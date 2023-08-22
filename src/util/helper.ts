import * as crypto from 'crypto';
import * as formidable from 'formidable';
import * as fs from 'fs';
import * as path from 'path';
import CONFIG from 'src/config';
import moment from 'moment';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import NodeRSA from 'node-rsa';
import mime from 'mime';
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
export const uploadFileToMinio = (ctx: any, withData, dir): Promise<any> => {
  return new Promise((resolve, reject) => {
    const form: any = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true; // 保留后缀
    form.maxFieldsSize = 200 * 1024 * 1024; // 文件大小200M
    form.multiples = true;
    form.uploadDir = path.join(CONFIG.root, CONFIG.appPath, CONFIG.tempUploads);
    mkdirsSync(form.uploadDir);
    form.parse(ctx.req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      Object.keys(files).forEach((key) => {
        const file = files[key];
        const tempPath = file.filepath; // 使用file.path获取文件的临时路径
        const extension = file.originalFilename.split('.').pop();
        const newName = dir ? `${dir}/${uuidv4().replace(/\-/g, '')}.${extension}` : `${moment().format('YYYYMMDD')}/${uuidv4().replace(/\-/g, '')}.${extension}`;
        minioClient.fPutObject(
          CONFIG.db.minio.buckets,
          newName,
          tempPath,
          { 'Content-Type': file.type || 'application/octet-stream' }, // 使用file.type获取MIME类型
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
export const uploadBase64FileToMinio = (base64: any, dir: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const match = base64.match(/^data:(.+);base64,/);
    if (!match) {
      reject(new Error('Invalid base64 format'));
      return;
    }
    base64 = base64.replace(/^data:.+;base64,/, '');
    const mimeType = match[1];
    const imageBuffer = Buffer.from(base64, 'base64');
    const extension = mime.getExtension(mimeType) || 'bin';
    const imagePath = path.join(CONFIG.root, CONFIG.appPath, CONFIG.tempUploads);
    const imageName = uuidv4().replace(/\-/g, '');
    const tempPath = imagePath + '/' + imageName + '.' + extension;
    const newName = `${dir}/${imageName}.${extension}`;
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }
    fs.writeFileSync(tempPath, imageBuffer);
    minioClient.fPutObject(CONFIG.db.minio.buckets, newName, tempPath, { 'Content-Type': mimeType }, function (err, objInfo) {
      if (err) {
        reject(err);
      }
      fs.unlinkSync(tempPath);
      resolve({ url: `http://${CONFIG.db.minio.endPoint}:${CONFIG.db.minio.port}/${CONFIG.db.minio.buckets}/${newName}` });
    });
  });
};
export const rsaDecrypt = (data: string): string => {
  let pk = CONFIG.rsaPrivateKey;
  let encrypt = new NodeRSA(pk);
  encrypt.setOptions({ encryptionScheme: 'pkcs1' });
  let encrypted = encrypt.decrypt(data, 'utf8');
  return encrypted;
};
export function formatDate(input: Date | number | null, format: string = 'yyyy-MM-dd hh:mm:ss'): string {
  if (!input || (typeof input === 'number' && input <= 0)) {
    return 'Invalid date';
  }
  let date: Date;
  if (typeof input === 'number') {
    date = new Date(input);
  } else {
    date = input;
  }
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  const replaceMap: { [key: string]: string } = {
    yyyy: String(date.getFullYear()),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
    hh: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };
  let formattedDate = format;
  for (const key in replaceMap) {
    formattedDate = formattedDate.replace(key, replaceMap[key]);
  }
  return formattedDate;
}
