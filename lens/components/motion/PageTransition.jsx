"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

/**
 * Duration in seconds matching the --motion-page-duration design token (300ms).
 * Framer Motion requires duration in seconds, so we mirror the CSS token value.
 */
const PAGE_DURATION = 0.3;

/**
 * Page-level transition wrapper.
 *
 * Wraps page content in a `motion.div` that fades in (opacity 0→1) and slides
 * up (y offset → 0) on navigation. The component is keyed by the current
 * pathname so that navigating to a new route triggers AnimatePresence to
 * unmount the old page and mount the new one with a fresh entrance animation.
 *
 * AnimatePresence `mode="wait"` ensures that if a navigation fires mid-
 * transition, the outgoing animation completes (or is interrupted gracefully)
 * before the incoming page animates in.
 *
 * Duration and offset are driven by design tokens defined in index.css:
 *   --motion-page-duration: 300ms (within the 200–400ms requirement)
 *   --motion-page-offset: 24px (max incoming translate)
 *
 * Validates: Requirements 18.1, 18.5
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
const PageTransition = ({ children }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: "var(--motion-page-offset)" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "var(--motion-page-offset)" }}
        transition={{ duration: PAGE_DURATION, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
