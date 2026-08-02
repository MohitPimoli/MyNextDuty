import Link from "next/link";
import { ROUTE_PATHS } from "@/config/RoutePath";

const footerLinks = [
    { label: "Community", href: ROUTE_PATHS.COMMUNITY },
    { label: "Mentors", href: ROUTE_PATHS.MENTORS },
    { label: "Login", href: ROUTE_PATHS.LOGIN },
    { label: "Register", href: ROUTE_PATHS.REGISTER },
];

/**
 * Landing Footer section — lightweight footer for the public landing page.
 */
export default function LandingFooter() {
    return (
        <footer className="border-t border-border bg-card px-4 py-[var(--spacing-5)] sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm font-semibold text-text-primary">
                    MyNextDuty
                </p>

                <nav aria-label="Footer navigation">
                    <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        {footerLinks.map(({ label, href }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className="text-sm text-text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <p className="text-xs text-text-secondary">
                    &copy; {new Date().getFullYear()} MyNextDuty. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
