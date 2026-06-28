"use client";

import Button from "@/components/common/Button/Button";
import RecommendationCard from "@/components/common/card/RecommendationCard";
import SkeletonCard from "@/components/feed/SkeletonCard";

const EMPTY_STATE_CONFIG = {
  personalized: {
    emoji: "🔍",
    heading: "No personalised duties yet",
    explanation: "Complete your profile to unlock recommendations tailored for you.",
  },
  "life-stage": {
    emoji: "🧭",
    heading: "No duties for your life stage",
    explanation: "Update your life stage in your profile to see results.",
  },
  interests: {
    emoji: "💡",
    heading: "No interest-based duties found",
    explanation: "Add interests to your profile to get relevant recommendations.",
  },
  critical: {
    emoji: "✅",
    heading: "No critical duties right now",
    explanation: "You're on track — nothing urgent needs your attention.",
  },
};

const RecommendationGrid = ({
  recommendations,
  loading,
  error,
  activeFilter,
  onRetry,
  onSwitchToAll,
  onLoadMore,
  showLoadMore,
  loadMoreLoading,
}) => {
  const gridClasses =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  // Loading state — 6 skeleton cards
  if (loading) {
    return (
      <section aria-label="Duty recommendations">
        <ul className={gridClasses}>
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section aria-label="Duty recommendations">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500">
            We couldn&apos;t load your recommendations. Please try again.
          </p>
          <Button
            aria-label="Retry loading recommendations"
            loading={loadMoreLoading}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  // Empty state
  if (recommendations.length === 0) {
    const config =
      EMPTY_STATE_CONFIG[activeFilter] ?? EMPTY_STATE_CONFIG.personalized;

    return (
      <section aria-label="Duty recommendations">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="text-5xl" aria-hidden="true">
            {config.emoji}
          </span>
          <h2 className="text-xl font-semibold text-gray-900">
            {config.heading}
          </h2>
          <p className="text-sm text-gray-500">{config.explanation}</p>
          <Button
            aria-label="Switch to all recommendations"
            onClick={onSwitchToAll}
          >
            Try All Recommendations
          </Button>
        </div>
      </section>
    );
  }

  // Data state — recommendation cards
  return (
    <section aria-label="Duty recommendations">
      <p className="mb-4 text-sm font-medium text-gray-500">
        {recommendations.length} {recommendations.length === 1 ? 'duty' : 'duties'} found
      </p>
      <ul className={gridClasses}>
        {recommendations.map((d) => (
          <li key={d.id}>
            <RecommendationCard {...d} />
          </li>
        ))}
      </ul>
      {showLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button
            aria-label="Load more duty recommendations"
            loading={loadMoreLoading}
            onClick={onLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecommendationGrid;
