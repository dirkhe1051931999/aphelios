import * as crypto from "crypto";
import * as formidable from "formidable";
import * as fs from "fs";
import * as path from "path";
import CONFIG from "src/config";
import moment from "moment";

/**
 * Make salt
 *
 * @return {string}
 * @api public
 */
export const makeSalt = (): string => {
  return crypto.randomBytes(16).toString("base64");
};

/**
 * Encrypt password
 *
 * @param {string} password
 * @return {string}
 * @api public
 */
export const encryptPassword = (password: string, salt: string): string => {
  if (!password || !salt) return "";
  const saltBuffer = Buffer.from(salt, "base64");
  const sugar = "!@A#$Q%W^E&R*T()_+a_1";
  const newPassword = crypto
    .createHash("md5")
    .update(sugar + password)
    .digest("hex");
  return crypto
    .pbkdf2Sync(newPassword, saltBuffer, 10000, 64, "sha1")
    .toString("base64");
};
/**
 * Encrypt input password
 *
 * @param {string} password
 * @return {string}
 * @api public
 */
export const encryptInputPassword = (
  password: string,
  salt: string
): string => {
  if (!password || !salt) return "";
  const saltBuffer = Buffer.from(salt, "base64");
  return crypto
    .pbkdf2Sync(password, saltBuffer, 10000, 64, "sha1")
    .toString("base64");
};

function mkdirsSync(dirname: string): boolean {
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
interface UploadResponse {
  fields: { [key: string]: any };
  filePath: string;
}
export const uploadFile = (ctx: any): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.keepExtensions = true; // 保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小2M
    form.multiples = true;

    form.uploadDir = path.join(CONFIG.root, CONFIG.appPath, CONFIG.tempUploads);
    mkdirsSync(form.uploadDir);
    // 解析文件
    form.parse(ctx.req, (err, fields, files) => {
      console.log("->>>>>>>", fields);
      if (err) {
        reject(err);
      }
      const data = JSON.parse(fields.data);
      // 更新时未修改图片的情况
      if (files.uploadFile === undefined && data.poster !== "") {
        return resolve({
          fields: data,
          filePath: data.poster,
        });
      }
      let filePath = "";
      // 如果提交文件的form中将上传文件的input名设置为uploadFile，就从uploadFile中取上传文件。否则取for in循环第一个上传的文件。
      if (files.uploadFile) {
        filePath = files.uploadFile.path;
      } else {
        for (const key in files) {
          if (files[key].path && filePath === "") {
            filePath = files[key].path;
            break;
          }
        }
      }
      //文件移动的目录文件夹，不存在时创建目标文件夹
      const dirName = moment().format("YYYYMMDD");
      const targetDir = path.join(
        CONFIG.root,
        CONFIG.appPath,
        CONFIG.uploads,
        dirName
      );
      mkdirsSync(targetDir);

      //以当前时间戳对上传文件进行重命名
      const fileExt = filePath.substring(filePath.lastIndexOf("."));
      const fileName = new Date().getTime() + fileExt;
      const targetFile = path.join(targetDir, fileName);
      //移动文件
      fs.rename(filePath, targetFile, (err) => {
        if (err) {
          reject(err);
        } else {
          //上传成功，返回文件的相对路径
          return resolve({
            fields: data,
            filePath: path.join(path.sep, CONFIG.uploads, dirName, fileName),
          });
        }
      });
    });
    ctx.session.fileUploadProgress = 0;
    // 文件上传中事件
    form.on("progress", (bytesReceived, bytesExpected) => {
      // 百分比
      const percent = Math.round((bytesReceived / bytesExpected) * 100);
      console.log("precent", percent);
      ctx.session.fileUploadProgress = percent;
    });
    form.on("end", () => {
      ctx.session.fileUploadProgress = 100;
    });
  });
};
