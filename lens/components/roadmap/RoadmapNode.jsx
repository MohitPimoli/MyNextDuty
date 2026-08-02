"use client";

import { CheckCircle2, Circle, Lock } from "lucide-react";

import { cn } from "@/util/cn";
import { nodeStatusToken } from "@/util/roadmap";
import MotionCard from "@/components/motion/MotionCard";

/**
 * Map a design-token name to Tailwind text/border/bg classes.
 */
const TOKEN_CLASSES = {
    success: {
        text: "text-success",
        border: "border-success",
        bg: "bg-success",
    },
    primary: {
        text: "text-primary",
        border: "border-primary",
        bg: "bg-primary",
    },
    textSecondary: {
        text: "text-text-secondary",
        border: "border-text-secondary",
        bg: "bg-text-secondary",
    },
};

/**
 * Icon for each status.
 */
const STATUS_ICONS = {
    Completed: CheckCircle2,
    Current: Circle,
    Locked: Lock,
};

/**
 * RoadmapNode — a single node in the roadmap timeline.
 *
 * Renders the node title with status-specific styling (color token, icon).
 * Supports selection via click or keyboard (Enter/Space).
 *
 * Requirements: 8.2, 8.3, 8.4, 8.5
 *
 * @param {Object} props
 * @param {import("@/util/roadmap").RoadmapNode} props.node - the roadmap node data
 * @param {boolean} props.isSelected - whether this node is currently selected
 * @param {(id: string) => void} props.onSelect - callback when the node is selected
 */
const RoadmapNode = ({ node, isSelected, onSelect }) => {
    const token = nodeStatusToken(node.status);
    const classes = TOKEN_CLASSES[token];
    const Icon = STATUS_ICONS[node.status];

    const handleClick = () => {
        onSelect(node.id);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(node.id);
        }
    };

    return (
        <MotionCard
            className={cn(
                "cursor-pointer rounded-card border-2 bg-card p-4 shadow-medium transition-colors duration-150",
                isSelected ? classes.border : "border-transparent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`${node.title} — ${node.status}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div className="flex items-center gap-3">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", classes.text)}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-text-primary">
                        {node.title}
                    </span>
                    <span className={cn("text-xs font-medium", classes.text)}>
                        {node.status}
                    </span>
                </div>
            </div>
        </MotionCard>
    );
};

export default RoadmapNode;
