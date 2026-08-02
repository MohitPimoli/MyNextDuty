import React from "react";
import { cn } from "@/util/cn";

/**
 * Skeleton primitive.
 *
 * Animated placeholder for loading states.
 * Accept className for custom width/height.
 */
const Skeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded-card bg-muted", className)}
    aria-hidden="true"
    {...props}
  />
));

Skeleton.displayName = "Skeleton";

export { Skeleton };
export default Skeleton;
