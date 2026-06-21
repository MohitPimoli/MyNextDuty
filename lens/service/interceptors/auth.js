import { getToken } from "@/util/tokenService";

export const authInterceptor = (config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
