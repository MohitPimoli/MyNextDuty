export const showLaunchNotice = () => {
  return (
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_LAUNCH_NOTICE === "true"
  );
};
