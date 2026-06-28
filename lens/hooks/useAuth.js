"use client";

import {useDispatch, useSelector} from "react-redux";
import {authService} from "../service/auth.service";
import toastService from "../util/toastService";
import {authLoginRequest, authLoginSuccess, authLogout} from "../redux/actions/auth.actions";
import {navigate} from "../service/navigation.service";
import {ROUTE_PATHS} from "../config/RoutePath";
import {setToken, clearToken} from "../util/tokenService";
import {persistor} from "../redux/store";
import {useState} from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { error, user, isAuthenticated } = useSelector((state) => state.auth);
  const login = async (values) => {
    dispatch(authLoginRequest());
    try {
      setLoading(true);
      const response = await authService.login(values);
      const payload = response?.data?.data;
      if (!payload?.accessToken) {
        const message = response?.data?.message || "Login failed";
        toastService.error(message);
        throw new Error(message);
      }
      dispatch(
        authLoginSuccess({
          user: payload.email,
          token: payload.accessToken,
        })
      );
      setToken(payload.accessToken);
      toastService.success("Login successful! Welcome back.");
      // Hard redirect — ensures CSS, middleware, and layout all initialize
      // fresh. Client-side router.push() causes Tailwind to render unstyled
      // on the first paint after login.
      window.location.href = ROUTE_PATHS.HOME;
      return response?.data;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Login failed";
      toastService.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (values) => {
    dispatch(authLoginRequest());
    try {
      setLoading(true);
      const response = await authService.signup(values);
      toastService.success(
        response?.data?.data?.message || "Account created successfully! Please log in."
      );
      return { success: true, data: response?.data?.data };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Signup failed";
      toastService.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } finally {
      clearToken();
      dispatch(authLogout());
      await persistor.purge();
      setLoading(false);
      window.location.href = ROUTE_PATHS.LOGIN;
    }
  };

  return {
    login,
    signup,
    logout,

    // derived state
    loading,
    error,
    user,
    isAuthenticated,
  };
};
