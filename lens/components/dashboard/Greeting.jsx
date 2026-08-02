"use client";

import { useAuth } from "@/hooks/useAuth";
import { resolveGreeting } from "@/util/greeting";

/**
 * Greeting — displays a time-based greeting with the user's name and subtitle.
 *
 * Uses `resolveGreeting` to determine the greeting term based on the current
 * local time and falls back to "there" when the user's name is unavailable.
 *
 * Requirements: 7.1, 7.2
 */
const Greeting = () => {
    const { user } = useAuth();
    const { term, name } = resolveGreeting(new Date(), user);

    return (
        <section aria-label="Greeting" className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                {term}, {name}
            </h1>
            <p className="text-sm text-text-secondary sm:text-base">
                Here&apos;s your next duty.
            </p>
        </section>
    );
};

export default Greeting;
