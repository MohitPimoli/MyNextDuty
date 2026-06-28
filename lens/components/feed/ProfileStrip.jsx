"use client";

const formatLifeStage = (raw) =>
  raw ? raw.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join(' ') : null;

const ProfileStrip = ({ userProfile, profileLoading }) => {
  const firstName = userProfile?.firstName;
  const greeting = firstName ? `Welcome back, ${firstName}!` : 'Welcome back!';
  const lifeStageLabel = formatLifeStage(userProfile?.lifeStage);

  if (profileLoading) {
    return (
      <section aria-label="User profile summary" className="mb-6">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-gray-200" />
      </section>
    );
  }

  return (
    <section aria-label="User profile summary" className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
      {lifeStageLabel && (
        <p className="mt-1 text-sm text-gray-500">
          Life stage: <span className="font-medium text-indigo-600">{lifeStageLabel}</span>
        </p>
      )}
    </section>
  );
};

export default ProfileStrip;
