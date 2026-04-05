import { lazy } from "react";

const DynamicComponents = {
  ServerError: lazy(() => import("../page/error/ServerError")),
  NotFound: lazy(() => import("../page/error/NotFound")),
  Forbidden: lazy(() => import("../page/error/Forbidden")),
  AuthPage: lazy(() => import("../page/auth/AuthPage")),
  VerifyEmail: lazy(() => import("../page/email/EmailVerificationPage")),
  MapPage: lazy(() => import("../page/location/MapPage")),
  HomeShellPage: lazy(() => import("../components/common/Loader")),
};
export default DynamicComponents;
