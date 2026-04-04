import { useDispatch, useSelector } from "react-redux";
import { authService } from "../service/auth.service";
import toastService  from "../util/toastService";
import {
  authLoginRequest,
  authLoginSuccess,
  authLoginFailure,
  authLogout,
} from "../redux/actions/auth.actions";

export const useAuth = () => {
  const dispatch = useDispatch();

  const { loading, error, user, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (values) => {
    dispatch(authLoginRequest());
    try {
      const response = await authService.login(values);
      console.log("login-response", response?.data);
      dispatch(
        authLoginSuccess({
          user: response.data.user,
          token: response.data.accessToken,
        })
      );
      toastService.success(response?.data?.data?.message || "Login successful! Welcome back.");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      dispatch(authLoginFailure(errorMessage));
      toastService.error(errorMessage);
      throw err;
    }
  };

  const signup = async (values) => {
    dispatch(authLoginRequest());
    try {
      const response = await authService.signup(values);
      toastService.success(
        response.data?.data?.message || "Account created successfully! Please log in."
      );
      dispatch(authLoginFailure(""));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      dispatch(authLoginFailure(errorMessage));
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
