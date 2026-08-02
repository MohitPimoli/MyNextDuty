"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "@/redux/actions/profile.actions";
import StateRenderer from "@/components/common/StateRenderer";
import PageContainer from "@/components/common/PageContainer";
import ProfileCover from "@/components/profile/ProfileCover";
import ProfilePhoto from "@/components/profile/ProfilePhoto";
import CareerStageBadge from "@/components/profile/CareerStageBadge";
import StatsSummary from "@/components/profile/StatsSummary";
import ProfileSections from "@/components/profile/ProfileSections";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileField from "@/components/profile/ProfileField";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import Button from "@/components/common/Button/Button";
import commonService from "@/service/commonService";

// --- helpers ---
const formatLifeStage = (raw) =>
    raw
        ? raw
            .split("_")
            .map((w) => w[0] + w.slice(1).toLowerCase())
            .join(" ")
        : "—";

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "—";

const formatIncome = (amount) => (amount != null ? amount.toLocaleString() : "—");

/**
 * Derive a display name from the profile data.
 */
const getDisplayName = (profile) => {
    if (!profile) return "";
    const parts = [profile.firstName, profile.lastName].filter(Boolean);
    return parts.join(" ");
};

/**
 * Map Redux profile state to the async status expected by StateRenderer.
 */
const deriveStatus = (loading, error, data) => {
    if (loading && !data) return "loading";
    if (error && !data) return "error";
    if (!data) return "empty";
    return "loaded";
};

export default function ProfilePage() {
    const dispatch = useDispatch();
    const {
        data: profile,
        loading,
        error,
        updateLoading,
        updateError,
    } = useSelector((state) => state.profile);

    const [editMode, setEditMode] = useState(false);
    const [educationLevels, setEducationLevels] = useState([]);

    // Tracks whether a save was just initiated so we only exit edit mode
    // in response to an actual save completing (not on initial render).
    const savePendingRef = useRef(false);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    // Load education levels once when entering edit mode
    useEffect(() => {
        if (editMode && educationLevels.length === 0) {
            commonService.USER.getEducationLevels()
                .then((res) => setEducationLevels(res.data.data ?? []))
                .catch(() => { }); // non-critical; select will be empty
        }
    }, [editMode, educationLevels.length]);

    // Exit edit mode only after a save completes successfully.
    useEffect(() => {
        if (savePendingRef.current && !updateLoading) {
            savePendingRef.current = false;
            if (!updateError) {
                setEditMode(false);
            }
        }
    }, [updateLoading, updateError]);

    const handleSave = (formValues) => {
        savePendingRef.current = true;
        dispatch(updateProfile(formValues));
    };

    const handleRetry = () => dispatch(fetchProfile());

    const status = deriveStatus(loading, error, profile);
    const displayName = getDisplayName(profile);

    // Edit mode (keep existing edit functionality intact)
    if (editMode && profile) {
        const initialValues = {
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            dateOfBirth: profile.dateOfBirth ?? "",
            lifeStage: profile.lifeStage ?? "",
            currentOccupation: profile.currentOccupation ?? "",
            educationLevelCode: "",
            monthlyIncome: profile.monthlyIncome ?? "",
        };

        return (
            <PageContainer className="space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">Edit Profile</h1>
                <ProfileEditForm
                    initialValues={initialValues}
                    educationLevels={educationLevels}
                    loading={updateLoading}
                    error={updateError}
                    onSave={handleSave}
                    onCancel={() => setEditMode(false)}
                />
            </PageContainer>
        );
    }

    // Main profile view wrapped in StateRenderer
    return (
        <PageContainer>
            <StateRenderer
                status={status}
                data={profile}
                error={error ? new Error(error) : null}
                retry={handleRetry}
                showSkeleton={loading && !profile}
                loadingProps={{ count: 1, lines: 5, ariaLabel: "Loading profile" }}
                errorProps={{ contentLabel: "your profile" }}
                emptyProps={{ message: "Profile data is not available." }}
            >
                {(data) => (
                    <div className="space-y-6">
                        {/* Cover region */}
                        <ProfileCover coverUrl={data.coverUrl ?? null} />

                        {/* Profile header: photo + name + career stage */}
                        <div className="relative -mt-12 flex flex-col items-start gap-3 px-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-4">
                            <ProfilePhoto
                                photoUrl={data.photoUrl ?? null}
                                name={displayName}
                            />
                            <div className="flex flex-col gap-1 pt-2 sm:pt-0">
                                <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
                                    {displayName || "User"}
                                </h1>
                                <CareerStageBadge stage={data.lifeStage} />
                            </div>
                            <div className="sm:ml-auto">
                                <Button
                                    aria-label="Edit your profile"
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </div>

                        {/* Stats summary */}
                        <StatsSummary
                            streakDays={data.learningStreakDays ?? 0}
                            contributionScore={data.contributionScore ?? 0}
                            className="px-4"
                        />

                        {/* Labeled sections: Roadmap, Achievements, Activity, Bookmarks */}
                        <div className="rounded-card border border-border bg-card p-4 shadow-low sm:p-6">
                            <ProfileSections
                                roadmap={data.currentRoadmap ?? null}
                                achievements={data.achievements ?? []}
                                activity={data.activity ?? []}
                                bookmarks={data.bookmarks ?? []}
                            />
                        </div>

                        {/* Personal info and career sections (existing) */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <ProfileSection title="Personal Info">
                                <ProfileField label="First name" value={data.firstName} />
                                <ProfileField label="Last name" value={data.lastName} />
                                <ProfileField label="Email" value={data.email} />
                                <ProfileField
                                    label="Date of birth"
                                    value={formatDate(data.dateOfBirth)}
                                />
                                <ProfileField
                                    label="Life stage"
                                    value={formatLifeStage(data.lifeStage)}
                                />
                                <ProfileField
                                    label="Account"
                                    badge={
                                        <span
                                            role="status"
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${data.verified
                                                ? "bg-green-50 text-green-700 ring-green-200"
                                                : "bg-amber-50 text-amber-700 ring-amber-200"
                                                }`}
                                        >
                                            {data.verified ? "Verified" : "Not Verified"}
                                        </span>
                                    }
                                />
                            </ProfileSection>

                            <ProfileSection title="Career & Finance">
                                <ProfileField label="Occupation" value={data.currentOccupation} />
                                <ProfileField
                                    label="Education level"
                                    value={data.educationLevel}
                                />
                                <ProfileField
                                    label="Monthly income"
                                    value={formatIncome(data.monthlyIncome)}
                                />
                            </ProfileSection>
                        </div>
                    </div>
                )}
            </StateRenderer>
        </PageContainer>
    );
}
