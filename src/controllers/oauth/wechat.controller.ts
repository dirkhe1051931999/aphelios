import CONFIG from "src/config"
import OAuth from 'wechat-oauth';
const oauth = new OAuth(CONFIG.oAuth.wechat.appId, CONFIG.oAuth.wechat.appSecret)
export const getAuthorizeURL = async (ctx) => {
  var url = oauth.getAuthorizeURL(CONFIG.oAuth.wechat.auth_callback_url, 'snsapi_login', 'snsapi_userinfo');
  ctx.success(ctx, url)
}
export const getAccessToken = async (ctx) => {
  console.log(ctx.request.query.code)
  // var code = req.query.code;
  //   client.getAccessToken(code, function (err, result) {
  //       console.log(result)
  //       var accessToken = result.data.access_token;
  //       var openid = result.data.openid;

  //       client.getUser(openid, function (err, result) {
  //           var userInfo = result;
  //           // save or other opration
  //           res.json(userInfo)
  //       });
  //   });
}