import { readFile } from "node:fs/promises";
import path from "node:path";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import type { AppConfig } from "./config.js";
import { availableModels, GroqEngine, MockEngine, providerErrors } from "./engine.js";
import { normalize } from "./knowledge.js";
import { KnowledgeStore } from "./knowledge.js";
import { lookupOrder } from "./orderStatus.js";
import type { ChatEngine } from "./types.js";
import { isPersonalOrderRequest, validateChatBody, ValidationError } from "./validation.js";
import { guardStream, refusal, TopicGate } from "./topicGate.js";
import type { KnowledgeItem } from "./types.js";

interface BuildOptions {
  config: AppConfig;
  engine?: ChatEngine;
  knowledge?: KnowledgeStore;
}

/* answers to the first question of a conversation (the widget's suggested questions come again and again), kept
   for 20 minutes: they come back at once and leave the provider's per-minute limit for new questions */
const ANSWER_TTL = 20 * 60_000;
const answerCache = new Map<string, { text: string; at: number }>();
function cacheKey(message: string, page: string | undefined, lang: string | undefined): string {
  return `${lang ?? ""}|${page ?? ""}|${normalize(message)}`;
}
function cachedAnswer(key: string): string | undefined {
  const hit = answerCache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > ANSWER_TTL) { answerCache.delete(key); return undefined; }
  return hit.text;
}
function rememberAnswer(key: string, text: string): void {
  answerCache.set(key, { text, at: Date.now() });
  while (answerCache.size > 300) answerCache.delete(answerCache.keys().next().value as string);
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
    config.shopBaseUrl,
    config.shopCrawl,
    config.shopCrawlMinutes
  );
  if (!options.knowledge) await knowledge.initialize(config.shoptetFeedRefreshMinutes);
  const engine = options.engine ?? (config.mockMode
    ? new MockEngine()
    : new GroqEngine(config.groqApiKey as string, config.groqModel, config.groqFallbackModels));

  /* the hard topic block (topicGate.ts): with the language model's classifier when the shop runs on Groq */
  const gate = new TopicGate(config.mockMode ? undefined : config.groqApiKey);
  const gateStats = { allowed: 0, blocked: 0, byReason: {} as Record<string, number> };

  /* the catalogue for the model: the whole one for a choice over the range (budget, cheapest, what do you have,
     recommend, compare), otherwise the products the search finds plus a short list - fewer tokens, more answers per
     minute within the provider's limit */
  const LISTING = /do \d|kc\b|korun|nejlevn|nejdraz|levn|co mate|co nabizite|sortiment|nabidk|doporuc|poradt|poradi|vyber|vybrat|porovn|srovn|rozdil|alternativ|darek|skladem|hledam|chci|potrebuj|ktery|ktera|ktere|jaky|jakou|jake|kategori/;
  function catalogFor(message: string, history: string): KnowledgeItem[] {
    const all = knowledge.products();
    if (LISTING.test(normalize(`${history} ${message}`))) return all;
    const found = knowledge.search(`${history} ${message}`, 14).filter((item) => item.type === "product");
    const ids = new Set(found.map((item) => item.id));
    return [...found, ...all.filter((item) => !ids.has(item.id))].slice(0, 20);
  }

  app.addHook("onClose", async () => knowledge.close());

  app.get("/health", async () => ({
    version: (process.env.RENDER_GIT_COMMIT || "").slice(0, 7) || undefined,
    ok: true,
    mode: config.mockMode ? "mock" : "groq",
    knowledge: knowledge.counts(),
    models: availableModels,
    topicGate: gateStats,
    cachedAnswers: answerCache.size,
    providerErrors
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

    const key = input.history.length === 0 && !(engine instanceof MockEngine) ? cacheKey(input.message, input.page, input.lang) : undefined;
    try {
      if (isPersonalOrderRequest(input.message)) {
        reply.raw.write(sse("token", { text: "Ke konkrétní objednávce nemám přístup. Kvůli ochraně soukromí sem neposílejte číslo objednávky ani osobní údaje. Napište prosím na [podpora@okla.cz](mailto:podpora@okla.cz)." }));
      } else if (!(await (async () => {
        /* the hard topic block: anything not about OKLA, its products or buying is refused with a fixed text */
        const verdict = await gate.check(input.message, input.history, knowledge.products(), controller.signal, knowledge.byUrl(input.page)?.title);
        gateStats.byReason[`${verdict.allowed ? "allow" : "block"}:${verdict.reason}`] = (gateStats.byReason[`${verdict.allowed ? "allow" : "block"}:${verdict.reason}`] ?? 0) + 1;
        if (verdict.allowed) { gateStats.allowed++; return true; }
        gateStats.blocked++;
        reply.raw.write(sse("token", { text: refusal(input.lang) }));
        return false;
      })())) {
        /* refused above */
      } else if (key && cachedAnswer(key)) {
        /* the same first question asked a moment ago: the same answer, streamed in pieces like a fresh one */
        const text = cachedAnswer(key) as string;
        for (let i = 0; i < text.length; i += 48) reply.raw.write(sse("token", { text: text.slice(i, i + 48) }));
      } else {
        /* the question alone, and together with the last exchange (so "a ten druhý?" still finds the products) */
        const lastUser = [...input.history].reverse().find((entry) => entry.role === "user")?.content ?? "";
        const pageItem = knowledge.byUrl(input.page);
        const found = knowledge.search(input.message, 6);
        const followUp = lastUser ? knowledge.search(`${lastUser} ${input.message}`, 4) : [];
        const relevant = [...new Map([...(pageItem ? [pageItem] : []), ...found, ...followUp].map((item) => [item.id, item])).values()].slice(0, 6);
        const stream = engine.stream({
          message: input.message,
          history: input.history,
          lang: input.lang,
          pageItem,
          catalog: catalogFor(input.message, lastUser),
          faqs: knowledge.faqs(),
          knowledge: relevant,
          signal: controller.signal
        });
        let answer = "";
        for await (const token of guardStream(stream, input.lang)) {
          answer += token;
          reply.raw.write(sse("token", { text: token }));
        }
        /* only full model answers of a fresh conversation are kept (not the quick answers from the pages) */
        if (key && !controller.signal.aborted && answer.length > 40 && !answer.includes("AI poradce je teď vytížený")) rememberAnswer(key, answer);
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

  /* Verified order status for /stav-objednavky/: order number + delivery ZIP.
     The ZIP is checked against the order, so a number alone reveals nothing. */
  app.post("/api/order-status", {
    config: { rateLimit: { max: config.rateLimitMax, timeWindow: config.rateLimitWindow } }
  }, async (request, reply) => {
    const body = (request.body ?? {}) as Record<string, unknown>;
    const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    const zip = typeof body.zip === "string" ? body.zip.trim() : "";
    if (!identifier || identifier.length > 40 || !zip || zip.length > 12) {
      return reply.code(400).send({ ok: false, error: "invalid_input" });
    }
    const result = await lookupOrder({ identifier, zip }, config);
    return reply.send(result);
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
