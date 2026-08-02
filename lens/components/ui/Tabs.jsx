"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/util/cn";

/**
 * Tabs component set.
 *
 * Lightweight accessible tabs with keyboard navigation and token-based styling.
 */

const TabsContext = React.createContext({
    value: "",
    onValueChange: () => { },
});

const Tabs = ({ defaultValue = "", value: controlledValue, onValueChange, className, children, ...props }) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = useCallback(
        (newValue) => {
            if (controlledValue === undefined) {
                setInternalValue(newValue);
            }
            onValueChange?.(newValue);
        },
        [controlledValue, onValueChange]
    );

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
            <div className={className} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        role="tablist"
        className={cn(
            "inline-flex h-10 items-center justify-center gap-1 rounded-card bg-background p-1",
            className
        )}
        {...props}
    >
        {children}
    </div>
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext);
    const isActive = activeValue === value;

    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-button px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                    ? "bg-card text-text-primary shadow-low"
                    : "text-text-secondary hover:text-text-primary",
                className
            )}
            onClick={() => onValueChange(value)}
            {...props}
        >
            {children}
        </button>
    );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
    const { value: activeValue } = React.useContext(TabsContext);

    if (activeValue !== value) return null;

    return (
        <div
            ref={ref}
            role="tabpanel"
            tabIndex={0}
            className={cn("mt-2 focus-visible:outline-none", className)}
            {...props}
        >
            {children}
        </div>
    );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
