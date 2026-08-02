/**
 * Pure component-variant configuration for the lens frontend (DOM-independent).
 *
 * Encodes the button and badge variant style maps as `class-variance-authority`
 * (cva) compatible config so the shadcn/ui primitives (Button, Badge in
 * `components/ui`) can consume a single source of truth, and so variant
 * distinctness can be unit- and property-tested without rendering.
 *
 * Every variant references the named design-token utilities declared in the
 * `@theme` block of `index.css` (`bg-primary`, `bg-card`, `border`,
 * `text-text-secondary`, `rounded-button`, `shadow-*`, ...) rather than raw
 * hex/px values, so the variants stay theme-aware in both light and dark mode.
 *
 * The raw variant maps (`BUTTON_VARIANTS`, `BADGE_VARIANTS`) are exported
 * alongside the cva instances so tests can assert that every variant is defined
 * and that all variants within a set are pairwise-distinct (Req 3.1, 3.7).
 *
 * Requirements: 3.1, 3.7
 */

import { cva } from "class-variance-authority";

/**
 * Button variant class map (Req 3.1).
 *
 * Four visually distinct, token-based styles:
 *   - primary:   solid brand fill with inverse text (most prominent)
 *   - secondary: neutral card surface with a border
 *   - outline:   transparent fill with a brand-colored border and text
 *   - ghost:     no border/fill until hovered (lowest emphasis)
 *
 * @type {Readonly<Record<"primary" | "secondary" | "outline" | "ghost", string>>}
 */
export const BUTTON_VARIANTS = Object.freeze({
    primary:
        "bg-primary text-text-inverse rounded-button shadow-medium hover:bg-primary-hover",
    secondary:
        "bg-card text-text-primary border border-border rounded-button shadow-low hover:bg-background",
    outline:
        "bg-transparent text-primary border border-primary rounded-button hover:bg-primary/10",
    ghost:
        "bg-transparent text-text-primary rounded-button hover:bg-background",
});

/**
 * Badge variant class map (Req 3.7).
 *
 * Four visually distinct, token-based label styles:
 *   - skill:    neutral card chip with a border
 *   - verified: success/green semantic tint
 *   - new:      brand/primary tint
 *   - popular:  warning/amber semantic tint
 *
 * @type {Readonly<Record<"skill" | "verified" | "new" | "popular", string>>}
 */
export const BADGE_VARIANTS = Object.freeze({
    skill: "bg-card text-text-secondary border border-border",
    verified: "bg-success/15 text-success border border-success",
    new: "bg-primary/15 text-primary border border-primary",
    popular: "bg-warning/15 text-warning border border-warning",
});

/** Shared, variant-independent button base classes. */
const BUTTON_BASE =
    "inline-flex items-center justify-center gap-2 font-medium " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50";

/** Shared, variant-independent badge base classes. */
const BADGE_BASE =
    "inline-flex items-center gap-1 rounded-button px-2 py-1 " +
    "text-xs font-medium";

/**
 * cva instance for the Button primitive (Req 3.1).
 *
 * The default variant is `primary`. Consumed by `components/ui/Button`.
 */
export const buttonVariants = cva(BUTTON_BASE, {
    variants: {
        variant: { ...BUTTON_VARIANTS },
    },
    defaultVariants: {
        variant: "primary",
    },
});

/**
 * cva instance for the Badge primitive (Req 3.7).
 *
 * The default variant is `skill`. Consumed by `components/ui/Badge`.
 */
export const badgeVariants = cva(BADGE_BASE, {
    variants: {
        variant: { ...BADGE_VARIANTS },
    },
    defaultVariants: {
        variant: "skill",
    },
});
