"use client";

import { TrendingUp } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * Placeholder fetcher that simulates loading progress data.
 */
const fetchProgress = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        completedDuties: 12,
        totalDuties: 20,
        streak: 5,
      });
    }, 500);
  });

/**
 * ProgressCard — shows the user's overall progress stats.
 *
 * Wraps StateRenderer for loading/empty/error states
 */
const ProgressCard = () => {
  const { status, data, error, showSkeleton, retry } = useAsyncData(fetchProgress, null);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StateRenderer
          status={status}
          data={data}
          error={error}
          retry={retry}
          showSkeleton={showSkeleton}
          loadingProps={{ lines: 2, ariaLabel: "Loading progress" }}
          emptyProps={{
            message: "No progress data available yet.",
            ctaLabel: "Start Learning",
            onCta: () => {},
          }}
          errorProps={{ contentLabel: "progress" }}
        >
          {(progress) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-text-primary">
                  {progress.completedDuties}/{progress.totalDuties}
                </span>
                <span className="text-sm text-text-secondary">duties completed</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${(progress.completedDuties / progress.totalDuties) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-text-secondary">🔥 {progress.streak}-day streak</p>
            </div>
          )}
        </StateRenderer>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
