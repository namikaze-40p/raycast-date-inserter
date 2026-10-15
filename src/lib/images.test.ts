import { describe, expect, it } from "vitest";
import { renderCalendarSvg } from "./calendar-image";
import { LANGUAGES } from "./locales";
import { renderPickerSvg } from "./picker-image";
import { IMAGE_HEIGHT, IMAGE_WIDTH, toDataUri } from "./svg";

const textOf = (svg: string) => [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((match) => match[1]);

describe("renderCalendarSvg", () => {
  const options = {
    selected: new Date(2026, 9, 21),
    today: new Date(2026, 9, 15),
    weekStartsOn: 0 as const,
    language: LANGUAGES.en,
    dark: false,
  };

  it("draws the title, weekday header and 42 days at the fixed size", () => {
    const svg = renderCalendarSvg(options);
    expect(svg).toContain(`width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}"`);
    const texts = textOf(svg);
    expect(texts[0]).toBe("October 2026");
    expect(texts.slice(1, 8)).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
    expect(texts).toHaveLength(1 + 7 + 42);
  });

  it("adds a week-number column only when requested", () => {
    const texts = textOf(renderCalendarSvg({ ...options, weekStartsOn: 1, weekNumbering: "iso" }));
    expect(texts[1]).toBe("Wk");
    expect(texts).toContain("42");
    expect(texts).toHaveLength(1 + 8 + 6 + 42);
  });

  it("highlights the selected day once", () => {
    expect(renderCalendarSvg(options).match(/<rect /g)).toHaveLength(1);
  });
});

describe("renderPickerSvg", () => {
  it("draws a heading and twelve cells", () => {
    const cells = Array.from({ length: 12 }, (_, i) => ({
      label: String(2019 + i),
      isSelected: i === 7,
      isCurrent: i === 7,
      isOutside: i === 0 || i === 11,
    }));
    const texts = textOf(renderPickerSvg("2020 – 2029", cells, true));
    expect(texts).toEqual(["2020 – 2029", ...cells.map((cell) => cell.label)]);
  });
});

describe("toDataUri", () => {
  it("encodes SVG as base64", () => {
    const uri = toDataUri("<svg/>");
    expect(uri).toBe(`data:image/svg+xml;base64,${Buffer.from("<svg/>").toString("base64")}`);
  });
});
