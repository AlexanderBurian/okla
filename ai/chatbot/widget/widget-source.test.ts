import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("geometrie widgetu", () => {
  it("má jediný vnější composer outline a textarea bez vlastního rámečku", async () => {
    const source = await readFile("./widget/widget.ts", "utf8");
    const textareaCss = source.match(/\n\s{6}textarea \{([\s\S]*?)\n\s{6}\}/)?.[1] ?? "";
    expect(source).toContain("height: 95px;");
    expect(source).toContain("border: 1px solid #6f91bd;");
    expect(source).toContain(".composer:focus-within { border-color: var(--okla-blue); box-shadow: none; }");
    expect(textareaCss).toContain("border: 0 !important;");
    expect(textareaCss).toContain("outline: 0 !important;");
    expect(textareaCss).toContain("box-shadow: none !important;");
  });

  it("neobsahuje sekundární X překrývající launcher", async () => {
    const source = await readFile("./widget/widget.ts", "utf8");
    expect(source).not.toContain("launcher-close");
    expect(source).not.toContain("closeIcon");
  });

  it("má na mobilu levý edge tab se souvislým bílým borderem ve všech stavech", async () => {
    const source = await readFile("./widget/widget.ts", "utf8");
    expect(source).toContain("@media (max-width: 466px)");
    expect(source).toContain("left: -17.1px;");
    expect(source).toContain("width: 39.6px;");
    expect(source).toContain("height: 70.2px;");
    expect(source).toContain("border: 1.8px solid #fff;");
    expect(source).toContain(".launcher:hover {");
    expect(source).toContain(".launcher:focus-visible {");
    expect(source).toContain(".launcher:active {");
    expect(source.match(/border-color: #fff;/g)?.length).toBeGreaterThanOrEqual(3);
    expect(source).toContain("launcher-search-icon");
    expect(source).toContain(".panel.open + .launcher");
  });

  it("vykresluje doručení vpravo, assistant čas vlevo a typing mimo bublinu", async () => {
    const source = await readFile("./widget/widget.ts", "utf8");
    expect(source).toContain("justify-content: flex-end");
    expect(source).toContain(".assistant-time-slot");
    expect(source).toContain("text-align: left");
    expect(source).toContain("padding-left: 39px");
    expect(source).toContain("assistant-avatar");
    expect(source).toContain("typingIndicator.show(messages)");
    expect(source).toContain("typingIndicator.moveToEnd(messages)");
    expect(source.match(/typingIndicator\.hide\(\)/g)?.length).toBeGreaterThanOrEqual(3);
    expect(source).not.toContain("setTypingState");
    expect(source).not.toContain("addAssistantMessage(\"\", true)");
  });

});
