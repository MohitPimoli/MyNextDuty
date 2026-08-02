"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/util/cn";

/**
 * Tooltip component set.
 *
 * Lightweight portal-based tooltip with hover/focus activation.
 */

const TooltipProviderContext = React.createContext({ delayDuration: 300 });

const TooltipProvider = ({ delayDuration = 300, children }) => (
    <TooltipProviderContext.Provider value={{ delayDuration }}>
        {children}
    </TooltipProviderContext.Provider>
);
TooltipProvider.displayName = "TooltipProvider";

const TooltipContext = React.createContext({
    open: false,
    setOpen: () => { },
    triggerRef: { current: null },
});

const Tooltip = ({ children, open: controlledOpen, onOpenChange }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const triggerRef = useRef(null);

    const setOpen = useCallback(
        (value) => {
            if (controlledOpen === undefined) setInternalOpen(value);
            onOpenChange?.(value);
        },
        [controlledOpen, onOpenChange]
    );

    return (
        <TooltipContext.Provider value={{ open, setOpen, triggerRef }}>
            {children}
        </TooltipContext.Provider>
    );
};
Tooltip.displayName = "Tooltip";

const TooltipTrigger = React.forwardRef(({ className, children, asChild: _asChild, ...props }, ref) => {
    const { setOpen, triggerRef } = React.useContext(TooltipContext);
    const { delayDuration } = React.useContext(TooltipProviderContext);
    const timeoutRef = useRef(null);

    const mergedRef = useCallback(
        (node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
        },
        [ref, triggerRef]
    );

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutRef.current);
        setOpen(false);
    };

    return (
        <span
            ref={mergedRef}
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            {...props}
        >
            {children}
        </span>
    );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(({ className, children, side = "top", ...props }, _ref) => {
    const { open, triggerRef } = React.useContext(TooltipContext);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const contentRef = useRef(null);

    useEffect(() => {
        if (open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const offset = 8;

            let top, left;
            switch (side) {
                case "bottom":
                    top = rect.bottom + offset;
                    left = rect.left + rect.width / 2;
                    break;
                case "left":
                    top = rect.top + rect.height / 2;
                    left = rect.left - offset;
                    break;
                case "right":
                    top = rect.top + rect.height / 2;
                    left = rect.right + offset;
                    break;
                default: // top
                    top = rect.top - offset;
                    left = rect.left + rect.width / 2;
            }
            setPosition({ top, left });
        }
    }, [open, side, triggerRef]);

    if (!open || typeof document === "undefined") return null;

    const transformClasses = {
        top: "-translate-x-1/2 -translate-y-full",
        bottom: "-translate-x-1/2",
        left: "-translate-x-full -translate-y-1/2",
        right: "-translate-y-1/2",
    };

    return createPortal(
        <div
            ref={contentRef}
            role="tooltip"
            className={cn(
                "fixed z-50 rounded-button bg-card px-3 py-1.5 text-xs text-text-primary shadow-medium border border-border",
                transformClasses[side] || transformClasses.top,
                className
            )}
            style={{ top: position.top, left: position.left }}
            {...props}
        >
            {children}
        </div>,
        document.body
    );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
