/** Central path constants — use for `navigate()`, `Link to`, and interceptors. */
export const ROUTE_PATHS = {
  LOGIN: "/login",
  HOME: "/",
  VERIFY_EMAIL: "/verify-email",
  NEARBY: "/nearby",
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
