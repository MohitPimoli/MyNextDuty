"use client";

import { Calendar, BookOpen, Info } from "lucide-react";

import { cn } from "@/util/cn";
import { nodeFieldEmptiness } from "@/util/roadmap";

/**
 * NodeDetailPanel — reveals estimated completion + recommended resources
 * for a selected roadmap node.
 *
 * Uses `nodeFieldEmptiness` to detect missing fields and shows an empty-state
 * indicator per field while preserving display of the available field.
 *
 * Requirements: 8.4, 8.6
 *
 * @param {Object} props
 * @param {import("@/util/roadmap").RoadmapNode} props.node - the selected node
 */
const NodeDetailPanel = ({ node }) => {
    const emptiness = nodeFieldEmptiness(node);

    return (
        <div
            className="animate-in fade-in slide-in-from-top-2 rounded-card border border-border bg-card p-4 shadow-low duration-200"
            role="region"
            aria-label={`Details for ${node.title}`}
        >
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
                {node.title} — Details
            </h3>

            {/* Estimated Completion */}
            <div className="mb-3">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-text-secondary">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Estimated Completion</span>
                </div>
                {emptiness.estimatedCompletion ? (
                    <div className="flex items-center gap-2 rounded-input bg-background px-3 py-2 text-xs text-text-secondary">
                        <Info className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>No estimate available</span>
                    </div>
                ) : (
                    <p className="rounded-input bg-background px-3 py-2 text-sm text-text-primary">
                        {node.estimatedCompletion}
                    </p>
                )}
            </div>

            {/* Recommended Resources */}
            <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-text-secondary">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Recommended Resources</span>
                </div>
                {emptiness.recommendedResources ? (
                    <div className="flex items-center gap-2 rounded-input bg-background px-3 py-2 text-xs text-text-secondary">
                        <Info className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>No resources available</span>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-1.5">
                        {node.recommendedResources.map((resource) => (
                            <li key={resource.id}>
                                <a
                                    href={resource.url}
                                    className={cn(
                                        "block rounded-input bg-background px-3 py-2 text-sm text-primary",
                                        "underline-offset-2 hover:underline",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    )}
                                >
                                    {resource.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NodeDetailPanel;
