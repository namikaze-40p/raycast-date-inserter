import { Action, ActionPanel, Detail, environment, getPreferenceValues, Keyboard } from "@raycast/api";
import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { shiftMonth, toDayId, WeekStartsOn } from "./lib/calendar";
import { renderCalendarSvg } from "./lib/calendar-image";

// Fixed for now; these become preferences in Phase 3.
const DATE_FORMAT = "yyyy-MM-dd";
const WEEK_STARTS_ON: WeekStartsOn = 0;
const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
const WEEK_LABEL = "週";
const MONTH_TITLE_FORMAT = "yyyy年M月";

const ARROW_MOVES: { title: string; key: Keyboard.KeyEquivalent; days: number }[] = [
  { title: "Previous Day", key: "arrowLeft", days: -1 },
  { title: "Next Day", key: "arrowRight", days: 1 },
  { title: "Previous Week", key: "arrowUp", days: -7 },
  { title: "Next Week", key: "arrowDown", days: 7 },
];

export default function Command() {
  const { showWeekNumbers } = getPreferenceValues<Preferences.InsertDate>();
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date>(today);

  const dark = environment.appearance === "dark";
  // Data URIs keyed by selected day. Raycast shows an image without flicker once
  // it has loaded that exact URI, so the same string must be reused every time.
  const imageCache = useMemo(() => new Map<string, string>(), []);

  function imageFor(date: Date): string {
    const key = toDayId(date);
    let uri = imageCache.get(key);
    if (!uri) {
      const svg = renderCalendarSvg({
        selected: date,
        today,
        weekStartsOn: WEEK_STARTS_ON,
        showWeekNumbers,
        dark,
        weekdayLabels: WEEKDAY_LABELS,
        weekLabel: WEEK_LABEL,
        monthTitleFormat: MONTH_TITLE_FORMAT,
      });
      uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
      imageCache.set(key, uri);
    }
    return uri;
  }

  const imageUrl = imageFor(selected);
  const formatted = format(selected, DATE_FORMAT);

  return (
    <Detail
      markdown={`![Calendar](${imageUrl})`}
      navigationTitle={formatted}
      actions={
        <ActionPanel>
          <Action.Paste title="Paste Date" content={formatted} />
          <ActionPanel.Section title="Navigate">
            {ARROW_MOVES.map((move) => (
              <Action
                key={move.key}
                title={move.title}
                shortcut={{ modifiers: [], key: move.key }}
                onAction={() => setSelected((current) => addDays(current, move.days))}
              />
            ))}
            <Action
              title="Previous Month"
              shortcut={{ modifiers: ["cmd"], key: "[" }}
              onAction={() => setSelected((current) => shiftMonth(current, -1))}
            />
            <Action
              title="Next Month"
              shortcut={{ modifiers: ["cmd"], key: "]" }}
              onAction={() => setSelected((current) => shiftMonth(current, 1))}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
