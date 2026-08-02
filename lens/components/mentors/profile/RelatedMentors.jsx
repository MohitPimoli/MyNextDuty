import Link from "next/link";
import { User } from "lucide-react";

import { capRelated } from "@/util/mentors";
import { resolveImage } from "@/util/format";
import { ROUTE_PATHS } from "@/config/RoutePath";

/**
 * RelatedMentors — displays 0–6 related mentors with photo and name,
 * each linking to their profile.
 *
 * Requirements: 11.6
 *
 * @param {Object} props
 * @param {Array} props.mentors - the list of related mentor objects
 */
const RelatedMentors = ({ mentors = [] }) => {
    const displayMentors = capRelated(mentors);

    if (displayMentors.length === 0) {
        return null;
    }

    return (
        <section
            className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-medium"
            aria-label="Related mentors"
        >
            <h2 className="text-lg font-semibold text-text-primary">Related Mentors</h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {displayMentors.map((mentor) => {
                    const photoSrc = resolveImage(mentor.photoUrl, "");
                    const hasPhoto = photoSrc.length > 0;

                    return (
                        <Link
                            key={mentor.id}
                            href={ROUTE_PATHS.MENTOR_PROFILE(mentor.id)}
                            className="flex flex-col items-center gap-2 rounded-card p-3 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            {hasPhoto ? (
                                <img
                                    src={photoSrc}
                                    alt={mentor.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <span
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-text-secondary"
                                    aria-label={`${mentor.name}'s avatar placeholder`}
                                >
                                    <User className="h-6 w-6" aria-hidden="true" />
                                </span>
                            )}
                            <span className="text-center text-xs font-medium text-text-primary">
                                {mentor.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default RelatedMentors;
