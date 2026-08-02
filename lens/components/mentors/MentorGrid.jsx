"use client";

import MotionCard from "@/components/motion/MotionCard";
import MentorCard from "./MentorCard";

/**
 * MentorGrid — responsive grid of mentor cards.
 *
 * Uses Tailwind responsive classes to achieve 1 column at mobile (<768px),
 * 2 columns at tablet (768–1279px), and 3 columns at desktop (≥1280px),
 * matching the `mentorColumns` breakpoint helper output.
 *
 * Each card is wrapped in a MotionCard for hover animation.
 *
 * Requirements: 10.1
 *
 * @param {Object} props
 * @param {Array} props.mentors - the list of mentor objects to display
 */
const MentorGrid = ({ mentors = [] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
                <MotionCard key={mentor.id}>
                    <MentorCard mentor={mentor} />
                </MotionCard>
            ))}
        </div>
    );
};

export default MentorGrid;
