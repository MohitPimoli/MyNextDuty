import { User, Briefcase } from "lucide-react";

import { resolveImage, capList, clampInt } from "@/util/format";

const MAX_SKILLS = 20;
const MAX_BIO_LENGTH = 1000;

/**
 * MentorHero — displays the mentor's photo, name, bio, years of experience,
 * and skill tags in a hero region.
 *
 * Requirements: 11.1
 *
 * @param {Object} props
 * @param {Object} props.mentor - the mentor profile data
 */
const MentorHero = ({ mentor }) => {
    const {
        name = "Unknown Mentor",
        photoUrl,
        bio = "",
        yearsExperience = 0,
        skills = [],
    } = mentor ?? {};

    const photoSrc = resolveImage(photoUrl, "");
    const hasPhoto = photoSrc.length > 0;
    const displayBio = bio.length > MAX_BIO_LENGTH ? bio.slice(0, MAX_BIO_LENGTH) : bio;
    const years = clampInt(yearsExperience, 0, 60);
    const displaySkills = capList(skills, MAX_SKILLS);

    return (
        <section
            className="flex flex-col gap-4 rounded-card bg-card p-6 shadow-medium"
            aria-label="Mentor profile hero"
        >
            {/* Photo + Name + Experience */}
            <div className="flex items-start gap-4">
                {hasPhoto ? (
                    <img
                        src={photoSrc}
                        alt={name}
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <span
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-background text-text-secondary"
                        aria-label={`${name}'s avatar placeholder`}
                    >
                        <User className="h-10 w-10" aria-hidden="true" />
                    </span>
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h1 className="text-xl font-bold text-text-primary">{name}</h1>
                    <p className="flex items-center gap-1.5 text-sm text-text-secondary">
                        <Briefcase className="h-4 w-4" aria-hidden="true" />
                        {years} {years === 1 ? "year" : "years"} of experience
                    </p>
                </div>
            </div>

            {/* Bio */}
            {displayBio && (
                <p className="text-sm leading-relaxed text-text-secondary">
                    {displayBio}
                </p>
            )}

            {/* Skills */}
            {displaySkills.length > 0 && (
                <div className="flex flex-wrap gap-2" aria-label="Skills">
                    {displaySkills.map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex rounded-full bg-background px-3 py-1 text-xs font-medium text-text-secondary"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MentorHero;
