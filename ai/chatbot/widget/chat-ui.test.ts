// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  appendChatTime,
  createTypingRow,
  DELIVERY_DELAY_MS,
  DeliveryReceiptController,
  formatChatTime,
  installImageFallback,
  MOBILE_ASSISTANT_GLYPH_PATH,
  resolveRobotAssetUrl,
  resolveWidgetAssetUrl,
  TypingIndicatorController
} from "./chat-ui.js";

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("stav Doručeno", () => {
  it("zobrazí Doručeno, check a čas až přibližně po 500 ms", () => {
    vi.useFakeTimers();
    const slot = document.createElement("span");
    document.body.append(slot);
    const controller = new DeliveryReceiptController();
    const sentAt = new Date(2025, 0, 2, 11, 16);
    controller.schedule(slot, sentAt);

    vi.advanceTimersByTime(DELIVERY_DELAY_MS - 1);
    expect(slot.textContent).toBe("");
    expect(slot.querySelector("time")).toBeNull();
    vi.advanceTimersByTime(1);
    expect(slot.querySelector(".receipt-check")?.textContent).toBe("✓");
    expect(slot.children[1]?.textContent).toBe("Doručeno");
    expect(slot.querySelector("time")?.textContent).toBe("11:16");
    expect(slot.querySelector("time")?.getAttribute("datetime")).toBe(sentAt.toISOString());
    expect(slot.getAttribute("aria-label")).toBe("Doručeno 11:16");
    expect(slot.classList.contains("visible")).toBe(true);
  });

  it("po resetu zruší timer a nepřidá opožděný stav", () => {
    vi.useFakeTimers();
    const slot = document.createElement("span");
    document.body.append(slot);
    const controller = new DeliveryReceiptController();
    controller.schedule(slot);
    controller.cancel();
    slot.remove();
    vi.runAllTimers();
    expect(slot.textContent).toBe("");
    expect(controller.hasPendingTimer()).toBe(false);
  });
});

describe("čas zpráv", () => {
  it("formátuje cs-CZ ve 24hodinovém formátu se dvěma číslicemi", () => {
    expect(formatChatTime(new Date(2025, 0, 2, 1, 5))).toBe("01:05");
    expect(formatChatTime(new Date(2025, 0, 2, 23, 9))).toBe("23:09");
  });

  it("přidá k dokončené odpovědi semantický time element", () => {
    const slot = document.createElement("div");
    const completedAt = new Date(2025, 0, 2, 11, 17);
    const time = appendChatTime(slot, completedAt, "assistant-time");
    expect(time.tagName).toBe("TIME");
    expect(time.textContent).toBe("11:17");
    expect(time.dateTime).toBe(completedAt.toISOString());
    expect(time.className).toBe("assistant-time");
  });
});

describe("stabilní typing řádek", () => {
  it("obsahuje přesně tři tečky a text, ale žádnou message bubble", () => {
    const row = createTypingRow(document);
    expect(row.className).toBe("typing-row");
    expect(row.querySelectorAll(".typing-dot")).toHaveLength(3);
    expect(row.querySelector(".typing-label")?.textContent).toBe("Pracuji na odpovědi…");
    expect(row.querySelector(".bubble")).toBeNull();
    expect(row.getAttribute("role")).toBe("status");
    expect(row.getAttribute("aria-live")).toBe("polite");
  });

  it("controller uklidí řádek při resetu nebo abortu a nevytvoří duplikát", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const controller = new TypingIndicatorController();
    const first = controller.show(container);
    const second = controller.show(container);
    expect(first.isConnected).toBe(false);
    expect(second.isConnected).toBe(true);
    expect(container.querySelectorAll(".typing-row")).toHaveLength(1);
    const streamedMessage = document.createElement("div");
    container.append(streamedMessage);
    controller.moveToEnd(container);
    expect(container.lastElementChild).toBe(second);
    expect(controller.isVisible()).toBe(true);
    controller.hide();
    expect(controller.isVisible()).toBe(false);
    expect(container.querySelector(".typing-row")).toBeNull();
  });
});

describe("robot asset", () => {
  it("upřednostní explicitní asset base URL", () => {
    expect(resolveRobotAssetUrl({
      scriptSrc: "https://cdn.example/widget.js",
      apiUrl: "https://api.example",
      assetBaseUrl: "https://assets.example/chatbot",
      locationOrigin: "https://shop.example"
    })).toBe("https://assets.example/chatbot/assets/okla-robot-launcher.png");
  });

  it("použije API URL a následně adresář externího scriptu", () => {
    expect(resolveRobotAssetUrl({ apiUrl: "https://chat.okla.cz", locationOrigin: "https://okla.cz" }))
      .toBe("https://chat.okla.cz/assets/okla-robot-launcher.png");
    expect(resolveRobotAssetUrl({ scriptSrc: "https://cdn.example/chat/widget.js", locationOrigin: "https://okla.cz" }))
      .toBe("https://cdn.example/chat/assets/okla-robot-launcher.png");
  });

  it("sestaví robustní URL mobilního piktogramu ze stejného asset base", () => {
    expect(resolveWidgetAssetUrl({
      assetBaseUrl: "https://assets.example/chatbot",
      locationOrigin: "https://okla.cz"
    }, MOBILE_ASSISTANT_GLYPH_PATH)).toBe(
    "https://assets.example/chatbot/assets/okla-mobile-assistant-glyph-v1.png"
    );
  });

  it("skryje rozbitý obrázek a aktivuje čistý fallback", () => {
    const shell = document.createElement("span");
    const image = document.createElement("img");
    shell.append(image);
    document.body.append(shell);
    installImageFallback(image);
    image.dispatchEvent(new Event("error"));
    expect(image.hidden).toBe(true);
    expect(shell.classList.contains("robot-fallback")).toBe(true);
  });

  it("použije samostatnou fallback třídu pro mobilní piktogram", () => {
    const shell = document.createElement("span");
    const image = document.createElement("img");
    image.dataset.fallbackClass = "mobile-glyph-fallback";
    shell.append(image);
    document.body.append(shell);
    installImageFallback(image);
    image.dispatchEvent(new Event("error"));
    expect(image.hidden).toBe(true);
    expect(shell.classList.contains("mobile-glyph-fallback")).toBe(true);
    expect(shell.classList.contains("robot-fallback")).toBe(false);
  });
});
