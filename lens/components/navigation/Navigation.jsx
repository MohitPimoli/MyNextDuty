"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { resolveNavLinks } from "@/util/navigation";
import { ROUTE_PATHS } from "@/config/RoutePath";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

/**
 * Global navigation bar.
 *
 * - Sticky top, rendered above all content (4.2)
 * - Desktop: horizontal links + theme toggle + profile avatar popover
 * - Mobile (≤768px): hamburger opens a Sheet drawer (4.3, 4.6)
 * - Drawer closes on link select, toggle, or outside click (4.7)
 * - Shows Login when unauthenticated (4.5), Profile avatar menu when authenticated (4.8)
 * - Theme toggle invokes the ThemeProvider toggle (4.4)
 */
const Navigation = () => {
  const { isAuthenticated, logout, firstName } = useAuth();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Hide navigation on auth pages (login, register) — industry standard
  const authRoutes = [ROUTE_PATHS.LOGIN, "/register"];
  if (authRoutes.includes(pathname)) return null;

  const links = resolveNavLinks(isAuthenticated);
  // Remove profile link from nav links (rendered as avatar popover instead)
  const navLinks = isAuthenticated ? links.filter((l) => l.href !== ROUTE_PATHS.PROFILE) : links;

  const closeDrawer = () => setDrawerOpen(false);
  const isActive = (href) => pathname === href;
  const initial = firstName ? firstName[0]?.toUpperCase() : "?";

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close profile menu on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md shadow-low"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href={ROUTE_PATHS.LANDING}
          className="flex items-center gap-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="MyNextDuty home"
        >
          <span className="text-lg font-bold tracking-tight">MyNextDuty</span>
        </Link>

        {/* Desktop links (hidden at ≤768px) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive(link.href)
                  ? "text-text-primary bg-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-accent/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />

          {/* Profile avatar with click popover menu */}
          {isAuthenticated && (
            <div className="relative ml-2" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                {initial}
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-card py-1 shadow-medium animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <Link
                    href={ROUTE_PATHS.PROFILE}
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block w-full px-4 py-2 text-left text-sm text-text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    View Profile
                  </Link>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile controls (shown at ≤768px) */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />

          {/* Mobile profile avatar with same popover */}
          {isAuthenticated && (
            <div className="relative" ref={!profileMenuRef.current ? undefined : undefined}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                {initial}
              </button>
            </div>
          )}

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger
              className="inline-flex h-9 w-9 items-center justify-center rounded-button text-text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" aria-label="Navigation menu">
              <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeDrawer}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive(link.href)
                        ? "text-text-primary bg-accent"
                        : "text-text-secondary hover:text-text-primary hover:bg-accent/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Profile & Logout in mobile drawer */}
                {isAuthenticated && (
                  <>
                    <Link
                      href={ROUTE_PATHS.PROFILE}
                      onClick={closeDrawer}
                      className={`px-3 py-2 rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive(ROUTE_PATHS.PROFILE)
                          ? "text-text-primary bg-accent"
                          : "text-text-secondary hover:text-text-primary hover:bg-accent/50"
                      }`}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        closeDrawer();
                        logout();
                      }}
                      className="px-3 py-2 rounded-md text-base font-medium text-left text-text-secondary transition-colors hover:text-text-primary hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
