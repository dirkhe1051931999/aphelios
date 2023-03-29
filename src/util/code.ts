export const errorCode = {
  500: ["服务器内部错误", "Internal server error"],
  100: [
    "用户名，密码，验证码不能为空",
    "User name or password cannot be empty",
  ],
  101: ["用户名或密码错误", "User name or password error"],
  102: ["用户不存在", "User does not exist"],
  103: ["Token 过期", "Token expired"],
  104: [
    "用户名，密码，新密码不能为空",
    "Username, password, new password cannot be empty",
  ],
  105: ["旧密码错误", "Old password error"],
  106: ["查询用户数据异常", "Query user data exception"],
  107: ["用户ID不合法", "User ID is not valid"],
  108: ["用户名不存在", "Email does not exist"],
  109: ["邮箱发送失败", "Email send failed"],
  110: [
    "查询用户数据异常或邮箱发送失败",
    "Query user data exception or email send failed",
  ],
  111: ["Token 无效", "Token is invalid"],
  112: ["查询Token有效期异常", "Query Token validity period exception"],
  113: ["新密码和Token不能为空", "New password and Token cannot be empty"],
  114: ["修改密码异常", "Modify password exception"],
  115: ["验证码无效", "Verification code is invalid"],
  116: [
    "邮箱，用户名，userId不能为空",
    "Email, username, userId cannot be empty",
  ],
};
