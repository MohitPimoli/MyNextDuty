package com.mynextduty.core.service.impl;

import com.mynextduty.core.service.RedisService;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBucket;
import org.redisson.api.RScript;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.StringCodec;
import org.springframework.stereotype.Service;

/**
 * Singleton Redis service implementation using Redisson client. Provides centralized Redis access
 * for rate limiting, caching, and general key-value operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

  private final RedissonClient redissonClient;

  @Override
  public Long executeLuaScript(String script, List<Object> keys, Object... args) {
    try {
      RScript rScript = redissonClient.getScript(StringCodec.INSTANCE);
      return rScript.eval(RScript.Mode.READ_WRITE, script, RScript.ReturnType.LONG, keys, args);
    } catch (Exception e) {
      log.error("Failed to execute Lua script on Redis. keys={}", keys, e);
      return null;
    }
  }

  @Override
  public void setWithTtl(String key, String value, long ttlSeconds) {
    try {
      RBucket<String> bucket = redissonClient.getBucket(key);
      bucket.set(value, Duration.ofSeconds(ttlSeconds));
    } catch (Exception e) {
      log.error("Failed to set key in Redis. key={}", key, e);
    }
  }

  @Override
  public String get(String key) {
    try {
      RBucket<String> bucket = redissonClient.getBucket(key);
      return bucket.get();
    } catch (Exception e) {
      log.error("Failed to get key from Redis. key={}", key, e);
      return null;
    }
  }

  @Override
  public boolean delete(String key) {
    try {
      RBucket<String> bucket = redissonClient.getBucket(key);
      return bucket.delete();
    } catch (Exception e) {
      log.error("Failed to delete key from Redis. key={}", key, e);
      return false;
    }
  }

  @Override
  public boolean exists(String key) {
    try {
      RBucket<String> bucket = redissonClient.getBucket(key);
      return bucket.isExists();
    } catch (Exception e) {
      log.error("Failed to check key existence in Redis. key={}", key, e);
      return false;
    }
  }
}
