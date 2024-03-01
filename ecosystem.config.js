const { name } = require('./package.json');
const path = require('path');

module.exports = {
  apps: [
    {
      name,
      script: path.resolve(__dirname, './dist/index.js'),
      instances: 1,
      autorestart: true,
      watch: true,
      interpreter: '/root/.nvm/versions/node/v16.16.0/bin/node',
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080
      }
    }
  ]
};
