"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_TIMEOUT_MS,
  isEmpty,
  MIN_SKELETON_DURATION_MS,
  SKELETON_SHOW_DELAY_MS,
  STATUS,
} from "@/util/asyncState";

/**
 * Serialize fetch params to a stable key for change detection.
 *
 * Used only to decide when to re-run the fetch as `params` changes across
 * renders; the original params object is preserved separately for retry so the
 * retry reuses the exact original request parameters (Req 15.2).
 *
 * @param {*} value - the params value
 * @returns {string} a stable string key
 */
const stableKey = (value) => {
  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    return String(value);
  }
};

/**
 * Normalize a thrown/rejected value into an `Error` instance.
 *
 * @param {*} reason - the rejection reason
 * @returns {Error} an Error carrying the reason's message
 */
const toError = (reason) => (reason instanceof Error ? reason : new Error(String(reason)));

/**
 * Drive a data fetch through the four-way async state machine with a
 * flicker-free loading experience and per-context timeouts.
 *
 * Timing enforced:
 *   - The loading skeleton is delayed by {@link SKELETON_SHOW_DELAY_MS} (100ms):
 *     a fetch that settles sooner never shows a skeleton, avoiding a flash.
 *   - Once shown, the skeleton stays visible for at least
 *     {@link MIN_SKELETON_DURATION_MS} (300ms), avoiding a flicker when data
 *     arrives just after the skeleton appears.
 *   - If the fetch neither resolves nor rejects within `timeoutMs`, the state
 *     transitions to "error" (default 15s; callers pass 10s or 5s per context).
 *
 * Result mapping:
 *   - resolve with data → "loaded"; resolve with zero items → "empty"
 *   - reject or timeout → "error" with no partial/stale data
 *
 * Retry: the returned `retry` re-invokes the fetcher with the
 * exact params captured when the fetch was initiated, and a failing retry
 * re-produces the error state.
 *
 * The returned object is an `AsyncState` consumed by `selectVariant` and the
 * `StateRenderer`.
 *
 * @template T
 * @param {(params: *) => Promise<T>} fetcher - the async data fetcher
 * @param {*} params - the request parameters passed to the fetcher
 * @param {{ timeoutMs?: number }} [options] - per-context fetch deadline
 * @returns {{
 *   status: "loading" | "loaded" | "empty" | "error",
 *   data: T | null,
 *   error: Error | null,
 *   showSkeleton: boolean,
 *   retry: () => void,
 * }}
 */
export const useAsyncData = (fetcher, params, options = {}) => {
  const { timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const [state, setState] = useState({
    status: STATUS.LOADING,
    data: null,
    error: null,
    showSkeleton: false,
  });

  // Latest fetcher/timeout without forcing a re-fetch when their identity
  // changes; the fetch lifecycle is keyed on the params content instead.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const timeoutRef = useRef(timeoutMs);
  timeoutRef.current = timeoutMs;

  // Params captured at fetch start, reused verbatim by retry.
  const activeParamsRef = useRef(params);

  // Run bookkeeping: `runId` invalidates in-flight fetches/timers so a stale
  // resolution can never overwrite a newer run.
  const runIdRef = useRef(0);
  const mountedRef = useRef(true);
  const showDelayTimerRef = useRef(null);
  const minDisplayTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const skeletonShownAtRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (showDelayTimerRef.current) {
      clearTimeout(showDelayTimerRef.current);
      showDelayTimerRef.current = null;
    }
    if (minDisplayTimerRef.current) {
      clearTimeout(minDisplayTimerRef.current);
      minDisplayTimerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
  }, []);

  const run = useCallback(
    (requestParams) => {
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;
      activeParamsRef.current = requestParams;

      clearTimers();
      skeletonShownAtRef.current = null;

      const isCurrent = () => runId === runIdRef.current && mountedRef.current;

      // Begin loading with the skeleton hidden; it appears only after the
      // show delay so fast fetches never flash a skeleton .
      setState({
        status: STATUS.LOADING,
        data: null,
        error: null,
        showSkeleton: false,
      });

      showDelayTimerRef.current = setTimeout(() => {
        if (!isCurrent()) {
          return;
        }
        skeletonShownAtRef.current = Date.now();
        setState((prev) => ({ ...prev, status: STATUS.LOADING, showSkeleton: true }));
      }, SKELETON_SHOW_DELAY_MS);

      // Commit a terminal state, honoring the minimum skeleton display time
      // once the skeleton has actually been shown.
      const settle = (next) => {
        if (!isCurrent()) {
          return;
        }
        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
          timeoutTimerRef.current = null;
        }

        const commit = () => {
          if (!isCurrent()) {
            return;
          }
          setState(next);
        };

        if (skeletonShownAtRef.current === null) {
          // Skeleton never became visible: settle now and cancel the
          // pending show so no skeleton flashes.
          if (showDelayTimerRef.current) {
            clearTimeout(showDelayTimerRef.current);
            showDelayTimerRef.current = null;
          }
          commit();
          return;
        }

        const elapsed = Date.now() - skeletonShownAtRef.current;
        const remaining = MIN_SKELETON_DURATION_MS - elapsed;
        if (remaining <= 0) {
          commit();
        } else {
          minDisplayTimerRef.current = setTimeout(commit, remaining);
        }
      };

      // Per-context deadline: transition to error on timeout
      timeoutTimerRef.current = setTimeout(() => {
        settle({
          status: STATUS.ERROR,
          data: null,
          error: new Error("The request timed out."),
          showSkeleton: false,
        });
      }, timeoutRef.current);

      // Invoke the fetcher; wrap in Promise.resolve so synchronous throws
      // surface as rejections rather than escaping the hook.
      Promise.resolve()
        .then(() => fetcherRef.current(requestParams))
        .then((data) => {
          settle({
            status: isEmpty(data) ? STATUS.EMPTY : STATUS.LOADED,
            data,
            error: null,
            showSkeleton: false,
          });
        })
        .catch((reason) => {
          settle({
            status: STATUS.ERROR,
            data: null,
            error: toError(reason),
            showSkeleton: false,
          });
        });
    },
    [clearTimers]
  );

  // Re-fetch when the params content changes (not merely their identity).
  const paramsKey = useMemo(() => stableKey(params), [params]);

  useEffect(() => {
    mountedRef.current = true;
    run(params);
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
    // `params` is intentionally excluded; `paramsKey` tracks its content and
    // `run`/`clearTimers` are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, run, clearTimers]);

  // Retry reuses the exact params captured at the last fetch start.
  const retry = useCallback(() => {
    run(activeParamsRef.current);
  }, [run]);

  return {
    status: state.status,
    data: state.data,
    error: state.error,
    showSkeleton: state.showSkeleton,
    retry,
  };
};
