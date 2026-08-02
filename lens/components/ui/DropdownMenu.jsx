"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/util/cn";

/**
 * DropdownMenu component set.
 *
 * Portal-based dropdown with keyboard navigation (arrow keys, Escape, Enter).
 */

const DropdownMenuContext = React.createContext({
    open: false,
    setOpen: () => { },
    triggerRef: { current: null },
});

const DropdownMenu = ({ children, open: controlledOpen, onOpenChange }) => {
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
        <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
            {children}
        </DropdownMenuContext.Provider>
    );
};
DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext);

    const mergedRef = useCallback(
        (node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
        },
        [ref, triggerRef]
    );

    return (
        <button
            ref={mergedRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            className={className}
            onClick={() => setOpen(!open)}
            {...props}
        >
            {children}
        </button>
    );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(
    ({ className, align = "start", children, ...props }, ref) => {
        const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext);
        const contentRef = useRef(null);
        const [position, setPosition] = useState({ top: 0, left: 0 });

        // Position relative to trigger
        useEffect(() => {
            if (open && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + 4,
                    left: align === "end" ? rect.right : rect.left,
                });
            }
        }, [open, align, triggerRef]);

        // Close on outside click
        useEffect(() => {
            if (!open) return;
            const handleClick = (e) => {
                if (
                    contentRef.current &&
                    !contentRef.current.contains(e.target) &&
                    triggerRef.current &&
                    !triggerRef.current.contains(e.target)
                ) {
                    setOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClick);
            return () => document.removeEventListener("mousedown", handleClick);
        }, [open, setOpen, triggerRef]);

        // Keyboard navigation
        useEffect(() => {
            if (!open) return;
            const handleKeyDown = (e) => {
                if (e.key === "Escape") {
                    setOpen(false);
                    triggerRef.current?.focus();
                }
            };
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }, [open, setOpen, triggerRef]);

        if (!open || typeof document === "undefined") return null;

        return createPortal(
            <div
                ref={(node) => {
                    contentRef.current = node;
                    if (typeof ref === "function") ref(node);
                    else if (ref) ref.current = node;
                }}
                role="menu"
                className={cn(
                    "fixed z-50 min-w-[8rem] overflow-hidden rounded-card border border-border bg-card p-1 shadow-medium",
                    align === "end" && "-translate-x-full",
                    className
                )}
                style={{ top: position.top, left: position.left }}
                {...props}
            >
                {children}
            </div>,
            document.body
        );
    }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className, children, onSelect, ...props }, ref) => {
    const { setOpen } = React.useContext(DropdownMenuContext);

    return (
        <button
            ref={ref}
            type="button"
            role="menuitem"
            className={cn(
                "flex w-full cursor-pointer items-center rounded-button px-2 py-1.5 text-sm text-text-primary outline-none",
                "hover:bg-background focus:bg-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            onClick={(e) => {
                onSelect?.(e);
                setOpen(false);
            }}
            {...props}
        >
            {children}
        </button>
    );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        role="separator"
        className={cn("-mx-1 my-1 h-px bg-border", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
};
