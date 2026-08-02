/**
 * Pure roadmap logic for the lens frontend (DOM-independent).
 *
 * Encodes roadmap node ordering, the exactly-one-Current invariant helper, the
 * status-to-design-token mapping, and per-field empty-state detection so the
 * Roadmap page (timeline, nodes, and detail panel) can be unit- and
 * property-tested without rendering.
 *
 * The status token names align with the color tokens defined in
 * `util/designTokens.js`: Completed → "success", Current → "primary",
 * Locked → "textSecondary" (the muted/secondary text token).
 *
 * @typedef {"Completed" | "Current" | "Locked"} RoadmapNodeStatus
 *
 * @typedef {Object} Resource
 * @property {string} id
 * @property {string} label
 * @property {string} url
 *
 * @typedef {Object} RoadmapNode
 * @property {string} id
 * @property {string} title
 * @property {number} order
 * @property {RoadmapNodeStatus} status
 * @property {string | null} estimatedCompletion
 * @property {Resource[]} recommendedResources
 *
 * Requirements: 8.1, 8.2, 8.3, 8.5, 8.6
 */

/**
 * The design-token name each roadmap status maps to (Req 8.2, 8.3).
 *
 * Each status maps to a distinct token so Completed, Current, and Locked nodes
 * are visually distinguishable from one another.
 *
 * @type {Readonly<Record<"Completed" | "Current" | "Locked", string>>}
 */
export const STATUS_TOKENS = Object.freeze({
    Completed: "success",
    Current: "primary",
    Locked: "textSecondary",
});

/**
 * Return roadmap nodes sorted top-to-bottom by their `order` field, ascending
 * (Req 8.1).
 *
 * This is a pure, non-mutating operation: the input array is copied before
 * sorting, so the caller's array (and its ordering) is left untouched. The
 * sort is stable, so nodes sharing the same `order` keep their relative input
 * order. Non-array input yields an empty array.
 *
 * @param {ReadonlyArray<RoadmapNode>} nodes - the roadmap nodes
 * @returns {RoadmapNode[]} a new array ordered by ascending `order`
 */
export const orderNodes = (nodes) => {
    if (!Array.isArray(nodes)) {
        return [];
    }
    return [...nodes].sort((a, b) => a.order - b.order);
};

/**
 * Count the roadmap nodes whose status is "Current" (Req 8.5).
 *
 * Used to enforce the exactly-one-Current invariant: a non-empty roadmap
 * should return exactly 1. Non-array input yields 0.
 *
 * @param {ReadonlyArray<RoadmapNode>} nodes - the roadmap nodes
 * @returns {number} the number of nodes with status "Current"
 */
export const currentNodeCount = (nodes) => {
    if (!Array.isArray(nodes)) {
        return 0;
    }
    return nodes.reduce(
        (count, node) => (node && node.status === "Current" ? count + 1 : count),
        0,
    );
};

/**
 * Map a roadmap node status to its distinct design-token name (Req 8.2, 8.3).
 *
 * Completed → "success", Current → "primary", Locked → "textSecondary". Each
 * status maps to a distinct token. An unknown or unsupported status is
 * rejected so misconfigured data surfaces during development rather than
 * silently rendering an unstyled node.
 *
 * @param {RoadmapNodeStatus} status - the node status
 * @returns {string} the design-token name for that status
 * @throws {Error} if the status is not one of Completed | Current | Locked
 */
export const nodeStatusToken = (status) => {
    if (!Object.prototype.hasOwnProperty.call(STATUS_TOKENS, status)) {
        const known = Object.keys(STATUS_TOKENS).join(", ");
        throw new Error(
            `Unknown roadmap node status "${status}". Expected one of: ${known}.`,
        );
    }
    return STATUS_TOKENS[status];
};

/**
 * Report per-field emptiness for a roadmap node's detail fields (Req 8.6).
 *
 * A field is "empty" when it has no usable value, so the detail panel can show
 * an empty-state indicator for that field while still rendering any field that
 * does have a value:
 *   - `estimatedCompletion` is empty when it is null/undefined or a
 *     blank/whitespace-only string.
 *   - `recommendedResources` is empty when it is not an array or an empty
 *     array.
 *
 * Non-object input is treated as having both fields empty.
 *
 * @param {RoadmapNode} node - the roadmap node
 * @returns {{ estimatedCompletion: boolean, recommendedResources: boolean }}
 *   per-field emptiness, where `true` means the field is empty
 */
export const nodeFieldEmptiness = (node) => {
    const source = node && typeof node === "object" ? node : {};

    const estimate = source.estimatedCompletion;
    const estimatedCompletionEmpty =
        typeof estimate !== "string" || estimate.trim().length === 0;

    const resources = source.recommendedResources;
    const recommendedResourcesEmpty =
        !Array.isArray(resources) || resources.length === 0;

    return {
        estimatedCompletion: estimatedCompletionEmpty,
        recommendedResources: recommendedResourcesEmpty,
    };
};
