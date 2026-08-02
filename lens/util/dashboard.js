/**
 * Pure dashboard configuration for the lens frontend (DOM-independent).
 *
 * Encodes the Dashboard_Page quick-action set and the fixed mobile card order
 * so the dashboard layout can be unit- and property-tested without rendering.
 *
 * Quick actions (Req 7.7, 7.8): the four actions are Continue Learning, Ask
 * Community, Book Mentor, and Update Profile, with Continue Learning marked as
 * the single primary action — exactly one action carries the primary variant.
 *
 * Mobile card order (Req 7.9): at or below the mobile breakpoint the cards are
 * stacked in a single column in a fixed order.
 *
 * @typedef {Object} QuickAction
 * @property {string} id - a stable identifier
 * @property {string} label - the human-readable action label
 * @property {"primary" | "secondary"} variant - the button variant to render;
 *   exactly one action is "primary"
 *
 * Requirements: 7.7, 7.8, 7.9
 */

/**
 * The dashboard quick-action set (Req 7.7, 7.8).
 *
 * "Continue Learning" is the single primary action; every other action uses the
 * secondary variant, so no other control competes for primary prominence.
 *
 * @type {ReadonlyArray<QuickAction>}
 */
export const QUICK_ACTIONS = Object.freeze([
    Object.freeze({
        id: "continue-learning",
        label: "Continue Learning",
        variant: "primary",
    }),
    Object.freeze({
        id: "ask-community",
        label: "Ask Community",
        variant: "secondary",
    }),
    Object.freeze({
        id: "book-mentor",
        label: "Book Mentor",
        variant: "secondary",
    }),
    Object.freeze({
        id: "update-profile",
        label: "Update Profile",
        variant: "secondary",
    }),
]);

/**
 * The fixed top-to-bottom dashboard card order used in the mobile single-column
 * layout (Req 7.9).
 *
 * @type {ReadonlyArray<string>}
 */
export const MOBILE_CARD_ORDER = Object.freeze([
    "TodaysDuty",
    "Progress",
    "CurrentRoadmap",
    "CommunityActivity",
    "MentorSuggestions",
    "RecentAchievements",
]);
