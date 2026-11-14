import type { AppConfig } from "./config.js";
import type { ChatMessage, ChatRole } from "./types.js";

export interface ValidChatBody {
  message: string;
  history: ChatMessage[];
  /* the page the chat was opened on (only its address is used, to know which product is on screen) */
  page?: string;
  lang?: string;
}

export class ValidationError extends Error {}

export function validateChatBody(body: unknown, config: AppConfig): ValidChatBody {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Neplatný formát požadavku.");
  }

  const candidate = body as Record<string, unknown>;
  if (typeof candidate.message !== "string") throw new ValidationError("Zpráva je povinná.");
  const message = candidate.message.trim();
  if (!message) throw new ValidationError("Zpráva nesmí být prázdná.");
  if (message.length > config.maxMessageLength) {
    throw new ValidationError(`Zpráva může mít nejvýše ${config.maxMessageLength} znaků.`);
  }

  const historyValue = candidate.history ?? [];
  if (!Array.isArray(historyValue)) throw new ValidationError("Historie musí být pole.");
  if (historyValue.length > config.maxHistoryMessages) {
    throw new ValidationError(`Historie může obsahovat nejvýše ${config.maxHistoryMessages} zpráv.`);
  }

  const history = historyValue.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new ValidationError("Neplatná položka historie.");
    const value = entry as Record<string, unknown>;
    if ((value.role !== "user" && value.role !== "assistant") || typeof value.content !== "string") {
      throw new ValidationError("Neplatná položka historie.");
    }
    const content = value.content.trim();
    if (!content || content.length > config.maxMessageLength * 2) throw new ValidationError("Neplatná délka zprávy v historii.");
    return { role: value.role as ChatRole, content };
  });

  const totalHistoryLength = history.reduce((sum, entry) => sum + entry.content.length, 0);
  if (totalHistoryLength > config.maxMessageLength * config.maxHistoryMessages) {
    throw new ValidationError("Historie konverzace je příliš dlouhá.");
  }

  let page: string | undefined;
  if (typeof candidate.page === "string" && candidate.page.length <= 500) {
    try {
      const url = new URL(candidate.page);
      if (url.protocol === "https:" || url.protocol === "http:") page = `${url.origin}${url.pathname}`;
    } catch {
      page = undefined;
    }
  }
  const lang = typeof candidate.lang === "string" && ["cs", "sk", "en", "hu"].includes(candidate.lang) ? candidate.lang : undefined;

  return { message, history, page, lang };
}

export function isPersonalOrderRequest(message: string): boolean {
  const normalized = message.toLowerCase();
  return /stav.*objedn|objedn.*stav|kde.*(?:bal[ií]k|z[aá]sil)|sledov.*z[aá]sil|zm[eě]n.*adres.*objedn/.test(normalized);
}
