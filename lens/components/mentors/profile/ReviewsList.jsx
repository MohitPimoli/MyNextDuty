"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

import { paginateReviews, REVIEWS_PER_PAGE } from "@/util/mentors";
import { formatRating } from "@/util/format";

/**
 * ReviewsList — displays paginated mentor reviews with rating, name, and text.
 *
 * Shows up to 10 reviews per page with prev/next pagination controls.
 * If no reviews exist, an empty-state message is shown (Req 11.4).
 *
 * Requirements: 11.3, 11.4
 *
 * @param {Object} props
 * @param {Array} props.reviews - the full list of reviews
 */
const ReviewsList = ({ reviews = [] }) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
    const currentReviews = paginateReviews(reviews, page);

    const goToPrev = () => setPage((p) => Math.max(1, p - 1));
    const goToNext = () => setPage((p) => Math.min(totalPages, p + 1));

    // Empty state (Req 11.4)
    if (!reviews || reviews.length === 0) {
        return (
            <section
                className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-medium"
                aria-label="Mentor reviews"
            >
                <h2 className="text-lg font-semibold text-text-primary">Reviews</h2>
                <p className="text-sm text-text-secondary">
                    No reviews are available for this mentor yet.
                </p>
            </section>
        );
    }

    return (
        <section
            className="flex flex-col gap-4 rounded-card bg-card p-6 shadow-medium"
            aria-label="Mentor reviews"
        >
            <h2 className="text-lg font-semibold text-text-primary">
                Reviews ({reviews.length})
            </h2>

            {/* Review items */}
            <div className="flex flex-col gap-3">
                {currentReviews.map((review) => (
                    <article
                        key={review.id}
                        className="flex flex-col gap-1.5 border-b border-border pb-3 last:border-b-0 last:pb-0"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-text-primary">
                                {review.reviewerName}
                            </span>
                            <span className="inline-flex items-center gap-1 text-sm text-text-secondary">
                                <Star className="h-3.5 w-3.5 text-yellow-500" aria-hidden="true" />
                                {formatRating(review.rating)}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-text-secondary">
                            {review.text && review.text.length > 500
                                ? review.text.slice(0, 500)
                                : review.text}
                        </p>
                    </article>
                ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={goToPrev}
                        disabled={page <= 1}
                        className="inline-flex items-center gap-1 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        aria-label="Previous page of reviews"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        Previous
                    </button>
                    <span className="text-xs text-text-secondary">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={goToNext}
                        disabled={page >= totalPages}
                        className="inline-flex items-center gap-1 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        aria-label="Next page of reviews"
                    >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default ReviewsList;
