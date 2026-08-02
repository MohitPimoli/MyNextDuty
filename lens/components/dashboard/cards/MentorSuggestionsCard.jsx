"use client";

import { Users } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import StateRenderer from "@/components/common/StateRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * Placeholder fetcher that simulates loading mentor suggestions.
 */
const fetchMentorSuggestions = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mentors: [
          { name: "Sarah Chen", specialty: "Career Transitions" },
          { name: "James Rivera", specialty: "Financial Planning" },
        ],
      });
    }, 650);
  });

/**
 * MentorSuggestionsCard — shows suggested mentors for the user.
 *
 * Wraps StateRenderer for loading/empty/error states.
 */
const MentorSuggestionsCard = () => {
  const { status, data, error, showSkeleton, retry } = useAsyncData(fetchMentorSuggestions, null);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          Mentor Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StateRenderer
          status={status}
          data={data}
          error={error}
          retry={retry}
          showSkeleton={showSkeleton}
          loadingProps={{ lines: 2, ariaLabel: "Loading mentor suggestions" }}
          emptyProps={{
            message: "No mentor suggestions available.",
            ctaLabel: "Browse Mentors",
            onCta: () => {},
          }}
          errorProps={{ contentLabel: "mentor suggestions" }}
        >
          {(suggestions) => (
            <ul className="flex flex-col gap-2">
              {suggestions.mentors.map((mentor) => (
                <li
                  key={mentor.name}
                  className="flex items-center justify-between rounded-input bg-background p-2"
                >
                  <span className="text-sm font-medium text-text-primary">{mentor.name}</span>
                  <span className="text-xs text-text-secondary">{mentor.specialty}</span>
                </li>
              ))}
            </ul>
          )}
        </StateRenderer>
      </CardContent>
    </Card>
  );
};

export default MentorSuggestionsCard;
