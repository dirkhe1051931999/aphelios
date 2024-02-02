const { writeFileSync } = require('fs');
const { resolve } = require('path');

// 读取 JSON 文件
const variables = require('./assets/style/variables.json');

// 转换为 SCSS 变量
const scssVariables =
  `// 由json生成，请勿手动修改\n` +
  Object.entries(variables)
    .map(([key, value]) => {
      const scssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `$${scssKey}: ${value};`;
    })
    .join('\n');

// 写入 SCSS 文件
writeFileSync(resolve(__dirname, 'assets/style/variables.scss'), scssVariables);
console.log('写入完成');
