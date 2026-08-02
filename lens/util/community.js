/**
 * Pure community-feed ordering logic for the lens frontend (DOM-independent).
 *
 * Encodes the four community filters (Newest, Trending, Unanswered,
 * MostHelpful) as a pure reordering so the Community page (FilterBar and the
 * question list) can be unit- and property-tested without rendering.
 *
 * Every filter is a pure permutation: the input array is never mutated, and
 * the returned array contains exactly the same elements (same length, same
 * references) in a possibly different order. An unknown/undefined filter
 * defaults to Newest.
 *
 * @typedef {"Newest" | "Trending" | "Unanswered" | "MostHelpful"} CommunityFilter
 *
 * @typedef {Object} Author
 * @property {string} name
 * @property {string} avatarUrl
 *
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} title
 * @property {Author} author
 * @property {string[]} tags
 * @property {number} replyCount
 * @property {number} likeCount
 * @property {number} viewCount
 * @property {string} createdAt - ISO 8601 timestamp
 *
 * Requirements: 9.3, 9.4
 */

/** The default filter applied when none (or an unknown one) is supplied. */
export const DEFAULT_FILTER = "Newest";

/**
 * Coerce a possibly-missing numeric field to a finite number.
 *
 * Non-numeric or non-finite values are treated as 0 so ordering stays total
 * and never produces NaN comparisons.
 *
 * @param {unknown} value - the candidate value
 * @returns {number} the value when finite, otherwise 0
 */
const toNumber = (value) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

/**
 * Parse an ISO timestamp to milliseconds for descending "newest first" order.
 *
 * Invalid or missing timestamps sort last (treated as the oldest possible
 * time) so a malformed `createdAt` never wins the newest position.
 *
 * @param {unknown} value - the candidate ISO string
 * @returns {number} epoch milliseconds, or -Infinity when unparseable
 */
const toTime = (value) => {
  if (typeof value !== "string") {
    return Number.NEGATIVE_INFINITY;
  }
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? Number.NEGATIVE_INFINITY : ms;
};

/**
 * Compare two questions by recency, most recent first.
 *
 * @param {Question} a
 * @param {Question} b
 * @returns {number}
 */
const byNewest = (a, b) => toTime(b.createdAt) - toTime(a.createdAt);

/**
 * Compare two questions by engagement (likes + views), highest first.
 *
 * Ties fall back to newest so the ordering is deterministic.
 *
 * @param {Question} a
 * @param {Question} b
 * @returns {number}
 */
const byTrending = (a, b) => {
  const engagementA = toNumber(a.likeCount) + toNumber(a.viewCount);
  const engagementB = toNumber(b.likeCount) + toNumber(b.viewCount);
  if (engagementB !== engagementA) {
    return engagementB - engagementA;
  }
  return byNewest(a, b);
};

/**
 * Compare two questions for the Unanswered filter.
 *
 * Questions with no replies (`replyCount === 0`) come first; within each group
 * the newest question wins.
 *
 * @param {Question} a
 * @param {Question} b
 * @returns {number}
 */
const byUnanswered = (a, b) => {
  const aUnanswered = toNumber(a.replyCount) === 0 ? 0 : 1;
  const bUnanswered = toNumber(b.replyCount) === 0 ? 0 : 1;
  if (aUnanswered !== bUnanswered) {
    return aUnanswered - bUnanswered;
  }
  return byNewest(a, b);
};

/**
 * Compare two questions by helpfulness, most likes first.
 *
 * Ties break by reply count (more discussion first), then by newest.
 *
 * @param {Question} a
 * @param {Question} b
 * @returns {number}
 */
const byMostHelpful = (a, b) => {
  const likeDelta = toNumber(b.likeCount) - toNumber(a.likeCount);
  if (likeDelta !== 0) {
    return likeDelta;
  }
  const replyDelta = toNumber(b.replyCount) - toNumber(a.replyCount);
  if (replyDelta !== 0) {
    return replyDelta;
  }
  return byNewest(a, b);
};

/** Comparator lookup keyed by filter name. */
const COMPARATORS = Object.freeze({
  Newest: byNewest,
  Trending: byTrending,
  Unanswered: byUnanswered,
  MostHelpful: byMostHelpful,
});

/**
 * Reorder community questions according to the selected filter.
 *
 * This is a pure, non-mutating permutation: the input array is copied before
 * sorting, so the caller's array is left untouched, and the result contains
 * exactly the same elements in a (possibly) new order. An unknown, missing, or
 * `undefined` filter falls back to Newest. Non-array input yields an
 * empty array.
 *
 * @param {ReadonlyArray<Question>} questions - the questions to order
 * @param {CommunityFilter} [filter] - the active community filter
 * @returns {Question[]} a new array ordered per the filter
 */
export const applyFilter = (questions, filter) => {
  if (!Array.isArray(questions)) {
    return [];
  }
  const comparator = COMPARATORS[filter] ?? COMPARATORS[DEFAULT_FILTER];
  return [...questions].sort(comparator);
};
