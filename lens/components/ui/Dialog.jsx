"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/util/cn";

/**
 * Dialog (modal) component set.
 *
 * Focus-trapped modal overlay with Escape to close, backdrop click close,
 * and animated entrance.
 */

const DialogContext = React.createContext({
    open: false,
    onOpenChange: () => { },
});

const Dialog = ({ open = false, onOpenChange = () => { }, children }) => (
    <DialogContext.Provider value={{ open, onOpenChange }}>
        {children}
    </DialogContext.Provider>
);
Dialog.displayName = "Dialog";

const DialogTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext);
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
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext);
    const contentRef = useRef(null);
    const previousActiveElement = useRef(null);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape") {
                onOpenChange(false);
            }
        },
        [onOpenChange]
    );

    // Focus trap and manage body scroll
    useEffect(() => {
        if (open) {
            previousActiveElement.current = document.activeElement;
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyDown);

            // Focus first focusable element
            requestAnimationFrame(() => {
                const el = contentRef.current;
                if (el) {
                    const focusable = el.querySelector(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    focusable?.focus();
                }
            });
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            if (!open && previousActiveElement.current) {
                previousActiveElement.current.focus?.();
            }
        };
    }, [open, handleKeyDown]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
            />
            {/* Content */}
            <div
                ref={(node) => {
                    contentRef.current = node;
                    if (typeof ref === "function") ref(node);
                    else if (ref) ref.current = node;
                }}
                className={cn(
                    "relative z-50 mx-4 w-full max-w-lg rounded-dialog border border-border bg-card p-6 shadow-high",
                    "animate-dialog-in",
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
        </div>,
        document.body
    );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-lg font-semibold text-text-primary", className)}
        {...props}
    >
        {children}
    </h2>
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-text-secondary", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({ className, ...props }) => (
    <div
        className={cn("flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end", className)}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogClose = React.forwardRef(({ className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext);
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
DialogClose.displayName = "DialogClose";

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
};
