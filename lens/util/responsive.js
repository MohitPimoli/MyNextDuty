/**
 * Pure responsive-layout logic for the lens frontend.
 *
 * These helpers map a viewport width to a breakpoint and the corresponding
 * layout specification (padding, max-width, centering) so that responsive
 * behavior is unit- and property-testable independent of the DOM.
 *
 * Breakpoints:
 *   - mobile:  360–767 (and any width < 360 is treated as mobile)
 *   - tablet:  768–1279
 *   - desktop: >= 1280
 *
 * @typedef {"mobile" | "tablet" | "desktop"} Breakpoint
 *
 * @typedef {Object} LayoutSpec
 * @property {Breakpoint} breakpoint - the resolved breakpoint
 * @property {16 | 20 | 32} paddingPx - left/right page padding in pixels
 * @property {1280} maxWidthPx - maximum content width in pixels
 * @property {boolean} centered - true when the viewport is wider than maxWidth
 */

/** Tablet lower bound (px). Widths below this are mobile. */
const TABLET_MIN = 768;
/** Desktop lower bound (px). Widths at or above this are desktop. */
const DESKTOP_MIN = 1280;

/** Maximum content width in pixels. */
export const MAX_WIDTH_PX = 1280;

/** Left/right page padding per breakpoint in pixels. */
export const PADDING_PX = Object.freeze({
  mobile: 16,
  tablet: 20,
  desktop: 32,
});

/** Mentor grid column count per breakpoint. */
export const MENTOR_COLUMNS = Object.freeze({
  mobile: 1,
  tablet: 2,
  desktop: 3,
});

/**
 * Resolve a viewport width to its breakpoint.
 *
 * Widths below 360px still resolve to "mobile".
 *
 * @param {number} width - viewport width in pixels
 * @returns {Breakpoint} the resolved breakpoint
 */
export function resolveBreakpoint(width) {
  if (width >= DESKTOP_MIN) {
    return "desktop";
  }
  if (width >= TABLET_MIN) {
    return "tablet";
  }
  return "mobile";
}

/**
 * Resolve a viewport width to its layout specification.
 *
 * Padding is 16px at mobile, 20px at tablet, and 32px at desktop. The content
 * max-width is always 1280px, and content is centered if and only if the
 * viewport width exceeds the max-width.
 *
 * @param {number} width - viewport width in pixels
 * @returns {LayoutSpec} the layout specification for the given width
 */
export function resolveLayout(width) {
  const breakpoint = resolveBreakpoint(width);
  return {
    breakpoint,
    paddingPx: PADDING_PX[breakpoint],
    maxWidthPx: MAX_WIDTH_PX,
    centered: width > MAX_WIDTH_PX,
  };
}

/**
 * Resolve the mentor grid column count for a breakpoint.
 *
 * @param {Breakpoint} breakpoint - one of "mobile" | "tablet" | "desktop"
 * @returns {1 | 2 | 3} the number of grid columns
 */
export function mentorColumns(breakpoint) {
  return MENTOR_COLUMNS[breakpoint];
}
