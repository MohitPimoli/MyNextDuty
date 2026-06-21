// redux/actions/auth.actions.js
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
} from "@/util/constants";
export const authLoginRequest = () => ({
  type: AUTH_LOGIN_REQUEST,
});

export const authLoginSuccess = (payload) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload, // { user, token }
});

export const authLoginFailure = (error) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
});

export const authLogout = () => ({
  type: AUTH_LOGOUT,
});
