/**
 * Pure navigation-link logic for the lens frontend (DOM-independent).
 *
 * Encodes the Navigation_Bar link set as a pure function of the authentication
 * state so the header (and its mobile drawer) can be unit- and property-tested
 * without rendering.
 *
 * Link set rules:
 *   - The base links (Home, Roadmap, Community, Mentors, About) are always
 *     present.
 *   - A Login action is present if and only if the user is unauthenticated.
 *   - A Profile link is present if and only if the user is authenticated.
 *
 * Where a route constant exists in `config/RoutePath.js` it is used; the
 * remaining marketing/section links use plain paths.
 *
 * @typedef {Object} NavLink
 * @property {string} label - the human-readable link label
 * @property {string} href - the destination path
 *
 * Requirements: 4.1, 4.5, 4.8
 */

import { ROUTE_PATHS } from "@/config/RoutePath";

/**
 * The base navigation links shown regardless of auth state.
 * @type {ReadonlyArray<NavLink>}
 */
export const BASE_NAV_LINKS = Object.freeze([
  Object.freeze({ label: "Home", href: ROUTE_PATHS.HOME }),
  Object.freeze({ label: "Roadmap", href: "/roadmap" }),
  Object.freeze({ label: "Community", href: "/community" }),
  Object.freeze({ label: "Mentors", href: "/mentors" }),
  Object.freeze({ label: "About", href: "/about" }),
]);

/** The Login action shown only to unauthenticated users. */
export const LOGIN_LINK = Object.freeze({
  label: "Login",
  href: ROUTE_PATHS.LOGIN,
});

/** The Profile link shown only to authenticated users. */
export const PROFILE_LINK = Object.freeze({
  label: "Profile",
  href: ROUTE_PATHS.PROFILE,
});

/**
 * Resolve the navigation link set for a given authentication state.
 *
 * Returns the base links followed by exactly one auth-dependent link: the
 * Profile link when authenticated, or the Login action when not. The returned
 * array is a new array so callers can safely map/filter it.
 *
 * @param {boolean} isAuthenticated - whether the current user is authenticated
 * @returns {NavLink[]} the ordered navigation link set
 */
export const resolveNavLinks = (isAuthenticated) => {
  const links = [...BASE_NAV_LINKS];
  links.push(isAuthenticated ? PROFILE_LINK : LOGIN_LINK);
  return links;
};
