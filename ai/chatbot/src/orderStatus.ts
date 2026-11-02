import type { AppConfig } from "./config.js";

/* Verified order status for the /stav-objednavky/ page.
   The customer enters their order number and the ZIP from the delivery address;
   we look the order up in the Shoptet Admin API, check the ZIP matches, and
   return only a coarse status + tracking link. We never reveal whether an order
   exists when the ZIP does not match, so the number alone leaks nothing. */

export interface OrderStatusResult {
  ok: boolean;
  configured?: boolean;
  number?: string;
  statusLabel?: string;
  step?: number; // 0..4, -1 = cancelled
  cancelled?: boolean;
  dateLabel?: string;
  trackingUrl?: string;
  carrier?: string;
}

const STEP_LABELS = ["Objednáno", "Zpracování", "Expedováno", "V přepravě", "Doručeno"];

interface StatusRule {
  m: string[];
  step?: number;
  cancelled?: boolean;
}

const STATUS_RULES: StatusRule[] = [
  { m: ["storno", "zrus", "zamit", "vrac", "odstoup"], cancelled: true },
  { m: ["dorucen", "vyrizen", "dokoncen", "vyzvednut", "predano zakaznik"], step: 4 },
  { m: ["v preprav", "na ceste", "ceste", "dopravci", "vydejn", "prepravuje"], step: 3 },
  { m: ["expedov", "odeslan", "pripraveno k vyzvednuti", "predano doprav"], step: 2 },
  { m: ["zpracov", "potvrzen", "prijata platba", "platba prijata", "balime", "kompletuje"], step: 1 },
  { m: ["prijat", "nova", "ceka", "zalozen", "nezaplacen", "vytvoren", "objednan"], step: 0 }
];

export function normalize(value: string): string {
  return (value || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function stepLabel(index: number): string {
  return STEP_LABELS[index] ?? STEP_LABELS[0] ?? "Objednáno";
}

export function mapStatus(name: string): { step: number; cancelled: boolean; label: string } {
  const n = normalize(name);
  for (const rule of STATUS_RULES) {
    if (rule.m.some((x) => n.includes(x))) {
      if (rule.cancelled) return { step: -1, cancelled: true, label: "Zrušeno" };
      const step = rule.step as number;
      return { step, cancelled: false, label: stepLabel(step) };
    }
  }
  return { step: 0, cancelled: false, label: stepLabel(0) };
}

function zipDigits(value: string): string {
  return (value || "").replace(/\D+/g, "");
}

/* Reads the first present value among several candidate dot-paths, so small
   differences in the Shoptet order payload do not break the lookup. */
function pick(source: unknown, paths: string[]): unknown {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>(
      (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
      source
    );
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

export async function lookupOrder(
  input: { identifier: string; zip: string },
  config: AppConfig,
  fetchImpl: typeof fetch = fetch
): Promise<OrderStatusResult> {
  if (!config.shoptetApiToken) return { ok: false, configured: false };

  const code = encodeURIComponent(input.identifier.trim());
  let payload: unknown;
  try {
    const res = await fetchImpl(`${config.shoptetApiBase}/api/orders/${code}`, {
      headers: { "Shoptet-Access-Token": config.shoptetApiToken, Accept: "application/json" }
    });
    if (!res.ok) return { ok: false, configured: true };
    payload = await res.json();
  } catch {
    return { ok: false, configured: true };
  }

  const order = pick(payload, ["data.order", "data", "order"]) ?? payload;

  const zip = pick(order, [
    "deliveryAddress.zip", "delivery.zip", "shippingAddress.zip", "deliveryZip", "billingAddress.zip"
  ]);
  if (!zip || zipDigits(String(zip)) !== zipDigits(input.zip)) {
    // ZIP missing or does not match -> do not reveal whether the order exists.
    return { ok: false, configured: true };
  }

  const statusName = String(pick(order, ["status.name", "statusName", "status"]) ?? "");
  const mapped = mapStatus(statusName);
  const number = String(pick(order, ["code", "orderCode", "number"]) ?? input.identifier);
  const creation = pick(order, ["creationTime", "creationDate", "created"]);
  const trackingUrl = String(
    pick(order, ["shipping.trackingUrl", "shipment.trackingUrl", "trackingUrl", "trackingLink"]) ?? ""
  );

  return {
    ok: true,
    configured: true,
    number,
    statusLabel: mapped.label,
    step: mapped.step,
    cancelled: mapped.cancelled,
    dateLabel: creation ? `Vytvořeno ${String(creation).slice(0, 10)}` : "",
    trackingUrl,
    carrier: "Zásilkovna"
  };
}
