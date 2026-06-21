"use client";

import React, { useEffect } from "react";
import "./style.scss";

const Dialog = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = "medium",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  ...props
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`dialog-overlay ${isOpen ? "dialog-overlay--open" : ""}`}
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleOverlayClick(e);
        }
      }}
      role="button"
      tabIndex={-1}
    >
      <div className={`dialog dialog--${size} ${className}`} {...props}>
        {(title || showCloseButton) && (
          <div className="dialog__header">
            {title && <h2 className="dialog__title">{title}</h2>}
            {showCloseButton && onClose && (
              <button className="dialog__close" onClick={onClose} aria-label="Close dialog">
                ×
              </button>
            )}
          </div>
        )}

        <div className="dialog__content">{children}</div>

        {footer && <div className="dialog__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Dialog;
