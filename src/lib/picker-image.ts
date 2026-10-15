import { DARK, IMAGE_HEIGHT, IMAGE_WIDTH, LIGHT, svgDocument, text, title, TITLE_HEIGHT } from "./svg";

/** Month and year pickers lay out twelve cells in a 4 x 3 grid. */
export const PICKER_COLUMNS = 4;
const PICKER_ROWS = 3;

export interface PickerCell {
  label: string;
  isSelected: boolean;
  /** The cell containing today, outlined like today in the day calendar. */
  isCurrent: boolean;
  /** Cells outside the page (e.g. the years around a decade) are drawn faded. */
  isOutside: boolean;
}

export function renderPickerSvg(heading: string, cells: PickerCell[], dark: boolean): string {
  const palette = dark ? DARK : LIGHT;
  const cellWidth = IMAGE_WIDTH / PICKER_COLUMNS;
  const cellHeight = (IMAGE_HEIGHT - TITLE_HEIGHT) / PICKER_ROWS;
  const parts = [title(heading, palette)];

  cells.forEach((cell, index) => {
    const x = (index % PICKER_COLUMNS) * cellWidth;
    const y = TITLE_HEIGHT + Math.floor(index / PICKER_COLUMNS) * cellHeight;
    const cx = x + cellWidth / 2;
    const cy = y + cellHeight / 2;

    if (cell.isSelected) {
      parts.push(
        `<rect x="${x + 6}" y="${y + 6}" width="${cellWidth - 12}" height="${cellHeight - 12}" rx="10" fill="${palette.selection}"/>`,
      );
    }
    const ring = cell.isCurrent
      ? `<rect x="${cx - 52}" y="${cy - 22}" width="104" height="44" rx="22" fill="none" stroke="${palette.todayRing}" stroke-width="2.5"/>`
      : "";
    const label = text(
      cx,
      cy + 1,
      cell.label,
      `font-size="22" font-weight="${cell.isCurrent ? 700 : 500}" fill="${palette.text}" text-anchor="middle"`,
    );
    parts.push(`<g opacity="${cell.isOutside ? 0.3 : 1}">${ring}${label}</g>`);
  });

  return svgDocument(parts);
}
