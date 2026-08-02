/**
 * Pure theme logic for the lens frontend (DOM-independent where possible).
 *
 * These helpers encode the light/dark theme rules so that toggling, initial
 * resolution, and persistence can be unit- and property-tested without a
 * running provider. React components consume `next-themes` for the actual
 * DOM/class application; this module is the testable source of truth for the
 * theme values, the toggle relation, and the storage-guard contract.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

/**
 * The two selectable themes.
 * @type {ReadonlyArray<"light" | "dark">}
 */
export const THEMES = ["light", "dark"];

/** The default theme applied when no preference is detectable. */
export const DEFAULT_THEME = "light";

/** The client-side storage key used to persist the selected theme. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Toggle between the two themes.
 *
 * The mapping is an involution: `toggleTheme(toggleTheme(t)) === t`, and the
 * result always differs from the input. Any value other than "dark" toggles to
 * "dark" so that an unexpected/undefined current theme resolves deterministically.
 *
 * @param {"light" | "dark"} theme - the currently active theme
 * @returns {"light" | "dark"} the opposite theme
 */
export const toggleTheme = (theme) => (theme === "dark" ? "light" : "dark");

/**
 * Resolve the theme to apply on load.
 *
 * When a persisted theme exists it takes precedence and is returned as-is.
 * Otherwise the operating-system preference is used, defaulting to the light
 * theme when no OS preference is detectable.
 *
 * @param {"light" | "dark" | null | undefined} persisted - the persisted theme,
 *   or null/undefined when none has been stored
 * @param {"light" | "dark" | null | undefined} osPref - the OS color-scheme
 *   preference, or null/undefined when it cannot be detected
 * @returns {"light" | "dark"} the theme to apply
 */
export const resolveInitialTheme = (persisted, osPref) => {
  if (persisted === "light" || persisted === "dark") {
    return persisted;
  }
  if (osPref === "light" || osPref === "dark") {
    return osPref;
  }
  return DEFAULT_THEME;
};

/**
 * Read the persisted theme from client-side storage.
 *
 * Guards `localStorage` access in try/catch so it never throws — for example
 * in privacy mode, when storage is disabled, or during server rendering where
 * `localStorage` is unavailable. Returns null on any failure or when no valid
 * theme has been stored.
 *
 * @returns {"light" | "dark" | null} the persisted theme, or null when it
 *   cannot be read or is not a valid theme
 */
export const readPersistedTheme = () => {
  try {
    if (typeof localStorage === "undefined") {
      return null;
    }
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

/**
 * Write the selected theme to client-side storage.
 *
 * Guards `localStorage` access in try/catch so it never throws when storage is
 * unavailable or write-protected. Returns whether the write succeeded so
 * callers can fall back to the OS preference for the session.
 *
 * @param {"light" | "dark"} theme - the theme to persist
 * @returns {boolean} true when the theme was persisted, false otherwise
 */
export const writePersistedTheme = (theme) => {
  if (theme !== "light" && theme !== "dark") {
    return false;
  }
  try {
    if (typeof localStorage === "undefined") {
      return false;
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
};
