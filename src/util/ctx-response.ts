"use strict";

import { Context } from "koa";
import { errorCode } from "./code";

/**
 * response
 * @param ctx
 * @param data 数据
 * @param code 错误码
 * @param message 错误描述
 */
const response = (ctx: Context, data, code, message) => {
  ctx.body = {
    data,
    code,
    success: code === 200 ? true : false,
    message,
  };
};

/**
 * response 成功
 * @param ctx
 * @param data 数据
 */
export const success = (ctx: Context, header, data) => {
  response(ctx, data, 200, "SUCCESS");
};

/**
 * response 异常
 * @param ctx
 * @param code 错误码
 */
export const error = (ctx: Context, heaadr, code: string | number) => {
  let message =
    ctx.request.headers["language"] == "zh_CN"
      ? errorCode[code][0]
      : errorCode[code][1];
  response(ctx, null, code, message);
};
