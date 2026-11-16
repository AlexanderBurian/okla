import { describe, expect, it } from "vitest";
import { MockEngine } from "./engine.js";

describe("mock stream", () => {
  it("zachová beze změny celý text včetně Markdown odkazu", async () => {
    const engine = new MockEngine(0, 0);
    const controller = new AbortController();
    let output = "";
    for await (const token of engine.stream({
      message: "Jak funguje vrácení?",
      history: [],
      knowledge: [{ id: "return", type: "faq", title: "Vrácení zboží", content: "Lhůta je 14 dnů.", url: "https://www.okla.cz/vraceni-zbozi/" }],
      signal: controller.signal
    })) output += token;

    expect(output).toContain("[Vrácení zboží](https://www.okla.cz/vraceni-zbozi/)");
  });
});

import { GroqEngine, retryAfterMs } from "./engine.js";

function limited(seconds: string) {
  return Object.assign(new Error(`Rate limit reached. Please try again in ${seconds}. Visit ...`), { status: 429 });
}
async function collect(engine: GroqEngine, message: string, lang = "cs") {
  let out = "";
  for await (const t of engine.stream({
    message, history: [], lang, signal: new AbortController().signal,
    knowledge: [{ id: "return", type: "faq", title: "Vrácení zboží", content: "Zboží můžete vrátit do 14 dnů od převzetí bez udání důvodu.", url: "https://www.okla.cz/vraceni-zbozi/" }]
  })) out += t;
  return out;
}
function fakeGroq(engine: GroqEngine, create: (model: string) => unknown, models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]) {
  const e = engine as unknown as { client: { models: { list: () => Promise<unknown> } }; create: (c: unknown, b: unknown, l: boolean, m: string) => unknown };
  e.client.models.list = async () => ({ data: models.map((id) => ({ id })) });
  const calls: string[] = [];
  e.create = async (_c, _b, _l, model) => { calls.push(model); return create(model); };
  return calls;
}

describe("Groq engine", () => {
  it("přečte čekání z odpovědi 429", () => {
    expect(retryAfterMs(limited("7.5s"))).toBe(7500);
    expect(retryAfterMs(limited("1m2s"))).toBe(62000);
    expect(retryAfterMs(limited("450ms"))).toBe(450);
    expect(retryAfterMs(new Error("other"))).toBeUndefined();
  });

  it("když jsou všechny modely přetížené, odpoví česky z podkladů webu místo chyby", async () => {
    const engine = new GroqEngine("test", "openai/gpt-oss-120b", ["openai/gpt-oss-20b", "neexistujici/model"], 0);
    const calls = fakeGroq(engine, () => { throw limited("40s"); });
    const out = await collect(engine, "Jak vrátím zboží?");
    expect(out).toContain("14 dnů");
    expect(out).toContain("AI poradce je teď vytížený");
    /* a model the account does not have is not tried */
    expect(calls).not.toContain("neexistujici/model");
  });

  it("anglický dotaz při přetížení vrátí chybu (odpověď z podkladů je jen česky)", async () => {
    const engine = new GroqEngine("test", "openai/gpt-oss-120b", [], 0);
    fakeGroq(engine, () => { throw limited("40s"); });
    await expect(collect(engine, "Do you ship to Germany?", "en")).rejects.toMatchObject({ status: 429 });
  });

  it("při krátkém čekání počká a zkusí to znovu", async () => {
    const engine = new GroqEngine("test", "openai/gpt-oss-120b", [], 2_000);
    let n = 0;
    fakeGroq(engine, () => {
      if (n++ < 2) throw limited("0.05s");
      return (async function* () { yield { choices: [{ delta: { content: "Hotovo." } }] }; })();
    });
    expect(await collect(engine, "Jak vrátím zboží?")).toBe("Hotovo.");
  });

  it("bez jisté rychlé odpovědi (nic neodpovídá) vrátí při přetížení chybu, nic nevymýšlí", async () => {
    const engine = new GroqEngine("test", "openai/gpt-oss-120b", [], 0);
    fakeGroq(engine, () => { throw limited("40s"); });
    let out = "";
    const run = async () => { for await (const t of engine.stream({ message: "Napiš mi básničku o pivu", history: [], lang: "cs", knowledge: [], catalog: [], signal: new AbortController().signal })) out += t; };
    await expect(run()).rejects.toMatchObject({ status: 429 });
    expect(out).toBe("");
  });

  it("záložní model, který nebere nastavení přemýšlení (400), zkusí znovu bez nich", async () => {
    const engine = new GroqEngine("test", "openai/gpt-oss-120b", ["qwen/qwen3.8-27b"], 0);
    const e = engine as unknown as { client: { models: { list: () => Promise<unknown> } }; create: (c: unknown, b: unknown, l: boolean, m: string, plain?: boolean) => unknown };
    e.client.models.list = async () => ({ data: [{ id: "openai/gpt-oss-120b" }, { id: "qwen/qwen3.8-27b" }] });
    e.create = async (_c, _b, _l, model, plain) => {
      if (model === "openai/gpt-oss-120b") throw limited("40s");
      if (!plain) throw Object.assign(new Error("reasoning_effort not supported"), { status: 400 });
      return (async function* () { yield { choices: [{ delta: { content: "Z Qwenu." } }] }; })();
    };
    expect(await collect(engine, "Jak vrátím zboží?")).toBe("Z Qwenu.");
  });
});

import { quickAnswer } from "./engine.js";

describe("rychlá odpověď", () => {
  const P = (title: string, slug: string, content: string) => ({ id: slug, type: "product" as const, title, url: `https://www.okla.cz/${slug}/`, price: 1000, inStock: true, content });
  const cat = [
    P("Flipper Zero – kapesní multitool pro digitální protokoly", "flipper", "Kapesní otevřená platforma pro práci s NFC, RFID a Sub-GHz signály."),
    P("Flipper Zero Wi-Fi Devboard", "devboard", "Originální vývojová deska pro Flipper Zero s ESP32-S2 a Wi-Fi.")
  ];
  it("vybere jmenovaný produkt, ne jeho příslušenství", () => {
    expect(quickAnswer({ message: "Co je Flipper Zero a k čemu se hodí?", knowledge: cat, catalog: cat })).toContain("(https://www.okla.cz/flipper/)");
    expect(quickAnswer({ message: "Co je Flipper Zero a k čemu se hodí?", knowledge: cat, catalog: cat })).not.toContain("devboard");
    expect(quickAnswer({ message: "Co umí Flipper Zero Wi-Fi Devboard?", knowledge: cat, catalog: cat })).toContain("(https://www.okla.cz/devboard/)");
  });
  it("bez shody nic nevymýšlí", () => {
    expect(quickAnswer({ message: "Napiš mi básničku o pivu", knowledge: [], catalog: cat })).toBeUndefined();
  });
});
