"use client";

import { useId } from "react";
import { cn } from "@/util/cn";

/**
 * "Remember Me" toggle control (Req 6.3).
 * Keyboard accessible — reachable via tab and activatable via keyboard.
 */
const RememberMe = ({ checked = false, onChange }) => {
    const id = useId();

    return (
        <div className="flex items-center gap-2">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
                className={cn(
                    "h-4 w-4 rounded border border-border bg-background",
                    "text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                    "cursor-pointer transition-colors"
                )}
                aria-label="Remember me"
            />
            <label
                htmlFor={id}
                className="text-sm text-text-secondary cursor-pointer select-none"
            >
                Remember Me
            </label>
        </div>
    );
};

export default RememberMe;
