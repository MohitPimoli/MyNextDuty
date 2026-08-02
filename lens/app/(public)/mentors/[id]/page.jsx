"use client";

import { useParams } from "next/navigation";
import { User } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { TIMEOUTS } from "@/util/asyncState";
import StateRenderer from "@/components/common/StateRenderer";
import PageContainer from "@/components/common/PageContainer";
import { fetchMentorProfile } from "@/service/mentors.service";

import MentorHero from "@/components/mentors/profile/MentorHero";
import AvailabilityCalendar from "@/components/mentors/profile/AvailabilityCalendar";
import ReviewsList from "@/components/mentors/profile/ReviewsList";
import RelatedMentors from "@/components/mentors/profile/RelatedMentors";
import BookSessionButton from "@/components/mentors/profile/BookSessionButton";

/**
 * MentorProfilePage — displays the full profile for a single mentor.
 *
 * Uses `useAsyncData` with a 5-second timeout. On error,
 * displays an error message with a retry action without navigating away.
 *
 */
const MentorProfilePage = () => {
  const params = useParams();
  const mentorId = params?.id;

  const { status, data, error, showSkeleton, retry } = useAsyncData(fetchMentorProfile, mentorId, {
    timeoutMs: TIMEOUTS.mentorProfile,
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <StateRenderer
        status={status}
        data={data}
        error={error}
        showSkeleton={showSkeleton}
        retry={retry}
        loadingProps={{
          count: 3,
          lines: 6,
          showMedia: true,
          ariaLabel: "Loading mentor profile",
        }}
        emptyProps={{
          icon: User,
          illustrationAlt: "Mentor not found",
          title: "Mentor not found",
          message: "The mentor profile you are looking for could not be found.",
          ctaLabel: "Retry",
          onCta: retry,
        }}
        errorProps={{
          contentLabel: "mentor profile",
        }}
      >
        {(mentor) => (
          <div className="flex flex-col gap-6">
            {/* Hero region: photo, name, bio, experience, skills */}
            <MentorHero mentor={mentor} />

            {/* Book Session action */}
            <div className="flex justify-start">
              <BookSessionButton mentorId={mentor.id} mentorName={mentor.name} />
            </div>

            {/* Two-column layout for calendar and reviews on larger screens */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Availability Calendar */}
              <AvailabilityCalendar slots={mentor.slots} />

              {/* Reviews */}
              <ReviewsList reviews={mentor.reviews} />
            </div>

            {/* Related Mentors */}
            <RelatedMentors mentors={mentor.relatedMentors} />
          </div>
        )}
      </StateRenderer>
    </PageContainer>
  );
};

export default MentorProfilePage;
