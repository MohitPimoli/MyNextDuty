import { STATUS, selectVariant } from "@/util/asyncState";

import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

/**
 * StateRenderer — renders exactly one async UI variant for a data region.
 *
 * Consumes the `AsyncState` produced by `useAsyncData` (`status`, `data`,
 * `error`, `showSkeleton`, `retry`) and, using the pure `selectVariant`
 * helper, renders exactly one of Loading / Empty / Error / Loaded. The
 * variants are mutually exclusive: it never renders more than one, the empty
 * and error variants never appear while loading, and the error variant never
 * coexists with loaded or partial data (Req 14.2, 14.3, 15.1).
 *
 * Loaded content is provided as a render prop (`children` as a function of
 * `data`) or as plain children. The loading, empty, and error variants can be
 * customized either by passing a ready-made node or by passing props forwarded
 * to the corresponding state component:
 *   - loading: `loading` node, or `loadingProps` (a skeleton descriptor for
 *     {@link LoadingState}) sized to the pending content.
 *   - empty: `empty` node, or `emptyProps` ({@link EmptyState}: illustration
 *     alt text, message, CTA label + `onCta`).
 *   - error: `errorState` node, or `errorProps` ({@link ErrorState}: the
 *     content label used in the message); the retry defaults to the state's
 *     `retry` callback.
 *
 * While loading, the skeleton is shown only when `showSkeleton` is true; a
 * fetch that settles before the skeleton-show delay therefore renders nothing
 * rather than flashing a skeleton (Req 13.1).
 *
 * Requirements: 7.4, 7.5, 7.6, 13.2, 14.1, 14.4, 14.5, 15.1
 *
 * @template T
 * @param {Object} props
 * @param {"loading"|"loaded"|"empty"|"error"} props.status - async status.
 * @param {T} [props.data] - resolved data, passed to the render prop when loaded.
 * @param {Error|null} [props.error] - failure reason when status is "error".
 * @param {() => void} [props.retry] - retry callback wired to the error variant.
 * @param {boolean} [props.showSkeleton=true] - whether to render the skeleton
 *   while loading.
 * @param {((data: T) => import("react").ReactNode) | import("react").ReactNode} props.children -
 *   the loaded content, as a render prop of `data` or as plain children.
 * @param {import("react").ReactNode} [props.loading] - custom loading node.
 * @param {Object} [props.loadingProps] - props forwarded to {@link LoadingState}.
 * @param {import("react").ReactNode} [props.empty] - custom empty node.
 * @param {Object} [props.emptyProps] - props forwarded to {@link EmptyState}.
 * @param {import("react").ReactNode} [props.errorState] - custom error node.
 * @param {Object} [props.errorProps] - props forwarded to {@link ErrorState}.
 * @returns {import("react").ReactNode}
 */
const StateRenderer = ({
    status,
    data,
    error,
    retry,
    showSkeleton = true,
    children,
    loading,
    loadingProps,
    empty,
    emptyProps,
    errorState,
    errorProps,
}) => {
    const variant = selectVariant({ status });

    switch (variant) {
        case STATUS.ERROR:
            return (
                errorState ?? (
                    <ErrorState
                        error={error}
                        onRetry={errorProps?.onRetry ?? retry}
                        {...errorProps}
                    />
                )
            );

        case STATUS.EMPTY:
            return empty ?? <EmptyState {...emptyProps} />;

        case STATUS.LOADED:
            return typeof children === "function" ? children(data) : children;

        case STATUS.LOADING:
        default:
            if (!showSkeleton) {
                return null;
            }
            return loading ?? <LoadingState {...loadingProps} />;
    }
};

export default StateRenderer;
