"use client";

import { BookOpen, MessageSquare, UserPlus, UserCog } from "lucide-react";
import Link from "next/link";

import { QUICK_ACTIONS } from "@/util/dashboard";
import { ROUTE_PATHS } from "@/config/RoutePath";
import { Button } from "@/components/ui/Button";

/**
 * Map action IDs to their Lucide icons.
 */
const ACTION_ICONS = {
    "continue-learning": BookOpen,
    "ask-community": MessageSquare,
    "book-mentor": UserPlus,
    "update-profile": UserCog,
};

/**
 * Map action IDs to their navigation routes.
 */
const ACTION_ROUTES = {
    "continue-learning": ROUTE_PATHS.ROADMAP,
    "ask-community": ROUTE_PATHS.COMMUNITY,
    "book-mentor": ROUTE_PATHS.MENTORS,
    "update-profile": ROUTE_PATHS.PROFILE,
};

/**
 * QuickActions — renders the dashboard quick action buttons.
 *
 * "Continue Learning" is the single primary action (most visually prominent).
 * All others use the secondary variant (Req 7.7, 7.8).
 *
 * Requirements: 7.7, 7.8
 */
const QuickActions = () => {
    return (
        <section aria-label="Quick actions" className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
                {QUICK_ACTIONS.map((action) => {
                    const Icon = ACTION_ICONS[action.id];
                    const route = ACTION_ROUTES[action.id];

                    return (
                        <Link key={action.id} href={route || "#"}>
                            <Button
                                variant={action.variant === "primary" ? "primary" : "secondary"}
                                leftIcon={Icon}
                            >
                                {action.label}
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default QuickActions;
