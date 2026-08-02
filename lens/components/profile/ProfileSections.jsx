"use client";

import { Activity, Bookmark, Map, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/util/cn";

/**
 * Empty state message for a profile section that has no data.
 */
const SectionEmpty = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
    <Icon className="h-8 w-8 text-text-secondary/50" aria-hidden="true" />
    <p className="text-sm text-text-secondary">{message}</p>
  </div>
);

/**
 * ProfileSections — tabbed sections for Roadmap, Achievements, Activity, and Bookmarks.
 *
 * Each section shows its content when data is available, or an empty-state
 * message when no data exists for that section. Uses the Tabs
 * primitive for navigation between sections.
 *
 * Requirements: 12.2, 12.4
 *
 * @param {Object} props
 * @param {Object | null} [props.roadmap] - the user's current roadmap data.
 * @param {Array} [props.achievements] - list of achievements.
 * @param {Array} [props.activity] - list of activity items.
 * @param {Array} [props.bookmarks] - list of bookmarks.
 * @param {string} [props.className] - additional classes.
 */
const ProfileSections = ({
  roadmap = null,
  achievements = [],
  activity = [],
  bookmarks = [],
  className,
}) => {
  const hasRoadmap = roadmap !== null && roadmap !== undefined;
  const hasAchievements = Array.isArray(achievements) && achievements.length > 0;
  const hasActivity = Array.isArray(activity) && activity.length > 0;
  const hasBookmarks = Array.isArray(bookmarks) && bookmarks.length > 0;

  return (
    <Tabs defaultValue="roadmap" className={cn("w-full", className)}>
      <TabsList className="w-full justify-start gap-1 border-b border-border bg-transparent p-0">
        <TabsTrigger value="roadmap" className="gap-1.5">
          <Map className="h-3.5 w-3.5" aria-hidden="true" />
          Roadmap
        </TabsTrigger>
        <TabsTrigger value="achievements" className="gap-1.5">
          <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          Achievements
        </TabsTrigger>
        <TabsTrigger value="activity" className="gap-1.5">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          Activity
        </TabsTrigger>
        <TabsTrigger value="bookmarks" className="gap-1.5">
          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          Bookmarks
        </TabsTrigger>
      </TabsList>

      <TabsContent value="roadmap">
        {hasRoadmap ? (
          <div className="py-4">
            <p className="text-sm text-text-primary">{roadmap.title ?? "Current Roadmap"}</p>
            {roadmap.description && (
              <p className="mt-1 text-xs text-text-secondary">{roadmap.description}</p>
            )}
          </div>
        ) : (
          <SectionEmpty
            icon={Map}
            message="No roadmap assigned yet. Start your learning journey to see progress here."
          />
        )}
      </TabsContent>

      <TabsContent value="achievements">
        {hasAchievements ? (
          <ul className="space-y-2 py-4">
            {achievements.map((item, idx) => (
              <li
                key={item.id ?? idx}
                className="flex items-center gap-2 text-sm text-text-primary"
              >
                <Trophy className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                {item.title ?? item.name ?? "Achievement"}
              </li>
            ))}
          </ul>
        ) : (
          <SectionEmpty
            icon={Trophy}
            message="No achievements earned yet. Complete tasks to unlock achievements."
          />
        )}
      </TabsContent>

      <TabsContent value="activity">
        {hasActivity ? (
          <ul className="space-y-2 py-4">
            {activity.map((item, idx) => (
              <li key={item.id ?? idx} className="text-sm text-text-primary">
                {item.description ?? item.title ?? "Activity"}
              </li>
            ))}
          </ul>
        ) : (
          <SectionEmpty
            icon={Activity}
            message="No recent activity. Your actions will appear here as you use the platform."
          />
        )}
      </TabsContent>

      <TabsContent value="bookmarks">
        {hasBookmarks ? (
          <ul className="space-y-2 py-4">
            {bookmarks.map((item, idx) => (
              <li key={item.id ?? idx} className="text-sm text-text-primary">
                <Bookmark
                  className="mr-1.5 inline h-4 w-4 text-text-secondary"
                  aria-hidden="true"
                />
                {item.title ?? item.name ?? "Bookmark"}
              </li>
            ))}
          </ul>
        ) : (
          <SectionEmpty
            icon={Bookmark}
            message="No bookmarks saved yet. Save content to revisit later."
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfileSections;
