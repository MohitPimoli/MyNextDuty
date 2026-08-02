"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/util/cn";

/**
 * Calendar component (Req 13.1).
 *
 * Simple month-view calendar grid for mentor availability.
 * Supports selected dates, disabled dates, and month navigation.
 */

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(a, b) {
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isDateDisabled(date, disabledDates) {
    if (!disabledDates) return false;
    if (typeof disabledDates === "function") return disabledDates(date);
    if (Array.isArray(disabledDates)) {
        return disabledDates.some((d) => isSameDay(d, date));
    }
    return false;
}

const Calendar = ({
    selected,
    onSelect,
    disabled,
    className,
    ...props
}) => {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(
        selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();

    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            cells.push(null);
        }
        // Day cells
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(new Date(year, month, d));
        }
        return cells;
    }, [year, month]);

    const prevMonth = () => {
        setViewMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setViewMonth(new Date(year, month + 1, 1));
    };

    const monthLabel = viewMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className={cn("w-full max-w-sm p-3", className)} {...props}>
            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-button text-text-secondary hover:text-text-primary hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-text-primary">{monthLabel}</span>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-button text-text-secondary hover:text-text-primary hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Next month"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((day) => (
                    <div
                        key={day}
                        className="flex h-8 items-center justify-center text-xs font-medium text-text-secondary"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1" role="grid" aria-label={monthLabel}>
                {days.map((date, i) => {
                    if (!date) {
                        return <div key={`empty-${i}`} className="h-8 w-8" />;
                    }

                    const isSelected = isSameDay(date, selected);
                    const isToday = isSameDay(date, today);
                    const isDisabled = isDateDisabled(date, disabled);

                    return (
                        <button
                            key={date.toISOString()}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => onSelect?.(date)}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-button text-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isSelected && "bg-primary text-text-inverse",
                                !isSelected && isToday && "border border-primary text-primary",
                                !isSelected && !isToday && "text-text-primary hover:bg-background",
                                isDisabled && "pointer-events-none opacity-50"
                            )}
                            aria-label={date.toLocaleDateString()}
                            aria-pressed={isSelected}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

Calendar.displayName = "Calendar";

export { Calendar };
export default Calendar;
