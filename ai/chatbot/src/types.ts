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
  /* live catalogue only */
  price?: number;
  inStock?: boolean;
  category?: string;
}

export interface ChatContext {
  message: string;
  history: ChatMessage[];
  knowledge: KnowledgeItem[];
  signal: AbortSignal;
  /* the product the visitor is looking at (its page), when known */
  pageItem?: KnowledgeItem;
  /* cs | sk | en | hu */
  lang?: string;
  /* the whole catalogue, for listing and budget questions */
  catalog?: KnowledgeItem[];
  /* every shop page and note, for questions about buying */
  faqs?: KnowledgeItem[];
  /* ids of the products the question is about: the catalogue gets a line about these */
  focus?: string[];
}

export interface ChatEngine {
  stream(context: ChatContext): AsyncIterable<string>;
}
