import CONFIG from "src/config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import jwt from "jsonwebtoken";

// 吊起github登录
export const githubOAuth = async (ctx) => {
  const code = ctx.query.code;
  if (!code) {
    ctx.error(ctx, '404#code')
    return
  }
  // 接口
  let path = "https://github.com/login/oauth/access_token";
  // 参数
  const params = {
    client_id: CONFIG.oAuth.github.client_id,
    client_secret: CONFIG.oAuth.github.client_secret,
    code: code,
  };
  // 请求接口
  await axios(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(params),
  })
    .then(async (res: any) => {
      const args = res.data.split('&');
      let arg = args[0].split('=');
      const url = "https://api.github.com/user?access_token=" + arg[1];
      await axios(url, {
        method: "get",
        headers: {
          Authorization: "token " + arg[1],
          "Content-Type": "application/json",
        },
      }).then(async (result: any) => {
        let { login, avatar_url, email } = result.data;
        let userId = 0;
        let isRegisterUser = await ctx.execSql([
          `SELECT COUNT(*) as count, MAX(id) as id FROM user WHERE userName = '${login}'`,
        ]);
        console.log(isRegisterUser)
        if (isRegisterUser.length > 0 && isRegisterUser[0][0].count > 0) {
          userId = isRegisterUser[0][0].id
          await ctx.execSql([
            `UPDATE user SET avatar = '${avatar_url}', email = '${email}' WHERE id = ${userId}`,
          ]);
        } else {
          const result = await ctx.execSql([
            `INSERT INTO user (userName, avatar, email,role,createTime,userType)
            VALUES ('${login}', '${avatar_url}', '${email}', 'GUEST', ${new Date().getTime()}, 2)`,
          ]);
          if (result[0].affectedRows > 0) {
            userId = result[0].insertId;
          }
        }
        if (userId > 0) {
          ctx.session.user = res.login;
          // 用户token
          const userToken = {
            name: login,
            email,
            mobile: null,
            id: userId,
          };
          ctx.redisDB.set(
            `${email}-${login}-${userId}`,
            userToken,
            1000 * 60 * 60 * 24
          );
          // 签发token
          const token = jwt.sign(userToken, CONFIG.tokenSecret, {
            expiresIn: "24h",
          });
          const roleResult = await ctx.execSql(
            `SELECT permissionList FROM role WHERE name = 'GUEST'`
          );
          ctx.success(ctx, {
            token,
            email: email,
            mobile: null,
            id: userId,
            pagePermissionId: roleResult[0].permissionList,
          });
        } else {
          ctx.error(ctx, 120)
        }
      });
    })
    .catch((e) => {
      console.log(e);
      ctx.error(ctx, 120)
    });
};
