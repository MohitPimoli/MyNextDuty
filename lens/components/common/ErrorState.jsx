"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";

import { cn } from "@/util/cn";

/**
 * ErrorState — placeholder shown when a data fetch fails or times out.
 *
 * Displays a message that identifies which content failed to load and a
 * "Try Again" action wired to the retry callback, without rendering any
 * partial or stale content (Req 15.1). The retry control is a native button,
 * operable by both pointer and keyboard.
 *
 * The failure message is derived from `contentLabel` (e.g. "recommendations"
 * → "We couldn't load recommendations.") unless an explicit `message` is
 * supplied. The region is announced assertively as an alert.
 *
 * Requirements: 15.1
 *
 * @param {Object} props
 * @param {string} [props.contentLabel="this content"] - name of the content
 *   that failed to load, used to build the identifying message.
 * @param {string} [props.message] - explicit failure message overriding the
 *   one derived from `contentLabel`.
 * @param {import("lucide-react").LucideIcon} [props.icon=TriangleAlert] -
 *   alert illustration icon from the Lucide set.
 * @param {string} [props.illustrationAlt="Error"] - text alternative for the
 *   alert illustration, announced by assistive technology.
 * @param {string} [props.retryLabel="Try Again"] - label for the retry action.
 * @param {() => void} props.onRetry - callback invoked to retry the failed
 *   fetch, by pointer or keyboard (Req 15.1).
 * @param {string} [props.className] - classes applied to the outer container.
 * @returns {JSX.Element}
 */
const ErrorState = ({
    contentLabel = "this content",
    message,
    icon: Icon = TriangleAlert,
    illustrationAlt = "Error",
    retryLabel = "Try Again",
    onRetry,
    className,
}) => {
    const failureMessage = message ?? `We couldn't load ${contentLabel}.`;

    return (
        <div
            role="alert"
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-card bg-card p-4 text-center shadow-low",
                className,
            )}
        >
            <span
                role="img"
                aria-label={illustrationAlt}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-danger"
            >
                <Icon className="h-8 w-8" aria-hidden="true" />
            </span>

            <p className="max-w-prose text-sm text-text-secondary">{failureMessage}</p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-button bg-primary px-3 py-2 text-sm font-semibold text-text-inverse shadow-medium transition-colors duration-150 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    {retryLabel}
                </button>
            )}
        </div>
    );
};

export default ErrorState;
