import axios from "axios";
import { navigate } from "../navigation.service";
import { ROUTE_PATHS } from "../../routes/RoutePath";
import { persistor } from "../../redux/store";
import API_URLS, { CORE_BASE_URL } from "../api/apiUrls";
import { setToken } from "../../util/tokenService";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

export const errorInterceptor = async (error, api) => {
  const { response, config } = error;
  if (!response) {
    navigate(ROUTE_PATHS.SERVER_ERROR);
    return Promise.reject(error);
  }

  const originalRequest = config;
  if (response.status === 401 && response.data?.errorCode === 1001 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        `${CORE_BASE_URL}${API_URLS.AUTH.REFRESH}`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = refreshResponse.data;

      setToken(accessToken);
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      persistor.purge();
      navigate(ROUTE_PATHS.LOGIN);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  // 🚦 Global status handling
  switch (response.status) {
    case 401:
      navigate(ROUTE_PATHS.LOGIN);
      break;
    case 403:
      navigate(ROUTE_PATHS.FORBIDDEN);
      break;
    case 404:
      navigate(ROUTE_PATHS.NOT_FOUND);
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      navigate(ROUTE_PATHS.SERVER_ERROR);
      break;
    default:
      break;
  }

  return Promise.reject(error);
};
