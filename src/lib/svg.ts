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

export function text(x: number, y: number, content: string | number, attrs: string): string {
  return `<text x="${x}" y="${y}" font-family="${FONT}" dominant-baseline="central" ${attrs}>${content}</text>`;
}

export function title(content: string, palette: Palette): string {
  return text(8, TITLE_HEIGHT / 2, content, `font-size="20" font-weight="700" fill="${palette.text}"`);
}

export function svgDocument(parts: string[]): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" ` +
    `viewBox="0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}">${parts.join("")}</svg>`
  );
}

export function toDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
