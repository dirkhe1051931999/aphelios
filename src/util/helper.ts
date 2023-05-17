import * as crypto from 'crypto';
import * as formidable from 'formidable';
import * as fs from 'fs';
import * as path from 'path';
import CONFIG from 'src/config';
import moment from 'moment';
import * as Minio from 'minio';
const minioClient = new Minio.Client({
  endPoint: CONFIG.db.minio.endPoint,
  port: CONFIG.db.minio.port,
  useSSL: CONFIG.db.minio.useSSL,
  accessKey: CONFIG.db.minio.accessKey,
  secretKey: CONFIG.db.minio.secretKey,
});
/**
 * Make salt
 *
 * @return {string}
 * @api public
 */
export const makeSalt = (): string => {
  return crypto.randomBytes(16).toString('base64');
};
/**
 * 判断是否是假值,0不是假值
 * @param data
 * @returns false or true
 */

export const hasEmptyValue = (data: any[]): boolean => {
  return data.some((value) => {
    return value === undefined || value === '' || value === false || value === 'false' || value === null;
  });
};
/**
 * Encrypt password
 *
 * @param {string} password
 * @return {string}
 * @api public
 */
export const encryptPassword = (password: string, salt: string): string => {
  if (!password || !salt) return '';
  const saltBuffer = Buffer.from(salt, 'base64');
  const sugar = '!@A#$Q%W^E&R*T()_+a_1';
  const newPassword = crypto
    .createHash('md5')
    .update(sugar + password)
    .digest('hex');
  return crypto.pbkdf2Sync(newPassword, saltBuffer, 10000, 64, 'sha1').toString('base64');
};
/**
 * Encrypt input password
 *
 * @param {string} password
 * @return {string}
 * @api public
 */
export const encryptInputPassword = (password: string, salt: string): string => {
  if (!password || !salt) return '';
  const saltBuffer = Buffer.from(salt, 'base64');
  return crypto.pbkdf2Sync(password, saltBuffer, 10000, 64, 'sha1').toString('base64');
};

export function mkdirsSync(dirname: string): boolean {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
/**
 * 上传文件
 */
export const uploadFileToMinio = (ctx: any, withData): Promise<any> => {
  return new Promise((resolve, reject) => {
    const form: any = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true; // 保留后缀
    form.maxFieldsSize = 200 * 1024 * 1024; // 文件大小2M
    form.multiples = true;
    form.uploadDir = path.join(CONFIG.root, CONFIG.appPath, CONFIG.tempUploads);
    mkdirsSync(form.uploadDir);
    form.parse(ctx.req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      Object.keys(files).forEach((key) => {
        const file = files[key];
        const tempPath = file.filepath;
        const newName = `${moment().format('YYYYMMDD')}/${file.newFilename}.${file.originalFilename.split('.').pop()}`;
        minioClient.fPutObject(
          CONFIG.db.minio.buckets,
          newName,
          tempPath,
          {
            'Content-Type': file.mimetype,
          },
          function (err, objInfo) {
            if (err) {
              reject(err);
            }
            fs.unlinkSync(tempPath);
            resolve({ url: `http://${CONFIG.db.minio.endPoint}:${CONFIG.db.minio.port}/${CONFIG.db.minio.buckets}/${newName}`, data: withData ? fields : null });
          }
        );
      });
    });
  });
};
