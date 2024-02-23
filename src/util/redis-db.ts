import Redis from 'ioredis';
import * as crypto from 'crypto';
import CONFIG from '../config';

const salt = CONFIG.db.db_salt;
const saltBuffer = Buffer.from(salt, 'base64');

/**
 * Encrypt input password
 *
 * @param {string} password
 * @return {string}
 * @api public
 */
class RedisDB {
  public redis: any;
  private redis2: any;

  constructor(redisConfig: any) {
    this.redis = new Redis(redisConfig);
  }

  async get<T>(key: string): Promise<T | null> {
    let data = await this.redis.get(key);
    return JSON.parse(data);
  }

  async set<T>(
    key: string,
    data: T,
    maxAge = 7 * 24 * 60 * 60 * 1000,
  ): Promise<string> {
    try {
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(key, JSON.stringify(data), 'EX', maxAge / 1000);
      return Promise.resolve(key);
    } catch (e) {
    }
    return 'success';
  }

  async destroy(key: string): Promise<number> {
    // const md5_key = crypto
    //   .pbkdf2Sync(key, saltBuffer, 10000, 64, "sha1")
    //   .toString("base64");
    return await this.redis.del(key);
  }

  async update<T>(key: string, data: T): Promise<string> {
    try {
      // 获取当前 key 的剩余过期时间（以秒为单位）
      const ttl = await this.redis.ttl(key);

      if (ttl > 0) {
        // 如果 key 有有效的剩余过期时间，使用它来设置新值
        await this.redis.set(key, JSON.stringify(data), 'EX', ttl);
      } else {
        // 如果 key 没有设置过期时间或已过期，只设置新值
        await this.redis.set(key, JSON.stringify(data));
      }
      return Promise.resolve(key);
    } catch (e) {
      // 错误处理
      console.error(e);
      throw e; // 或返回错误信息
    }
  }
}

export default RedisDB;
