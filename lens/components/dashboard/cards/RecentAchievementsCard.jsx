"use client";

import { Trophy } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

/**
 * Placeholder fetcher that simulates loading recent achievements.
 */
const fetchRecentAchievements = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                achievements: [
                    { title: "First Roadmap Completed", date: "2 days ago" },
                    { title: "5-Day Streak", date: "Today" },
                ],
            });
        }, 500);
    });

/**
 * RecentAchievementsCard — shows the user's recent achievements.
 *
 * Wraps StateRenderer for loading/empty/error states (Req 7.4, 7.5, 7.6).
 */
const RecentAchievementsCard = () => {
    const { status, data, error, showSkeleton, retry } = useAsyncData(fetchRecentAchievements, null);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-warning" aria-hidden="true" />
                    Recent Achievements
                </CardTitle>
            </CardHeader>
            <CardContent>
                <StateRenderer
                    status={status}
                    data={data}
                    error={error}
                    retry={retry}
                    showSkeleton={showSkeleton}
                    loadingProps={{ lines: 2, ariaLabel: "Loading achievements" }}
                    emptyProps={{
                        message: "No achievements earned yet.",
                        ctaLabel: "Start Learning",
                        onCta: () => { },
                    }}
                    errorProps={{ contentLabel: "achievements" }}
                >
                    {(achievements) => (
                        <ul className="flex flex-col gap-2">
                            {achievements.achievements.map((achievement) => (
                                <li
                                    key={achievement.title}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm font-medium text-text-primary">
                                        {achievement.title}
                                    </span>
                                    <span className="text-xs text-text-secondary">
                                        {achievement.date}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </StateRenderer>
            </CardContent>
        </Card>
    );
};

export default RecentAchievementsCard;
