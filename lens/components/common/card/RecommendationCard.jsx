"use client";

import React from "react";

const PRIORITY_CONFIG = {
  LOW:      { label: "Low",      classes: "bg-green-50 text-green-700 ring-green-200",   dot: "bg-green-500" },
  MEDIUM:   { label: "Medium",   classes: "bg-yellow-50 text-yellow-700 ring-yellow-200", dot: "bg-yellow-500" },
  HIGH:     { label: "High",     classes: "bg-orange-50 text-orange-700 ring-orange-200", dot: "bg-orange-500" },
  CRITICAL: { label: "Critical", classes: "bg-red-50 text-red-700 ring-red-200",          dot: "bg-red-500" },
};

const getMatchColor = (score) => {
  if (score >= 80) return { bar: "bg-green-500", text: "text-green-600" };
  if (score >= 50) return { bar: "bg-yellow-500", text: "text-yellow-600" };
  return { bar: "bg-red-500", text: "text-red-600" };
};

const RecommendationCard = ({
  title,
  description,
  category,
  priority = "MEDIUM",
  estimatedCost,
  timeToComplete,
  reasonForRecommendation,
  matchScore,
  isCompleted = false,
  isInProgress = false,
}) => {
  const p = PRIORITY_CONFIG[priority?.toUpperCase()] ?? PRIORITY_CONFIG.MEDIUM;
  const match = matchScore != null ? getMatchColor(matchScore) : null;

  const statusBadge = isCompleted
    ? { label: "Completed", classes: "bg-green-50 text-green-700 ring-green-200" }
    : isInProgress
    ? { label: "In Progress", classes: "bg-blue-50 text-blue-700 ring-blue-200" }
    : null;

  return (
    <article
      aria-label={`Recommendation: ${title}`}
      className="group relative flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {category && (
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              {category}
            </span>
          )}
          <h3 className="text-base font-semibold leading-snug text-gray-900">
            {title}
          </h3>
        </div>

        {/* Priority badge */}
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${p.classes}`}
          aria-label={`Priority: ${p.label}`}
        >
          <span className={`size-1.5 rounded-full ${p.dot}`} aria-hidden="true" />
          {p.label}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      )}

      {/* Reason */}
      {reasonForRecommendation && (
        <div
          role="note"
          className="flex gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 ring-1 ring-blue-100"
        >
          <span aria-hidden="true" className="mt-px shrink-0">💡</span>
          <span>{reasonForRecommendation}</span>
        </div>
      )}

      {/* Meta chips */}
      {(estimatedCost != null || timeToComplete) && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Details">
          {estimatedCost != null && (
            <span
              role="listitem"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200"
              aria-label={`Estimated cost: $${estimatedCost}`}
            >
              💰 ${estimatedCost.toFixed(2)}
            </span>
          )}
          {timeToComplete && (
            <span
              role="listitem"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200"
              aria-label={`Time to complete: ${timeToComplete}`}
            >
              🕐 {timeToComplete}
            </span>
          )}
        </div>
      )}

      {/* Footer — match score + status */}
      {(match || statusBadge) && (
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
          {/* Match score bar */}
          {match && matchScore != null && (
            <div
              className="flex flex-1 flex-col gap-1"
              role="meter"
              aria-valuenow={matchScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Match score: ${matchScore}%`}
            >
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Match score</span>
                <span className={`font-semibold ${match.text}`}>{matchScore}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${match.bar}`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Status badge */}
          {statusBadge && (
            <span
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusBadge.classes}`}
              aria-label={`Status: ${statusBadge.label}`}
            >
              {isCompleted ? "✓" : "⟳"} {statusBadge.label}
            </span>
          )}
        </div>
      )}
    </article>
  );
};

export default RecommendationCard;
