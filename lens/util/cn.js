import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind
 * utilities. Combines `clsx` (conditional/array/object class handling) with
 * `tailwind-merge` (last-wins resolution of conflicting Tailwind classes).
 *
 * Exported for shadcn/ui primitives and feature components.
 *
 * @param {...import("clsx").ClassValue} inputs - class values (strings,
 *   arrays, objects, or falsy values that are ignored)
 * @returns {string} the merged, conflict-resolved class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
