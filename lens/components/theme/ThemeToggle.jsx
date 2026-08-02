"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { toggleTheme } from "@/util/theme";

/**
 * Navigation-bar control that switches between the light and dark themes.
 *
 * Reads the active theme from `next-themes` via `useTheme()` and, on click,
 * flips it using the pure `toggleTheme` involution. Because the provider
 * defaults to `"system"`, `resolvedTheme` is used as the current value so the
 * toggle always maps to a concrete "light"/"dark" choice (Req 2.2). Activating
 * the control invokes `setTheme`, which the ThemeProvider applies to the
 * `<html>` element without a full page reload (Req 4.4).
 *
 * The theme is only known on the client, so a `mounted` guard renders a stable
 * placeholder on the server and first client render to avoid a hydration
 * mismatch.
 *
 * @returns {JSX.Element}
 */
const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const buttonClasses =
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    // Render a non-interactive placeholder until mounted so the server-rendered
    // markup matches the initial client render (no theme-dependent icon yet).
    if (!mounted) {
        return (
            <button
                type="button"
                className={buttonClasses}
                aria-label="Toggle theme"
                disabled
            >
                <span className="h-5 w-5" aria-hidden="true" />
            </button>
        );
    }

    const isDark = resolvedTheme === "dark";
    const nextTheme = toggleTheme(resolvedTheme);
    const label = isDark ? "Switch to light theme" : "Switch to dark theme";

    return (
        <button
            type="button"
            className={buttonClasses}
            aria-label={label}
            onClick={() => setTheme(nextTheme)}
        >
            {isDark ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
            )}
        </button>
    );
};

export default ThemeToggle;
