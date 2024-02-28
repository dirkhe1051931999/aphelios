import * as crypto from 'crypto';
import * as formidable from 'formidable';
import * as fs from 'fs';
import * as path from 'path';
import CONFIG from '../config';
import setting from '../config';
import moment from 'moment';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import NodeRSA from 'node-rsa';
import { getExtension, getType } from './mime';


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
          function(err, objInfo) {
            if (err) {
              reject(err);
            }
            fs.unlinkSync(tempPath);
            resolve({
              url: `/${CONFIG.db.minio.buckets}/${newName}`,
              data: withData ? fields : null,
            });
          },
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
    const extension = getExtension(mimeType) || 'bin';
    const imagePath = path.join(CONFIG.root, CONFIG.appPath, CONFIG.tempUploads);
    const imageName = uuidv4().replace(/\-/g, '');
    const tempPath = imagePath + '/' + imageName + '.' + extension;
    const newName = `${dir}/${imageName}.${extension}`;
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }
    fs.writeFileSync(tempPath, imageBuffer);
    minioClient.fPutObject(CONFIG.db.minio.buckets, newName, tempPath, { 'Content-Type': mimeType }, function(err, objInfo) {
      if (err) {
        reject(err);
      }
      fs.unlinkSync(tempPath);
      resolve({ url: `/${CONFIG.db.minio.buckets}/${newName}` });
    });
  });
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

export function isFieldFile(ctx: any, fieldNames: string[]): Promise<{ [key: string]: any }> {
  return new Promise((resolve, reject) => {
    const form: any = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true; // 保留后缀
    form.maxFieldsSize = 200 * 1024 * 1024; // 文件大小200M
    form.multiples = true;
    form.uploadDir = path.join(CONFIG.root, CONFIG.appPath, CONFIG.tempUploads);
    mkdirsSync(form.uploadDir);
    const result: { [key: string]: any } = {};
    form.parse(ctx.req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      // 根据提供的字段名判断是否为文件
      fieldNames.forEach((fieldName) => {
        if (files[fieldName]) {
          const extension = path.extname(files[fieldName].originalFilename); // 获取文件扩展名
          const newFileName = path.join(form.uploadDir, uuidv4().replace(/\-/g, '') + extension);
          fs.renameSync(files[fieldName].filepath, newFileName); // 重命名文件，加上扩展名
          result[fieldName] = {
            type: 'file',
            extension,
            value: newFileName,
          }; // 是文件
        } else {
          result[fieldName] = {
            type: 'string',
            value: fields[fieldName],
          }; // 不是文件
        }
      });
      resolve(result);
    });
  });
}

export function fileToBase64(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        console.error('Error reading file:', readErr);
        reject(readErr);
        return;
      }
      // 使用mime库获取文件的MIME类型
      const mimeType = getType(filePath) || 'application/octet-stream';
      // 将文件内容转换为Base64字符串，并添加适当的前缀
      const base64File = `data:${mimeType};base64,` + data.toString('base64');
      // 解析成功，将Base64编码的文件内容解析为Promise的解析值
      resolve(base64File);
    });
  });
}

export function transformResultsWithPrefix(prefix, resultsArray) {
  return resultsArray.map(row => {
    const transformedRow = { ...row }; // Clone the original row to avoid mutating it
    const nestedObject = {}; // This will hold the values corresponding to the prefix
    let prefixExists = false; // Flag to check if any key starts with the prefix
    for (const [key, value] of Object.entries(transformedRow)) {
      if (key.startsWith(prefix)) {
        const newKey = key.slice(prefix.length); // Remove the prefix
        nestedObject[newKey] = value; // Add the value to the nested object
        delete transformedRow[key]; // Remove the prefixed key-value pair from the original row
        prefixExists = true; // Set the flag
      }
    }
    // Add the nested object back to the original row only if the prefix exists
    if (prefixExists) {
      transformedRow[prefix.slice(0, -1)] = nestedObject;
    }
    return transformedRow;
  });
}

