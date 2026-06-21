import API_URLS from "./api/apiUrls";
import { get, put, post, patch, del, upload, download } from "./api/apiService";

const commonService = {
  // AUTH ENDPOINTS
  AUTH: {
    login: (payload) => {
      return post(API_URLS.AUTH.LOGIN, payload, {
        invalidateCache: true, // Clear cache on login
      });
    },
    signup: (payload) => {
      return post(API_URLS.AUTH.SIGNUP, payload);
    },
    logout: () => {
      return post(
        API_URLS.AUTH.LOGOUT,
        {},
        {
          invalidateCache: true, // Clear all cache on logout
        }
      );
    },
    refreshToken: () => {
      return post(API_URLS.AUTH.REFRESH);
    },
    verifyEmail: (token) => {
      return get(API_URLS.AUTH.VERIFY_MAIL(token));
    },
    resendVerification: () => {
      return post(API_URLS.USER.REVERIFY);
    },
  },

  // USER ENDPOINTS
  USER: {
    getProfile: (userId) => {
      return get(`/users/${userId}/profile`, {
        enableCache: true,
        cache: {
          ttl: 300000, // 5 minutes
          key: `user_profile_${userId}`,
        },
      });
    },

    updateProfile: (userId, payload) => {
      return put(`/users/${userId}/profile`, payload, {
        invalidateCache: true,
        cacheKeysToInvalidate: [`user_profile_${userId}`, `user_${userId}`],
      });
    },

    getById: (userId) => {
      return get(`/users/${userId}`, {
        enableCache: true,
        cache: {
          ttl: 180000, // 3 minutes
          key: `user_${userId}`,
        },
      });
    },

    uploadAvatar: (userId, file, onProgress) => {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", userId);

      return upload(`/users/${userId}/avatar`, formData, {
        onUploadProgress: onProgress,
      });
    },

    getUsersList: (params = {}) => {
      return get("/users", {
        params,
        enableCache: true,
        cache: {
          ttl: 120000, // 2 minutes
          key: `users_list_${JSON.stringify(params)}`,
        },
      });
    },
  },

  // LOCATION ENDPOINTS
  LOCATION: {
    getUserLocation: (userId) => {
      return get(`${API_URLS.LOCATION.USER}/${userId}`, {
        enableCache: true,
        cache: {
          ttl: 60000, // 1 minute
          key: `user_location_${userId}`,
        },
      });
    },

    updateUserLocation: (userId, payload) => {
      return post(API_URLS.LOCATION.UPDATE, payload, {
        params: { userId },
        invalidateCache: true,
        cacheKeysToInvalidate: [`user_location_${userId}`, `nearby_users_${userId}`],
      });
    },

    getNearbyUsers: (userId, radius = 5000) => {
      return get(API_URLS.LOCATION.NEARBY, {
        params: { userId, radius },
        enableCache: true,
        cache: {
          ttl: 30000, // 30 seconds
          key: `nearby_users_${userId}_${radius}`,
        },
      });
    },
  },

  // NOTIFICATION ENDPOINTS
  NOTIFICATION: {
    getNotifications: (userId, params = {}) => {
      return get(`/notifications/${userId}`, {
        params,
        enableCache: true,
        cache: {
          ttl: 60000, // 1 minute
          key: `notifications_${userId}_${JSON.stringify(params)}`,
        },
      });
    },

    markAsRead: (notificationId) => {
      return patch(
        `/notifications/${notificationId}/read`,
        {},
        {
          invalidateCache: true,
          cacheKeysToInvalidate: [`notifications_*`], // Clear all notification caches
        }
      );
    },

    markAllAsRead: (userId) => {
      return patch(
        `/notifications/${userId}/read-all`,
        {},
        {
          invalidateCache: true,
          cacheKeysToInvalidate: [`notifications_${userId}_*`],
        }
      );
    },
  },

  // SETTINGS ENDPOINTS
  SETTINGS: {
    getUserSettings: (userId) => {
      return get(`/settings/${userId}`, {
        enableCache: true,
        cache: {
          ttl: 600000, // 10 minutes
          key: `user_settings_${userId}`,
        },
      });
    },

    updateSettings: (userId, payload) => {
      return put(`/settings/${userId}`, payload, {
        invalidateCache: true,
        cacheKeysToInvalidate: [`user_settings_${userId}`],
      });
    },
  },

  // FILE ENDPOINTS
  FILE: {
    uploadFile: (file, folder = "general", onProgress) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      return upload("/files/upload", formData, {
        onUploadProgress: onProgress,
      });
    },

    downloadFile: (fileId, filename) => {
      return download(`/files/${fileId}`, {
        responseType: "blob",
        params: { filename },
      });
    },
  },

  // SEARCH ENDPOINTS
  SEARCH: {
    searchUsers: (query, filters = {}) => {
      return get("/search/users", {
        params: { q: query, ...filters },
        enableCache: true,
        cache: {
          ttl: 120000, // 2 minutes
          key: `search_users_${query}_${JSON.stringify(filters)}`,
        },
      });
    },

    searchContent: (query, type = "all", filters = {}) => {
      return get("/search/content", {
        params: { q: query, type, ...filters },
        enableCache: true,
        cache: {
          ttl: 180000, // 3 minutes
          key: `search_content_${query}_${type}_${JSON.stringify(filters)}`,
        },
      });
    },
  },
};

export default commonService;
