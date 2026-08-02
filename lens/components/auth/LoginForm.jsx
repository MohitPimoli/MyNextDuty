"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SocialLoginButtons from "./SocialLoginButtons";
import RememberMe from "./RememberMe";
import ForgotPasswordLink from "./ForgotPasswordLink";
import formConfig from "@/config/formConfig";
import { useAuth } from "@/hooks/useAuth";
import { authFailureTransform, retainValues } from "@/util/form";
import { ROUTE_PATHS } from "@/config/RoutePath";

/**
 * Login form component
 *
 * - Inline validation with error messages adjacent to fields
 * - Value retention on validation failure
 * - Focus-first-invalid on failed submit
 * - Auth failure transform: retains email, clears password
 * - On success: useAuth().login() handles navigation to dashboard
 */
const LoginForm = () => {
  const fields = formConfig.login.fields;
  const { login, loading } = useAuth();

  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.name] = "";
    });
    return initial;
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Derive whether both fields are valid for showing RememberMe
  const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(values.email || "");
  const isPasswordValid = (values.password || "").length >= 6;
  const showRememberMe = isEmailValid && isPasswordValid;

  // Refs for focus management
  const fieldRefs = useRef({});

  const setFieldRef = useCallback(
    (name) => (el) => {
      fieldRefs.current[name] = el;
    },
    []
  );

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear inline error for this field as user types
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
   * On failure: sets errors, retains values, focuses first invalid .
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
      // Use retainValues from util/form.js for state consistency
      retainValues(values, newErrors);
      // Focus first invalid field
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
      await login(values);
      // On success, useAuth handles navigation to ROUTE_PATHS.HOME
    } catch (err) {
      // Auth failure: retain email, clear password
      const transformed = authFailureTransform(values);
      setValues(transformed);
      setAuthError(
        err?.response?.data?.message || err?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 space-y-spacing-3">
      {/* Header */}
      <div className="space-y-spacing-1">
        <h1 className="text-3xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-xl text-text-secondary">Sign in to continue your journey</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 space-y-spacing-2" noValidate>
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-0.5 space-y-1">
            <label
              htmlFor={`login-${field.name}`}
              className="text-sm font-medium text-text-primary"
            >
              {field.label}
            </label>
            <Input
              ref={setFieldRef(field.name)}
              id={`login-${field.name}`}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              invalid={!!errors[field.name]}
              reason={errors[field.name]}
              autoComplete={field.name === "email" ? "email" : "current-password"}
            />
          </div>
        ))}

        {/* Remember Me + Forgot Password row */}
        <div className="flex items-center justify-between">
          {showRememberMe && <RememberMe checked={rememberMe} onChange={setRememberMe} />}
          <ForgotPasswordLink onClick={() => {}} />
        </div>

        {/* Auth error message */}
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
          Log In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center py-spacing-0.5">
        <div className="grow border-t border-border" />
        <span className="px-3 text-xs text-text-secondary uppercase">Or continue with</span>
        <div className="grow border-t border-border" />
      </div>

      {/* Social Login  */}
      <SocialLoginButtons />

      {/* Switch to register */}
      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTE_PATHS.REGISTER}
          className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
