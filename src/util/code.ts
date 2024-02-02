const webErrorCode = {
  W1000: ['查询异常', 'Query exception'],
  W2000: ['操作异常', 'Operation exception'],
  W1001: ['sortBy只支持id，createTime，view，comment排序', 'sortBy only supports id, createTime, view, comment sorting'],
  W1002: ['缺少必传参数id', 'Missing required parameter id'],
  W1003: ['缺少关键字', 'Missing keywords'],
  W1004: ['缺少用户名或密码', 'Missing username or password'],
  W1005: ['用户不存在', 'User does not exist'],
  W1006: ['账号和密码不匹配', 'Account and password do not match'],
  W1007: ['用户已存在', 'User already exists'],
  W1008: ['重置密码链接失效', 'Reset password link invalid'],
  W1009: ['验证码无效', 'Verification code is invalid'],
  W1010: ['验证码错误', 'Verification code error'],
};
export const errorCode = {
  ...webErrorCode,
  500: ['服务器内部错误', 'Internal server error'],
  401: ['Token 失效', 'Token invalid'],
  402: ['查询异常', 'Query exception'],
  404: ['不能为空', 'cannot be empty'],
  405: ['操作异常', 'Operation exception'],
  100: ['用户名，密码，验证码不能为空', 'User name or password cannot be empty'],
  101: ['用户名或密码错误', 'User name or password error'],
  102: ['用户不存在', 'User does not exist'],
  103: ['Token 过期', 'Token expired'],
  104: ['用户名，密码，新密码不能为空', 'Username, password, new password cannot be empty'],
  105: ['旧密码错误', 'Old password error'],
  106: ['查询用户数据异常', 'Query user data exception'],
  107: ['用户ID不合法', 'User ID is not valid'],
  108: ['用户名不存在', 'Email does not exist'],
  109: ['邮箱发送失败', 'Email send failed'],
  110: ['查询用户数据异常或邮箱发送失败', 'Query user data exception or email send failed'],
  111: ['Token 无效', 'Token is invalid'],
  112: ['查询Token有效期异常', 'Query Token validity period exception'],
  113: ['新密码和Token不能为空', 'New password and Token cannot be empty'],
  114: ['修改密码异常', 'Modify password exception'],
  115: ['验证码无效', 'Verification code is invalid'],
  116: ['用户已锁，请联系管理员解锁', 'User is locked, please contact the administrator'],
  117: ['用户已停用，请联系管理员启用', 'User is disabled, please contact the administrator'],
  118: ['用户设置密码链接过期，请联系管理员', 'User status exception, please contact the administrator'],
  119: ['初始化用户，请设置密码', 'Initialize user, please set password'],
  120: ['GitHub授权登录失败', 'GitHub authorization login failed'],
  301: ['用户已存在', 'User already exists'],
  302: ['邮箱已存在', 'Email already exists'],
  303: ['邮箱或用户已存在', 'Email already exists'],
  304: ['角色已存在', 'Role already exists'],
  305: ['手机号已存在', 'Phone number already exists'],
  606: ['图片上传异常', 'Image upload exception'],
  607: ['名称重复', 'Name already exists'],
  608: ['该企业已提交认证', 'The enterprise has been verified'],
  701: ['用户名已存在', 'Username already exists'],
  801: ['该分类下有数据，不允许删除', 'There is data under this category, deletion is not allowed'],
};
