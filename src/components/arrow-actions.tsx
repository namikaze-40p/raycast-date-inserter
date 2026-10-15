import { Action, Keyboard } from "@raycast/api";

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
export function arrowActions(columns: number, move: (delta: number) => void, titles?: string[]) {
  return ARROWS.map((arrow, index) => (
    <Action
      key={arrow.key}
      title={titles?.[index] ?? arrow.title}
      shortcut={{ modifiers: [], key: arrow.key }}
      onAction={() => move(arrow.step(columns))}
    />
  ));
}
