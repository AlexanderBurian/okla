import path from "node:path";

function integer(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export interface AppConfig {
  host: string;
  port: number;
  publicBaseUrl: string;
  allowedOrigins: string[];
  mockMode: boolean;
  groqApiKey?: string;
  groqModel: string;
  maxMessageLength: number;
  maxHistoryMessages: number;
  chatTimeoutMs: number;
  rateLimitMax: number;
  rateLimitWindow: string;
  knowledgeFile: string;
  shoptetCsvFile: string;
  shopBaseUrl?: string;
  shoptetFeedUrl?: string;
  shoptetFeedRefreshMinutes: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const mockMode = bool(env.MOCK_MODE, !env.GROQ_API_KEY);
  if (!mockMode && !env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY je povinný, pokud MOCK_MODE není true.");
  }

  return {
    host: env.HOST || "127.0.0.1",
    port: integer(env.PORT, 8787, 1, 65535),
    publicBaseUrl: (env.PUBLIC_BASE_URL || "http://localhost:8787").replace(/\/$/, ""),
    allowedOrigins: (env.ALLOWED_ORIGINS || "http://localhost:8787,http://127.0.0.1:8787")
      .split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean),
    mockMode,
    groqApiKey: env.GROQ_API_KEY || undefined,
    groqModel: env.GROQ_MODEL || "llama-3.3-70b-versatile",
    maxMessageLength: integer(env.MAX_MESSAGE_LENGTH, 1200, 100, 4000),
    maxHistoryMessages: integer(env.MAX_HISTORY_MESSAGES, 12, 0, 30),
    chatTimeoutMs: integer(env.CHAT_TIMEOUT_MS, 30_000, 5_000, 120_000),
    rateLimitMax: integer(env.RATE_LIMIT_MAX, 20, 1, 500),
    rateLimitWindow: env.RATE_LIMIT_WINDOW || "1 minute",
    knowledgeFile: path.resolve(process.cwd(), env.KNOWLEDGE_FILE || "./data/knowledge.json"),
    shoptetCsvFile: path.resolve(process.cwd(), env.SHOPTET_CSV_FILE || "./data/shoptet-products.csv"),
    shopBaseUrl: env.SHOP_BASE_URL || "https://825108.myshoptet.com",
    shoptetFeedUrl: env.SHOPTET_FEED_URL || undefined,
    shoptetFeedRefreshMinutes: integer(env.SHOPTET_FEED_REFRESH_MINUTES, 60, 5, 1440)
  };
}
