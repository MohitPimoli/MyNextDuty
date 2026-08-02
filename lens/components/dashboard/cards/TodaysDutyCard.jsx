"use client";

import { CalendarCheck } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

/**
 * Placeholder fetcher that simulates loading Today's Duty data.
 * Will be replaced with a real API call when the endpoint exists.
 */
const fetchTodaysDuty = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: "Build your emergency fund",
                description: "Set aside 3–6 months of expenses for emergencies.",
                priority: "HIGH",
            });
        }, 600);
    });

/**
 * TodaysDutyCard — shows the user's most important task for today.
 *
 * Wraps StateRenderer for loading/empty/error states (Req 7.4, 7.5, 7.6).
 */
const TodaysDutyCard = () => {
    const { status, data, error, showSkeleton, retry } = useAsyncData(fetchTodaysDuty, null);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                    Today&apos;s Duty
                </CardTitle>
            </CardHeader>
            <CardContent>
                <StateRenderer
                    status={status}
                    data={data}
                    error={error}
                    retry={retry}
                    showSkeleton={showSkeleton}
                    loadingProps={{ lines: 2, ariaLabel: "Loading today's duty" }}
                    emptyProps={{
                        message: "No duty assigned for today.",
                        ctaLabel: "Explore Roadmap",
                        onCta: () => { },
                    }}
                    errorProps={{ contentLabel: "today's duty" }}
                >
                    {(duty) => (
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold text-text-primary">{duty.title}</p>
                            <p className="text-sm text-text-secondary">{duty.description}</p>
                        </div>
                    )}
                </StateRenderer>
            </CardContent>
        </Card>
    );
};

export default TodaysDutyCard;
