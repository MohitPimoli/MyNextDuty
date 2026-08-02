import { Flame, TrendingUp } from "lucide-react";
import { clampInt } from "@/util/format";
import { cn } from "@/util/cn";

/**
 * StatsSummary — displays the user's learning streak and contribution score.
 *
 * Both values are clamped to non-negative integers using `clampInt` from
 * `util/format.js`. Streak is displayed as consecutive days (≥0), and
 * contribution score is clamped to 0–999,999,999 .
 *
 * Requirements: 12.3
 *
 * @param {Object} props
 * @param {number} [props.streakDays=0] - consecutive learning days.
 * @param {number} [props.contributionScore=0] - total contribution points.
 * @param {string} [props.className] - additional classes for the container.
 */
const StatsSummary = ({ streakDays = 0, contributionScore = 0, className }) => {
  const clampedStreak = clampInt(streakDays, 0, 999999999);
  const clampedContribution = clampInt(contributionScore, 0, 999999999);

  return (
    <div className={cn("flex flex-wrap items-center gap-4 sm:gap-6", className)}>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <Flame className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">
            {clampedStreak.toLocaleString()}
          </span>
          <span className="text-xs text-text-secondary">Day streak</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">
            {clampedContribution.toLocaleString()}
          </span>
          <span className="text-xs text-text-secondary">Contributions</span>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
