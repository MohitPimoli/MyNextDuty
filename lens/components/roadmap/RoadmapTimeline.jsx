"use client";

import { useState } from "react";

import { orderNodes } from "@/util/roadmap";
import RoadmapNode from "./RoadmapNode";
import NodeDetailPanel from "./NodeDetailPanel";

/**
 * RoadmapTimeline — renders the full roadmap as a top-to-bottom sequence of
 * connected nodes with a vertical connector between each adjacent pair.
 *
 * Manages selected-node state internally. When a node is selected, the
 * NodeDetailPanel is rendered directly below it showing estimate + resources.
 *
 * Requirements: 8.1, 8.4, 8.5
 *
 * @param {Object} props
 * @param {import("@/util/roadmap").RoadmapNode[]} props.nodes - unordered roadmap nodes
 */
const RoadmapTimeline = ({ nodes }) => {
    const [selectedId, setSelectedId] = useState(null);

    const sorted = orderNodes(nodes);

    const handleSelect = (id) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="flex flex-col items-center" role="list" aria-label="Roadmap timeline">
            {sorted.map((node, index) => {
                const isSelected = selectedId === node.id;
                const isLast = index === sorted.length - 1;

                return (
                    <div key={node.id} className="flex w-full max-w-md flex-col items-center" role="listitem">
                        {/* Node */}
                        <div className="w-full">
                            <RoadmapNode
                                node={node}
                                isSelected={isSelected}
                                onSelect={handleSelect}
                            />
                        </div>

                        {/* Detail panel (shown when selected) */}
                        {isSelected && (
                            <div className="mt-2 w-full">
                                <NodeDetailPanel node={node} />
                            </div>
                        )}

                        {/* Connector between adjacent nodes */}
                        {!isLast && (
                            <div
                                className="my-2 h-8 w-0.5 bg-border"
                                aria-hidden="true"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default RoadmapTimeline;
