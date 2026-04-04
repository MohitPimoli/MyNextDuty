/**
 * Common Service Usage Examples
 * This file demonstrates how to use the structured commonService
 */

import commonService from "./commonService";

// ==================== AUTH EXAMPLES ====================

// Login with error handling
export const handleLogin = async (credentials) => {
  try {
    const response = await commonService.AUTH.login(credentials);
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Signup
export const handleSignup = async (userData) => {
  try {
    const response = await commonService.AUTH.signup(userData);
    console.log("Signup successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

// Email verification
export const verifyUserEmail = async (token) => {
  try {
    const response = await commonService.AUTH.verifyEmail(token);
    return response.data;
  } catch (error) {
    console.error("Email verification failed:", error);
    throw error;
  }
};

// ==================== USER EXAMPLES ====================

// Get user profile with caching
export const getUserProfile = async (userId) => {
  try {
    const response = await commonService.USER.getProfile(userId);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await commonService.USER.updateProfile(userId, profileData);
    console.log("Profile updated successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

// Upload user avatar with progress
export const uploadUserAvatar = async (userId, file, onProgress) => {
  try {
    const response = await commonService.USER.uploadAvatar(userId, file, (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${progress}%`);
      if (onProgress) onProgress(progress);
    });

    console.log("Avatar uploaded successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    throw error;
  }
};

// Get users list with pagination
export const getUsersList = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = { page, limit, ...filters };
    const response = await commonService.USER.getUsersList(params);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users list:", error);
    throw error;
  }
};

// ==================== LOCATION EXAMPLES ====================

// Get user location (cached)
export const getUserLocation = async (userId) => {
  try {
    const response = await commonService.LOCATION.getUserLocation(userId);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user location:", error);
    throw error;
  }
};

// Update user location
export const updateLocation = async (userId, locationData) => {
  try {
    const response = await commonService.LOCATION.updateUserLocation(userId, locationData);
    console.log("Location updated successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to update location:", error);
    throw error;
  }
};

// Get nearby users
export const findNearbyUsers = async (userId, radius = 5000) => {
  try {
    const response = await commonService.LOCATION.getNearbyUsers(userId, radius);
    return response.data;
  } catch (error) {
    console.error("Failed to find nearby users:", error);
    throw error;
  }
};

// ==================== NOTIFICATION EXAMPLES ====================

// Get user notifications
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  try {
    const response = await commonService.NOTIFICATION.getNotifications(userId, { page, limit });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await commonService.NOTIFICATION.markAsRead(notificationId);
    console.log("Notification marked as read");
    return response.data;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (userId) => {
  try {
    const response = await commonService.NOTIFICATION.markAllAsRead(userId);
    console.log("All notifications marked as read");
    return response.data;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
};

// ==================== SETTINGS EXAMPLES ====================

// Get user settings
export const getUserSettings = async (userId) => {
  try {
    const response = await commonService.SETTINGS.getUserSettings(userId);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    throw error;
  }
};

// Update user settings
export const updateUserSettings = async (userId, settings) => {
  try {
    const response = await commonService.SETTINGS.updateSettings(userId, settings);
    console.log("Settings updated successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to update settings:", error);
    throw error;
  }
};

// ==================== FILE EXAMPLES ====================

// Upload file with progress tracking
export const uploadFile = async (file, folder = "general", onProgress) => {
  try {
    const response = await commonService.FILE.uploadFile(file, folder, (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${progress}%`);
      if (onProgress) onProgress(progress);
    });

    console.log("File uploaded successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
};

// Download file
export const downloadFile = async (fileId, filename) => {
  try {
    const response = await commonService.FILE.downloadFile(fileId, filename);

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response;
  } catch (error) {
    console.error("Failed to download file:", error);
    throw error;
  }
};

// ==================== SEARCH EXAMPLES ====================

// Search users
export const searchUsers = async (query, filters = {}) => {
  try {
    const response = await commonService.SEARCH.searchUsers(query, filters);
    return response.data;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
};

// Search content
export const searchContent = async (query, type = "all", filters = {}) => {
  try {
    const response = await commonService.SEARCH.searchContent(query, type, filters);
    return response.data;
  } catch (error) {
    console.error("Failed to search content:", error);
    throw error;
  }
};

// ==================== REACT COMPONENT EXAMPLES ====================

// Example React component using commonService
export const UserProfileComponent = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile(userId);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateUserProfile(userId, updatedData);
      // Refresh profile data
      const profileData = await getUserProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
      {/* Profile update form would go here */}
    </div>
  );
};

// ==================== ERROR HANDLING PATTERNS ====================

// Centralized error handling
export const handleApiError = (error, context = "") => {
  console.error(`API Error ${context}:`, error);

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 401:
        console.log("Unauthorized - redirecting to login");
        // Handle unauthorized
        break;
      case 403:
        console.log("Forbidden - insufficient permissions");
        // Handle forbidden
        break;
      case 404:
        console.log("Resource not found");
        // Handle not found
        break;
      case 500:
        console.log("Server error");
        // Handle server error
        break;
      default:
        console.log("Unknown error:", data.message || "Something went wrong");
    }
  } else if (error.request) {
    // Network error
    console.log("Network error - check connection");
  } else {
    // Other error
    console.log("Error:", error.message);
  }
};

// Wrapper function with error handling
export const safeApiCall = async (apiFunction, ...args) => {
  try {
    return await apiFunction(...args);
  } catch (error) {
    handleApiError(error, apiFunction.name);
    throw error;
  }
};
