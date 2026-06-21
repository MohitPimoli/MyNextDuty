import api from "./axiosInstance";

// Simple in-memory cache implementation
class ApiCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, data, ttl = 300000) {
    // Default 5 minutes TTL
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  generateKey(url, params = {}, payload = {}) {
    return `${url}_${JSON.stringify(params)}_${JSON.stringify(payload)}`;
  }
}

const apiCache = new ApiCache();

// API Service Wrapper
class ApiService {
  constructor(axiosInstance) {
    this.api = axiosInstance;
  }

  /**
   * GET request with optional caching
   * @param {string} url - API endpoint
   * @param {Object} options - Request options
   * @param {Object} options.params - Query parameters
   * @param {Object} options.headers - Custom headers
   * @param {boolean} options.enableCache - Enable caching for this request
   * @param {Object} options.cache - Cache configuration
   * @param {number} options.cache.ttl - Time to live in milliseconds
   * @param {string} options.cache.key - Custom cache key
   */
  async get(url, options = {}) {
    const { params = {}, headers = {}, enableCache = false, cache = {} } = options;
    const { ttl = 300000, key } = cache;
    // Generate cache key
    const cacheKey = key || apiCache.generateKey(url, params);
    // Check cache if enabled
    if (enableCache) {
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        return Promise.resolve(cachedData);
      }
    }
    try {
      const response = await this.api.get(url, {
        params,
        headers,
      });
      // Cache the response if enabled
      if (enableCache) {
        apiCache.set(cacheKey, response, ttl);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {Object} payload - Request body
   * @param {Object} options - Request options
   * @param {Object} options.params - Query parameters
   * @param {Object} options.headers - Custom headers
   * @param {boolean} options.invalidateCache - Invalidate related cache entries
   * @param {string|Array} options.cacheKeysToInvalidate - Specific cache keys to invalidate
   */
  async post(url, payload = {}, options = {}) {
    const {
      params = {},
      headers = {},
      invalidateCache = false,
      cacheKeysToInvalidate = [],
    } = options;
    try {
      const response = await this.api.post(url, payload, {
        params,
        headers,
      });
      // Invalidate cache if requested
      if (invalidateCache) {
        if (Array.isArray(cacheKeysToInvalidate) && cacheKeysToInvalidate.length > 0) {
          cacheKeysToInvalidate.forEach((key) => apiCache.delete(key));
        } else {
          // Clear all cache for safety
          apiCache.clear();
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {Object} payload - Request body
   * @param {Object} options - Request options
   * @param {Object} options.params - Query parameters
   * @param {Object} options.headers - Custom headers
   * @param {boolean} options.invalidateCache - Invalidate related cache entries
   * @param {string|Array} options.cacheKeysToInvalidate - Specific cache keys to invalidate
   */
  async put(url, payload = {}, options = {}) {
    const {
      params = {},
      headers = {},
      invalidateCache = false,
      cacheKeysToInvalidate = [],
    } = options;
    try {
      const response = await this.api.put(url, payload, {
        params,
        headers,
      });
      // Invalidate cache if requested
      if (invalidateCache) {
        if (Array.isArray(cacheKeysToInvalidate) && cacheKeysToInvalidate.length > 0) {
          cacheKeysToInvalidate.forEach((key) => apiCache.delete(key));
        } else {
          apiCache.clear();
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {Object} payload - Request body
   * @param {Object} options - Request options
   * @param {Object} options.params - Query parameters
   * @param {Object} options.headers - Custom headers
   * @param {boolean} options.invalidateCache - Invalidate related cache entries
   * @param {string|Array} options.cacheKeysToInvalidate - Specific cache keys to invalidate
   */
  async patch(url, payload = {}, options = {}) {
    const {
      params = {},
      headers = {},
      invalidateCache = false,
      cacheKeysToInvalidate = [],
    } = options;
    try {
      const response = await this.api.patch(url, payload, {
        params,
        headers,
      });
      // Invalidate cache if requested
      if (invalidateCache) {
        if (Array.isArray(cacheKeysToInvalidate) && cacheKeysToInvalidate.length > 0) {
          cacheKeysToInvalidate.forEach((key) => apiCache.delete(key));
        } else {
          apiCache.clear();
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {Object} options - Request options
   * @param {Object} options.params - Query parameters
   * @param {Object} options.headers - Custom headers
   * @param {Object} options.payload - Request body (for DELETE with body)
   * @param {boolean} options.invalidateCache - Invalidate related cache entries
   * @param {string|Array} options.cacheKeysToInvalidate - Specific cache keys to invalidate
   */
  async delete(url, options = {}) {
    const {
      params = {},
      headers = {},
      payload,
      invalidateCache = true,
      cacheKeysToInvalidate = [],
    } = options;
    try {
      const config = {
        params,
        headers,
      };
      // Add data to config if payload is provided
      if (payload) {
        config.data = payload;
      }
      const response = await this.api.delete(url, config);
      // Invalidate cache by default for DELETE operations
      if (invalidateCache) {
        if (Array.isArray(cacheKeysToInvalidate) && cacheKeysToInvalidate.length > 0) {
          cacheKeysToInvalidate.forEach((key) => apiCache.delete(key));
        } else {
          apiCache.clear();
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload file with progress tracking
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {Object} options - Request options
   * @param {Function} options.onUploadProgress - Progress callback
   * @param {Object} options.headers - Custom headers
   */
  async upload(url, formData, options = {}) {
    const { onUploadProgress, headers = {} } = options;
    try {
      const response = await this.api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...headers,
        },
        onUploadProgress,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download file
   * @param {string} url - API endpoint
   * @param {Object} options - Request options
   * @param {Object} options.params - Query parameters
   * @param {string} options.responseType - Response type (blob, arraybuffer, etc.)
   */
  async download(url, options = {}) {
    const { params = {}, responseType = "blob" } = options;
    try {
      const response = await this.api.get(url, {
        params,
        responseType,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear cache
   * @param {string} key - Specific key to clear, if not provided clears all
   */
  clearCache(key) {
    if (key) {
      apiCache.delete(key);
    } else {
      apiCache.clear();
    }
  }

  /**
   * Get cache instance for advanced operations
   */
  getCache() {
    return apiCache;
  }
}

// Create and export the service instance
const apiService = new ApiService(api);

// Export individual methods for structured usage
export const get = (url, options) => apiService.get(url, options);
export const post = (url, payload, options) => apiService.post(url, payload, options);
export const put = (url, payload, options) => apiService.put(url, payload, options);
export const patch = (url, payload, options) => apiService.patch(url, payload, options);
export const del = (url, options) => apiService.delete(url, options);
export const upload = (url, formData, options) => apiService.upload(url, formData, options);
export const download = (url, options) => apiService.download(url, options);
export const clearCache = (key) => apiService.clearCache(key);
