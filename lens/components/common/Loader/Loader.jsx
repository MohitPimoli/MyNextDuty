import React from "react";
import { LOADER_VARIANTS, LOADER_SIZES } from "./loader.constants";
import {
  containerStyle,
  overlayStyle,
  spinnerBase,
  spinnerSizes,
  dotsWrapper,
  dot,
  barWrapper,
  bar,
} from "./loader.styles";

const Spinner = ({ size }) => {
  const sizeStyle = spinnerSizes[size];

  return (
    <div
      style={{
        ...spinnerBase,
        ...sizeStyle,
        borderColor: "#e5e7eb",
        borderTopColor: "currentColor",
      }}
    />
  );
};

const Dots = () => (
  <div style={dotsWrapper}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          ...dot,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const Bar = () => (
  <div style={barWrapper}>
    <div style={bar} />
  </div>
);

const Loader = ({
  variant = LOADER_VARIANTS.SPINNER,
  size = LOADER_SIZES.MD,
  fullscreen = false,
  color = "#2563eb",
  ariaLabel = "Loading",
}) => {
  const content = (
    <div
      role="status"
      aria-label={ariaLabel}
      style={{
        ...containerStyle,
        color,
      }}
    >
      {variant === LOADER_VARIANTS.SPINNER && <Spinner size={size} />}
      {variant === LOADER_VARIANTS.DOTS && <Dots />}
      {variant === LOADER_VARIANTS.BAR && <Bar />}
    </div>
  );

  if (!fullscreen) return content;

  return <div style={overlayStyle}>{content}</div>;
};

export default Loader;
