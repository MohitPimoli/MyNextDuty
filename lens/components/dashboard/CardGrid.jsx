"use client";

import { MOBILE_CARD_ORDER } from "@/util/dashboard";

import TodaysDutyCard from "./cards/TodaysDutyCard";
import ProgressCard from "./cards/ProgressCard";
import CurrentRoadmapCard from "./cards/CurrentRoadmapCard";
import CommunityActivityCard from "./cards/CommunityActivityCard";
import MentorSuggestionsCard from "./cards/MentorSuggestionsCard";
import RecentAchievementsCard from "./cards/RecentAchievementsCard";

/**
 * Map from card identifier (matching MOBILE_CARD_ORDER) to component.
 */
const CARD_COMPONENTS = {
    TodaysDuty: TodaysDutyCard,
    Progress: ProgressCard,
    CurrentRoadmap: CurrentRoadmapCard,
    CommunityActivity: CommunityActivityCard,
    MentorSuggestions: MentorSuggestionsCard,
    RecentAchievements: RecentAchievementsCard,
};

/**
 * CardGrid — renders the six dashboard cards in a responsive grid.
 *
 * Desktop: 2-column grid.
 * Mobile (≤767px): single column in the fixed order from MOBILE_CARD_ORDER (Req 7.9).
 *
 * The grid uses CSS order utilities on mobile to enforce the correct card order
 * regardless of DOM order, while desktop uses a natural 2-col flow.
 *
 * Requirements: 7.3, 7.9
 */
const CardGrid = () => {
    return (
        <section
            aria-label="Dashboard cards"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
        >
            {MOBILE_CARD_ORDER.map((cardId, index) => {
                const CardComponent = CARD_COMPONENTS[cardId];
                if (!CardComponent) return null;
                return (
                    <div
                        key={cardId}
                        className="min-w-0"
                        style={{ order: index }}
                    >
                        <CardComponent />
                    </div>
                );
            })}
        </section>
    );
};

export default CardGrid;
