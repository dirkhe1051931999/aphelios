import * as path from 'path';
interface Config {
  db: {
    mysql: {
      host: string;
      user: string;
      port: number;
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
    minio: {
      endPoint: string;
      port: number;
      useSSL: boolean;
      accessKey: string;
      secretKey: string;
      buckets: string;
    };
    db_salt: string;
  };
  oAuth: {
    github: {
      client_id: string;
      client_secret: string;
    };
    wechat: {
      appId: string;
      appSecret: string;
      auth_callback_url: string;
    };
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
  rsaPublicKey: string;
  rsaPrivateKey: string;
}
const config: Config = {
  db: {
    mysql: {
      host: '192.168.124.40',
      user: 'hejian',
      password: 'Hejian@123',
      port: 3306,
      database: 'nodejs-service',
      connectionLimit: 10,
    },
    redis: {
      port: 6380,
      host: '192.168.124.40',
      db: 3,
      options: {
        return_buffers: false,
        auth_pass: '',
      },
    },
    minio: {
      endPoint: '192.168.124.40',
      port: 9000,
      useSSL: false,
      accessKey: 'qrCX3RbPTSoryHikrxeI',
      secretKey: 'dfe4EJ5h5ca7mppvqL7l1gmuEcFbRLFO72200fbC',
      buckets: 'blog-service-oss',
    },
    db_salt: 'LGGKqbCrRKRnywHv3uqFZw==',
  },
  oAuth: {
    github: {
      client_id: 'b0fbc6a7d4ff2b320158',
      client_secret: 'a02a9f6bac91f3acee2dc8aae86513bc2a94a6b6',
    },
    wechat: {
      appId: 'wx48f0181992fa8676',
      appSecret: 'd581afc54ddedf1a6ffef37d8b6d2c18',
      auth_callback_url: 'http://192.168.200.130:3000/oauth/wechat/callback',
    },
  },
  root: path.normalize(__dirname + '/..'),
  appPath: 'src/static',
  resetPasswordUrl: 'http://localhost:9002/index.html#/login?token=',
  defaultCdnUrl: 'http://localhost:3000/cdn',
  tempUploads: 'tempUploads',
  uploads: 'uploads',
  port: 3000,
  tokenSecret: 'test',
  isUpdateAdmin: false,
  accessControlAllowOrigin: 'http://localhost:3000',
  adminName: 'admin',
  adminPassword: '123456',
  socketioPath: '/testsocketiopath',
  draftPostRedisKey: 'DRAFTPSOTKEY',
  aliCloudApi: '',
  aliCloud_APPCODE: '',
  rsaPublicKey: `-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK5oK2YRalfr6OjDcjkrljm0FFIFQ4iA/NYcoqIXkdVkmtTeBrcz+OSx39rOqT8xuuZVuTE++DcTwehr9mb1PmECAwEAAQ==-----END PUBLIC KEY-----`,
  rsaPrivateKey: `-----BEGIN PRIVATE KEY-----MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEArmgrZhFqV+vo6MNyOSuWObQUUgVDiID81hyioheR1WSa1N4GtzP45LHf2s6pPzG65lW5MT74NxPB6Gv2ZvU+YQIDAQABAkA1ibi4zmPMtZh7y3OG5UBqWkNaok8G2kHDIGs0QvP7gzLX4VW6L1seswq8IJLxKz5zU4ObkUBpxZmCjj7dy+zZAiEA2IZ4EeGVPdGfanfQKt1bt8ypey2Mfr9wie3JRF/SWM8CIQDOM/qjrlZPMSBV/f4Sp/+0LE10g6XnCpW2xKjWEHdhzwIgIulznLZ5wND22kzdRLwSWM1oGlNazukBNUwg4qRsnyMCIQCQLpZF10QwcXhbyJLcdq38TLIIE3lwuN0AhDhOHgtrzwIgMaBLSEmu8IJrXh7XuJwY+58udanJwDH8No+r41rcNec=-----END PRIVATE KEY-----`,
};
export default config;
