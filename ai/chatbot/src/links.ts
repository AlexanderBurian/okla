import { normalizeUrl } from "./knowledge.js";
import type { KnowledgeItem } from "./types.js";

/* ---------- Product keys and link checking ----------
   The model does not get the products' addresses: every product in the catalogue it sees has a short key (#p12) and the
   model writes its links as [name](#p12). The server turns the key into the product's real address while the answer
   streams. This saves many tokens per question and makes an invented link impossible: a key that does not exist, or an
   okla.cz address that is not one of the shop's known pages, is written as plain text instead of a dead link. */

export interface LinkTable {
  /* "p12" -> the product */
  byKey: Map<string, KnowledgeItem>;
  /* product id -> "p12" */
  keyOf: Map<string, string>;
  /* every address the answer may link to (normalised) */
  known: Set<string>;
}

export function buildLinkTable(catalog: KnowledgeItem[], others: KnowledgeItem[] = []): LinkTable {
  const byKey = new Map<string, KnowledgeItem>();
  const keyOf = new Map<string, string>();
  const known = new Set<string>();
  catalog.forEach((item, index) => {
    const key = `p${index + 1}`;
    byKey.set(key, item);
    keyOf.set(item.id, key);
  });
  for (const item of [...catalog, ...others]) {
    const url = item.url && normalizeUrl(item.url);
    if (url) known.add(url);
  }
  return { byKey, keyOf, known };
}

const SHOP_HOST = /^(?:https?:\/\/)?(?:www\.)?okla\.cz(\/|$)/i;

/* the address a link of the answer really goes to, or undefined = write the text alone */
export function resolveTarget(target: string, table: LinkTable): string | undefined {
  const t = target.trim().replace(/^<|>$/g, "");
  const key = t.match(/^#?(p\d+)$/i)?.[1]?.toLowerCase();
  if (key) return table.byKey.get(key)?.url;
  if (/^mailto:[^\s@]+@okla\.cz$/i.test(t)) return t;
  if (SHOP_HOST.test(t)) {
    const full = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    const norm = normalizeUrl(full);
    /* the homepage and the shop's known pages, products and categories only */
    if (norm && (table.known.has(norm) || /^https?:\/\/(?:www\.)?okla\.cz\/?$/i.test(full))) return full;
    return undefined;
  }
  /* no links outside the shop */
  return undefined;
}

/* one finished piece of text: [text](target) links resolved, stray keys removed */
export function resolveLinks(text: string, table: LinkTable): string {
  return text
    .replace(/\[([^\]\n]{1,200})\]\(([^)\s]{1,300})\)/g, (_m, label: string, target: string) => {
      const url = resolveTarget(target, table);
      return url ? `[${label}](${url})` : label;
    })
    /* a key the model wrote outside a link: "(#p12)" or "#p12" */
    .replace(/\s?\(#p\d+\)/gi, "")
    .replace(/(^|[\s(])#p\d+\b/gi, "$1")
    .replace(/[ \t]+([,.;:!?])/g, "$1");
}

/* the stream with links resolved: text is passed on up to the last place where a link might still be being written
   ("[…", "[…](…"), that tail waits for the next piece */
export async function* linkStream(stream: AsyncIterable<string>, table: LinkTable): AsyncIterable<string> {
  let buffer = "";
  for await (const token of stream) {
    buffer += token;
    const cut = holdFrom(buffer);
    if (cut > 0) {
      yield resolveLinks(buffer.slice(0, cut), table);
      buffer = buffer.slice(cut);
    }
  }
  if (buffer) yield resolveLinks(buffer, table);
}

/* where the unfinished tail starts (everything before it is safe to send) */
function holdFrom(text: string): number {
  const open = text.lastIndexOf("[");
  if (open >= 0) {
    const rest = text.slice(open);
    /* a finished link, or a bracket that is clearly not a link, is no reason to wait */
    const finished = /^\[[^\]\n]*\]\([^)\n]*\)/.test(rest) || /^\[[^\]\n]*\](?!\()./.test(rest) || rest.length > 400;
    if (!finished) return open;
  }
  /* a key being written at the very end ("#p1" may become "#p12") */
  const key = text.match(/#p?\d*$/i);
  if (key && key.index !== undefined) return key.index;
  return text.length;
}
