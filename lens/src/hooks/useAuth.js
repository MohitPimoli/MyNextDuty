import { useDispatch, useSelector } from "react-redux";
import { authService } from "../service/auth.service";
import toastService  from "../util/toastService";
import {
  authLoginRequest,
  authLoginSuccess,
  authLogout,
} from "../redux/actions/auth.actions";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { loading, error, user, isAuthenticated } = useSelector((state) => state.auth);
  const login = async (values) => {
    dispatch(authLoginRequest());
    try {
      const response = await authService.login(values);
      dispatch(
        authLoginSuccess({
          user: response?.data?.data?.email,
          token: response?.data?.data?.accessToken,
        })
      );
      toastService.success("Login successful! Welcome back.");
      return response?.data;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Login failed";
      toastService.error(errorMessage);
      throw err;
    }
  };

  const signup = async (values) => {
    dispatch(authLoginRequest());
    try {
      const response = await authService.signup(values);
      toastService.success(
        response?.data?.data?.message || "Account created successfully! Please log in."
      );
      return { success: true, data: response?.data?.data };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Signup failed";
      toastService.error(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(authLogout());
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
