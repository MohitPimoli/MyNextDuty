package com.mynextduty.core.service;

import java.util.List;

/**
 * Service interface for Redis interactions. Provides a centralized abstraction over Redis operations
 * used throughout the application (rate limiting, caching, token blacklisting, etc.).
 */
public interface RedisService {

  /**
   * Executes a Lua script atomically in Redis.
   *
   * @param script The Lua script text to execute.
   * @param keys The Redis keys referenced by the script.
   * @param args The arguments passed to the script.
   * @return The script result as a Long, or null if execution fails.
   */
  Long executeLuaScript(String script, List<Object> keys, Object... args);

  /**
   * Sets a key-value pair in Redis with a TTL.
   *
   * @param key The Redis key.
   * @param value The value to store.
   * @param ttlSeconds Time-to-live in seconds.
   */
  void setWithTtl(String key, String value, long ttlSeconds);

  /**
   * Gets the value associated with a key.
   *
   * @param key The Redis key.
   * @return The value, or null if the key doesn't exist.
   */
  String get(String key);

  /**
   * Deletes a key from Redis.
   *
   * @param key The Redis key to delete.
   * @return true if the key was deleted, false if it didn't exist.
   */
  boolean delete(String key);

  /**
   * Checks if a key exists in Redis.
   *
   * @param key The Redis key.
   * @return true if the key exists.
   */
  boolean exists(String key);
}
