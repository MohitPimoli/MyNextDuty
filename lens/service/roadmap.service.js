/**
 * Roadmap service — fetches the user's roadmap nodes.
 *
 * Currently returns mock data for development. Wire to the real API endpoint
 * when available (e.g., GET /core/roadmap).
 */

const MOCK_NODES = [
    {
        id: "1",
        title: "Complete Profile Setup",
        order: 1,
        status: "Completed",
        estimatedCompletion: "2024-12-01",
        recommendedResources: [
            { id: "r1", label: "Profile Guide", url: "/guides/profile" },
        ],
    },
    {
        id: "2",
        title: "Set Career Goals",
        order: 2,
        status: "Current",
        estimatedCompletion: "2025-02-15",
        recommendedResources: [
            { id: "r2", label: "Goal Setting Framework", url: "/guides/goals" },
            { id: "r3", label: "Career Assessment Tool", url: "/tools/career-assessment" },
        ],
    },
    {
        id: "3",
        title: "Build Emergency Fund",
        order: 3,
        status: "Locked",
        estimatedCompletion: null,
        recommendedResources: [],
    },
    {
        id: "4",
        title: "Develop Core Skills",
        order: 4,
        status: "Locked",
        estimatedCompletion: "2025-06-01",
        recommendedResources: [
            { id: "r4", label: "Skill Development Path", url: "/guides/skills" },
        ],
    },
];

/**
 * Fetch roadmap nodes for the current user.
 *
 * @returns {Promise<Array>} resolves with the ordered roadmap nodes
 */
export const fetchRoadmapNodes = async () => {
    // TODO: Replace with real API call, e.g.:
    // return commonService.get("/roadmap");
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_NODES), 400);
    });
};
