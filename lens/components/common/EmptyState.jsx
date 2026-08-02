"use client";

import { Inbox } from "lucide-react";

import { cn } from "@/util/cn";

/**
 * EmptyState — placeholder shown when a successful fetch returns zero items.
 *
 * Contains an illustration with a text alternative announced to assistive
 * technology, an explanatory message, and exactly one primary call-to-action
 * that invokes the supplied callback. The single CTA is a native button, so it
 * is operable by both pointer and keyboard
 *
 *
 * @param {Object} props
 * @param {import("lucide-react").LucideIcon} [props.icon=Inbox] - illustration
 *   icon rendered from the Lucide set.
 * @param {string} [props.illustrationAlt="No content"] - text alternative for
 *   the illustration, announced by assistive technology (Req 14.5).
 * @param {string} [props.title] - optional short heading above the message.
 * @param {string} props.message - explanatory text describing the empty region.
 * @param {string} props.ctaLabel - label for the single primary call-to-action.
 * @param {() => void} props.onCta - callback invoked when the CTA is activated
 *   by pointer or keyboard
 * @param {string} [props.className] - classes applied to the outer container.
 * @returns {JSX.Element}
 */
const EmptyState = ({
    icon: Icon = Inbox,
    illustrationAlt = "No content",
    title,
    message,
    ctaLabel,
    onCta,
    className,
}) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-card bg-card p-4 text-center shadow-low",
                className,
            )}
        >
            <span
                role="img"
                aria-label={illustrationAlt}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-text-secondary"
            >
                <Icon className="h-8 w-8" aria-hidden="true" />
            </span>

            <div className="flex flex-col gap-1">
                {title && (
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                )}
                {message && (
                    <p className="max-w-prose text-sm text-text-secondary">{message}</p>
                )}
            </div>

            {ctaLabel && onCta && (
                <button
                    type="button"
                    onClick={onCta}
                    className="mt-1 inline-flex items-center justify-center rounded-button bg-primary px-3 py-2 text-sm font-semibold text-text-inverse shadow-medium transition-colors duration-150 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    {ctaLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
