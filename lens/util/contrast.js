/**
 * WCAG 2.1 contrast logic (pure, DOM-independent).
 *
 * Computes relative luminance and contrast ratios from hex color strings so
 * that accessibility guarantees can be unit- and property-tested without a
 * DOM. Works directly against the raw token hex values exposed by
 * `designTokens.js`.
 *
 * WCAG 2.1 success criteria encoded here:
 *   - Focus indicators must reach at least 3:1 against the adjacent
 *     background.
 *   - Text must reach at least 4.5:1 for normal text and at least 3:1 for
 *     large text.
 *   - UI components and graphical objects must reach at least 3:1 against
 *     adjacent colors.
 *
 * @typedef {"normalText" | "largeText" | "ui"} ContrastKind
 *
 * @typedef {Object} RGB
 * @property {number} r - red channel, integer in [0, 255]
 * @property {number} g - green channel, integer in [0, 255]
 * @property {number} b - blue channel, integer in [0, 255]
 *
 */

/**
 * Minimum required contrast ratio per contrast kind (WCAG 2.1 AA).
 *
 * `normalText` requires 4.5:1; `largeText` and `ui` require 3:1
 *
 * @type {Readonly<Record<ContrastKind, number>>}
 */
export const CONTRAST_THRESHOLDS = Object.freeze({
  normalText: 4.5,
  largeText: 3,
  ui: 3,
});

/**
 * Parse a hex color string into its RGB channels.
 *
 * Accepts `#RGB` and `#RRGGBB` forms, case-insensitively. The leading `#` is
 * required. Shorthand `#RGB` digits are expanded by duplication (e.g. `#0af`
 * becomes `#00aaff`).
 *
 * @param {string} hex - a hex color string, e.g. "#FFF" or "#4F46E5"
 * @returns {RGB} the parsed red/green/blue channels
 * @throws {Error} if the input is not a valid `#RGB` or `#RRGGBB` string
 */
export function parseHexColor(hex) {
  if (typeof hex !== "string") {
    throw new Error(`Invalid hex color: expected a string, got ${typeof hex}.`);
  }

  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!match) {
    throw new Error(`Invalid hex color "${hex}". Expected "#RGB" or "#RRGGBB".`);
  }

  let digits = match[1];
  if (digits.length === 3) {
    digits = digits
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return {
    r: parseInt(digits.slice(0, 2), 16),
    g: parseInt(digits.slice(2, 4), 16),
    b: parseInt(digits.slice(4, 6), 16),
  };
}

/**
 * Linearize a single 8-bit sRGB channel per the WCAG formula.
 *
 * @param {number} channel - channel value, integer in [0, 255]
 * @returns {number} the linearized channel value in [0, 1]
 */
function linearizeChannel(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Compute the WCAG relative luminance of a hex color.
 *
 * Channels are linearized from sRGB and combined as
 * `0.2126*R + 0.7152*G + 0.0722*B`.
 *
 * @param {string} hex - a hex color string, e.g. "#FFFFFF"
 * @returns {number} the relative luminance in [0, 1]
 * @throws {Error} if the input is not a valid hex color
 */
export function relativeLuminance(hex) {
  const { r, g, b } = parseHexColor(hex);
  return 0.2126 * linearizeChannel(r) + 0.7152 * linearizeChannel(g) + 0.0722 * linearizeChannel(b);
}

/**
 * Compute the WCAG contrast ratio between two hex colors.
 *
 * Returns `(L1 + 0.05) / (L2 + 0.05)` where `L1` is the lighter of the two
 * luminances, so the result is order-independent and lies in `[1, 21]`.
 *
 * @param {string} hex1 - first hex color string
 * @param {string} hex2 - second hex color string
 * @returns {number} the contrast ratio in [1, 21]
 * @throws {Error} if either input is not a valid hex color
 */
export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Select the minimum required contrast ratio for a given kind of content.
 *
 * @param {ContrastKind} kind - one of "normalText" | "largeText" | "ui"
 * @returns {number} the minimum required contrast ratio (4.5 or 3)
 * @throws {Error} if the kind is not a recognized contrast kind
 */
export function contrastThreshold(kind) {
  if (!Object.prototype.hasOwnProperty.call(CONTRAST_THRESHOLDS, kind)) {
    const known = Object.keys(CONTRAST_THRESHOLDS).join(", ");
    throw new Error(`Unknown contrast kind "${kind}". Expected one of: ${known}.`);
  }
  return CONTRAST_THRESHOLDS[kind];
}

/**
 * Determine whether two colors meet the contrast threshold for a kind.
 *
 * @param {string} hex1 - first hex color string
 * @param {string} hex2 - second hex color string
 * @param {ContrastKind} kind - one of "normalText" | "largeText" | "ui"
 * @returns {boolean} true when the contrast ratio meets or exceeds the
 *   minimum required for the given kind
 * @throws {Error} if either color is invalid or the kind is unrecognized
 */
export function meetsContrast(hex1, hex2, kind) {
  return contrastRatio(hex1, hex2) >= contrastThreshold(kind);
}
