import { format, getDay, isSameDay, isSameMonth } from "date-fns";
import { buildMonthPage, weekNumber, WeekStartsOn, WEEKS_PER_PAGE } from "./calendar";

export interface CalendarImageOptions {
  selected: Date;
  today: Date;
  weekStartsOn: WeekStartsOn;
  showWeekNumbers: boolean;
  dark: boolean;
  /** Weekday names indexed by `getDay()` (0 = Sunday). */
  weekdayLabels: string[];
  weekLabel: string;
  monthTitleFormat: string;
}

interface Palette {
  text: string;
  label: string;
  saturday: string;
  sunday: string;
  todayRing: string;
  selection: string;
}

const LIGHT: Palette = {
  text: "#1C1C1E",
  label: "#8E8E93",
  saturday: "#0A64D6",
  sunday: "#D93636",
  todayRing: "#E5484D",
  selection: "#E3E3E8",
};

const DARK: Palette = {
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
const TITLE_HEIGHT = 36;
const WEEKDAY_ROW_HEIGHT = 24;
const WEEK_COLUMN_WIDTH = 48;
const ROW_HEIGHT = (IMAGE_HEIGHT - TITLE_HEIGHT - WEEKDAY_ROW_HEIGHT) / WEEKS_PER_PAGE;
const FONT = "-apple-system, Helvetica, Arial, sans-serif";

function weekdayColor(weekday: number, palette: Palette, fallback: string): string {
  if (weekday === 0) return palette.sunday;
  if (weekday === 6) return palette.saturday;
  return fallback;
}

function text(x: number, y: number, content: string | number, attrs: string): string {
  return `<text x="${x}" y="${y}" font-family="${FONT}" dominant-baseline="central" ${attrs}>` + `${content}</text>`;
}

/** Renders one month page, including the selection highlight, as an SVG document. */
export function renderCalendarSvg(options: CalendarImageOptions): string {
  const { selected, today, weekStartsOn, showWeekNumbers } = options;
  const palette = options.dark ? DARK : LIGHT;
  const days = buildMonthPage(selected, weekStartsOn);

  const gridLeft = showWeekNumbers ? WEEK_COLUMN_WIDTH : 0;
  const cellWidth = (IMAGE_WIDTH - gridLeft) / 7;
  const gridTop = TITLE_HEIGHT + WEEKDAY_ROW_HEIGHT;
  const headerY = TITLE_HEIGHT + WEEKDAY_ROW_HEIGHT / 2;

  const parts: string[] = [];
  parts.push(
    text(
      8,
      TITLE_HEIGHT / 2,
      format(selected, options.monthTitleFormat),
      `font-size="20" font-weight="700" fill="${palette.text}"`,
    ),
  );

  if (showWeekNumbers) {
    parts.push(
      text(
        WEEK_COLUMN_WIDTH / 2,
        headerY,
        options.weekLabel,
        `font-size="13" font-weight="600" fill="${palette.label}" text-anchor="middle"`,
      ),
    );
  }
  days.slice(0, 7).forEach((date, column) => {
    const weekday = getDay(date);
    parts.push(
      text(
        gridLeft + column * cellWidth + cellWidth / 2,
        headerY,
        options.weekdayLabels[weekday],
        `font-size="13" font-weight="600" fill="${weekdayColor(weekday, palette, palette.label)}" text-anchor="middle"`,
      ),
    );
  });

  for (let row = 0; row < WEEKS_PER_PAGE; row++) {
    const y = gridTop + row * ROW_HEIGHT;
    const cy = y + ROW_HEIGHT / 2;

    if (showWeekNumbers) {
      parts.push(
        text(
          WEEK_COLUMN_WIDTH / 2,
          cy,
          weekNumber(days[row * 7], weekStartsOn),
          `font-size="14" fill="${palette.label}" text-anchor="middle"`,
        ),
      );
    }

    for (let column = 0; column < 7; column++) {
      const date = days[row * 7 + column];
      const x = gridLeft + column * cellWidth;
      const cx = x + cellWidth / 2;
      const isToday = isSameDay(date, today);

      if (isSameDay(date, selected)) {
        parts.push(
          `<rect x="${x + 3}" y="${y + 2}" width="${cellWidth - 6}" height="${ROW_HEIGHT - 4}" rx="8" fill="${palette.selection}"/>`,
        );
      }
      const opacity = isSameMonth(date, selected) ? 1 : 0.3;
      const ring = isToday
        ? `<circle cx="${cx}" cy="${cy}" r="${ROW_HEIGHT / 2 - 4}" fill="none" stroke="${palette.todayRing}" stroke-width="2.5"/>`
        : "";
      const number = text(
        cx,
        cy + 1,
        date.getDate(),
        `font-size="19" font-weight="${isToday ? 700 : 500}" fill="${weekdayColor(getDay(date), palette, palette.text)}" text-anchor="middle"`,
      );
      parts.push(`<g opacity="${opacity}">${ring}${number}</g>`);
    }
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" ` +
    `viewBox="0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}">${parts.join("")}</svg>`
  );
}
