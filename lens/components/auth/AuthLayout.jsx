"use client";

import { cn } from "@/util/cn";

/**
 * Auth screen split layout
 *
 * Full-viewport standalone layout — no navigation bar or footer.
 * At desktop (≥1280px / xl breakpoint): illustration region (left) + form region (right)
 * side by side, form occupies ~50% width.
 * At mobile (<1280px): single column, illustration hidden.
 */
const AuthLayout = ({ children, illustration }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Illustration region — visible only at desktop (xl+) */}
      <div
        className={cn(
          "hidden xl:flex xl:w-1/2 items-center justify-center",
          "bg-linear-to-br from-primary/10 via-primary/5 to-background",
          "p-spacing-6"
        )}
        aria-hidden="true"
      >
        {illustration || <DefaultIllustration />}
      </div>

      {/* Form region — full width on mobile, ~50% at desktop */}
      <div
        className={cn(
          "flex w-full xl:w-1/2 items-center justify-center",
          "px-spacing-2 py-spacing-4 sm:px-spacing-3 md:px-spacing-4"
        )}
      >
        <div className="w-full max-w-md space-y-spacing-3">{children}</div>
      </div>
    </div>
  );
};

/**
 * Default illustration for the auth screen left panel.
 */
const DefaultIllustration = () => (
  <div className="flex flex-col items-center text-center gap-2 max-w-sm">
    <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
      <svg
        className="w-24 h-24 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    </div>
    <h1 className="text-heading-1 font-bold text-text-primary">Know Your Next Step</h1>
    <p className="text-body text-text-secondary">
      Join thousands of users who have found clarity in their career journey with MyNextDuty.
    </p>
  </div>
);

export default AuthLayout;
