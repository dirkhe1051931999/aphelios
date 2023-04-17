import * as path from "path";
interface Config {
  db: {
    mysql: {
      host: string;
      user: string;
      port: number,
      password: string;
      database: string;
      connectionLimit: number;
    };
    redis: {
      port: number;
      host: string;
      db: number;
      options: {
        return_buffers: boolean;
        auth_pass: string;
      };
    };
    db_salt: string;
  };
  oAuth: {
    github: {
      client_id: string;
      client_secret: string;
    };
    wechat: {
      appId: string,
      appSecret: string
      auth_callback_url: string
    }
  };
  root: string;
  appPath: string;
  resetPasswordUrl: string;
  defaultCdnUrl: string;
  tempUploads: string;
  uploads: string;
  port: number;
  tokenSecret: string;
  isUpdateAdmin: boolean;
  accessControlAllowOrigin: string;
  adminName: string;
  adminPassword: string;
  socketioPath: string;
  draftPostRedisKey: string;
  aliCloudApi: string;
  aliCloud_APPCODE: string;
}
const config: Config = {
  db: {
    mysql: {
      host: "192.168.200.128",
      user: "root",
      password: "123456",
      port: 3310,
      database: "nodejs-service",
      connectionLimit: 10,
    },
    redis: {
      port: 6380,
      host: "192.168.200.128",
      db: 3,
      options: {
        return_buffers: false,
        auth_pass: "",
      },
    },
    db_salt: "LGGKqbCrRKRnywHv3uqFZw==",
  },
  oAuth: {
    github: {
      client_id: "b0fbc6a7d4ff2b320158",
      client_secret: "a02a9f6bac91f3acee2dc8aae86513bc2a94a6b6",
    },
    wechat: {
      appId: 'wx48f0181992fa8676',
      appSecret: 'd581afc54ddedf1a6ffef37d8b6d2c18',
      auth_callback_url: 'http://192.168.200.128:3000/oauth/wechat/callback',
    }
  },
  root: path.normalize(__dirname + "/.."),
  appPath: "src/static",
  resetPasswordUrl: "http://192.168.200.128:9002/index.html#/login?token=",
  defaultCdnUrl: "http://192.168.200.128:3000/cdn",
  tempUploads: "tempUploads",
  uploads: "uploads",
  port: 3000,
  tokenSecret: "test",
  isUpdateAdmin: false,
  accessControlAllowOrigin: "http://192.168.200.128:3000",
  adminName: "admin",
  adminPassword: "123456",
  socketioPath: "/testsocketiopath",
  draftPostRedisKey: "DRAFTPSOTKEY",
  aliCloudApi: "",
  aliCloud_APPCODE: "",
};
export default config;
