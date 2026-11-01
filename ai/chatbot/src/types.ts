export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface KnowledgeItem {
  id: string;
  type: "product" | "faq";
  title: string;
  content: string;
  url?: string;
  keywords?: string[];
}

export interface ChatContext {
  message: string;
  history: ChatMessage[];
  knowledge: KnowledgeItem[];
  signal: AbortSignal;
}

export interface ChatEngine {
  stream(context: ChatContext): AsyncIterable<string>;
}
