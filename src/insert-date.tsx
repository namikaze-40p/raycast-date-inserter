import { Action, ActionPanel, Detail, environment, Icon, Keyboard, useNavigation } from "@raycast/api";
import { addDays } from "date-fns";
import { useMemo, useState } from "react";
import { arrowActions } from "./components/arrow-actions";
import { MonthView } from "./components/month-view";
import { YearView } from "./components/year-view";
import { moveToMonth, moveToYear, shiftMonth, shiftYear, toDayId } from "./lib/calendar";
import { renderCalendarSvg } from "./lib/calendar-image";
import { formatDate } from "./lib/date-format";
import { readSettings } from "./lib/settings";
import { GO_TO_MONTH, GO_TO_TODAY, GO_TO_YEAR } from "./lib/shortcuts";
import { useImageCache } from "./lib/use-image-cache";

export default function Command() {
  const settings = useMemo(readSettings, []);
  const { formats, language, weekStartsOn, weekNumbering } = settings;
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date>(today);
  const [formatIndex, setFormatIndex] = useState(settings.initialFormatIndex);
  const { push, pop } = useNavigation();

  const dark = environment.appearance === "dark";
  const imageFor = useImageCache();
  const imageUrl = imageFor(toDayId(selected), () =>
    renderCalendarSvg({ selected, today, weekStartsOn, weekNumbering, language, dark }),
  );

  const activeFormat = formats[formatIndex];
  const result = formatDate(selected, activeFormat.pattern, language.locale);
  // The output itself shows which format is active; the action panel marks it too.
  const navigationTitle = result.ok
    ? result.value
    : `Invalid Date Format ${activeFormat.number}: ${activeFormat.pattern}`;

  /** Opens the month view; `pops` is how many screens to close after a month is chosen. */
  function monthView(initial: Date, pops: number) {
    return (
      <MonthView
        initial={initial}
        today={today}
        language={language}
        onPick={(month) => {
          setSelected((current) => moveToMonth(current, month));
          for (let i = 0; i < pops; i++) pop();
        }}
      />
    );
  }

  return (
    <Detail
      markdown={`![Calendar](${imageUrl})`}
      navigationTitle={navigationTitle}
      actions={
        <ActionPanel>
          {result.ok ? (
            <>
              <Action.Paste title="Paste Date" content={result.value} />
              <Action.CopyToClipboard
                title="Copy Date"
                content={result.value}
                shortcut={{ modifiers: ["cmd"], key: "c" }}
              />
            </>
          ) : (
            <Action.OpenInBrowser title="Open Date Format Reference" url="https://date-fns.org/docs/format" />
          )}
          {formats.length > 1 && (
            <ActionPanel.Section title="Format">
              {formats.map((slot, index) => (
                <Action
                  key={slot.number}
                  title={`Use Date Format ${slot.number} (${slot.pattern})`}
                  icon={index === formatIndex ? Icon.CheckCircle : Icon.Circle}
                  shortcut={{ modifiers: [], key: String(slot.number) as Keyboard.KeyEquivalent }}
                  onAction={() => setFormatIndex(index)}
                />
              ))}
            </ActionPanel.Section>
          )}
          <ActionPanel.Section title="Jump">
            <Action
              title="Go to Today"
              icon={Icon.Calendar}
              shortcut={GO_TO_TODAY}
              onAction={() => setSelected(today)}
            />
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
        </ActionPanel>
      }
    />
  );
}
