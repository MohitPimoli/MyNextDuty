import { Target, Map, Users, BookOpen, TrendingUp, Shield } from "lucide-react";

const features = [
    {
        icon: Target,
        title: "Personalized Duties",
        description:
            "Get actionable tasks tailored to your life stage, goals, and interests.",
    },
    {
        icon: Map,
        title: "Career Roadmaps",
        description:
            "Visual step-by-step paths that guide you from where you are to where you want to be.",
    },
    {
        icon: Users,
        title: "Community Support",
        description:
            "Connect with peers and mentors who share your journey and can help you grow.",
    },
    {
        icon: BookOpen,
        title: "Curated Resources",
        description:
            "Access handpicked learning materials matched to each step of your roadmap.",
    },
    {
        icon: TrendingUp,
        title: "Progress Tracking",
        description:
            "See how far you've come with streaks, achievements, and milestone markers.",
    },
    {
        icon: Shield,
        title: "Expert Mentors",
        description:
            "Book sessions with verified mentors for guidance on your specific challenges.",
    },
];

/**
 * Features section — showcases platform capabilities in a responsive grid.
 */
export default function Features() {
    return (
        <section className="px-4 py-[var(--spacing-6)] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-3xl font-bold text-text-primary sm:text-4xl">
                    Everything you need to move forward
                </h2>
                <p className="mx-auto mt-[var(--spacing-2)] max-w-2xl text-center text-text-secondary">
                    Built for every stage of your journey — from student to senior
                    professional.
                </p>

                <div className="mt-[var(--spacing-5)] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="rounded-card border border-border bg-card p-6 shadow-low transition-shadow hover:shadow-medium"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-button)] bg-primary/10">
                                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm text-text-secondary">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
