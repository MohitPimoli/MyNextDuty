import {useState} from "react";
import "./style.scss";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import formConfig from "../../config/formConfig";
import {useAuth} from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import {Footer} from "../../components/Hooter/Footer";
import {BUTTON_VARIANTS} from "../../components/common/Button/button.constants";

const showLaunchNotice = import.meta.env.DEV || import.meta.env.VITE_SHOW_LAUNCH_NOTICE === "true";

const buildInitialValues = (mode) => {
  const values = {};
  formConfig[mode].fields.forEach((field) => {
    values[field.name] = "";
  });
  return values;
};

export const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState(buildInitialValues("login"));
  const [errors, setErrors] = useState({});

  const { login, signup, loading, error } = useAuth();
  const fields = formConfig[mode].fields;

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = values[field.name] || "";
      if (field.required && !value) {
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
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (mode === "login") {
        await login(values);
      } else {
        const { confirmPassword: _confirmPassword, ...signupPayload } = values;
        const result = await signup(signupPayload);
        // If signup is successful, switch to log in mode
        if (result?.success) {
          switchMode("login");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setValues(buildInitialValues(nextMode));
    setErrors({});
  };

  return (
    <>
      <div className="auth-page">
        {showLaunchNotice && (
          <div className="auth-launch-notice" role="status" aria-live="polite">
            <span className="auth-launch-notice__badge">Preview</span>
            <p className="auth-launch-notice__title">We&apos;re not live yet</p>
            <p className="auth-launch-notice__text">
              MyNextDuty is still in active development. You can explore the app, but things may
              change. A full public launch is coming soon — thanks for stopping by.
            </p>
          </div>
        )}
        <p className="auth-subtitle">
          Find clarity in your <span>next step</span>
        </p>
        {/* ===== FORM CARD ===== */}
        <div className="auth-card">
          <h2 className="auth-heading">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {fields.map((field) => (
              <InputField
                key={field.name}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.name]}
                error={errors[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ))}
            {mode === "login" && <div className="auth-forgot">Forgot password?</div>}
            <Button type="submit" disabled={loading} variant={BUTTON_VARIANTS.SECONDARY}>
              {loading ? <Loader size="sm" /> : mode === "login" ? "Log In" : "Create Account"}
            </Button>
            {error && <p className="auth-error">{error}</p>}
            <div className="auth-divider" />
            <div className="auth-switch">
              {mode === "login" ? (
                <Button type="button" onClick={() => switchMode("signup")}>
                  New here? Create an account
                </Button>
              ) : (
                <Button type="button" onClick={() => switchMode("login")}>
                  Back to login
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthPage;
