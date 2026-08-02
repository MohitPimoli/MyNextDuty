"use client";

import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import PageContainer from "@/components/common/PageContainer";
import QuestionCard from "@/components/community/QuestionCard";
import FilterBar from "@/components/community/FilterBar";
import AskQuestionFab from "@/components/community/AskQuestionFab";
import { fetchCommunityQuestions } from "@/service/community.service";
import { applyFilter, DEFAULT_FILTER } from "@/util/community";

/**
 * CommunityPage — displays community questions with filtering.
 *
 * Fetches questions via useAsyncData and renders the appropriate async state
 * (loading skeleton, empty message, error with retry, or the loaded list).
 * Users can filter questions by Newest, Trending, Unanswered, or Most Helpful.
 * A floating "Ask Question" button is always visible while scrolling.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */
const CommunityPage = () => {
    const [activeFilter, setActiveFilter] = useState(DEFAULT_FILTER);

    const { status, data, error, showSkeleton, retry } = useAsyncData(
        fetchCommunityQuestions,
        null,
    );

    const filteredQuestions = useMemo(() => {
        if (!data) return [];
        return applyFilter(data, activeFilter);
    }, [data, activeFilter]);

    return (
        <PageContainer className="flex flex-col gap-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Community</h1>
                <p className="mt-1 text-sm text-text-secondary">
                    Ask questions, share knowledge, and learn from others on similar paths.
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
                    lines: 3,
                    showMedia: true,
                    ariaLabel: "Loading community questions",
                }}
                emptyProps={{
                    icon: MessageSquare,
                    illustrationAlt: "No community questions",
                    title: "No questions yet",
                    message: "Be the first to ask a question and start a conversation.",
                    ctaLabel: "Ask a Question",
                    onCta: () => { },
                }}
                errorProps={{
                    contentLabel: "community questions",
                }}
            >
                {(_data) => (
                    <div className="flex flex-col gap-4">
                        {/* Filter controls */}
                        <FilterBar
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                        />

                        {/* Question list or empty-state for filter */}
                        {filteredQuestions.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {filteredQuestions.map((question) => (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 rounded-card bg-card p-6 text-center shadow-low">
                                <MessageSquare className="h-8 w-8 text-text-secondary" aria-hidden="true" />
                                <p className="text-sm text-text-secondary">
                                    No questions match the selected filter.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </StateRenderer>

            {/* Fixed floating action button */}
            <AskQuestionFab />
        </PageContainer>
    );
};

export default CommunityPage;
