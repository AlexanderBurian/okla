import { readFile } from "node:fs/promises";
import path from "node:path";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import type { AppConfig } from "./config.js";
import { GroqEngine, MockEngine } from "./engine.js";
import { KnowledgeStore } from "./knowledge.js";
import type { ChatEngine } from "./types.js";
import { isPersonalOrderRequest, validateChatBody, ValidationError } from "./validation.js";

interface BuildOptions {
  config: AppConfig;
  engine?: ChatEngine;
  knowledge?: KnowledgeStore;
}

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function safeRetryAfter(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const headers = (error as { headers?: Headers | Record<string, string> }).headers;
  if (headers instanceof Headers) return headers.get("retry-after") ?? undefined;
  if (headers && typeof headers === "object") return headers["retry-after"];
  return undefined;
}

function errorStatus(error: unknown): number | undefined {
  return error && typeof error === "object" && "status" in error ? Number((error as { status: unknown }).status) : undefined;
}

export async function buildApp(options: BuildOptions): Promise<FastifyInstance> {
  const { config } = options;
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      redact: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie"]
    },
    bodyLimit: 32 * 1024,
    trustProxy: true
  });

  await app.register(cors, {
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["content-type"],
    origin(origin, callback) {
      if (!origin || config.allowedOrigins.includes(origin.replace(/\/$/, ""))) return callback(null, true);
      return callback(null, false);
    }
  });
  await app.register(rateLimit, { global: false, max: config.rateLimitMax, timeWindow: config.rateLimitWindow });

  const knowledge = options.knowledge ?? new KnowledgeStore(
    config.knowledgeFile,
    config.shoptetFeedUrl,
    config.shoptetCsvFile,
    config.shopBaseUrl
  );
  if (!options.knowledge) await knowledge.initialize(config.shoptetFeedRefreshMinutes);
  const engine = options.engine ?? (config.mockMode
    ? new MockEngine()
    : new GroqEngine(config.groqApiKey as string, config.groqModel));

  app.addHook("onClose", async () => knowledge.close());

  app.get("/health", async () => ({
    ok: true,
    mode: config.mockMode ? "mock" : "groq",
    knowledge: knowledge.counts()
  }));

  app.get("/widget.js", async (_request, reply) => {
    const widgetPath = path.resolve(process.cwd(), "public/widget.js");
    const source = await readFile(widgetPath, "utf8");
    return reply
      .header("content-type", "text/javascript; charset=utf-8")
      .header("cache-control", "public, max-age=300")
      .send(source);
  });

  app.get("/assets/okla-robot-launcher.png", async (_request, reply) => {
    const assetPath = path.resolve(process.cwd(), "public/assets/okla-robot-launcher.png");
    const asset = await readFile(assetPath);
    return reply
      .header("content-type", "image/png")
      .header("cache-control", "public, max-age=86400, immutable")
      .send(asset);
  });

app.get("/assets/okla-mobile-assistant-glyph-v1.png", async (_request, reply) => {
  const assetPath = path.resolve(process.cwd(), "public/assets/okla-mobile-assistant-glyph-v1.png");
    const asset = await readFile(assetPath);
    return reply
      .header("content-type", "image/png")
      .header("cache-control", "public, max-age=86400, immutable")
      .send(asset);
  });

  app.get("/", async (_request, reply) => {
    const demoPath = path.resolve(process.cwd(), "public/index.html");
    const html = (await readFile(demoPath, "utf8")).replaceAll("__PUBLIC_BASE_URL__", config.publicBaseUrl);
    return reply.header("content-type", "text/html; charset=utf-8").send(html);
  });

  app.post("/api/chat", {
    config: { rateLimit: { max: config.rateLimitMax, timeWindow: config.rateLimitWindow } }
  }, async (request, reply) => {
    let input;
    try {
      input = validateChatBody(request.body, config);
    } catch (error) {
      if (error instanceof ValidationError) return reply.code(400).send({ error: error.message });
      throw error;
    }

    reply.hijack();
    const requestOrigin = typeof request.headers.origin === "string" ? request.headers.origin.replace(/\/$/, "") : undefined;
    const corsHeaders = requestOrigin && config.allowedOrigins.includes(requestOrigin)
      ? { "access-control-allow-origin": request.headers.origin as string, vary: "Origin" }
      : {};
    reply.raw.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
      ...corsHeaders
    });
    reply.raw.flushHeaders();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error("timeout")), config.chatTimeoutMs);
    reply.raw.on("close", () => {
      if (!reply.raw.writableEnded) controller.abort(new Error("client_closed"));
    });

    try {
      if (isPersonalOrderRequest(input.message)) {
        reply.raw.write(sse("token", { text: "Ke konkrétní objednávce nemám přístup. Kvůli ochraně soukromí sem neposílejte číslo objednávky ani osobní údaje. Napište prosím na [podpora@okla.cz](mailto:podpora@okla.cz)." }));
      } else {
        const relevant = knowledge.search(input.message, 5);
        for await (const token of engine.stream({ ...input, knowledge: relevant, signal: controller.signal })) {
          reply.raw.write(sse("token", { text: token }));
        }
      }
      if (!controller.signal.aborted) reply.raw.write(sse("done", { ok: true }));
    } catch (error) {
      if (controller.signal.aborted) {
        if (!reply.raw.destroyed) reply.raw.write(sse("error", { code: "timeout", message: "Odpověď trvala příliš dlouho. Zkuste to prosím znovu." }));
      } else if (errorStatus(error) === 429) {
        reply.raw.write(sse("error", { code: "rate_limited", message: "AI služba je dočasně vytížená. Zkuste to prosím za chvíli.", retryAfter: safeRetryAfter(error) }));
      } else {
        request.log.error({ providerStatus: errorStatus(error), errorType: error instanceof Error ? error.name : "UnknownError" }, "Chat provider failed");
        reply.raw.write(sse("error", { code: "provider_error", message: "Odpověď se nepodařilo načíst. Zkuste to prosím znovu." }));
      }
    } finally {
      clearTimeout(timeout);
      if (!reply.raw.destroyed) reply.raw.end();
    }
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    const status = error.statusCode && error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 500;
    if (status >= 500) request.log.error({ err: error }, "Request failed");
    const message = status === 429
      ? "Limit požadavků byl překročen. Zkuste to prosím za chvíli."
      : status >= 500 ? "Nastala interní chyba." : "Požadavek nelze zpracovat.";
    return reply.code(status).send({ error: message });
  });

  return app;
}
