"use client";

import { cn } from "@/util/cn";
import { DEFAULT_FILTER } from "@/util/community";

/**
 * Available community filters.
 * @type {Array<{key: import("@/util/community").CommunityFilter, label: string}>}
 */
const FILTERS = [
    { key: "Newest", label: "Newest" },
    { key: "Trending", label: "Trending" },
    { key: "Unanswered", label: "Unanswered" },
    { key: "MostHelpful", label: "Most Helpful" },
];

/**
 * FilterBar — filter controls for community questions.
 *
 * Renders buttons for Newest, Trending, Unanswered, and Most Helpful filters.
 * Newest is the default on load. Selecting a filter invokes `onFilterChange`
 * with the filter key so the parent can reorder cards.
 *
 * Requirements: 9.3, 9.4
 *
 * @param {Object} props
 * @param {import("@/util/community").CommunityFilter} [props.activeFilter] - currently active filter
 * @param {(filter: import("@/util/community").CommunityFilter) => void} props.onFilterChange - callback when filter changes
 * @param {string} [props.className] - additional classes
 */
const FilterBar = ({ activeFilter = DEFAULT_FILTER, onFilterChange, className }) => {
    return (
        <nav
            aria-label="Community question filters"
            className={cn("flex flex-wrap gap-2", className)}
        >
            {FILTERS.map(({ key, label }) => {
                const isActive = activeFilter === key;
                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onFilterChange(key)}
                        aria-pressed={isActive}
                        className={cn(
                            "rounded-button px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                            isActive
                                ? "bg-primary text-text-inverse shadow-medium"
                                : "bg-card text-text-secondary hover:bg-background hover:text-text-primary",
                        )}
                    >
                        {label}
                    </button>
                );
            })}
        </nav>
    );
};

export default FilterBar;
