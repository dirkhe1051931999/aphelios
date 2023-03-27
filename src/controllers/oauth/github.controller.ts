import CONFIG from "src/config";
import sqlQuery from "../../util/mysql-async";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import moment from "moment";
import jwt from "jsonwebtoken";

// 吊起github登录
export const githubOAuth = async (ctx) => {
  const code = ctx.query.code;
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
    .then((res: any) => {
      const args = res.split("&");
      let arg = args[0].split("=");
      return arg[1];
    })
    .then(async (token) => {
      const url = " https://api.github.com/user?access_token=" + token;
      await axios(url).then(async (res: any) => {
        let userId = 0;
        let selectGuest = await sqlQuery(
          `SELECT * FROM user WHERE role = 'GUEST' AND userName = ?`,
          [res.login]
        );
        if (selectGuest.length > 0) {
          userId = selectGuest[0].id;
          await sqlQuery(`UPDATE user SET avatar = ?, email = ? WHERE id = ?`, [
            res.avatar_url,
            res.email,
            userId,
          ]);
        } else {
          let newGuest = {
            userName: res.login,
            avatar: res.avatar_url,
            email: res.email,
            role: "GUEST",
            createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          let insertGuest = await sqlQuery(`INSERT INTO user SET ?`, newGuest);
          if (insertGuest.affectedRows > 0) {
            userId = insertGuest.insertId;
          }
        }
        if (userId > 0) {
          ctx.session.user = res.login;
          // 用户token
          const userToken = {
            name: res.login,
            id: userId,
          };
          // 签发token
          const token = jwt.sign(userToken, CONFIG.tokenSecret, {
            expiresIn: "2h",
          });
          ctx.body = {
            success: 1,
            token: token,
            id: userId,
            userName: res.login,
            avatar: res.avatar_url,
            message: "",
          };
        } else {
          ctx.body = {
            success: 0,
            token: "",
            message: "GitHub授权登录失败",
          };
        }
      });
    })
    .catch((e) => {
      console.log(e);
      ctx.body = {
        success: 0,
        token: "",
        message: "GitHub授权登录失败",
      };
    });
};
