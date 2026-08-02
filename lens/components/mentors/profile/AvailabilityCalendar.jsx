"use client";

import { useState, useMemo } from "react";

import Calendar from "@/components/ui/Calendar";
import { generateCalendarDays } from "@/util/mentors";

/**
 * AvailabilityCalendar — displays the mentor's available session slots
 * for the next 30 days using the Calendar component.
 *
 * Unavailable days are marked as disabled on the calendar.
 *
 * Requirements: 11.2
 *
 * @param {Object} props
 * @param {Array} props.slots - the mentor's session slot data
 */
const AvailabilityCalendar = ({ slots = [] }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const calendarDays = useMemo(
        () => generateCalendarDays(slots, new Date()),
        [slots],
    );

    // Build a list of Date objects for unavailable days to pass as disabled
    const disabledDates = useMemo(() => {
        return calendarDays
            .filter((day) => day.unavailable)
            .map((day) => {
                const [year, month, date] = day.date.split("-").map(Number);
                return new Date(year, month - 1, date);
            });
    }, [calendarDays]);

    return (
        <section
            className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-medium"
            aria-label="Mentor availability calendar"
        >
            <h2 className="text-lg font-semibold text-text-primary">Availability</h2>
            <p className="text-sm text-text-secondary">
                Available slots for the next 30 days. Greyed-out dates are unavailable.
            </p>
            <Calendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDates}
                className="mt-2"
            />
        </section>
    );
};

export default AvailabilityCalendar;
