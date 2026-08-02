/**
 * Community service — fetches community questions.
 *
 * Currently returns mock data for development. Wire to the real API endpoint
 * when available (e.g., GET /core/community/questions).
 */

const MOCK_QUESTIONS = [
    {
        id: "q1",
        title: "How do I start building an emergency fund on a student budget?",
        author: {
            name: "Priya S.",
            avatarUrl: "",
        },
        tags: ["finance", "student", "savings"],
        replyCount: 12,
        likeCount: 34,
        viewCount: 210,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "q2",
        title: "What certifications are most valued for early-career software engineers transitioning into cloud architecture roles?",
        author: {
            name: "Ravi K.",
            avatarUrl: "https://i.pravatar.cc/40?u=ravi",
        },
        tags: ["career", "cloud", "certifications", "software", "engineering"],
        replyCount: 8,
        likeCount: 22,
        viewCount: 180,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "q3",
        title: "Best strategies for work-life balance during family building stage?",
        author: {
            name: "Anita M.",
            avatarUrl: "https://i.pravatar.cc/40?u=anita",
        },
        tags: ["work-life-balance", "family"],
        replyCount: 0,
        likeCount: 5,
        viewCount: 45,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "q4",
        title: "How to negotiate salary for a mid-career switch?",
        author: {
            name: "Deepak R.",
            avatarUrl: "",
        },
        tags: ["salary", "negotiation", "mid-career"],
        replyCount: 15,
        likeCount: 48,
        viewCount: 520,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "q5",
        title: "Recommended books for retirement planning in India?",
        author: {
            name: "Sunita P.",
            avatarUrl: "https://i.pravatar.cc/40?u=sunita",
        },
        tags: ["retirement", "books", "india", "planning", "finance"],
        replyCount: 3,
        likeCount: 11,
        viewCount: 90,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

/**
 * Fetch community questions.
 *
 * @returns {Promise<Array>} resolves with the community questions
 */
export const fetchCommunityQuestions = async () => {
    // TODO: Replace with real API call, e.g.:
    // return commonService.get(API_URLS.COMMUNITY.QUESTIONS);
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_QUESTIONS), 400);
    });
};
