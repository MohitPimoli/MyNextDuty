/**
 * Pure form-state logic for the lens frontend (DOM-independent).
 *
 * Encodes the value-retention rules that keep a user's entered data on screen
 * after a failed submit, so the Auth screens (and any validated form) can be
 * unit- and property-tested without rendering.
 *
 * Both helpers are pure and never mutate their inputs — they return new state
 * objects, leaving the caller's `fields`, `errors`, and `state` untouched.
 *
 * @typedef {Object} FieldState
 * @property {*} value - the current field value (unchanged on failure)
 * @property {string | null} reason - the programmatically associated validation
 *   reason message, or null when the field is valid
 *
 * Requirements: 3.4, 6.4, 6.5, 17.9
 */

/** The password field name cleared by the auth-failure transform. */
export const PASSWORD_FIELD = "password";

/**
 * The identity field names retained by the auth-failure transform.
 * @type {ReadonlyArray<string>}
 */
export const IDENTITY_FIELDS = ["email", "username"];

/**
 * Build the form state for a failed validation submit.
 *
 * Every field keeps its original value unchanged, and each field that has an
 * entry in `errors` additionally carries the associated reason message so the
 * UI can render an inline, programmatically associated validation message. A
 * field with no error (or an empty/whitespace-only reason) carries `reason:
 * null`.
 *
 * Pure and non-mutating: a new state object with new per-field objects is
 * returned; `fields` and `errors` are left untouched.
 *
 * @param {Readonly<Record<string, *>>} fields - the entered field values keyed
 *   by field name
 * @param {Readonly<Record<string, string>>} [errors] - validation reasons keyed
 *   by field name (only invalid fields need appear)
 * @returns {Record<string, FieldState>} the retained form state
 */
export const retainValues = (fields, errors) => {
  const source = fields && typeof fields === "object" ? fields : {};
  const reasons = errors && typeof errors === "object" ? errors : {};

  const result = {};
  for (const name of Object.keys(source)) {
    const reason = reasons[name];
    const hasReason = typeof reason === "string" && reason.trim().length > 0;
    result[name] = {
      value: source[name],
      reason: hasReason ? reason : null,
    };
  }
  return result;
};

/**
 * Transform form state after a failed authentication/registration.
 *
 * The entered email/username value(s) are retained while the password field is
 * cleared to an empty string, so the user does not have to re-enter their
 * identity but must re-enter their secret.
 *
 * Pure and non-mutating: a shallow copy of `state` is returned with the
 * password field replaced; the original `state` is left untouched. Fields that
 * are absent from `state` are not introduced.
 *
 * @param {Readonly<Record<string, *>>} state - the current form state keyed by
 *   field name
 * @returns {Record<string, *>} a new state object with the password cleared and
 *   the identity value(s) retained
 */
export const authFailureTransform = (state) => {
  const source = state && typeof state === "object" ? state : {};
  const next = { ...source };

  if (Object.prototype.hasOwnProperty.call(next, PASSWORD_FIELD)) {
    next[PASSWORD_FIELD] = "";
  }
  return next;
};
