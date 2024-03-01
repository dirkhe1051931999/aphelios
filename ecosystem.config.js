const { name } = require('./package.json');
module.exports = {
  apps: [
    {
      name, // 应用名称
      instances: 1,
      watch: true, // 是否监听文件变化重启应用
      autorestart: true, // 应用崩溃后自动重启
      interpreter: 'node@18.16.0', // 使用 Babel 解释器
      env: {
        NODE_ENV: 'production', // 设置环境变量
        HOST: '0.0.0.0', // 应用监听的主机地址
      },
    },
  ],
};
