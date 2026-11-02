import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";
import { lookupOrder, mapStatus } from "./orderStatus.js";

describe("mapStatus", () => {
  it("maps a dispatched order to the shipped step", () => {
    expect(mapStatus("Expedováno").step).toBe(2);
  });
  it("maps a completed order to delivered", () => {
    expect(mapStatus("Vyřízeno").step).toBe(4);
  });
  it("maps a cancelled order", () => {
    const r = mapStatus("Stornováno");
    expect(r.cancelled).toBe(true);
    expect(r.step).toBe(-1);
  });
  it("defaults an unknown status to received", () => {
    expect(mapStatus("Něco nového").step).toBe(0);
  });
  it("is diacritics-insensitive", () => {
    expect(mapStatus("expedovano").label).toBe("Expedováno");
  });
});

describe("lookupOrder", () => {
  const config = loadConfig({ MOCK_MODE: "true", SHOPTET_API_TOKEN: "test-token" });

  it("reports unconfigured when no token is set", async () => {
    const noToken = loadConfig({ MOCK_MODE: "true" });
    const res = await lookupOrder({ identifier: "250042", zip: "11000" }, noToken);
    expect(res).toEqual({ ok: false, configured: false });
  });

  it("returns the status when the ZIP matches", async () => {
    const fakeFetch = (async () => ({
      ok: true,
      json: async () => ({ data: { order: { code: "250042", status: { name: "Expedováno" }, deliveryAddress: { zip: "110 00" }, creationTime: "2025-11-02T10:00:00" } } })
    })) as unknown as typeof fetch;
    const res = await lookupOrder({ identifier: "250042", zip: "11000" }, config, fakeFetch);
    expect(res.ok).toBe(true);
    expect(res.step).toBe(2);
    expect(res.number).toBe("250042");
  });

  it("refuses when the ZIP does not match (without leaking existence)", async () => {
    const fakeFetch = (async () => ({
      ok: true,
      json: async () => ({ data: { order: { code: "250042", status: { name: "Expedováno" }, deliveryAddress: { zip: "11000" } } } })
    })) as unknown as typeof fetch;
    const res = await lookupOrder({ identifier: "250042", zip: "60200" }, config, fakeFetch);
    expect(res.ok).toBe(false);
    expect(res.number).toBeUndefined();
  });
});
