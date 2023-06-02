import { exec } from 'child_process';
import setting from '../config';

export function backupDatabase(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // 替换以下参数为你的 MySQL 配置
    const database = setting.db.mysql.database;
    const username = setting.db.mysql.user;
    const password = setting.db.mysql.password;
    const output = `${__dirname}/../../backup/${database}.sql`;

    // 执行 mysqldump 命令备份数据库
    const command = `mysqldump --user=${username} --password=${password} ${database} > ${output}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('备份数据库失败:', error);
        reject(error);
      } else {
        console.log('数据库备份成功');
        resolve();
      }
    });
  });
}
