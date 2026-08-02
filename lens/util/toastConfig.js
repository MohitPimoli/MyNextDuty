/**
 * Pure configuration helpers for the toast facade (Requirement 15.5).
 *
 * Keeping this logic in a dependency-free module makes the auto-dismiss
 * bounds testable without rendering react-toastify.
 */

/** Minimum allowed auto-close duration in milliseconds. */
export const MIN_AUTO_CLOSE_MS = 3000;

/** Maximum allowed auto-close duration in milliseconds. */
export const MAX_AUTO_CLOSE_MS = 10000;

/** Default auto-close duration in milliseconds. */
export const DEFAULT_AUTO_CLOSE_MS = 5000;

/**
 * Clamp a requested auto-close duration to the inclusive range
 * [3000, 10000] milliseconds.
 *
 * Returns the default of 5000ms when the input is undefined, null, or not a
 * finite number. In-range finite values pass through unchanged.
 *
 * @param {number} [ms] Requested auto-close duration in milliseconds.
 * @returns {number} A duration within [3000, 10000].
 */
export const clampAutoClose = (ms) => {
    if (typeof ms !== "number" || !Number.isFinite(ms)) {
        return DEFAULT_AUTO_CLOSE_MS;
    }
    if (ms < MIN_AUTO_CLOSE_MS) {
        return MIN_AUTO_CLOSE_MS;
    }
    if (ms > MAX_AUTO_CLOSE_MS) {
        return MAX_AUTO_CLOSE_MS;
    }
    return ms;
};
