/**
 * Mentors service — fetches mentor listings.
 *
 * Currently returns mock data for development. Wire to the real API endpoint
 * when available (e.g., GET /core/mentors).
 */

const MOCK_MENTORS = [
    {
        id: "m1",
        name: "Dr. Ananya Sharma",
        photoUrl: "https://i.pravatar.cc/80?u=ananya",
        company: "Google India",
        yearsExperience: 12,
        skills: ["System Design", "Cloud Architecture", "Leadership", "Go", "Kubernetes"],
        rating: 4.8,
        availability: "Available",
    },
    {
        id: "m2",
        name: "Rahul Mehta",
        photoUrl: "https://i.pravatar.cc/80?u=rahul",
        company: "Flipkart",
        yearsExperience: 7,
        skills: ["React", "Node.js", "TypeScript", "GraphQL"],
        rating: 4.5,
        availability: "Limited",
    },
    {
        id: "m3",
        name: "Priya Nair",
        photoUrl: "",
        company: "Microsoft",
        yearsExperience: 15,
        skills: ["Data Science", "Machine Learning", "Python", "SQL", "Statistics"],
        rating: 4.9,
        availability: "Unavailable",
    },
    {
        id: "m4",
        name: "Vikram Singh",
        photoUrl: "https://i.pravatar.cc/80?u=vikram",
        company: "Razorpay",
        yearsExperience: 5,
        skills: ["Fintech", "Java", "Spring Boot", "Microservices"],
        rating: 4.2,
        availability: "Available",
    },
    {
        id: "m5",
        name: "Sneha Reddy",
        photoUrl: "https://i.pravatar.cc/80?u=sneha",
        company: "Amazon",
        yearsExperience: 9,
        skills: ["Product Management", "Agile", "UX Research", "Analytics", "Strategy"],
        rating: 4.7,
        availability: "Limited",
    },
    {
        id: "m6",
        name: "Arjun Patel",
        photoUrl: "https://i.pravatar.cc/80?u=arjun",
        company: "Swiggy",
        yearsExperience: 3,
        skills: ["Mobile Development", "Flutter", "Dart", "Firebase"],
        rating: 3.9,
        availability: "Available",
    },
];

/**
 * Fetch mentor listings.
 *
 * @returns {Promise<Array>} resolves with the list of mentors
 */
export const fetchMentors = async () => {
    // TODO: Replace with real API call, e.g.:
    // return commonService.get(API_URLS.MENTORS.LIST);
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_MENTORS), 400);
    });
};

/**
 * Mock mentor profile data keyed by mentor ID.
 *
 * Provides a full profile shape for the Mentor Profile page including
 * bio, availability slots, reviews, and related mentors.
 */
const MOCK_MENTOR_PROFILES = {
    m1: {
        id: "m1",
        name: "Dr. Ananya Sharma",
        photoUrl: "https://i.pravatar.cc/150?u=ananya",
        bio: "Senior Staff Engineer at Google India with over a decade of experience in distributed systems and cloud-native architecture. I mentor engineers looking to transition into system design roles or navigate the path to Staff+ positions. My sessions focus on practical design thinking, career strategy, and building technical leadership skills.",
        yearsExperience: 12,
        skills: [
            "System Design", "Cloud Architecture", "Leadership", "Go", "Kubernetes",
            "Distributed Systems", "gRPC", "Terraform", "AWS", "GCP",
        ],
        slots: generateMockSlots(),
        reviews: [
            { id: "r1", reviewerName: "Karan Gupta", rating: 5, text: "Dr. Sharma helped me ace my system design interviews. Her structured approach to breaking down problems is invaluable." },
            { id: "r2", reviewerName: "Meera Iyer", rating: 5, text: "Incredibly knowledgeable and patient. She tailored our session to my specific career goals." },
            { id: "r3", reviewerName: "Aditya Rao", rating: 4, text: "Great mentor for anyone looking to move into cloud architecture. Very practical advice." },
            { id: "r4", reviewerName: "Fatima Khan", rating: 5, text: "One of the best mentors I have worked with. She goes above and beyond to help you understand complex concepts." },
            { id: "r5", reviewerName: "Rohit Sharma", rating: 4, text: "Helpful feedback on my resume and interview prep. Would recommend to anyone aiming for senior roles." },
        ],
        relatedMentors: [
            { id: "m2", name: "Rahul Mehta", photoUrl: "https://i.pravatar.cc/80?u=rahul" },
            { id: "m5", name: "Sneha Reddy", photoUrl: "https://i.pravatar.cc/80?u=sneha" },
            { id: "m4", name: "Vikram Singh", photoUrl: "https://i.pravatar.cc/80?u=vikram" },
        ],
    },
    m2: {
        id: "m2",
        name: "Rahul Mehta",
        photoUrl: "https://i.pravatar.cc/150?u=rahul",
        bio: "Full-stack engineer at Flipkart specializing in React, Node.js, and GraphQL. I enjoy helping early-career developers level up their frontend skills and build production-grade applications.",
        yearsExperience: 7,
        skills: ["React", "Node.js", "TypeScript", "GraphQL", "Next.js", "PostgreSQL"],
        slots: generateMockSlots(),
        reviews: [
            { id: "r6", reviewerName: "Priya Deshmukh", rating: 5, text: "Rahul is super approachable and explains complex React patterns in simple terms." },
            { id: "r7", reviewerName: "Sanjay Kumar", rating: 4, text: "Helped me understand GraphQL subscriptions and real-time data patterns." },
        ],
        relatedMentors: [
            { id: "m1", name: "Dr. Ananya Sharma", photoUrl: "https://i.pravatar.cc/80?u=ananya" },
            { id: "m6", name: "Arjun Patel", photoUrl: "https://i.pravatar.cc/80?u=arjun" },
        ],
    },
};

/**
 * Generate mock availability slots for the next 30 days.
 * Randomly marks ~60% of days as available.
 *
 * @returns {Array<{date: string, available: boolean}>}
 */
function generateMockSlots() {
    const slots = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
        const day = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = day.toISOString().split("T")[0];
        slots.push({ date: dateStr, available: Math.random() > 0.4 });
    }
    return slots;
}

/**
 * Fetch a single mentor's full profile by ID.
 *
 * Returns mock data for development. Wire to the real API endpoint
 * when available (e.g., GET /core/mentors/:id).
 *
 * @param {string} id - the mentor's unique identifier
 * @returns {Promise<Object>} resolves with the full mentor profile
 */
export const fetchMentorProfile = async (id) => {
    // TODO: Replace with real API call, e.g.:
    // return commonService.get(API_URLS.MENTORS.PROFILE(id));
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const profile = MOCK_MENTOR_PROFILES[id];
            if (profile) {
                resolve(profile);
            } else {
                // Fallback: return a generic profile for any unknown ID
                resolve({
                    id,
                    name: "Mentor",
                    photoUrl: "",
                    bio: "Experienced professional ready to help you grow in your career.",
                    yearsExperience: 5,
                    skills: ["Mentoring", "Career Guidance"],
                    slots: generateMockSlots(),
                    reviews: [],
                    relatedMentors: [],
                });
            }
        }, 300);
    });
};
