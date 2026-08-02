/** Central path constants — use for `navigate()`, `Link to`, and interceptors. */
export const ROUTE_PATHS = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/dashboard",
  DASHBOARD: "/dashboard",
  VERIFY_EMAIL: "/verify-email",
  NEARBY: "/nearby",
  PROFILE: "/profile",
  ROADMAP: "/roadmap",
  COMMUNITY: "/community",
  RECOMMENDATIONS: "/recommendations",
  MENTORS: "/mentors",
  MENTOR_PROFILE: (id) => `/mentors/${id}`,
  FORBIDDEN: "/forbidden",
  NOT_FOUND: "/not-found",
  SERVER_ERROR: "/server-error",
};

/** Back-compat shape for code that used `Routes` from `Routes.js`. */
export const AppRouteConstants = {
  AUTH: { LOGIN: ROUTE_PATHS.LOGIN },
  USER: { HOME: ROUTE_PATHS.HOME },
};

/** Nested segment under `HOME` (React Router child `path`, no leading slash). */
export const LAYOUT_PATH = {
  NEARBY: "nearby",
};
