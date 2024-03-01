const { name } = require('./package.json');
module.exports = {
  apps: [
    {
      name, // 应用名称
      instances: 2,
      watch: true, // 是否监听文件变化重启应用
      autorestart: true, // 应用崩溃后自动重启
      args: 'start', // 启动命令
      script: './node_modules/nuxt/bin/nuxt.js', // Nuxt 启动脚本
      interpreter: '/root/.nvm/versions/node/v18.16.0/bin/node', // 使用 Babel 解释器
      env: {
        NODE_ENV: 'production', // 设置环境变量
        HOST: '0.0.0.0', // 应用监听的主机地址
      },
    },
  ],
};
