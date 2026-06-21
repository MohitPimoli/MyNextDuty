import { authInterceptor } from "./auth";
import { errorInterceptor } from "./error";

export const setupInterceptors = (api) => {
  api.interceptors.request.use(authInterceptor);

  api.interceptors.response.use(
    (response) => response,
    (error) => errorInterceptor(error, api)
  );
};
