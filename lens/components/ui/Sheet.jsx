"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/util/cn";

/**
 * Sheet (slide-in drawer) component set (Req 3.9).
 *
 * Lightweight custom implementation for mobile navigation drawer.
 * Supports left/right slide, focus trapping, and Escape to close.
 */

const SheetContext = React.createContext({
    open: false,
    onOpenChange: () => { },
});

const Sheet = ({ open = false, onOpenChange = () => { }, children }) => (
    <SheetContext.Provider value={{ open, onOpenChange }}>
        {children}
    </SheetContext.Provider>
);

const SheetTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(SheetContext);
    return (
        <button
            ref={ref}
            type="button"
            className={className}
            onClick={() => onOpenChange(true)}
            {...props}
        >
            {children}
        </button>
    );
});
SheetTrigger.displayName = "SheetTrigger";

const SheetContent = React.forwardRef(
    ({ className, side = "right", children, ...props }, ref) => {
        const { open, onOpenChange } = React.useContext(SheetContext);
        const contentRef = useRef(null);
        const mergedRef = ref || contentRef;

        const handleKeyDown = useCallback(
            (e) => {
                if (e.key === "Escape") {
                    onOpenChange(false);
                }
            },
            [onOpenChange]
        );

        // Focus trap: focus content when opened
        useEffect(() => {
            if (open) {
                const el =
                    typeof mergedRef === "object" ? mergedRef.current : contentRef.current;
                if (el) {
                    const focusable = el.querySelector(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    focusable?.focus();
                }
                document.addEventListener("keydown", handleKeyDown);
                document.body.style.overflow = "hidden";
            }
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.body.style.overflow = "";
            };
        }, [open, handleKeyDown, mergedRef]);

        if (!open) return null;

        const slideClasses = {
            left: "inset-y-0 left-0 w-3/4 max-w-sm animate-slide-in-left",
            right: "inset-y-0 right-0 w-3/4 max-w-sm animate-slide-in-right",
        };

        const content = (
            <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => onOpenChange(false)}
                    aria-hidden="true"
                />
                {/* Panel */}
                <div
                    ref={mergedRef}
                    className={cn(
                        "fixed z-50 flex flex-col gap-4 bg-card p-6 shadow-high border-border",
                        slideClasses[side] || slideClasses.right,
                        className
                    )}
                    {...props}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 rounded-button p-1 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    {children}
                </div>
            </div>
        );

        if (typeof document === "undefined") return null;
        return createPortal(content, document.body);
    }
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col gap-2", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-lg font-semibold text-text-primary", className)}
        {...props}
    >
        {children}
    </h2>
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-text-secondary", className)}
        {...props}
    />
));
SheetDescription.displayName = "SheetDescription";

const SheetClose = React.forwardRef(({ className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(SheetContext);
    return (
        <button
            ref={ref}
            type="button"
            className={className}
            onClick={() => onOpenChange(false)}
            {...props}
        >
            {children}
        </button>
    );
});
SheetClose.displayName = "SheetClose";

export {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
};
