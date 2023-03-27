import Redis from "ioredis";
import { Store } from "koa-session2";

class RedisStore extends Store {
  redis: any;

  constructor(redisConfig: any) {
    super();
    this.redis = new Redis(redisConfig);
  }

  async get(sid: string, ctx?: any) {
    let data = await this.redis.get(`SESSION:${sid}`);
    return JSON.parse(data);
  }

  async set(
    session: any,
    { sid = this.get("24"), maxAge = 1000000 } = {},
    ctx?: any
  ) {
    try {
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(
        `SESSION:${sid}`,
        JSON.stringify(session),
        "EX",
        maxAge / 1000
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async destroy(sid: string, ctx?: any) {
    return await this.redis.del(`SESSION:${sid}`);
  }
}

export default RedisStore;
