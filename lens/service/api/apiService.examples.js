/**
 * API Service Usage Examples
 * This file demonstrates how to use the new API service wrapper
 */

import apiService from "./apiService";

// Example 1: Simple GET request
export const getUser = async (userId) => {
  try {
    const response = await apiService.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

// Example 2: GET request with caching
export const getUserProfile = async () => {
  try {
    const response = await apiService.get(`/users/${userId}/profile`, {
      enableCache: true,
      cache: {
        ttl: 300000, // 5 minutes
        key: `user_profile_${userId}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

// Example 3: GET request with query parameters
export const searchUsers = async (searchTerm, filters = {}) => {
  try {
    const response = await apiService.get("/users/search", {
      params: {
        q: searchTerm,
        ...filters,
      },
      enableCache: true,
      cache: {
        ttl: 60000, // 1 minute
        key: `search_${searchTerm}_${JSON.stringify(filters)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
};

// Example 4: POST request with cache invalidation
export const createUser = async (userData) => {
  try {
    const response = await apiService.post("/users", userData, {
      invalidateCache: true,
      cacheKeysToInvalidate: ["users_list", "users_count"],
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

// Example 5: PUT request to update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiService.put(`/users/${userId}`, userData, {
      invalidateCache: true,
      cacheKeysToInvalidate: [`user_profile_${userId}`, `user_${userId}`, "users_list"],
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

// Example 6: PATCH request for partial updates
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await apiService.patch(
      `/users/${userId}/status`,
      { status },
      {
        invalidateCache: true,
        cacheKeysToInvalidate: [`user_${userId}`, `user_profile_${userId}`],
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw error;
  }
};

// Example 7: DELETE request
export const deleteUser = async (userId) => {
  try {
    const response = await apiService.delete(`/users/${userId}`, {
      invalidateCache: true,
      cacheKeysToInvalidate: [
        `user_${userId}`,
        `user_profile_${userId}`,
        "users_list",
        "users_count",
      ],
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

// Example 8: File upload
export const uploadAvatar = async (userId, file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userId", userId);

    const response = await apiService.upload(`/users/${userId}/avatar`, formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(progress);
      },
    });

    // Invalidate user cache after successful upload
    apiService.clearCache(`user_profile_${userId}`);

    return response.data;
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    throw error;
  }
};

// Example 9: File download
export const downloadUserReport = async (userId) => {
  try {
    const response = await apiService.download(`/users/${userId}/report`, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `user_${userId}_report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response;
  } catch (error) {
    console.error("Failed to download report:", error);
    throw error;
  }
};

// Example 10: Custom headers
export const getProtectedData = async () => {
  try {
    const response = await apiService.get("/protected-data", {
      headers: {
        "X-Custom-Header": "custom-value",
        Accept: "application/json",
      },
      enableCache: true,
      cache: {
        ttl: 120000, // 2 minutes
        key: "protected_data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch protected data:", error);
    throw error;
  }
};

// Example 11: Manual cache management
export const clearUserCache = (userId) => {
  apiService.clearCache(`user_${userId}`);
  apiService.clearCache(`user_profile_${userId}`);
};

export const clearAllCache = () => {
  apiService.clearCache(); // Clears all cache
};

// Example 12: Bulk operations with cache management
export const bulkUpdateUsers = async (userUpdates) => {
  try {
    const response = await apiService.post(
      "/users/bulk-update",
      { users: userUpdates },
      {
        invalidateCache: true, // Clear all cache for safety
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to bulk update users:", error);
    throw error;
  }
};