export const rsaDecrypt = (data: string): string => {
  let pk = CONFIG.rsaPrivateKey;
  let encrypt = new NodeRSA(pk);
  encrypt.setOptions({ encryptionScheme: 'pkcs1' });
  return encrypt.decrypt(data, 'utf8');
};

export const rsaEncrypt = (data: string): string => {
  let pk = CONFIG.rsaPublicKey;
  let encrypt = new NodeRSA(pk);
  encrypt.setOptions({ encryptionScheme: 'pkcs1' });
  return encrypt.encrypt(data, 'base64');
};


// 遍历数组，给指定的字段加上前缀
export const addPrefixToFields = (arr) => {
  const prefix = `http://${setting.db.minio.endPoint}:${setting.db.minio.port}`;
  const fields = ['companyLicense', 'avatarUrl', 'coverUrl', 'source', 'poster', 'videoPoster', 'videoUrl', 'cover'];
  const objectFields = ['galleries'];

  for (let item of arr) {
    for (let key in item) {
      if (!item[key]) continue;
      if (fields.includes(key) && typeof item[key] === 'string' && !item[key].startsWith(prefix) && item[key].indexOf('data:image') === -1) {
        if (isCdnAvatar(item[key])) {
          item[key] = replacePrefixForText2(item[key]);
        } else {
          item[key] = `${prefix}${item[key]}`;
        }
      } else if (objectFields.includes(key) && Array.isArray(item[key])) {
        item[key] = item[key].map(innerItem => innerItem.startsWith(prefix) ? innerItem : `${prefix}${innerItem}`);
      }
      if (key === 'content') {
        item[key] = replacePrefix(item[key]);
      }

    }
  }
  return arr;
};
// 替换一大段文本的前缀

export const replacePrefix = (str) => {
  if (!str) return str;
  str = ensureImgSrcQuoted(str);
  const regex = /['"]\/blog-service-oss\/(.*?)['"]/g;
  const subst = `"http://${setting.db.minio.endPoint}:${setting.db.minio.port}/blog-service-oss/$1"`;
  return str.replace(regex, subst);
};

// 替换普通文本的前缀
export const replacePrefixForText = (str) => {
  if (!str) return str;
  return `http://${setting.db.minio.endPoint}:${setting.db.minio.port}${str}`;
};

export const replacePrefixForText2 = (str) => {
  if (!str) return str;
  return `${setting.accessControlAllowOrigin}${str}`;
};

// 编辑加了前缀的数据，去掉前缀
export const removePrefixFromFields = (data: string | object) => {
  let prefix = `http://${setting.db.minio.endPoint}:${setting.db.minio.port}`;
  if (typeof data === 'string' && data.indexOf('data:image') === -1 && data) {
    return data.replace(new RegExp(prefix, 'g'), '');
  }
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string' && item.indexOf('data:image') === -1) {
        return item.replace(new RegExp(prefix, 'g'), '');
      }
      return item;
    });
  }
  if (typeof data === 'object' && data) {
    for (let key in data) {
      if (typeof data[key] === 'string' && data[key].indexOf('data:image') === -1) {
        data[key] = data[key].replace(new RegExp(prefix, 'g'), '');
      }
    }
  }
  return data;
};
// 读static/cdn/avatar 下面的文件，返回文件名数组，判断传入的path是否是否包含数组里面的某一个文件名，如果包含，就返回true
export const isCdnAvatar = (url) => {
  const avatarDir = path.join(CONFIG.root, CONFIG.appPath, 'cdn/avatar');
  const avatarFiles = fs.readdirSync(avatarDir);
  return avatarFiles.some(fileName => url.indexOf(fileName) !== -1);
};

function ensureImgSrcQuoted(html) {
  return html.replace(/<img\s+([^>]*?)src=(?:(["'])(.*?)\2|([^\s>]+))(.*?)>/gi, (match, prefix, quote, srcWithQuote, srcWithoutQuote, suffix) => {
    const src = srcWithQuote || srcWithoutQuote;
    return `<img ${prefix}src='${src}'${suffix}>`;
  });
}
