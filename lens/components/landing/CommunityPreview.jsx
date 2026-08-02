import { MessageCircle, ThumbsUp, TrendingUp } from "lucide-react";

const stats = [
    { icon: MessageCircle, value: "2,500+", label: "Questions Asked" },
    { icon: ThumbsUp, value: "12,000+", label: "Helpful Answers" },
    { icon: TrendingUp, value: "800+", label: "Active Members" },
];

/**
 * Community Preview section — highlights community engagement stats.
 */
export default function CommunityPreview() {
    return (
        <section className="px-4 py-[var(--spacing-6)] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-center text-3xl font-bold text-text-primary sm:text-4xl">
                    Join a thriving community
                </h2>
                <p className="mx-auto mt-[var(--spacing-2)] max-w-xl text-center text-text-secondary">
                    Ask questions, share experiences, and learn from others on the same
                    path.
                </p>

                <div className="mt-[var(--spacing-5)] grid gap-6 sm:grid-cols-3">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center rounded-card border border-border bg-card p-6 shadow-low"
                        >
                            <Icon
                                className="mb-3 h-8 w-8 text-primary"
                                aria-hidden="true"
                            />
                            <span className="text-2xl font-bold text-text-primary">
                                {value}
                            </span>
                            <span className="mt-1 text-sm text-text-secondary">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
