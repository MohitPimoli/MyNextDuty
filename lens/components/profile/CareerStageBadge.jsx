import { Badge } from "@/components/ui/Badge";
import { cn } from "@/util/cn";

/**
 * Format a raw life-stage value (e.g. "EARLY_CAREER") into a human-readable
 * label (e.g. "Early Career").
 */
const formatStage = (raw) =>
    raw
        ? raw
            .split("_")
            .map((w) => w[0] + w.slice(1).toLowerCase())
            .join(" ")
        : null;

/**
 * CareerStageBadge — displays the user's current life stage as a styled badge.
 *
 * Uses the Badge primitive. When no stage is provided, renders nothing.
 *
 * Requirements: 12.1
 *
 * @param {Object} props
 * @param {string | null} [props.stage] - the raw life-stage enum value.
 * @param {string} [props.className] - additional classes for the badge.
 */
const CareerStageBadge = ({ stage, className }) => {
    const label = formatStage(stage);

    if (!label) return null;

    return (
        <Badge variant="skill" className={cn("text-xs", className)}>
            {label}
        </Badge>
    );
};

export default CareerStageBadge;
