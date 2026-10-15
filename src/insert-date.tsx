import { Action, ActionPanel, Detail, environment, getPreferenceValues, Icon, useNavigation } from "@raycast/api";
import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { arrowActions } from "./components/arrow-actions";
import { MonthView } from "./components/month-view";
import { YearView } from "./components/year-view";
import { moveToMonth, moveToYear, shiftMonth, shiftYear, toDayId, WeekStartsOn } from "./lib/calendar";
import { renderCalendarSvg } from "./lib/calendar-image";
import { GO_TO_MONTH, GO_TO_YEAR } from "./lib/shortcuts";
import { useImageCache } from "./lib/use-image-cache";

// Fixed for now; these become preferences in Phase 3.
const DATE_FORMAT = "yyyy-MM-dd";
const WEEK_STARTS_ON: WeekStartsOn = 0;
const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
const WEEK_LABEL = "週";
const MONTH_TITLE_FORMAT = "yyyy年M月";
const YEAR_TITLE_FORMAT = "yyyy年";
const MONTH_LABEL_FORMAT = "M月";

export default function Command() {
  const { showWeekNumbers } = getPreferenceValues<Preferences.InsertDate>();
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date>(today);
  const { push, pop } = useNavigation();

  const dark = environment.appearance === "dark";
  const imageFor = useImageCache();
  const imageUrl = imageFor(toDayId(selected), () =>
    renderCalendarSvg({
      selected,
      today,
      weekStartsOn: WEEK_STARTS_ON,
      showWeekNumbers,
      dark,
      weekdayLabels: WEEKDAY_LABELS,
      weekLabel: WEEK_LABEL,
      monthTitleFormat: MONTH_TITLE_FORMAT,
    }),
  );

  /** Opens the month view; `pops` is how many screens to close after a month is chosen. */
  function monthView(initial: Date, pops: number) {
    return (
      <MonthView
        initial={initial}
        today={today}
        yearTitleFormat={YEAR_TITLE_FORMAT}
        monthLabelFormat={MONTH_LABEL_FORMAT}
        onPick={(month) => {
          setSelected((current) => moveToMonth(current, month));
          for (let i = 0; i < pops; i++) pop();
        }}
      />
    );
  }

  const formatted = format(selected, DATE_FORMAT);

  return (
    <Detail
      markdown={`![Calendar](${imageUrl})`}
      navigationTitle={formatted}
      actions={
        <ActionPanel>
          <Action.Paste title="Paste Date" content={formatted} />
          <Action.CopyToClipboard title="Copy Date" content={formatted} shortcut={{ modifiers: ["cmd"], key: "c" }} />
          <ActionPanel.Section title="Navigate">
            {arrowActions(7, (delta) => setSelected((current) => addDays(current, delta)), [
              "Previous Day",
              "Next Day",
              "Previous Week",
              "Next Week",
            ])}
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
            <Action
              title="Previous Year"
              shortcut={{ modifiers: ["cmd", "shift"], key: "[" }}
              onAction={() => setSelected((current) => shiftYear(current, -1))}
            />
            <Action
              title="Next Year"
              shortcut={{ modifiers: ["cmd", "shift"], key: "]" }}
              onAction={() => setSelected((current) => shiftYear(current, 1))}
            />
          </ActionPanel.Section>
          <ActionPanel.Section title="Jump">
            <Action
              title="Go to Month…"
              icon={Icon.Calendar}
              shortcut={GO_TO_MONTH}
              onAction={() => push(monthView(selected, 1))}
            />
            <Action
              title="Go to Year…"
              icon={Icon.Calendar}
              shortcut={GO_TO_YEAR}
              onAction={() =>
                push(
                  <YearView
                    initialYear={selected.getFullYear()}
                    today={today}
                    // Choosing a year continues to that year's months; afterwards close both screens.
                    onPick={(year) => push(monthView(moveToYear(selected, year), 2))}
                  />,
                )
              }
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
