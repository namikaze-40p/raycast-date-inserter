export interface Palette {
  text: string;
  label: string;
  saturday: string;
  sunday: string;
  todayRing: string;
  selection: string;
}

export const LIGHT: Palette = {
  text: "#1C1C1E",
  label: "#8E8E93",
  saturday: "#0A64D6",
  sunday: "#D93636",
  todayRing: "#E5484D",
  selection: "#E3E3E8",
};

export const DARK: Palette = {
  text: "#F2F2F7",
  label: "#98989F",
  saturday: "#5AA9FF",
  sunday: "#FF6B6B",
  todayRing: "#FF6369",
  selection: "#3A3A3C",
};

// The Detail view scrolls when the image is taller than this at full width.
export const IMAGE_WIDTH = 700;
export const IMAGE_HEIGHT = 300;
export const TITLE_HEIGHT = 36;

const FONT = "-apple-system, Helvetica, Arial, sans-serif";

/** Rounds coordinates to keep the markup short; a tenth of a pixel is invisible. */
export function round(value: number): number {
  return Math.round(value * 10) / 10;
}

const XML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };

/** Escapes text so labels and titles can never break the SVG markup. */
export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);
}

/**
 * A text element centered on (x, y). Font, size, color and anchor come from an
 * enclosing group so they are written once per group instead of per element;
 * the baseline stays on each element because not every renderer inherits it.
 */
export function text(x: number, y: number, content: string | number, attrs = ""): string {
  return `<text x="${round(x)}" y="${round(y)}" dominant-baseline="central"${attrs ? ` ${attrs}` : ""}>${escapeXml(String(content))}</text>`;
}

export function group(attrs: string, children: string[]): string {
  return children.length > 0 ? `<g ${attrs}>${children.join("")}</g>` : "";
}

export function title(content: string, palette: Palette): string {
  return text(
    8,
    TITLE_HEIGHT / 2,
    content,
    `text-anchor="start" font-size="20" font-weight="700" fill="${palette.text}"`,
  );
}

/** Root element; text is centered horizontally unless an element says otherwise. */
export function svgDocument(parts: string[]): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" ` +
    `viewBox="0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}" font-family="${FONT}" text-anchor="middle">${parts.join("")}</svg>`
  );
}

export function toDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
