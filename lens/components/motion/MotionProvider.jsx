"use client";

import { MotionConfig } from "motion/react";

/**
 * Client-boundary wrapper around Framer Motion's MotionConfig.
 *
 * Sets `reducedMotion="user"` so that when the OS requests reduced motion,
 * all motion animations are disabled while content and state changes still
 * render correctly (Req 18.4).
 *
 * This wrapper exists because MotionConfig uses client hooks internally, and
 * the root layout remains a server component. Importing this client component
 * into a server component is fine per Next.js App Router conventions.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
const MotionProvider = ({ children }) => (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export default MotionProvider;
