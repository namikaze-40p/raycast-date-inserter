import { format, getDay, isSameDay, isSameMonth } from "date-fns";
import { buildMonthPage, weekNumber, WeekNumbering, WeekStartsOn, WEEKS_PER_PAGE } from "./calendar";
import { LanguageConfig } from "./locales";
import { DARK, IMAGE_HEIGHT, IMAGE_WIDTH, LIGHT, Palette, svgDocument, text, title, TITLE_HEIGHT } from "./svg";

export interface CalendarImageOptions {
  selected: Date;
  today: Date;
  weekStartsOn: WeekStartsOn;
  /** Undefined hides the week-number column. */
  weekNumbering?: WeekNumbering;
  language: LanguageConfig;
  dark: boolean;
}

const WEEKDAY_ROW_HEIGHT = 24;
const WEEK_COLUMN_WIDTH = 48;
const ROW_HEIGHT = (IMAGE_HEIGHT - TITLE_HEIGHT - WEEKDAY_ROW_HEIGHT) / WEEKS_PER_PAGE;

function weekdayColor(weekday: number, palette: Palette, fallback: string): string {
  if (weekday === 0) return palette.sunday;
  if (weekday === 6) return palette.saturday;
  return fallback;
}

/** Renders one month page, including the selection highlight, as an SVG document. */
export function renderCalendarSvg(options: CalendarImageOptions): string {
  const { selected, today, weekStartsOn, weekNumbering, language } = options;
  const palette = options.dark ? DARK : LIGHT;
  const days = buildMonthPage(selected, weekStartsOn);

  const gridLeft = weekNumbering ? WEEK_COLUMN_WIDTH : 0;
  const cellWidth = (IMAGE_WIDTH - gridLeft) / 7;
  const gridTop = TITLE_HEIGHT + WEEKDAY_ROW_HEIGHT;
  const headerY = TITLE_HEIGHT + WEEKDAY_ROW_HEIGHT / 2;

  const parts: string[] = [title(format(selected, language.monthTitleFormat, { locale: language.locale }), palette)];

  if (weekNumbering) {
    parts.push(
      text(
        WEEK_COLUMN_WIDTH / 2,
        headerY,
        language.weekLabel,
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
        language.weekdayLabels[weekday],
        `font-size="13" font-weight="600" fill="${weekdayColor(weekday, palette, palette.label)}" text-anchor="middle"`,
      ),
    );
  });

  for (let row = 0; row < WEEKS_PER_PAGE; row++) {
    const y = gridTop + row * ROW_HEIGHT;
    const cy = y + ROW_HEIGHT / 2;

    if (weekNumbering) {
      parts.push(
        text(
          WEEK_COLUMN_WIDTH / 2,
          cy,
          weekNumber(days[row * 7], weekNumbering),
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

  return svgDocument(parts);
}
