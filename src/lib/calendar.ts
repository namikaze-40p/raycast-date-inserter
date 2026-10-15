import {
  addDays,
  addMonths,
  format,
  getISOWeek,
  getWeek,
  lastDayOfMonth,
  setDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export type WeekStartsOn = 0 | 1;

/** Every page has the same number of rows so the image never changes size. */
export const WEEKS_PER_PAGE = 6;

/** Stable key for a day. */
export function toDayId(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Days shown on the page for `month`: a fixed number of full weeks starting
 * on the week that contains the 1st, padded with days of the neighboring months.
 */
export function buildMonthPage(month: Date, weekStartsOn: WeekStartsOn): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn });
  return Array.from({ length: WEEKS_PER_PAGE * 7 }, (_, i) => addDays(start, i));
}

/** How week numbers are counted, matching the options of the Obsidian plugin. */
export type WeekNumbering = "iso" | "western" | "middle-eastern";

/** "auto" picks the numbering that matches the calendar's first day of the week. */
export function resolveWeekNumbering(setting: WeekNumbering | "auto", weekStartsOn: WeekStartsOn): WeekNumbering {
  if (setting !== "auto") return setting;
  return weekStartsOn === 1 ? "iso" : "western";
}

/**
 * Week number shown for the calendar row starting at `rowStart`.
 *
 * The row's middle day is used so that the number belongs to the week sharing
 * most days with the row, even when the numbering starts the week on a
 * different day than the calendar (e.g. ISO weeks on a Sunday-first calendar).
 */
export function weekNumber(rowStart: Date, numbering: WeekNumbering): number {
  const day = addDays(rowStart, 3);
  switch (numbering) {
    case "iso":
      return getISOWeek(day);
    case "western":
      return getWeek(day, { weekStartsOn: 0, firstWeekContainsDate: 1 });
    case "middle-eastern":
      return getWeek(day, { weekStartsOn: 6, firstWeekContainsDate: 1 });
  }
}

export function toMonthId(date: Date): string {
  return format(date, "yyyy-MM");
}

/** The twelve months of the year that `year` falls in. */
export function monthsOfYear(year: Date): Date[] {
  const first = startOfYear(year);
  return Array.from({ length: 12 }, (_, i) => addMonths(first, i));
}

/** Moves to the given month, keeping the day of month and clamping it to the month's length. */
export function moveToMonth(date: Date, month: Date): Date {
  const target = startOfMonth(month);
  return setDate(target, Math.min(date.getDate(), lastDayOfMonth(target).getDate()));
}

export function shiftMonth(date: Date, amount: number): Date {
  return moveToMonth(date, addMonths(startOfMonth(date), amount));
}

export function shiftYear(date: Date, amount: number): Date {
  return shiftMonth(date, amount * 12);
}

/** Moves to the same month and day in `year`, clamping the day to the month's length. */
export function moveToYear(date: Date, year: number): Date {
  return moveToMonth(date, new Date(year, date.getMonth(), 1));
}

/** First year of the decade `year` belongs to, e.g. 2020 for 2026. */
export function decadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

/** Twelve years shown on a decade page: the decade plus one year on each side. */
export function decadePage(year: number): number[] {
  const first = decadeStart(year) - 1;
  return Array.from({ length: 12 }, (_, i) => first + i);
}
