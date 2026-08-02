/**
 * Pure mentor logic for the lens frontend (DOM-independent).
 *
 * Encodes the availability-calendar generation, reviews pagination, and the
 * related-mentors cap so the Mentor Profile page (availability calendar,
 * reviews list, and related-mentors region) can be unit- and property-tested
 * without rendering.
 *
 * @typedef {Object} SessionSlot
 * @property {string} date - an ISO date/timestamp for the slot
 * @property {boolean} available - whether the mentor is available that day
 *
 * @typedef {Object} CalendarDay
 * @property {string} date - the day's date key (YYYY-MM-DD, UTC)
 * @property {boolean} available - true when a matching available slot exists
 * @property {boolean} unavailable - always the logical negation of `available`
 *
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} reviewerName
 * @property {1 | 2 | 3 | 4 | 5} rating
 * @property {string} text - the review body (≤500 chars)
 *
 * Requirements: 11.2, 11.3, 11.6
 */

/** The number of days the availability calendar covers (Req 11.2). */
export const CALENDAR_DAYS = 30;

/** The maximum number of reviews shown on a single page (Req 11.3). */
export const REVIEWS_PER_PAGE = 10;

/** The maximum number of related mentors shown (Req 11.6). */
export const MAX_RELATED_MENTORS = 6;

/** Milliseconds in a single day, used to advance the calendar day-by-day. */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Coerce a Date or date-like string to a `Date`, or `null` when unparseable.
 *
 * Accepts an existing `Date` instance or any string parseable by `Date.parse`
 * (ISO dates and timestamps). Invalid input yields `null` so callers can decide
 * on a fallback rather than propagating an `Invalid Date`.
 *
 * @param {Date | string | number} value - the candidate date
 * @returns {Date | null} a valid `Date`, or `null` when it cannot be parsed
 */
const toDate = (value) => {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === "string" || typeof value === "number") {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
};

/**
 * Reduce a `Date` to its UTC calendar-day key (YYYY-MM-DD).
 *
 * Using UTC keeps day matching stable regardless of the runtime timezone, so a
 * slot and a calendar day that fall on the same calendar date always match.
 *
 * @param {Date} date - the date to reduce
 * @returns {string} the day key in `YYYY-MM-DD` form
 */
const toDayKey = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Generate one calendar entry for each of the next 30 days from `from` (Req 11.2).
 *
 * Starting from the calendar day of `from` (inclusive), this produces exactly
 * {@link CALENDAR_DAYS} entries, one per consecutive day. A day is `available`
 * when the slot data contains at least one available slot on that calendar day;
 * otherwise it is `unavailable`. Every entry carries both `available` and
 * `unavailable` flags that are strict logical negations of one another, so each
 * day is marked as exactly one of the two (available xor unavailable).
 *
 * The `from` argument may be a `Date` or a date-like string; an unparseable
 * `from` falls back to the current date so the calendar still renders 30 days.
 * Non-array or malformed `slots` simply produce an all-unavailable calendar.
 *
 * @param {ReadonlyArray<SessionSlot>} slots - the mentor's session slots
 * @param {Date | string} from - the first day the calendar should cover
 * @returns {CalendarDay[]} exactly 30 calendar-day entries in ascending order
 */
export const generateCalendarDays = (slots, from) => {
    const start = toDate(from) ?? new Date();

    const availableDays = new Set();
    if (Array.isArray(slots)) {
        for (const slot of slots) {
            if (!slot || slot.available !== true) {
                continue;
            }
            const slotDate = toDate(slot.date);
            if (slotDate) {
                availableDays.add(toDayKey(slotDate));
            }
        }
    }

    const days = [];
    for (let offset = 0; offset < CALENDAR_DAYS; offset += 1) {
        const dayDate = new Date(start.getTime() + offset * MS_PER_DAY);
        const key = toDayKey(dayDate);
        const available = availableDays.has(key);
        days.push({
            date: key,
            available,
            unavailable: !available,
        });
    }
    return days;
};

/**
 * Return the reviews for a single page, at most 10 per page (Req 11.3).
 *
 * Pages are 1-indexed: page 1 returns the first {@link REVIEWS_PER_PAGE}
 * reviews, page 2 the next batch, and so on. A missing, non-numeric, or
 * out-of-range `page` is normalized to 1, and fractional pages are floored.
 * Requesting a page beyond the available reviews yields an empty array.
 * Non-array input yields an empty array.
 *
 * @param {ReadonlyArray<Review>} reviews - the full review list
 * @param {number} [page] - the 1-indexed page number
 * @returns {Review[]} at most 10 reviews for the requested page
 */
export const paginateReviews = (reviews, page) => {
    if (!Array.isArray(reviews)) {
        return [];
    }
    const requested =
        typeof page === "number" && Number.isFinite(page)
            ? Math.floor(page)
            : 1;
    const safePage = requested >= 1 ? requested : 1;
    const start = (safePage - 1) * REVIEWS_PER_PAGE;
    return reviews.slice(start, start + REVIEWS_PER_PAGE);
};

/**
 * Return at most six related mentors, preserving order (Req 11.6).
 *
 * The related-mentors region shows between 0 and 6 mentors, so any longer list
 * is capped at {@link MAX_RELATED_MENTORS}. Non-array input yields an empty
 * array.
 *
 * @template T
 * @param {ReadonlyArray<T>} list - the candidate related mentors
 * @returns {T[]} at most six related mentors
 */
export const capRelated = (list) => {
    if (!Array.isArray(list)) {
        return [];
    }
    return list.slice(0, MAX_RELATED_MENTORS);
};
