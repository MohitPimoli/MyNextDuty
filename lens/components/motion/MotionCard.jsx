"use client";

import { motion } from "motion/react";

/**
 * Duration in seconds matching the --motion-hover-duration design token (180ms).
 * Framer Motion requires duration in seconds, so we mirror the CSS token value.
 */
const HOVER_DURATION = 0.18;

/**
 * Interactive card wrapper with hover-scale animation.
 *
 * On pointer hover the card scales to 1.03 over 180ms, and on pointer leave it
 * returns to scale 1.0 in the same duration. This satisfies:
 *   - Req 18.2: scale between 1.0–1.05, completes within 100–250ms
 *   - Req 18.3: returns to original scale within 100–250ms
 *
 * The component forwards all additional props and renders children inside a
 * `motion.div`, making it a drop-in wrapper for any card content.
 *
 * Reduced-motion behavior is handled at the MotionConfig level (wired in the
 * root layout in a separate task), which disables transforms automatically
 * when the OS requests reduced motion (Req 18.4).
 *
 * Validates: Requirements 18.2, 18.3
 *
 * @param {{ children: React.ReactNode, className?: string, [key: string]: any }} props
 * @returns {JSX.Element}
 */
const MotionCard = ({ children, className, ...props }) => {
    return (
        <motion.div
            className={className}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: HOVER_DURATION, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default MotionCard;
