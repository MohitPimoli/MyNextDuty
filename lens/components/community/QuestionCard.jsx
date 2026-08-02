"use client";

import { Eye, Heart, MessageCircle, User } from "lucide-react";

import { cn } from "@/util/cn";
import { truncate, relativeTime } from "@/util/text";
import { resolveImage, capList } from "@/util/format";

const PLACEHOLDER_AVATAR = "";
const MAX_TITLE_LENGTH = 120;
const MAX_TAGS = 5;

/**
 * QuestionCard — renders a single community question card.
 *
 * Displays the author avatar, truncated title (max 120 chars), up to 5 tag
 * chips, reply count, like count, view count, and relative time since posting.
 * Missing fields get placeholders: default avatar for missing avatar, "0" for
 * empty counts, no tag chips when tags are absent.
 *
 * Requirements: 9.1, 9.2
 *
 * @param {Object} props
 * @param {Object} props.question - the question data object
 * @param {string} [props.className] - additional classes for the card container
 */
const QuestionCard = ({ question, className }) => {
    const {
        title = "",
        author = {},
        tags = [],
        replyCount,
        likeCount,
        viewCount,
        createdAt,
    } = question ?? {};

    const avatarSrc = resolveImage(author?.avatarUrl, PLACEHOLDER_AVATAR);
    const hasAvatar = avatarSrc.length > 0;
    const displayTitle = truncate(title, MAX_TITLE_LENGTH) || "Untitled";
    const displayTags = capList(tags, MAX_TAGS);
    const time = relativeTime(createdAt) || "just now";

    const replies = typeof replyCount === "number" && Number.isFinite(replyCount) ? replyCount : 0;
    const likes = typeof likeCount === "number" && Number.isFinite(likeCount) ? likeCount : 0;
    const views = typeof viewCount === "number" && Number.isFinite(viewCount) ? viewCount : 0;

    return (
        <article
            className={cn(
                "flex gap-3 rounded-card bg-card p-4 shadow-medium transition-shadow hover:shadow-high",
                className,
            )}
        >
            {/* Author avatar */}
            {hasAvatar ? (
                <img
                    src={avatarSrc}
                    alt={author?.name ? `${author.name}'s avatar` : "Author avatar"}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
            ) : (
                <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-text-secondary"
                    aria-label={author?.name ? `${author.name}'s avatar` : "Author avatar"}
                >
                    <User className="h-5 w-5" aria-hidden="true" />
                </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-2">
                {/* Title */}
                <h3 className="text-sm font-semibold leading-snug text-text-primary">
                    {displayTitle}
                </h3>

                {/* Tags */}
                {displayTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5" aria-label="Tags">
                        {displayTags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex rounded-full bg-background px-2 py-0.5 text-xs text-text-secondary"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Meta row: counts + time */}
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span className="inline-flex items-center gap-1" aria-label={`${replies} replies`}>
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        {replies}
                    </span>
                    <span className="inline-flex items-center gap-1" aria-label={`${likes} likes`}>
                        <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                        {likes}
                    </span>
                    <span className="inline-flex items-center gap-1" aria-label={`${views} views`}>
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        {views}
                    </span>
                    <span className="ml-auto">{time}</span>
                </div>
            </div>
        </article>
    );
};

export default QuestionCard;
