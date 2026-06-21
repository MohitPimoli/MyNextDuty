const CORE_BASE_URL = process.env.NEXT_PUBLIC_CORE_BASE_URL;

const API_URLS = {
  AUTH: {
    LOGIN: `${CORE_BASE_URL}/auth/login`,
    REFRESH: `${CORE_BASE_URL}/auth/refresh`,
    LOGOUT: `${CORE_BASE_URL}/auth/logout`,
    SIGNUP: `${CORE_BASE_URL}/auth/register`,
    VERIFY_MAIL: (token) => {
      return `${CORE_BASE_URL}/auth/verify-email?token=${token}`;
    },
  },
  USER: {
    REVERIFY: `${CORE_BASE_URL}/user/resend-verification`,
  },
  LOCATION: {
    USER: `${CORE_BASE_URL}/location/user`,
    UPDATE: `${CORE_BASE_URL}/location/update`,
    NEARBY: `${CORE_BASE_URL}/location/nearby`,
  },
};
export default API_URLS;
export { CORE_BASE_URL };
