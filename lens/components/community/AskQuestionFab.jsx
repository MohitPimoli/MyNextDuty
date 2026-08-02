"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { ROUTE_PATHS } from "@/config/RoutePath";
import { cn } from "@/util/cn";

/**
 * AskQuestionFab — floating action button for asking a new question.
 *
 * Remains visible (fixed position) while scrolling. When activated,
 * unauthenticated users are routed to `/login`; authenticated users get
 * the question-posting interface (currently navigates to a placeholder route).
 *
 * Requirements: 9.6, 9.7
 *
 * @param {Object} props
 * @param {string} [props.className] - additional classes
 */
const AskQuestionFab = ({ className }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleClick = () => {
        if (!isAuthenticated) {
            router.push(ROUTE_PATHS.LOGIN);
            return;
        }
        // TODO: Navigate to question-posting interface when available
        // For now, this could open a modal or navigate to a create page
        router.push(`${ROUTE_PATHS.COMMUNITY}/ask`);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label="Ask a question"
            className={cn(
                "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-text-inverse shadow-high transition-transform duration-150 hover:scale-105 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                className,
            )}
        >
            <Plus className="h-6 w-6" aria-hidden="true" />
        </button>
    );
};

export default AskQuestionFab;
