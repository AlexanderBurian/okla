import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";
import type { ChatEngine } from "./types.js";

const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
const engine: ChatEngine = {
  async *stream() {
    yield "První ";
    yield "část.";
  }
};

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe("HTTP API", () => {
  it("vrátí health stav bez tajných údajů", async () => {
    const app = await buildApp({ config: loadConfig({ MOCK_MODE: "true", KNOWLEDGE_FILE: "./data/knowledge.json" }), engine });
    apps.push(app);
    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(expect.objectContaining({ ok: true, mode: "mock" }));
    expect(response.body).not.toContain("apiKey");
  });

  it("servíruje robot asset jako platné PNG", async () => {
    const app = await buildApp({ config: loadConfig({ MOCK_MODE: "true", KNOWLEDGE_FILE: "./data/knowledge.json" }), engine });
    apps.push(app);
    const response = await app.inject({ method: "GET", url: "/assets/okla-robot-launcher.png" });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe("image/png");
    expect(response.rawPayload.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("servíruje mobilní piktogram jako platné PNG", async () => {
    const app = await buildApp({ config: loadConfig({ MOCK_MODE: "true", KNOWLEDGE_FILE: "./data/knowledge.json" }), engine });
    apps.push(app);
    const response = await app.inject({ method: "GET", url: "/assets/okla-mobile-assistant-glyph-v1.png" });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe("image/png");
    expect(response.rawPayload.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("streamuje tokeny a dokončení přes SSE", async () => {
    const app = await buildApp({ config: loadConfig({ MOCK_MODE: "true", KNOWLEDGE_FILE: "./data/knowledge.json" }), engine });
    apps.push(app);
    const response = await app.inject({
      method: "POST",
      url: "/api/chat",
      headers: { origin: "http://127.0.0.1:8787" },
      payload: { message: "Doporučte nabíječku", history: [] }
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/event-stream");
    expect(response.headers["access-control-allow-origin"]).toBe("http://127.0.0.1:8787");
    expect(response.body).toContain("event: token");
    expect(response.body).toContain("První ");
    expect(response.body).toContain("event: done");
  });

  it("odmítne prázdnou zprávu", async () => {
    const app = await buildApp({ config: loadConfig({ MOCK_MODE: "true", KNOWLEDGE_FILE: "./data/knowledge.json" }), engine });
    apps.push(app);
    const response = await app.inject({ method: "POST", url: "/api/chat", payload: { message: " " } });
    expect(response.statusCode).toBe(400);
  });
});
