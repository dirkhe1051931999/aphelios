import mysql from 'mysql2';
import CONFIG from 'src/config';

const pool = mysql.createPool({
  host: CONFIG.db.mysql.host,
  user: CONFIG.db.mysql.user,
  port: CONFIG.db.mysql.port,
  password: CONFIG.db.mysql.password,
  database: CONFIG.db.mysql.database,
  connectionLimit: CONFIG.db.mysql.connectionLimit,
});

const query = function (sqls: string | string[], values?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (typeof sqls === 'string') {
        connection.query(sqls, values, (err, rows) => {
          connection.release();
          if (err) {
            return reject(err);
          } else {
            return resolve(rows);
          }
        });
      } else {
        // 开始事务
        connection.beginTransaction((err) => {
          if (err) {
            connection.release();
            return reject(err);
          }
          // 定义一个数组，用于保存多条 SQL 语句的执行结果
          const results = [];
          // 遍历 SQL 语句数组，依次执行每条 SQL 语句
          Promise.all(
            sqls.map((sql) => {
              return new Promise<void>((resolve, reject) => {
                connection.query(sql, values, (err, rows) => {
                  if (err) {
                    // 如果执行出错，回滚事务并释放连接
                    connection.rollback(() => {
                      connection.release();
                      console.log(err.message, sql);
                      reject(err);
                    });
                  } else {
                    // 将执行结果保存到数组中
                    results.push(rows);
                    resolve();
                  }
                });
              });
            })
          )
            .then(() => {
              // 如果所有 SQL 语句都执行成功，提交事务并释放连接
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    connection.release();
                    reject(err);
                  });
                } else {
                  connection.release();
                  resolve(results);
                }
              });
            })
            .catch((err) => {
              // 如果有任何一条 SQL 语句执行失败，回滚事务并释放连接
              connection.rollback(() => {
                connection.release();
                reject(err);
              });
            });
        });
      }
    });
  });
};

export default query;
