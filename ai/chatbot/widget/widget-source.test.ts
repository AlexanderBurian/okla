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
    expect(source).toContain("left: -19.7px;");
    expect(source).toContain("width: 45.5px;");
    expect(source).toContain("height: 80.7px;");
    expect(source).toContain("border: 2px solid #fff;");
    expect(source).toContain("top: clamp(180px, 82dvh, calc(100dvh - 86px));");
    expect(source).toContain("left: calc(50% + 6.5px);");
    expect(source).toContain(":host(.mobile-launcher-visible) .launcher");
    expect(source).toContain("window.scrollY >= revealAfter");
    expect(source).toContain("mobileLauncherRevealed = true");
    expect(source).toContain("window.addEventListener(\"scroll\", syncMobileLauncherVisibility, { passive: true })");
    expect(source).toContain(".launcher:hover {");
    expect(source).toContain(".launcher:focus-visible {");
    expect(source).toContain(".launcher:active {");
    expect(source.match(/border-color: #fff;/g)?.length).toBeGreaterThanOrEqual(3);
    expect(source).toContain("launcher-search-icon");
    expect(source).toContain(".panel.open + .launcher");
  });

  it("má na mobilu fullscreen chat s křížkem vpravo nahoře", async () => {
    const source = await readFile("./widget/widget.ts", "utf8");
    expect(source).toContain("height: 100dvh;");
    expect(source).toContain("border-radius: 0;");
    expect(source).toContain(".expand { display: none; }");
    expect(source).toContain("mobile-close-icon");
    expect(source).toContain("panel.setAttribute(\"aria-modal\", String(open && mobileLauncherMedia.matches))");
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
