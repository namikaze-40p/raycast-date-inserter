import { Action, ActionPanel, Detail, environment, Icon } from "@raycast/api";
import { useState } from "react";
import { decadePage, decadeStart } from "../lib/calendar";
import { PICKER_COLUMNS, renderPickerSvg } from "../lib/picker-image";
import { GO_TO_TODAY } from "../lib/shortcuts";
import { useImageCache } from "../lib/use-image-cache";
import { arrowActions } from "./arrow-actions";

interface Props {
  initialYear: number;
  today: Date;
  /** Called with the chosen year; the caller decides where to navigate next. */
  onPick: (year: number) => void;
}

/** Decade page of years. Moving past the decade turns the page, like the day calendar. */
export function YearView({ initialYear, today, onPick }: Props) {
  const [selected, setSelected] = useState(initialYear);
  const imageFor = useImageCache();
  const dark = environment.appearance === "dark";

  const start = decadeStart(selected);
  const image = imageFor(String(selected), () =>
    renderPickerSvg(
      `${start} – ${start + 9}`,
      decadePage(selected).map((year) => ({
        label: String(year),
        isSelected: year === selected,
        isCurrent: year === today.getFullYear(),
        isOutside: decadeStart(year) !== start,
      })),
      dark,
    ),
  );

  return (
    <Detail
      markdown={`![Years](${image})`}
      navigationTitle={String(selected)}
      actions={
        <ActionPanel>
          <Action title="Choose Year" onAction={() => onPick(selected)} />
          <ActionPanel.Section title="Navigate">
            {arrowActions(PICKER_COLUMNS, (delta) => setSelected((year) => year + delta), [
              "Previous Year",
              "Next Year",
              `Back ${PICKER_COLUMNS} Years`,
              `Forward ${PICKER_COLUMNS} Years`,
            ])}
          </ActionPanel.Section>
          <ActionPanel.Section title="Jump">
            <Action
              title="Go to This Year"
              icon={Icon.Calendar}
              shortcut={GO_TO_TODAY}
              onAction={() => setSelected(today.getFullYear())}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
