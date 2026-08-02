/**
 * Pure async-state logic for the lens frontend (DOM-independent).
 *
 * Encodes the four-way async UI state (loading / loaded / empty / error), the
 * emptiness rule that distinguishes a successful-but-empty fetch from a
 * successful-with-data fetch, and the timing/timeout constants that govern the
 * loading experience. Keeping this logic dependency-free lets the async state
 * machine be unit- and property-tested without rendering React or touching the
 * DOM.
 *
 * The `useAsyncData` hook (`hooks/useAsyncData.js`) and the `StateRenderer`
 * component consume these helpers so the rendered variant is always a pure
 * function of the state produced by the machine.
 *
 * @typedef {"loading" | "loaded" | "empty" | "error"} AsyncStatus
 *
 * @typedef {Object} AsyncState
 * @property {AsyncStatus} status - the current async status
 * @property {*} data - the resolved data (null while loading, on empty, or on error)
 * @property {Error | null} error - the failure reason when status is "error"
 * @property {boolean} [showSkeleton] - whether the loading skeleton should render
 *
 * Requirements: 11.7, 13.1, 13.3, 13.4, 14.2, 14.3, 15.1, 15.2, 15.3
 */

/**
 * The four mutually-exclusive async statuses.
 *
 * @type {Readonly<Record<"LOADING" | "LOADED" | "EMPTY" | "ERROR", AsyncStatus>>}
 */
export const STATUS = Object.freeze({
  LOADING: "loading",
  LOADED: "loaded",
  EMPTY: "empty",
  ERROR: "error",
});

/**
 * Delay before the loading skeleton becomes visible, in milliseconds.
 *
 * A fetch that settles faster than this never shows a skeleton, preventing a
 * flash of skeleton for near-instant responses.
 */
export const SKELETON_SHOW_DELAY_MS = 100;

/**
 * Minimum time the skeleton stays visible once shown, in milliseconds.
 *
 * Once the skeleton appears it remains for at least this long, preventing a
 * flicker when the fetch completes shortly after the skeleton appears.
 */
export const MIN_SKELETON_DURATION_MS = 300;

/**
 * Per-context fetch deadlines in milliseconds.
 *
 *   - `default` (15s): the generic loading→error fallback.
 *   - `error`   (10s): the Error_State contract deadline.
 *   - `mentorProfile` (5s): the Mentor Profile page deadline.
 *
 * On timeout the async state transitions to "error".
 *
 * @type {Readonly<Record<"default" | "error" | "mentorProfile", number>>}
 */
export const TIMEOUTS = Object.freeze({
  default: 15000,
  error: 10000,
  mentorProfile: 5000,
});

/** The default fetch deadline when a caller supplies no `timeoutMs`. */
export const DEFAULT_TIMEOUT_MS = TIMEOUTS.default;

/**
 * Report whether a resolved fetch result should be treated as "empty".
 *
 * A successful fetch that yields zero items renders the Empty_State rather than
 * the loaded content. Emptiness is defined defensively so the machine stays
 * total for any resolved value:
 *   - `null` / `undefined` → empty
 *   - array → empty when it has no elements
 *   - `Map` / `Set` → empty when `size` is 0
 *   - plain object → empty when it has no own enumerable keys
 *   - string → empty when blank/whitespace-only
 *   - any other primitive (number, boolean) → not empty (a present value)
 *
 * @param {*} data - the resolved fetch result
 * @returns {boolean} true when the result represents zero items
 */
export const isEmpty = (data) => {
  if (data === null || data === undefined) {
    return true;
  }
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  if (data instanceof Map || data instanceof Set) {
    return data.size === 0;
  }
  if (typeof data === "string") {
    return data.trim().length === 0;
  }
  if (typeof data === "object") {
    return Object.keys(data).length === 0;
  }
  return false;
};

/**
 * Select the single UI variant to render for an async state.
 *
 * Returns exactly one of "loading" | "loaded" | "empty" | "error", guaranteeing
 * the variants are mutually exclusive: while loading, neither the empty nor the
 * error variant is selected, and the error variant never coexists with loaded
 * data. The choice is driven by the state's `status`, which the async state
 * machine sets. Any missing or unrecognized status falls back to "loading" (the
 * safe initial state) so the selector is total for any input.
 *
 * @param {AsyncState} state - the async state produced by the machine
 * @returns {AsyncStatus} the single variant to render
 */
export const selectVariant = (state) => {
  const status = state && typeof state === "object" ? state.status : undefined;
  switch (status) {
    case STATUS.ERROR:
      return STATUS.ERROR;
    case STATUS.EMPTY:
      return STATUS.EMPTY;
    case STATUS.LOADED:
      return STATUS.LOADED;
    case STATUS.LOADING:
      return STATUS.LOADING;
    default:
      return STATUS.LOADING;
  }
};
