"use client";

import { Users } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import PageContainer from "@/components/common/PageContainer";
import MentorGrid from "@/components/mentors/MentorGrid";
import { fetchMentors } from "@/service/mentors.service";

/**
 * MentorsPage — displays the mentor listing grid.
 *
 * Fetches mentors via useAsyncData and renders the appropriate async state
 * (loading skeleton, empty message, error with retry, or the loaded grid).
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8
 */
const MentorsPage = () => {
    const { status, data, error, showSkeleton, retry } = useAsyncData(
        fetchMentors,
        null,
    );

    return (
        <PageContainer className="flex flex-col gap-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Mentors</h1>
                <p className="mt-1 text-sm text-text-secondary">
                    Connect with experienced professionals who can guide your career journey.
                </p>
            </div>

            <StateRenderer
                status={status}
                data={data}
                error={error}
                showSkeleton={showSkeleton}
                retry={retry}
                loadingProps={{
                    count: 6,
                    lines: 4,
                    showMedia: true,
                    ariaLabel: "Loading mentors",
                }}
                emptyProps={{
                    icon: Users,
                    illustrationAlt: "No mentors available",
                    title: "No mentors found",
                    message: "There are no mentors available at the moment. Check back soon!",
                    ctaLabel: "Refresh",
                    onCta: retry,
                }}
                errorProps={{
                    contentLabel: "mentors",
                }}
            >
                {(mentors) => <MentorGrid mentors={mentors} />}
            </StateRenderer>
        </PageContainer>
    );
};

export default MentorsPage;
