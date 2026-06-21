import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY } from "./constants";

export const getToken = () => {
  try {
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  } catch (e) {
    console.error("Error reading token:", e);
    return null;
  }
};

export const setToken = (accessToken) => {
  try {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      secure: true,
      sameSite: "Strict",
    });
  } catch (e) {
    console.error("Error setting token:", e);
  }
};

export const clearToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};
