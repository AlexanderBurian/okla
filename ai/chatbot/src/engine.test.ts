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
