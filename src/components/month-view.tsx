import { Action, ActionPanel, Detail, environment, Icon, useNavigation } from "@raycast/api";
import { addMonths, format, getYear, isSameMonth, startOfMonth } from "date-fns";
import { useState } from "react";
import { monthsOfYear, toMonthId } from "../lib/calendar";
import { PICKER_COLUMNS, renderPickerSvg } from "../lib/picker-image";
import { LanguageConfig } from "../lib/locales";
import { GO_TO_TODAY, GO_TO_YEAR } from "../lib/shortcuts";
import { useImageCache } from "../lib/use-image-cache";
import { arrowActions } from "./arrow-actions";
import { YearView } from "./year-view";

interface Props {
  initial: Date;
  today: Date;
  language: LanguageConfig;
  /** Called with the first day of the chosen month; the caller decides where to navigate next. */
  onPick: (month: Date) => void;
}

/** Twelve months of one year. Moving past December or January turns the page to the next or previous year. */
export function MonthView({ initial, today, language, onPick }: Props) {
  const { push, pop } = useNavigation();
  const [selected, setSelected] = useState(() => startOfMonth(initial));
  const imageFor = useImageCache();
  const dark = environment.appearance === "dark";

  const image = imageFor(toMonthId(selected), () =>
    renderPickerSvg(
      format(selected, language.yearTitleFormat, { locale: language.locale }),
      monthsOfYear(selected).map((month) => ({
        label: format(month, language.monthLabelFormat, { locale: language.locale }),
        isSelected: isSameMonth(month, selected),
        isCurrent: isSameMonth(month, today),
        isOutside: false,
      })),
      dark,
    ),
  );

  return (
    <Detail
      markdown={`![Months](${image})`}
      navigationTitle={format(selected, "yyyy-MM")}
      actions={
        <ActionPanel>
          <Action title="Choose Month" onAction={() => onPick(selected)} />
          <ActionPanel.Section title="Jump">
            <Action
              title="Go to This Month"
              icon={Icon.Calendar}
              shortcut={GO_TO_TODAY}
              onAction={() => setSelected(startOfMonth(today))}
            />
            <Action
              title="Go to Year…"
              icon={Icon.Calendar}
              shortcut={GO_TO_YEAR}
              onAction={() =>
                push(
                  <YearView
                    initialYear={getYear(selected)}
                    today={today}
                    onPick={(year) => {
                      setSelected((month) => new Date(year, month.getMonth(), 1));
                      pop();
                    }}
                  />,
                )
              }
            />
          </ActionPanel.Section>
          <ActionPanel.Section title="Navigate">
            {arrowActions(PICKER_COLUMNS, (delta) => setSelected((month) => addMonths(month, delta)), [
              "Previous Month",
              "Next Month",
              `Back ${PICKER_COLUMNS} Months`,
              `Forward ${PICKER_COLUMNS} Months`,
            ])}
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
