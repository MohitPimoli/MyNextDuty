"use client";

/**
 * "Forgot Password?" action link (Req 6.3).
 * Keyboard focusable and activatable via keyboard (uses <button> for semantics).
 */
const ForgotPasswordLink = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-sm text-primary hover:text-primary-hover underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label="Forgot Password"
        >
            Forgot Password?
        </button>
    );
};

export default ForgotPasswordLink;
