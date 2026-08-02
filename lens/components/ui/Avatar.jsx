import React, { useState } from "react";
import { cn } from "@/util/cn";

/**
 * Avatar component set.
 *
 * Rounded image container with fallback support.
 */

const AvatarContext = React.createContext({ imageLoaded: true });

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => (
    <span
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    >
        {children}
    </span>
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, src, alt = "", onLoadingStatusChange, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) return null;

    return (
        <img
            ref={ref}
            src={src}
            alt={alt}
            className={cn("aspect-square h-full w-full object-cover", className)}
            onError={() => {
                setHasError(true);
                onLoadingStatusChange?.("error");
            }}
            onLoad={() => onLoadingStatusChange?.("loaded")}
            {...props}
        />
    );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => (
    <span
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-text-secondary",
            className
        )}
        {...props}
    >
        {children}
    </span>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
