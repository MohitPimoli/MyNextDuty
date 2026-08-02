import { UserPlus, Compass, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        step: "1",
        title: "Create Your Profile",
        description:
            "Tell us your life stage, interests, and goals. It takes less than 2 minutes.",
    },
    {
        icon: Compass,
        step: "2",
        title: "Get Your Roadmap",
        description:
            "We generate a personalized set of duties and a visual roadmap to guide you.",
    },
    {
        icon: CheckCircle,
        step: "3",
        title: "Take Action & Grow",
        description:
            "Complete duties, track progress, connect with mentors, and level up.",
    },
];

/**
 * How It Works section — three-step process breakdown.
 */
export default function HowItWorks() {
    return (
        <section className="bg-muted px-4 py-[var(--spacing-6)] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-center text-3xl font-bold text-text-primary sm:text-4xl">
                    How it works
                </h2>
                <p className="mx-auto mt-[var(--spacing-2)] max-w-xl text-center text-text-secondary">
                    Three simple steps to clarity.
                </p>

                <div className="mt-[var(--spacing-5)] grid gap-8 md:grid-cols-3">
                    {steps.map(({ icon: Icon, step, title, description }) => (
                        <div key={step} className="flex flex-col items-center text-center">
                            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-text-inverse shadow-medium">
                                <Icon className="h-7 w-7" aria-hidden="true" />
                                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-low">
                                    {step}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary">
                                {title}
                            </h3>
                            <p className="mt-2 max-w-xs text-sm text-text-secondary">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
