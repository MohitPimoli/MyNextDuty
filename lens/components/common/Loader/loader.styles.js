export const containerStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.6)",
  zIndex: 9999,
};

export const spinnerBase = {
  borderRadius: "50%",
  borderStyle: "solid",
  animation: "spin 1s linear infinite",
};

export const spinnerSizes = {
  sm: { width: 16, height: 16, borderWidth: 2 },
  md: { width: 24, height: 24, borderWidth: 3 },
  lg: { width: 40, height: 40, borderWidth: 4 },
};

export const dotsWrapper = {
  display: "flex",
  gap: "6px",
};

export const dot = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "currentColor",
  animation: "bounce 1.4s infinite both",
};

export const barWrapper = {
  width: "100%",
  height: 4,
  background: "#e5e7eb",
  overflow: "hidden",
  borderRadius: 4,
};

export const bar = {
  width: "40%",
  height: "100%",
  background: "currentColor",
  animation: "slide 1.2s infinite",
};
