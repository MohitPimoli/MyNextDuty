import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/util/cn";
import { buttonVariants } from "@/util/variants";

/**
 * Button primitive.
 *
 * Consumes `buttonVariants` from `@/util/variants` for variant styling.
 * Supports loading state, left/right icons, and multiple sizes.
 */
const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "default",
      asChild = false,
      loading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant }),
          sizeClasses[size] || sizeClasses.default,
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {!loading && LeftIcon && <LeftIcon className="h-4 w-4" aria-hidden="true" />}
        {children}
        {!loading && RightIcon && <RightIcon className="h-4 w-4" aria-hidden="true" />}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
