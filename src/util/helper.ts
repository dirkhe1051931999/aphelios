import * as crypto from 'crypto';
import * as formidable from 'formidable';
import * as fs from 'fs';
import * as path from 'path';
import CONFIG from 'src/config';
import moment from 'moment';

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
export const uploadImage = (ctx: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
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
      const arr = [];
      Object.keys(files).forEach((key) => {
        const file = files[key];
        const tempPath = file.filepath;
        const dirPath = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/post/')}${moment().format('YYYYMMDD')}`;
        const newName = `${file.newFilename}.${file.originalFilename.split('.').pop()}`;
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        const newPath = path.join(dirPath, newName);
        fs.rename(tempPath, newPath, (err) => {
          if (err) {
            reject(err);
          }
        });
        arr.push(CONFIG.defaultCdnUrl.split('/cdn')[0] + newPath.split(CONFIG.appPath).pop());
      });
      resolve(arr);
    });
  });
};
export const uploadPDF = (ctx: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true; // 保留后缀
    form.maxFieldsSize = 200 * 1024 * 1024; // 文件大小2M
    form.multiples = true;
    form.uploadDir = path.join(CONFIG.root, CONFIG.appPath, 'cdn/post_author_verify_pdf/');
    mkdirsSync(form.uploadDir);
    form.parse(ctx.req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      const arr = [];
      Object.keys(files).forEach((key) => {
        const file = files[key];
        const tempPath = file.filepath;
        const dirPath = `${path.join(CONFIG.root, CONFIG.appPath, 'cdn/post_author_verify_pdf/')}${moment().format('YYYYMMDD')}`;
        const newName = `${file.newFilename}.${file.originalFilename.split('.').pop()}`;
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        const newPath = path.join(dirPath, newName);
        fs.rename(tempPath, newPath, (err) => {
          if (err) {
            reject(err);
          }
        });
        arr.push(CONFIG.defaultCdnUrl.split('/cdn')[0] + newPath.split(CONFIG.appPath).pop());
      });
      arr.push(fields);
      resolve(arr);
    });
  });
};