"use client";

import React from "react";
import "./inputField.css";

import { INPUT_VARIANTS, INPUT_SIZES } from "./input.constants";

const InputField = React.forwardRef(
  (
    {
      label,
      helperText,
      error,
      variant = INPUT_VARIANTS.DEFAULT,
      size = INPUT_SIZES.MD,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const describedBy = error || helperText ? `${inputId}-desc` : undefined;

    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}

        <div className="input-container">
          {leftIcon && <span className="input-icon left">{leftIcon}</span>}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={`input-field ${variant} ${size} ${error ? "error" : ""}`}
            {...props}
          />

          {rightIcon && <span className="input-icon right">{rightIcon}</span>}
        </div>

        {(error || helperText) && (
          <span
            id={describedBy}
            className={error ? "input-error-text" : "input-helper-text"}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
