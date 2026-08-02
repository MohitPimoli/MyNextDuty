/**
 * Pure field-formatting logic for the lens frontend (DOM-independent).
 *
 * Encodes rating formatting, integer clamping, image placeholder fallback, and
 * list capping so mentor cards, profile statistics, and other consumers can be
 * unit- and property-tested without rendering.
 *
 * Requirements: 9.2, 10.2, 11.1, 11.6, 12.3, 12.6
 */

/**
 * Format a rating to one decimal place, clamped to the 0.0–5.0 scale (Req 10.2).
 *
 * Values below 0 clamp to 0.0 and values above 5 clamp to 5.0. Non-numeric or
 * non-finite input formats as "0.0".
 *
 * @param {number} n - the raw rating value
 * @returns {string} the rating shown to one decimal place (e.g. "4.5")
 */
export const formatRating = (n) => {
    const value = typeof n === "number" && Number.isFinite(n) ? n : 0;
    const clamped = Math.min(5, Math.max(0, value));
    return clamped.toFixed(1);
};

/**
 * Clamp a value to an integer within the inclusive range [min, max] (Req 12.3).
 *
 * The input is truncated toward zero to an integer, then constrained to the
 * range. Non-numeric or non-finite input resolves to `min`. When `min` is
 * greater than `max`, `min` takes precedence.
 *
 * @param {number} n - the raw value
 * @param {number} min - the inclusive lower bound
 * @param {number} max - the inclusive upper bound
 * @returns {number} the clamped integer
 */
export const clampInt = (n, min, max) => {
    const lower = Math.trunc(min);
    const upper = Math.trunc(max);
    const value =
        typeof n === "number" && Number.isFinite(n) ? Math.trunc(n) : lower;
    return Math.min(upper, Math.max(lower, value));
};

/**
 * Resolve an image URL, falling back to a placeholder when absent (Req 9.2, 12.6).
 *
 * The URL is considered usable when it is a non-empty, non-whitespace string.
 * Otherwise the provided placeholder is returned so missing avatars/photos
 * still render an image.
 *
 * @param {string | null | undefined} url - the candidate image URL
 * @param {string} placeholder - the fallback image URL
 * @returns {string} the usable URL, or the placeholder when the URL is absent
 */
export const resolveImage = (url, placeholder) => {
    if (typeof url === "string" && url.trim().length > 0) {
        return url;
    }
    return placeholder;
};

/**
 * Return at most `max` items from a list (Req 11.1, 11.6, 10.2).
 *
 * Caps skill lists, tag lists, related-mentor lists, and similar collections.
 * Non-array input yields an empty array. Non-positive or non-numeric `max`
 * yields an empty array.
 *
 * @template T
 * @param {ReadonlyArray<T>} items - the source list
 * @param {number} max - the maximum number of items to keep
 * @returns {T[]} at most `max` items, preserving order
 */
export const capList = (items, max) => {
    if (!Array.isArray(items)) {
        return [];
    }
    if (typeof max !== "number" || !Number.isFinite(max) || max <= 0) {
        return [];
    }
    return items.slice(0, Math.floor(max));
};
