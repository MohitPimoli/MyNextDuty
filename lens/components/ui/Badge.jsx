import React from "react";
import { cn } from "@/util/cn";
import { badgeVariants } from "@/util/variants";

/**
 * Badge primitive (Req 3.7).
 *
 * Consumes `badgeVariants` from `@/util/variants` for variant styling.
 * Variants: skill, verified, new, popular.
 */
const Badge = React.forwardRef(
    ({ className, variant = "skill", children, ...props }, ref) => (
        <span
            ref={ref}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        >
            {children}
        </span>
    )
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
export default Badge;
