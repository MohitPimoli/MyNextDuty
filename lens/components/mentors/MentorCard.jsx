"use client";

import Link from "next/link";
import { Briefcase, Calendar, MessageSquare, Star, User } from "lucide-react";

import { cn } from "@/util/cn";
import { formatRating, capList, resolveImage } from "@/util/format";
import { ROUTE_PATHS } from "@/config/RoutePath";

const MAX_SKILLS = 5;

/**
 * Availability indicator color mapping.
 * Green for Available, yellow for Limited, red for Unavailable.
 */
const AVAILABILITY_STYLES = {
    Available: "bg-green-500",
    Limited: "bg-yellow-500",
    Unavailable: "bg-red-500",
};

/**
 * MentorCard — renders a single mentor card with photo, details, and actions.
 *
 * Displays the mentor's photo (with User icon fallback), name, company, years
 * of experience, up to 5 skill labels, rating (0.0–5.0), availability
 * indicator, and three actions: View Profile, Book Session, Message.
 *
 * Requirements: 10.2, 10.3, 10.4, 10.5
 *
 * @param {Object} props
 * @param {Object} props.mentor - the mentor data object
 * @param {string} [props.className] - additional classes for the card
 */
const MentorCard = ({ mentor, className }) => {
    const {
        id,
        name = "Unknown Mentor",
        photoUrl,
        company = "",
        yearsExperience = 0,
        skills = [],
        rating = 0,
        availability = "Unavailable",
    } = mentor ?? {};

    const photoSrc = resolveImage(photoUrl, "");
    const hasPhoto = photoSrc.length > 0;
    const displaySkills = capList(skills, MAX_SKILLS);
    const displayRating = formatRating(rating);
    const years = Math.floor(Math.max(0, yearsExperience));
    const availabilityDotClass = AVAILABILITY_STYLES[availability] || AVAILABILITY_STYLES.Unavailable;

    return (
        <article
            className={cn(
                "flex flex-col gap-4 rounded-card bg-card p-5 shadow-medium",
                className,
            )}
        >
            {/* Header: Photo + Basic Info */}
            <div className="flex items-start gap-3">
                {hasPhoto ? (
                    <img
                        src={photoSrc}
                        alt={name}
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <span
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-background text-text-secondary"
                        aria-label={`${name}'s avatar placeholder`}
                    >
                        <User className="h-7 w-7" aria-hidden="true" />
                    </span>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <h3 className="text-base font-semibold text-text-primary truncate">
                        {name}
                    </h3>
                    {company && (
                        <p className="text-sm text-text-secondary truncate">
                            {company}
                        </p>
                    )}
                    <p className="flex items-center gap-1 text-xs text-text-secondary">
                        <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                        {years} {years === 1 ? "year" : "years"}
                    </p>
                </div>
            </div>

            {/* Skills */}
            {displaySkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5" aria-label="Skills">
                    {displaySkills.map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-text-secondary"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {/* Rating + Availability */}
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-text-primary">
                    <Star className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                    {displayRating}
                </span>

                <span
                    className="inline-flex items-center gap-1.5 text-xs text-text-secondary"
                    aria-label={`Availability: ${availability}`}
                >
                    <span
                        className={cn("h-2 w-2 rounded-full", availabilityDotClass)}
                        aria-hidden="true"
                    />
                    {availability}
                </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <Link
                    href={ROUTE_PATHS.MENTOR_PROFILE(id)}
                    className="inline-flex items-center gap-1 rounded-button bg-primary px-3 py-1.5 text-xs font-medium text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    View Profile
                </Link>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => {
                        // TODO: Open session booking flow
                    }}
                >
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Book Session
                </button>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => {
                        // TODO: Open messaging interface
                    }}
                >
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    Message
                </button>
            </div>
        </article>
    );
};

export default MentorCard;
