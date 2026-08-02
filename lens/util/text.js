/**
 * Pure text-formatting logic for the lens frontend (DOM-independent).
 *
 * Encodes title truncation and relative-time formatting so the Community
 * question cards (and any other consumers) can be unit- and property-tested
 * without rendering.
 *
 * Requirements: 9.1, 11.1
 */

/** The ellipsis character appended to truncated text. */
const ELLIPSIS = "\u2026";

/**
 * Truncate text to at most `max` characters.
 *
 * When the text is longer than `max`, it is cut and an ellipsis is appended so
 * that the returned string never exceeds `max` characters (the ellipsis
 * counts toward the cap). Non-positive or non-numeric `max` yields an empty
 * string. Non-string input yields an empty string.
 *
 * @param {string} text - the text to truncate
 * @param {number} max - the maximum number of characters allowed
 * @returns {string} the truncated text, never longer than `max`
 */
export const truncate = (text, max) => {
  if (typeof text !== "string") {
    return "";
  }
  if (typeof max !== "number" || !Number.isFinite(max) || max <= 0) {
    return "";
  }

  const cap = Math.floor(max);
  if (text.length <= cap) {
    return text;
  }

  // Reserve one character for the ellipsis; if the cap is a single character
  // there is no room for content, so return just the ellipsis.
  if (cap === 1) {
    return ELLIPSIS;
  }
  return text.slice(0, cap - 1).trimEnd() + ELLIPSIS;
};

/** Time unit thresholds (in seconds) used for relative-time formatting. */
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Pluralize a unit label based on a count.
 *
 * @param {number} value - the count
 * @param {string} unit - the singular unit label (e.g. "hour")
 * @returns {string} a phrase like "1 hour ago" or "2 hours ago"
 */
const ago = (value, unit) => `${value} ${unit}${value === 1 ? "" : "s"} ago`;

/**
 * Express the time elapsed since `fromISO` as a relative duration string
 * (for example "2 hours ago").
 *
 * The elapsed time is measured from `fromISO` up to `now`. Times within the
 * last minute render as "just now". Future timestamps (where `fromISO` is
 * after `now`) also render as "just now". Invalid input renders as an empty
 * string.
 *
 * @param {string} fromISO - the ISO 8601 timestamp of the past event
 * @param {Date | number} [now] - the reference "current" time; defaults to the
 *   current time when omitted
 * @returns {string} a human-readable relative duration
 */
export const relativeTime = (fromISO, now = new Date()) => {
  if (typeof fromISO !== "string") {
    return "";
  }

  const fromMs = Date.parse(fromISO);
  if (Number.isNaN(fromMs)) {
    return "";
  }

  const nowMs = now instanceof Date ? now.getTime() : Number(now);
  if (!Number.isFinite(nowMs)) {
    return "";
  }

  const elapsedSeconds = Math.floor((nowMs - fromMs) / 1000);

  if (elapsedSeconds < MINUTE) {
    return "just now";
  }
  if (elapsedSeconds < HOUR) {
    return ago(Math.floor(elapsedSeconds / MINUTE), "minute");
  }
  if (elapsedSeconds < DAY) {
    return ago(Math.floor(elapsedSeconds / HOUR), "hour");
  }
  if (elapsedSeconds < WEEK) {
    return ago(Math.floor(elapsedSeconds / DAY), "day");
  }
  if (elapsedSeconds < MONTH) {
    return ago(Math.floor(elapsedSeconds / WEEK), "week");
  }
  if (elapsedSeconds < YEAR) {
    return ago(Math.floor(elapsedSeconds / MONTH), "month");
  }
  return ago(Math.floor(elapsedSeconds / YEAR), "year");
};
