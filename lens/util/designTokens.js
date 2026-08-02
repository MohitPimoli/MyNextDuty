/**
 * Design token layer (pure, DOM-independent).
 *
 * Mirrors the color tokens declared in the `@theme` block of `index.css` so
 * token resolution can be unit- and property-tested without a DOM. React
 * components still consume tokens via Tailwind utilities (`bg-card`,
 * `text-text-secondary`, ...); this module is the testable source of truth for
 * the raw hex values behind those utilities.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.11, 2.6
 */

/**
 * The two selectable themes.
 * @type {ReadonlyArray<"light" | "dark">}
 */
export const THEMES = ["light", "dark"];

/**
 * Color token maps per theme. Each value is a hex color string.
 *
 * Surface/text tokens differ between light and dark;
 * brand and semantic tokens (primary, primaryHover, success, warning, danger)
 * and textInverse are shared across themes.
 *
 * @type {Readonly<Record<"light" | "dark", Readonly<Record<string, string>>>>}
 */
export const TOKENS = {
  light: {
    // Surfaces & borders
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
    // Text
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textInverse: "#F8FAFC",
    // Brand
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    // Semantic
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  dark: {
    // Surfaces & borders (dark-mode overrides)
    background: "#0F172A",
    card: "#1E293B",
    border: "#334155",
    // Text (dark-mode overrides)
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textInverse: "#F8FAFC",
    // Brand (shared across themes)
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    // Semantic (shared across themes)
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
};

/**
 * The strict 8px spacing scale: at least 6 discrete steps, each a
 * positive integer multiple of the 8px base unit. Represented as pixel
 * integers.
 * @type {ReadonlyArray<number>}
 */
export const SPACING_SCALE = [8, 16, 24, 32, 40, 48];

/**
 * Resolve a color token to its hex string for the given theme.
 *
 * @param {"light" | "dark"} theme - the active theme
 * @param {string} name - the token name (e.g. "background", "primary")
 * @returns {string} the hex color string for that theme/token
 * @throws {Error} if the theme is unknown or the token name is undefined for
 *   the theme
 */
export const resolveToken = (theme, name) => {
  const tokens = TOKENS[theme];
  if (!tokens) {
    throw new Error(`Unknown theme "${theme}". Expected one of: ${THEMES.join(", ")}.`);
  }

  if (!Object.prototype.hasOwnProperty.call(tokens, name)) {
    const known = Object.keys(tokens).join(", ");
    throw new Error(`Unknown token "${name}" for theme "${theme}". Known tokens: ${known}.`);
  }

  return tokens[name];
};
