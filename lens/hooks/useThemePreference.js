"use client";

import { useCallback, useEffect, useState } from "react";

import {
    DEFAULT_THEME,
    readPersistedTheme,
    resolveInitialTheme,
    toggleTheme,
    writePersistedTheme,
} from "@/util/theme";

/**
 * Read the OS color-scheme preference, guarding `matchMedia` access.
 *
 * Returns "dark"/"light" when detectable, or `null` during server rendering or
 * when `matchMedia` is unavailable or throws (Req 2.4, 2.5).
 *
 * @returns {"light" | "dark" | null}
 */
const readOsPreference = () => {
    try {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return null;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    } catch {
        return null;
    }
};

/**
 * Thin theme-preference hook that never throws.
 *
 * Resolves the initial theme from the persisted value when available, otherwise
 * from the OS preference, defaulting to light (Req 2.5). All `localStorage`
 * access is guarded via the `util/theme` helpers; when persistence fails (e.g.
 * privacy mode) the hook falls back to the OS preference for the session and
 * continues without error (Req 2.4). The selection is persisted so it reapplies
 * on later visits (Req 2.3), and only the two selectable themes are ever
 * produced (Req 2.1).
 *
 * @returns {{
 *   theme: "light" | "dark",
 *   setTheme: (theme: "light" | "dark") => void,
 *   toggle: () => void,
 * }}
 */
export const useThemePreference = () => {
    const [theme, setThemeState] = useState(DEFAULT_THEME);

    // Resolve the real preference after mount, where browser APIs are available.
    useEffect(() => {
        setThemeState(resolveInitialTheme(readPersistedTheme(), readOsPreference()));
    }, []);

    const setTheme = useCallback((next) => {
        setThemeState((current) => {
            const resolved = next === "light" || next === "dark" ? next : current;
            writePersistedTheme(resolved);
            return resolved;
        });
    }, []);

    const toggle = useCallback(() => {
        setThemeState((current) => {
            const next = toggleTheme(current);
            writePersistedTheme(next);
            return next;
        });
    }, []);

    return { theme, setTheme, toggle };
};
