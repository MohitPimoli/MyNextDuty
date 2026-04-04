# API Service Architecture

A comprehensive API service architecture with structured endpoints, caching, and enhanced functionality.

## Architecture Overview

The API service is built in layers:

1. **axiosInstance.js** - Base Axios configuration with interceptors
2. **apiService.js** - Core API wrapper with caching and HTTP methods
3. **commonService.js** - Structured service layer organized by domain
4. **Individual Services** - Domain-specific services (auth.service.js, location.service.js)

## Quick Start

```javascript
import commonService from './commonService';

// Auth operations
const loginResponse = await commonService.AUTH.login(credentials);
const signupResponse = await commonService.AUTH.signup(userData);

// User operations
const profile = await commonService.USER.getProfile(userId);
const updatedProfile = await commonService.USER.updateProfile(userId, data);

// Location operations
const location = await commonService.LOCATION.getUserLocation(userId);
const nearbyUsers = await commonService.LOCATION.getNearbyUsers(userId, 5000);
```

## Service Structure

### AUTH Endpoints
- `login(payload)` - User authentication with cache invalidation
- `signup(payload)` - User registration
- `logout()` - User logout with cache clearing
- `refreshToken()` - Token refresh
- `verifyEmail(token)` - Email verification
- `resendVerification(token)` - Resend verification email

### USER Endpoints
- `getProfile(userId)` - Get user profile (cached 5min)
- `updateProfile(userId, payload)` - Update profile with cache invalidation
- `getById(userId)` - Get user by ID (cached 3min)
- `updateUser(userId, payload)` - Update user data
- `deleteUser(userId)` - Delete user
- `uploadAvatar(userId, file, onProgress)` - Upload avatar with progress
- `changePassword(userId, payload)` - Change password
- `getUsersList(params)` - Get paginated users list (cached 2min)

### LOCATION Endpoints
- `getUserLocation(userId)` - Get user location (cached 1min)
- `updateUserLocation(userId, payload)` - Update location with cache invalidation
- `getNearbyUsers(userId, radius)` - Get nearby users (cached 30sec)
- `getLocationHistory(userId, params)` - Get location history (cached 5min)

### NOTIFICATION Endpoints
- `getNotifications(userId, params)` - Get user notifications (cached 1min)
- `markAsRead(notificationId)` - Mark notification as read
- `markAllAsRead(userId)` - Mark all notifications as read
- `deleteNotification(notificationId)` - Delete notification

### SETTINGS Endpoints
- `getUserSettings(userId)` - Get user settings (cached 10min)
- `updateSettings(userId, payload)` - Update settings
- `getPrivacySettings(userId)` - Get privacy settings (cached 10min)
- `updatePrivacySettings(userId, payload)` - Update privacy settings

### FILE Endpoints
- `uploadFile(file, folder, onProgress)` - Upload file with progress
- `downloadFile(fileId, filename)` - Download file
- `deleteFile(fileId)` - Delete file
- `getFileInfo(fileId)` - Get file information (cached 5min)

### SEARCH Endpoints
- `searchUsers(query, filters)` - Search users (cached 2min)
- `searchContent(query, type, filters)` - Search content (cached 3min)

## Features

### Automatic Caching
- **Smart TTL**: Different cache durations based on data type
- **Auto Invalidation**: Cache cleared on relevant mutations
- **Custom Keys**: Meaningful cache keys for better management

### Error Handling
- **Interceptors**: Built-in auth and error handling
- **Retry Logic**: Automatic token refresh on 401 errors
- **Global Navigation**: Auto-redirect on specific error codes

### Progress Tracking
- **File Uploads**: Real-time upload progress
- **Large Operations**: Progress callbacks for long-running tasks

## Usage Patterns

### Basic API Call
```javascript
try {
  const response = await commonService.USER.getProfile(userId);
  console.log('Profile:', response.data);
} catch (error) {
  console.error('Failed to fetch profile:', error);
}
```

### File Upload with Progress
```javascript
const handleUpload = async (file) => {
  try {
    const response = await commonService.FILE.uploadFile(
      file, 
      'avatars',
      (progress) => setUploadProgress(progress)
    );
    console.log('Upload complete:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Search with Caching
```javascript
const searchUsers = async (query, filters) => {
  try {
    // Automatically cached for 2 minutes
    const response = await commonService.SEARCH.searchUsers(query, filters);
    return response.data;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};
```

## Migration Guide

### From Direct Axios
```javascript
// Before
import api from './axiosInstance';
const response = await api.get('/users/123');

// After
import commonService from './commonService';
const response = await commonService.USER.getById('123');
```

### From Old API Service
```javascript
// Before
import apiService from './apiService';
const response = await apiService.get('/users/123', { enableCache: true });

// After
import commonService from './commonService';
const response = await commonService.USER.getById('123'); // Auto-cached
```

## Best Practices

1. **Use Domain Structure**: Always use commonService.DOMAIN.method()
2. **Handle Errors**: Wrap calls in try-catch blocks
3. **Leverage Caching**: Trust the built-in caching for read operations
4. **Progress Feedback**: Use progress callbacks for file operations
5. **Consistent Patterns**: Follow the established naming conventions

## Examples

See `commonService.examples.js` for comprehensive usage examples covering all endpoints and patterns.

## Core API Service

For advanced usage and direct access to the underlying API service, see `apiService.js` documentation.