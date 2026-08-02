import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { ROUTE_PATHS } from "@/config/RoutePath";

/**
 *
 * Displays the main headline, subheadline, and two CTAs:
 * - "Get Started" → /register
 * - "Explore Community" → /community
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-[var(--spacing-6)] text-center sm:px-6 lg:px-8">
      {/* Background gradient decoration */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
        Know Your Next Step.
      </h1>

      <p className="mt-[var(--spacing-3)] max-w-2xl text-lg text-text-secondary sm:text-xl">
        A community-driven platform that maps your goals to actionable steps, so you always know
        what to focus on next.
      </p>

      <div className="mt-[var(--spacing-5)] flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href={ROUTE_PATHS.REGISTER}
          className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-6 text-lg font-semibold text-text-inverse shadow-medium transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Get Started
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>

        <Link
          href={ROUTE_PATHS.COMMUNITY}
          className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-button)] border border-border bg-card px-6 text-lg font-semibold text-text-primary shadow-low transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Users className="h-5 w-5" aria-hidden="true" />
          Explore Community
        </Link>
      </div>
    </section>
  );
}
