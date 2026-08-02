"use client";

import { Map } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import PageContainer from "@/components/common/PageContainer";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import { fetchRoadmapNodes } from "@/service/roadmap.service";

/**
 * RoadmapPage — displays the user's duty roadmap as a connected timeline.
 *
 * Fetches roadmap nodes via useAsyncData and renders the appropriate async
 * state (loading skeleton, empty message, error with retry, or the loaded
 * timeline). Wrapped in StateRenderer for consistent state handling.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
 */
const RoadmapPage = () => {
    const { status, data, error, showSkeleton, retry } = useAsyncData(
        fetchRoadmapNodes,
        null,
    );

    return (
        <PageContainer className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Your Roadmap</h1>
                <p className="mt-1 text-sm text-text-secondary">
                    Track your progress and see what comes next.
                </p>
            </div>

            <StateRenderer
                status={status}
                data={data}
                error={error}
                showSkeleton={showSkeleton}
                retry={retry}
                loadingProps={{
                    count: 4,
                    lines: 2,
                    ariaLabel: "Loading roadmap",
                }}
                emptyProps={{
                    icon: Map,
                    illustrationAlt: "No roadmap nodes",
                    title: "No roadmap yet",
                    message: "Your roadmap will appear here once duties are assigned to your path.",
                    ctaLabel: "Go to Dashboard",
                    onCta: () => {
                        window.location.href = "/dashboard";
                    },
                }}
                errorProps={{
                    contentLabel: "your roadmap",
                }}
            >
                {(nodes) => <RoadmapTimeline nodes={nodes} />}
            </StateRenderer>
        </PageContainer>
    );
};

export default RoadmapPage;
