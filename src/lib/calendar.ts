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

/** Week number shown for a row: ISO 8601 for Monday-start weeks, Jan 1-based for Sunday-start weeks. */
export function weekNumber(weekStart: Date, weekStartsOn: WeekStartsOn): number {
  return weekStartsOn === 1 ? getISOWeek(weekStart) : getWeek(weekStart, { weekStartsOn: 0, firstWeekContainsDate: 1 });
}

/** Moves to the given month, keeping the day of month and clamping it to the month's length. */
export function moveToMonth(date: Date, month: Date): Date {
  const target = startOfMonth(month);
  return setDate(target, Math.min(date.getDate(), lastDayOfMonth(target).getDate()));
}

export function shiftMonth(date: Date, amount: number): Date {
  return moveToMonth(date, addMonths(startOfMonth(date), amount));
}
