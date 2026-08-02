"use client";

import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

/**
 * BookSessionButton — a prominent button that navigates the user to
 * the session booking flow for the selected mentor.
 *
 * Requirements: 11.5
 *
 * @param {Object} props
 * @param {string} props.mentorId - the mentor's unique identifier
 * @param {string} [props.mentorName] - the mentor's name for accessibility
 */
const BookSessionButton = ({ mentorId, mentorName = "this mentor" }) => {
    const router = useRouter();

    const handleBookSession = () => {
        // TODO: Navigate to session booking flow when implemented
        // For now, navigate to a booking page placeholder
        router.push(`/mentors/${mentorId}/book`);
    };

    return (
        <button
            type="button"
            onClick={handleBookSession}
            className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-primary px-6 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
            aria-label={`Book a session with ${mentorName}`}
        >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Book Session
        </button>
    );
};

export default BookSessionButton;
