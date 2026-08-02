import { CheckCircle2, Circle, Lock } from "lucide-react";

const nodes = [
    { status: "completed", label: "Create Profile", icon: CheckCircle2 },
    { status: "completed", label: "Set Goals", icon: CheckCircle2 },
    { status: "current", label: "Build Emergency Fund", icon: Circle },
    { status: "locked", label: "Start Investing", icon: Lock },
    { status: "locked", label: "Career Growth Plan", icon: Lock },
];

/**
 * Roadmap Preview section — visual teaser of the roadmap feature.
 */
export default function RoadmapPreview() {
    return (
        <section className="px-4 py-[var(--spacing-6)] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h2 className="text-center text-3xl font-bold text-text-primary sm:text-4xl">
                    Your journey, visualized
                </h2>
                <p className="mx-auto mt-[var(--spacing-2)] max-w-xl text-center text-text-secondary">
                    See exactly where you are and what comes next with interactive
                    roadmaps.
                </p>

                <div className="mt-[var(--spacing-5)] flex flex-col items-center gap-0">
                    {nodes.map(({ status, label, icon: Icon }, index) => (
                        <div key={label} className="flex flex-col items-center">
                            {/* Connector line above (except first node) */}
                            {index > 0 && (
                                <div
                                    className={`h-8 w-0.5 ${status === "completed" ? "bg-success" : "bg-border"
                                        }`}
                                    aria-hidden="true"
                                />
                            )}

                            {/* Node */}
                            <div
                                className={`flex items-center gap-3 rounded-card border px-5 py-3 shadow-low ${status === "completed"
                                        ? "border-success/30 bg-success/5"
                                        : status === "current"
                                            ? "border-primary/30 bg-primary/5 ring-2 ring-primary/20"
                                            : "border-border bg-card opacity-60"
                                    }`}
                            >
                                <Icon
                                    className={`h-5 w-5 ${status === "completed"
                                            ? "text-success"
                                            : status === "current"
                                                ? "text-primary"
                                                : "text-text-secondary"
                                        }`}
                                    aria-hidden="true"
                                />
                                <span
                                    className={`text-sm font-medium ${status === "locked"
                                            ? "text-text-secondary"
                                            : "text-text-primary"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
