import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Priya S.",
        role: "Early Career Professional",
        quote:
            "MyNextDuty gave me clarity when I felt completely lost after graduation. Now I always know what to work on.",
        rating: 5,
    },
    {
        name: "Rahul M.",
        role: "Career Changer",
        quote:
            "The roadmap feature is incredible. It broke down my career switch into manageable steps I could actually follow.",
        rating: 5,
    },
    {
        name: "Anita K.",
        role: "Student",
        quote:
            "I love the community. Getting real advice from mentors and peers who've been through the same phase is priceless.",
        rating: 5,
    },
];

/**
 * Testimonials section — social proof from existing users.
 */
export default function Testimonials() {
    return (
        <section className="bg-muted px-4 py-[var(--spacing-6)] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-3xl font-bold text-text-primary sm:text-4xl">
                    What our users say
                </h2>
                <p className="mx-auto mt-[var(--spacing-2)] max-w-xl text-center text-text-secondary">
                    Real stories from real people who found their next step.
                </p>

                <div className="mt-[var(--spacing-5)] grid gap-6 md:grid-cols-3">
                    {testimonials.map(({ name, role, quote, rating }) => (
                        <div
                            key={name}
                            className="flex flex-col rounded-card border border-border bg-card p-6 shadow-low"
                        >
                            <div className="mb-3 flex gap-0.5" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
                                {Array.from({ length: rating }, (_, i) => (
                                    <Star
                                        key={i}
                                        className="h-4 w-4 fill-warning text-warning"
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>
                            <p className="flex-1 text-sm text-text-secondary italic">
                                &ldquo;{quote}&rdquo;
                            </p>
                            <div className="mt-4 border-t border-border pt-4">
                                <p className="text-sm font-semibold text-text-primary">
                                    {name}
                                </p>
                                <p className="text-xs text-text-secondary">{role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
