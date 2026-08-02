// redux/reducers/auth.reducer.js

import {
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_TOKEN_REFRESHED,
} from "@/util/constants";

const initialState = {
  isAuthenticated: false,
  email: null,
  firstName: null,
  lastName: null,
  token: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        email: action?.payload?.email,
        firstName: action?.payload?.firstName,
        lastName: action?.payload?.lastName,
        token: action?.payload?.token,
      };

    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload,
        isAuthenticated: false,
      };

    case AUTH_TOKEN_REFRESHED:
      return {
        ...state,
        token: action?.payload,
      };

    case AUTH_LOGOUT:
      return initialState;

    default:
      return state;
  }
};
