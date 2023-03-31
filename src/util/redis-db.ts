import Redis from "ioredis";
import * as crypto from "crypto";
import CONFIG from "src/config";
const salt = CONFIG.db.db_salt;
const saltBuffer = Buffer.from(salt, "base64");
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
    const md5_key = crypto
      .pbkdf2Sync(key, saltBuffer, 10000, 64, "sha1")
      .toString("base64");
    let data = await this.redis.get(md5_key);
    return JSON.parse(data);
  }

  async set<T>(
    key: string,
    data: T,
    maxAge = 7 * 24 * 60 * 60 * 1000
  ): Promise<string> {
    try {
      const md5_key = crypto
        .pbkdf2Sync(key, saltBuffer, 10000, 64, "sha1")
        .toString("base64");
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(md5_key, JSON.stringify(data), "EX", maxAge / 1000);
      return Promise.resolve(md5_key);
    } catch (e) {}
    return "success";
  }

  async destroy(key: string): Promise<number> {
    const md5_key = crypto
      .pbkdf2Sync(key, saltBuffer, 10000, 64, "sha1")
      .toString("base64");
    return await this.redis.del(md5_key);
  }
}

export default RedisDB;
