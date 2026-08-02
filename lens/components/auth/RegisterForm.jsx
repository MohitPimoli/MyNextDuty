"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SocialLoginButtons from "./SocialLoginButtons";
import formConfig from "@/config/formConfig";
import { useAuth } from "@/hooks/useAuth";
import { retainValues, authFailureTransform } from "@/util/form";
import { ROUTE_PATHS } from "@/config/RoutePath";

/**
 * Register form component (Req 6.2, 6.4, 6.5, 6.7).
 *
 * - Signup fields from formConfig
 * - Inline validation with error messages adjacent to fields
 * - Value retention on validation failure
 * - Focus-first-invalid on failed submit
 * - Auth failure transform: retains email/username, clears password
 * - On success: navigates to login or shows success message
 */
const RegisterForm = () => {
    const fields = formConfig.signup.fields;
    const { signup, loading } = useAuth();

    const [values, setValues] = useState(() => {
        const initial = {};
        fields.forEach((f) => { initial[f.name] = ""; });
        return initial;
    });
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState("");
    const [success, setSuccess] = useState(false);

    // Refs for focus management
    const fieldRefs = useRef({});

    const setFieldRef = useCallback((name) => (el) => {
        fieldRefs.current[name] = el;
    }, []);

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
        if (authError) setAuthError("");
    };

    /**
     * Validate all fields. Returns true if valid, false otherwise.
     * On failure: sets errors, retains values (Req 6.4), focuses first invalid (Req 6.4).
     */
    const validate = () => {
        const newErrors = {};
        fields.forEach((field) => {
            const value = values[field.name] || "";
            if (field.required && !value.trim()) {
                newErrors[field.name] = `${field.label} is required`;
                return;
            }
            if (field.validation) {
                const result = field.validation(value, values);
                if (result !== true) {
                    newErrors[field.name] = result;
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            retainValues(values, newErrors);
            // Focus first invalid field (Req 6.4)
            const firstInvalid = fields.find((f) => newErrors[f.name]);
            if (firstInvalid && fieldRefs.current[firstInvalid.name]) {
                fieldRefs.current[firstInvalid.name].focus();
            }
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError("");

        if (!validate()) return;

        try {
            const { confirmPassword: _confirmPassword, ...signupPayload } = values;
            const result = await signup(signupPayload);

            if (result?.success) {
                setSuccess(true);
                // Navigate to login after a brief delay to show success
                setTimeout(() => {
                    window.location.href = ROUTE_PATHS.LOGIN;
                }, 1500);
            }
        } catch (err) {
            // Auth failure: retain email/username, clear password (Req 6.5)
            const transformed = authFailureTransform(values);
            setValues({ ...transformed, confirmPassword: "" });
            setAuthError(
                err?.response?.data?.message || err?.message || "Registration failed. Please try again."
            );
        }
    };

    if (success) {
        return (
            <div className="space-y-spacing-3 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-heading-3 font-bold text-text-primary">Account Created!</h2>
                <p className="text-body text-text-secondary">
                    Redirecting you to login...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-spacing-3">
            {/* Header */}
            <div className="space-y-spacing-1">
                <h1 className="text-heading-2 font-bold text-text-primary">
                    Create your account
                </h1>
                <p className="text-body text-text-secondary">
                    Start discovering your next step today
                </p>
            </div>

            {/* Social Login (Req 6.2) */}
            <SocialLoginButtons />

            {/* Divider */}
            <div className="relative flex items-center py-spacing-0.5">
                <div className="flex-grow border-t border-border" />
                <span className="px-3 text-xs text-text-secondary uppercase">or</span>
                <div className="flex-grow border-t border-border" />
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-spacing-2" noValidate>
                {/* Arrange name fields side by side on wider screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-spacing-2">
                    {fields
                        .filter((f) => f.name === "firstName" || f.name === "lastName")
                        .map((field) => (
                            <div key={field.name} className="space-y-1">
                                <label
                                    htmlFor={`register-${field.name}`}
                                    className="text-sm font-medium text-text-primary"
                                >
                                    {field.label}
                                    {!field.required && (
                                        <span className="text-text-secondary ml-1">(optional)</span>
                                    )}
                                </label>
                                <Input
                                    ref={setFieldRef(field.name)}
                                    id={`register-${field.name}`}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={values[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    invalid={!!errors[field.name]}
                                    reason={errors[field.name]}
                                />
                            </div>
                        ))}
                </div>

                {/* Remaining fields (single column) */}
                {fields
                    .filter((f) => f.name !== "firstName" && f.name !== "lastName")
                    .map((field) => (
                        <div key={field.name} className="space-y-1">
                            <label
                                htmlFor={`register-${field.name}`}
                                className="text-sm font-medium text-text-primary"
                            >
                                {field.label}
                            </label>
                            <Input
                                ref={setFieldRef(field.name)}
                                id={`register-${field.name}`}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={values[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                invalid={!!errors[field.name]}
                                reason={errors[field.name]}
                                autoComplete={
                                    field.name === "email"
                                        ? "email"
                                        : field.name === "password" || field.name === "confirmPassword"
                                            ? "new-password"
                                            : field.name === "username"
                                                ? "username"
                                                : "off"
                                }
                            />
                        </div>
                    ))}

                {/* Auth error message (Req 6.5) */}
                {authError && (
                    <div
                        className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
                        role="alert"
                        aria-live="assertive"
                    >
                        {authError}
                    </div>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    variant="primary"
                    size="default"
                    className="w-full"
                    loading={loading}
                    disabled={loading}
                >
                    Create Account
                </Button>
            </form>

            {/* Switch to login */}
            <p className="text-center text-sm text-text-secondary">
                Already have an account?{" "}
                <Link
                    href={ROUTE_PATHS.LOGIN}
                    className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default RegisterForm;
