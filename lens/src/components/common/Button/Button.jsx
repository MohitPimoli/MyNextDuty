import React from "react";
import { baseStyle, variants, sizes, disabledStyle } from "./button.styles";
import { BUTTON_VARIANTS, BUTTON_SIZES } from "./button.constants";

const Button = React.forwardRef(
  (
    {
      children,
      variant = BUTTON_VARIANTS.PRIMARY,
      size = BUTTON_SIZES.MD,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      as: Component = "button",
      style,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Component
        ref={ref}
        style={{
          ...baseStyle,
          ...variants[variant],
          ...sizes[size],
          ...(isDisabled ? disabledStyle : {}),
          ...style,
        }}
        disabled={Component === "button" ? isDisabled : undefined}
        aria-busy={loading}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
