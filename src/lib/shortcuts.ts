import { Keyboard } from "@raycast/api";

export const GO_TO_MONTH: Keyboard.Shortcut = { modifiers: ["cmd"], key: "m" };

// Cmd+Y stands for "year" here; it only shares its key with the common Quick Look shortcut.

export const GO_TO_YEAR: Keyboard.Shortcut = { modifiers: ["cmd"], key: "y" };

export const GO_TO_TODAY: Keyboard.Shortcut = { modifiers: ["cmd"], key: "t" };
