import React from "react";
import { cn } from "@/util/cn";

/**
 * Input primitive.
 *
 * Supports leading icon, error state with accessible description,
 * and token-based focus ring.
 */
const Input = React.forwardRef(
  (
    { className, type = "text", leadingIcon: LeadingIcon, invalid = false, reason, id, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = reason ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        <div className="relative">
          {LeadingIcon && (
            <LeadingIcon
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              aria-hidden="true"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-input border border-border bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-text-secondary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              LeadingIcon && "pl-9",
              invalid && "border-danger focus-visible:ring-danger",
              className
            )}
            aria-invalid={invalid || undefined}
            aria-describedby={errorId}
            {...props}
          />
        </div>
        {invalid && reason && (
          <p id={errorId} className="mt-1.5 text-xs text-danger" role="alert">
            {reason}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;
