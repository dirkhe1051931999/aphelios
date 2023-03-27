import Redis from "ioredis";

class DraftRedis {
  private redis: any;

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
    maxAge = 7 * 24 * 60 * 60 * 1000
  ): Promise<string> {
    try {
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(key, JSON.stringify(data), "EX", maxAge / 1000);
    } catch (e) {}
    return "success";
  }

  async destroy(key: string): Promise<number> {
    return await this.redis.del(key);
  }
}

export default DraftRedis;
