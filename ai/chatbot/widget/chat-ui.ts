export const DELIVERY_DELAY_MS = 500;
export const ROBOT_ASSET_PATH = "assets/okla-robot-launcher.png";
export const MOBILE_ASSISTANT_GLYPH_PATH = "assets/okla-mobile-assistant-glyph-v1.png";

interface AssetUrlOptions {
  scriptSrc?: string;
  apiUrl?: string;
  assetBaseUrl?: string;
  locationOrigin: string;
}

export function resolveWidgetAssetUrl(options: AssetUrlOptions, assetPath: string): string {
  const { scriptSrc, apiUrl, assetBaseUrl, locationOrigin } = options;
  let base: URL;
  if (assetBaseUrl) base = new URL(assetBaseUrl.endsWith("/") ? assetBaseUrl : `${assetBaseUrl}/`, locationOrigin);
  else if (apiUrl) base = new URL(apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`, locationOrigin);
  else if (scriptSrc) base = new URL(".", scriptSrc);
  else base = new URL(locationOrigin.endsWith("/") ? locationOrigin : `${locationOrigin}/`);
  return new URL(assetPath, base).toString();
}

export function resolveRobotAssetUrl(options: AssetUrlOptions): string {
  return resolveWidgetAssetUrl(options, ROBOT_ASSET_PATH);
}

export function installImageFallback(image: HTMLImageElement): void {
  const fallbackClass = image.dataset.fallbackClass || "robot-fallback";
  const fallback = () => {
    image.hidden = true;
    image.parentElement?.classList.add(fallbackClass);
  };
  image.addEventListener("error", fallback, { once: true });
  queueMicrotask(() => {
    if (image.complete && image.naturalWidth === 0) fallback();
  });
}

const CHAT_TIME_FORMATTER = new Intl.DateTimeFormat("cs-CZ", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23"
});

export function formatChatTime(value: Date): string {
  return CHAT_TIME_FORMATTER.format(value);
}

export function appendChatTime(target: HTMLElement, value: Date, className: string): HTMLTimeElement {
  const time = target.ownerDocument.createElement("time");
  time.className = className;
  time.dateTime = value.toISOString();
  time.textContent = formatChatTime(value);
  target.replaceChildren(time);
  return time;
}

export function createTypingRow(ownerDocument: Document): HTMLElement {
  const row = ownerDocument.createElement("div");
  row.className = "typing-row";
  row.dataset.state = "typing";
  row.setAttribute("role", "status");
  row.setAttribute("aria-live", "polite");
  row.setAttribute("aria-label", "Pracuji na odpovědi");

  const dots = ownerDocument.createElement("span");
  dots.className = "typing-dots";
  dots.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 3; index += 1) {
    const dot = ownerDocument.createElement("span");
    dot.className = "typing-dot";
    dots.append(dot);
  }

  const label = ownerDocument.createElement("span");
  label.className = "typing-label";
  label.textContent = "Pracuji na odpovědi…";
  row.append(dots, label);
  return row;
}

export class TypingIndicatorController {
  private row: HTMLElement | undefined;

  show(container: HTMLElement): HTMLElement {
    this.hide();
    this.row = createTypingRow(container.ownerDocument);
    container.append(this.row);
    return this.row;
  }

  hide(): void {
    this.row?.remove();
    this.row = undefined;
  }

  moveToEnd(container: HTMLElement): void {
    if (this.row?.isConnected) container.append(this.row);
  }

  isVisible(): boolean {
    return this.row?.isConnected ?? false;
  }
}

export class DeliveryReceiptController {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private generation = 0;

  schedule(target: HTMLElement, sentAt = new Date(), delay = DELIVERY_DELAY_MS): void {
    this.cancel();
    const generation = this.generation;
    target.replaceChildren();
    target.classList.remove("visible");
    this.timer = setTimeout(() => {
      if (generation !== this.generation || !target.isConnected) return;
      const check = target.ownerDocument.createElement("span");
      check.className = "receipt-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";
      const label = target.ownerDocument.createElement("span");
      label.textContent = "Doručeno";
      const time = target.ownerDocument.createElement("time");
      time.dateTime = sentAt.toISOString();
      time.textContent = formatChatTime(sentAt);
      target.setAttribute("aria-label", `Doručeno ${time.textContent}`);
      target.append(check, label, time);
      target.classList.add("visible");
      this.timer = undefined;
    }, delay);
  }

  cancel(): void {
    this.generation += 1;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }

  hasPendingTimer(): boolean {
    return this.timer !== undefined;
  }
}
