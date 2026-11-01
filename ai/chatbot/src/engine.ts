import Groq from "groq-sdk";
import { normalize } from "./knowledge.js";
import { toGroqMessages } from "./prompt.js";
import type { ChatContext, ChatEngine, KnowledgeItem } from "./types.js";

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function mockAnswer(message: string, items: KnowledgeItem[], isFirst: boolean): string {

  const greeting = isFirst ? "Dobrý den, jsem **OKLA poradce**. " : "";

  const question = normalize(message);
  if (/kokain|heroin|pervitin|marihuan|drogy|zbrane|pistol|samopal|vybusnin|munic|granat/.test(question)) return "OKLA se zaměřuje na elektroniku. S tímto požadavkem vám nepomohu.";
  if (/cizi|bez svoleni|bez opravneni/.test(question) && /kart|zamek|pristup/.test(question)) return "S obcházením cizího přístupu nepomohu. U vlastní karty můžu vysvětlit rozdíl mezi NFC a RFID.";
  if (/^(ahoj|dobry den|cau|zdravim)$/.test(question)) return "Dobrý den! S čím vám můžu poradit?";
  if (/kde.*(balik|objednav|zasilk)|stav.*objednav|sledov.*zasil|objednav.*(stav|dorazi)/.test(question)) {
    return "Stav objednávky ověří kolegové na [podpora@okla.cz](mailto:podpora@okla.cz). K objednávkám nemám přístup.";
  }
  if (/nafoukl|nafouknut/.test(question) && /bateri|akumul/.test(question)) {
    return "Zařízení dál nepoužívejte ani nenabíjejte. Před odesláním kontaktujte [podporu OKLA](mailto:podpora@okla.cz) a domluvte si bezpečné předání.";
  }
  const item = items[0];
  if (item?.type === "faq") {
    return item.content + (item.url && !item.url.startsWith("mailto:") ? `\n\n[${item.title}](${item.url})` : "");
  }
  if (item?.type === "product") {
    const link = item.url ? `[${item.title}](${item.url})` : item.title;
    if (/skladem|dostupn|kolik kusu/.test(question)) return `Aktuální počet kusů ověříte přímo na stránce ${link}.`;
    if (/kolik stoji|cena|cenu/.test(question)) {
      const price = item.content.match(/Cena v produktovém CSV: ([^.]+Kč)/)?.[1];
      return price ? `V posledním exportu je u produktu ${link} cena ${price}. Aktuální cenu najdete na odkazu.` : `Aktuální cenu najdete zde: ${link}.`;
    }
    const description = item.content.split(/ Kategorie:| Výrobce:| Kód produktu:/)[0] ?? "";
    const sentences = description.split(/(?<=[.!?])\s+/);
    const words = question.split(" ").filter(word => word.length > 3);
    const ranked = sentences.map(sentence => ({sentence: sentence.trim(), score: words.filter(word => normalize(sentence).includes(word)).length})).sort((a,b) => b.score - a.score);
    return `${ranked[0]?.sentence || item.title}\n\n${link}`;
  }
  return `${greeting}Co hledáte a k čemu to chcete používat?`;
}

export class MockEngine implements ChatEngine {
  constructor(private readonly initialDelayMs = 650, private readonly chunkDelayMs = 18) {}

  async *stream(context: ChatContext): AsyncIterable<string> {
    const answer = mockAnswer(context.message, context.knowledge, context.history.length === 0);
    const chunks = Array.from({ length: Math.ceil(answer.length / 22) }, (_, index) => answer.slice(index * 22, (index + 1) * 22));
    if (this.initialDelayMs > 0) await wait(this.initialDelayMs);
    for (const chunk of chunks) {
      if (context.signal.aborted) return;
      if (this.chunkDelayMs > 0) await wait(this.chunkDelayMs);
      yield chunk;
    }
  }
}

export class GroqEngine implements ChatEngine {
  private readonly client: Groq;

  constructor(apiKey: string, private readonly model: string) {
    this.client = new Groq({ apiKey });
  }

  async *stream(context: ChatContext): AsyncIterable<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: toGroqMessages(context.message, context.history, context.knowledge),
      temperature: 0.25,
      max_completion_tokens: 700,
      stream: true
    }, { signal: context.signal });

    for await (const chunk of completion) {
      if (context.signal.aborted) return;
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
}
