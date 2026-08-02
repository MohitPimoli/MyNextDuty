import { toast } from "react-toastify";
import { clampAutoClose } from "@/util/toastConfig";

/*
 * Shared toast presentation (Requirements 15.4, 15.5, 15.6).
 *
 * All toasts render top-right (15.4), auto-close within the bounded
 * [3000, 10000]ms range via clampAutoClose (15.5), and remain manually
 * dismissible through react-toastify's close control (15.6). Styling
 * references design-system tokens (surfaces, text, radius, elevation,
 * semantic accent border) rather than literal color/size values so toasts
 * track the active theme.
 */

// Token-based surface shared by every toast kind.
const baseClassName =
  "bg-card text-text-primary rounded-card shadow-high border border-border";

// Semantic accent applied per kind using the design-system color tokens.
const accentClassName = {
  success: "border-l-4 border-l-success",
  error: "border-l-4 border-l-danger",
  info: "border-l-4 border-l-primary",
  warning: "border-l-4 border-l-warning",
};

const buildOptions = (kind, autoClose) => ({
  position: "top-right",
  autoClose: clampAutoClose(autoClose),
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  className: `${baseClassName} ${accentClassName[kind]}`,
});

const toastService = {
  success(message, autoClose) {
    toast.success(message, buildOptions("success", autoClose));
  },

  error(message, autoClose) {
    toast.error(message, buildOptions("error", autoClose ?? 7000));
  },

  info(message, autoClose) {
    toast.info(message, buildOptions("info", autoClose));
  },

  warning(message, autoClose) {
    toast.warning(message, buildOptions("warning", autoClose ?? 6000));
  },
};

export default toastService;
