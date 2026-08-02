"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { resolveNavLinks } from "@/util/navigation";
import { ROUTE_PATHS } from "@/config/RoutePath";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
} from "@/components/ui/Sheet";

/**
 * Global navigation bar (Requirements 4.1–4.8).
 *
 * - Sticky top, rendered above all content (4.2)
 * - Desktop: horizontal links + theme toggle
 * - Mobile (≤768px): hamburger opens a Sheet drawer (4.3, 4.6)
 * - Drawer closes on link select, toggle, or outside click (4.7)
 * - Shows Login when unauthenticated (4.5), Profile when authenticated (4.8)
 * - Theme toggle invokes the ThemeProvider toggle (4.4)
 */
const Navigation = () => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const links = resolveNavLinks(isAuthenticated);

    const closeDrawer = () => setDrawerOpen(false);

    const isActive = (href) => pathname === href;

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
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(link.href)
                                ? "text-text-primary bg-accent"
                                : "text-text-secondary hover:text-text-primary hover:bg-accent/50"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                </div>

                {/* Mobile controls (shown at ≤768px) */}
                <div className="flex md:hidden items-center gap-1">
                    <ThemeToggle />
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
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeDrawer}
                                        className={`px-3 py-2 rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(link.href)
                                            ? "text-text-primary bg-accent"
                                            : "text-text-secondary hover:text-text-primary hover:bg-accent/50"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
