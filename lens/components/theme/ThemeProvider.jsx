"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { THEME_STORAGE_KEY } from "@/util/theme";

/**
 * Client-boundary theme provider for the lens frontend.
 *
 * Wraps `next-themes` to toggle the `.dark` class on the `<html>` element so
 * every rendered page and component receives the active theme's tokens
 * . The provider supports the two selectable themes ,
 * persists the selection under the `"theme"` storage key so it reapplies on
 * later visits , and defaults to the OS color-scheme preference on
 * first load via `defaultTheme="system"` + `enableSystem` .
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
const ThemeProvider = ({ children }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    storageKey={THEME_STORAGE_KEY}
  >
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
