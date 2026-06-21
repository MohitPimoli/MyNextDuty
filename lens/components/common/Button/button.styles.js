export const baseStyle = {
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.2s ease",
};

export const variants = {
  primary: {
    background: "#2563eb",
    color: "#fff",
  },
  secondary: {
    background: "#e5e7eb",
    color: "#111827",
  },
  outline: {
    background: "transparent",
    border: "1px solid #d1d5db",
    color: "#111827",
  },
  danger: {
    background: "#dc2626",
    color: "#fff",
  },
};

export const sizes = {
  sm: {
    padding: "6px 12px",
    fontSize: "14px",
  },
  md: {
    padding: "8px 16px",
    fontSize: "16px",
  },
  lg: {
    padding: "12px 20px",
    fontSize: "18px",
  },
};

export const disabledStyle = {
  opacity: 0.6,
  cursor: "not-allowed",
};
