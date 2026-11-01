import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";
import { isPersonalOrderRequest, validateChatBody, ValidationError } from "./validation.js";

const config = loadConfig({ MOCK_MODE: "true" });

describe("chat validation", () => {
  it("přijme platnou zprávu a historii", () => {
    expect(validateChatBody({ message: "  Dobrý den  ", history: [{ role: "assistant", content: "Ahoj" }] }, config))
      .toEqual({ message: "Dobrý den", history: [{ role: "assistant", content: "Ahoj" }] });
  });

  it("odmítne příliš dlouhou zprávu", () => {
    expect(() => validateChatBody({ message: "x".repeat(config.maxMessageLength + 1) }, config)).toThrow(ValidationError);
  });

  it("pozná dotaz na konkrétní stav objednávky", () => {
    expect(isPersonalOrderRequest("Kde je můj balík a stav objednávky?")).toBe(true);
    expect(isPersonalOrderRequest("Jak vytvořit objednávku?")).toBe(false);
  });
});
