import * as path from "path";
interface Config {
  db: {
    mysql: {
      host: string;
      user: string;
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
  };
  oAuth: {
    github: {
      client_id: string;
      client_secret: string;
    };
  };
  root: string;
  appPath: string;
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
      host: "127.0.0.1",
      user: "root",
      password: "hejian",
      database: "nodejs-service",
      connectionLimit: 10,
    },
    redis: {
      port: 6379,
      host: "127.0.0.1",
      db: 3,
      options: {
        return_buffers: false,
        auth_pass: "",
      },
    },
  },
  oAuth: {
    github: {
      client_id: "b0fbc6a7d4ff2b320158",
      client_secret: "a02a9f6bac91f3acee2dc8aae86513bc2a94a6b6",
    },
  },
  root: path.normalize(__dirname + "/.."),
  appPath: "src/static",
  tempUploads: "tempUploads",
  uploads: "uploads",
  port: 3000,
  tokenSecret: "test",
  isUpdateAdmin: false,
  accessControlAllowOrigin: "http://127.0.0.1:3000",
  adminName: "admin",
  adminPassword: "123456",
  socketioPath: "/testsocketiopath",
  draftPostRedisKey: "DRAFTPSOTKEY",
  aliCloudApi: "",
  aliCloud_APPCODE: "",
};
export default config;
