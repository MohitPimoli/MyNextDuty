"use client";

import { Map } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

/**
 * Placeholder fetcher that simulates loading current roadmap data.
 */
const fetchCurrentRoadmap = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                currentNode: "Build Emergency Fund",
                totalNodes: 8,
                completedNodes: 3,
            });
        }, 700);
    });

/**
 * CurrentRoadmapCard — shows the user's current roadmap position.
 *
 * Wraps StateRenderer for loading/empty/error states (Req 7.4, 7.5, 7.6).
 */
const CurrentRoadmapCard = () => {
    const { status, data, error, showSkeleton, retry } = useAsyncData(fetchCurrentRoadmap, null);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" aria-hidden="true" />
                    Current Roadmap
                </CardTitle>
            </CardHeader>
            <CardContent>
                <StateRenderer
                    status={status}
                    data={data}
                    error={error}
                    retry={retry}
                    showSkeleton={showSkeleton}
                    loadingProps={{ lines: 2, ariaLabel: "Loading roadmap" }}
                    emptyProps={{
                        message: "No roadmap available yet.",
                        ctaLabel: "Create Roadmap",
                        onCta: () => { },
                    }}
                    errorProps={{ contentLabel: "roadmap" }}
                >
                    {(roadmap) => (
                        <div className="flex flex-col gap-2">
                            <p className="font-medium text-text-primary">
                                Currently on: {roadmap.currentNode}
                            </p>
                            <p className="text-sm text-text-secondary">
                                {roadmap.completedNodes} of {roadmap.totalNodes} nodes completed
                            </p>
                        </div>
                    )}
                </StateRenderer>
            </CardContent>
        </Card>
    );
};

export default CurrentRoadmapCard;
