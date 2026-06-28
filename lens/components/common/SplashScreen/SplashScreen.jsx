"use client";

import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

/**
 * Animated splash screen inspired by quick-commerce apps.
 * Sequence:
 *   0 – 1.5s  → three fluid shapes dance, scale, and morph
 *   1.5 – 2.5s → shapes converge and morph into the brand mark
 *   2.5s+      → brand mark holds; parent can unmount after onDone fires
 *
 * Props:
 *   onDone  – called after the full animation completes (optional)
 */
const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState("intro"); // "intro" | "merge" | "brand"

  useEffect(() => {
    const mergeTimer = setTimeout(() => setPhase("merge"), 1500);
    const brandTimer = setTimeout(() => setPhase("brand"), 2200);
    const doneTimer  = setTimeout(() => onDone?.(), 2800);

    return () => {
      clearTimeout(mergeTimer);
      clearTimeout(brandTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`${styles.root} ${phase === "brand" ? styles.rootBrand : ""}`}
      role="status"
      aria-label="Loading MyNextDuty"
      aria-live="polite"
    >
      {/* ── SVG gooey filter — invisible, referenced by CSS filter: url(#goo) ── */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      {/* ── Fluid shapes (intro + merge phases) ── */}
      <div
        className={`${styles.shapes} ${phase === "merge" ? styles.shapesMerge : ""} ${phase === "brand" ? styles.shapesGone : ""}`}
        aria-hidden="true"
      >
        {/* Shape A — large pill, indigo */}
        <span className={`${styles.shape} ${styles.shapeA} ${phase === "merge" ? styles.shapeAMerge : ""}`} />
        {/* Shape B — circle, violet */}
        <span className={`${styles.shape} ${styles.shapeB} ${phase === "merge" ? styles.shapeBMerge : ""}`} />
        {/* Shape C — small rotated pill, sky */}
        <span className={`${styles.shape} ${styles.shapeC} ${phase === "merge" ? styles.shapeCMerge : ""}`} />
      </div>

      {/* ── Brand mark (brand phase) ── */}
      <div
        className={`${styles.brand} ${phase === "brand" ? styles.brandVisible : ""}`}
        aria-hidden="true"
      >
        {/* SVG logomark — stylised "N" made of the same pill shapes */}
        <svg
          className={styles.logo}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Left vertical bar */}
          <rect x="8" y="10" width="12" height="44" rx="6" fill="url(#g1)" />
          {/* Diagonal connector */}
          <rect
            x="8" y="10" width="12" height="52"
            rx="6"
            fill="url(#g2)"
            transform="rotate(-22 32 32) translate(4 0)"
          />
          {/* Right vertical bar */}
          <rect x="44" y="10" width="12" height="44" rx="6" fill="url(#g1)" />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <span className={styles.wordmark}>MyNextDuty</span>
      </div>
    </div>
  );
};

export default SplashScreen;
