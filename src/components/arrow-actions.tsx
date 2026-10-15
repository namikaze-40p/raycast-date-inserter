import { Action, Keyboard } from "@raycast/api";
import { HoldOptions } from "../lib/update-scheduler";

const ARROWS: { title: string; key: Keyboard.KeyEquivalent; step: (columns: number) => number }[] = [
  { title: "Move Left", key: "arrowLeft", step: () => -1 },
  { title: "Move Right", key: "arrowRight", step: () => 1 },
  { title: "Move Up", key: "arrowUp", step: (columns) => -columns },
  { title: "Move Down", key: "arrowDown", step: (columns) => columns },
];

/**
 * Bare arrow-key actions for a grid drawn as an image. Detail views do not
 * handle arrow keys themselves, so these shortcuts reach the extension.
 * Returned as an array because action panels only accept Action elements.
 */
export function arrowActions(
  columns: number,
  move: (delta: number, key: Keyboard.KeyEquivalent) => void,
  titles?: string[],
) {
  return ARROWS.map((arrow, index) => (
    <Action
      key={arrow.key}
      title={titles?.[index] ?? arrow.title}
      shortcut={{ modifiers: [], key: arrow.key }}
      onAction={() => move(arrow.step(columns), arrow.key)}
    />
  ));
}

/**
 * Hold behavior for left/right in a grid: while the key is held, only show the
 * selection when it reaches another row, so the highlight keeps landing in the
 * same column. Up/down already move a whole row per press and need no hold.
 */
export function rowHold<T>(key: Keyboard.KeyEquivalent, rowOf: (value: T) => string): HoldOptions<T> | undefined {
  if (key !== "arrowLeft" && key !== "arrowRight") return undefined;
  return { key, isBoundary: (shown, next) => rowOf(shown) !== rowOf(next) };
}
