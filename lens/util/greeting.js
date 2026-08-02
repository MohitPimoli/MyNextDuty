/**
 * Pure greeting logic for the lens frontend (DOM-independent).
 *
 * Encodes the time-of-day greeting buckets and the name fallback so the
 * Dashboard greeting can be unit- and property-tested without rendering.
 * React components consume `resolveGreeting`; this module is the testable
 * source of truth for the greeting term and name.
 *
 * Greeting term rules based on the local device hour (Req 7.1):
 *   - "Good morning"   from 05:00 to 11:59
 *   - "Good afternoon" from 12:00 to 16:59
 *   - "Good evening"   from 17:00 to 04:59 (wraps past midnight)
 *
 * Name fallback (Req 7.2): when the name is unavailable, "there" is used.
 *
 * Requirements: 7.1, 7.2
 */

/** The fallback name used when no usable name is provided (Req 7.2). */
export const NAME_FALLBACK = "there";

/**
 * The three greeting terms (Req 7.1).
 * @type {ReadonlyArray<"Good morning" | "Good afternoon" | "Good evening">}
 */
export const GREETING_TERMS = ["Good morning", "Good afternoon", "Good evening"];

/**
 * Resolve the greeting term for a local hour (Req 7.1).
 *
 * @param {number} hour - the local hour of day (0–23)
 * @returns {"Good morning" | "Good afternoon" | "Good evening"} the term
 */
const resolveTerm = (hour) => {
    if (hour >= 5 && hour <= 11) {
        return "Good morning";
    }
    if (hour >= 12 && hour <= 16) {
        return "Good afternoon";
    }
    // 17:00–23:59 and 00:00–04:59
    return "Good evening";
};

/**
 * Resolve the display name, applying the "there" fallback (Req 7.2).
 *
 * A name is considered unavailable when it is null, undefined, or a string
 * that is empty or only whitespace. Available names are trimmed of surrounding
 * whitespace.
 *
 * @param {string | null | undefined} name - the user's name, if any
 * @returns {string} the usable name, or "there" when unavailable
 */
const resolveName = (name) => {
    if (typeof name !== "string") {
        return NAME_FALLBACK;
    }
    const trimmed = name.trim();
    return trimmed.length > 0 ? trimmed : NAME_FALLBACK;
};

/**
 * Resolve the greeting for a given date and name.
 *
 * The greeting term is chosen from the local hour of `date`, and the name
 * falls back to "there" when unavailable (Req 7.1, 7.2).
 *
 * @param {Date} date - the reference date/time (local time is used)
 * @param {string | null | undefined} name - the user's name, if any
 * @returns {{ term: "Good morning" | "Good afternoon" | "Good evening", name: string }}
 *   the greeting term and resolved name
 */
export const resolveGreeting = (date, name) => ({
    term: resolveTerm(date.getHours()),
    name: resolveName(name),
});
