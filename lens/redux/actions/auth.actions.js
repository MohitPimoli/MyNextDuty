import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
  AUTH_TOKEN_REFRESHED,
} from "@/util/constants";

export const authLoginRequest = () => ({ type: AUTH_LOGIN_REQUEST });
export const authLoginSuccess = (payload) => ({ type: AUTH_LOGIN_SUCCESS, payload });
export const authLoginFailure = (error)   => ({ type: AUTH_LOGIN_FAILURE, payload: error });
export const authLogout       = ()        => ({ type: AUTH_LOGOUT });
export const authTokenRefreshed = (token) => ({ type: AUTH_TOKEN_REFRESHED, payload: token });
