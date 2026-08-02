"use client";

import { MessageCircle } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

/**
 * Placeholder fetcher that simulates loading community activity data.
 */
const fetchCommunityActivity = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                recentQuestions: 3,
                newAnswers: 7,
                trending: "How to negotiate a raise",
            });
        }, 550);
    });

/**
 * CommunityActivityCard — shows recent community activity highlights.
 *
 * Wraps StateRenderer for loading/empty/error states (Req 7.4, 7.5, 7.6).
 */
const CommunityActivityCard = () => {
    const { status, data, error, showSkeleton, retry } = useAsyncData(fetchCommunityActivity, null);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-warning" aria-hidden="true" />
                    Community Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <StateRenderer
                    status={status}
                    data={data}
                    error={error}
                    retry={retry}
                    showSkeleton={showSkeleton}
                    loadingProps={{ lines: 2, ariaLabel: "Loading community activity" }}
                    emptyProps={{
                        message: "No community activity yet.",
                        ctaLabel: "Ask a Question",
                        onCta: () => { },
                    }}
                    errorProps={{ contentLabel: "community activity" }}
                >
                    {(activity) => (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">New questions</span>
                                <span className="font-medium text-text-primary">{activity.recentQuestions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">New answers</span>
                                <span className="font-medium text-text-primary">{activity.newAnswers}</span>
                            </div>
                            <p className="mt-1 text-xs text-text-secondary">
                                Trending: {activity.trending}
                            </p>
                        </div>
                    )}
                </StateRenderer>
            </CardContent>
        </Card>
    );
};

export default CommunityActivityCard;
