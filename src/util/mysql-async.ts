import mysql from "mysql";
import CONFIG from "src/config";

const pool = mysql.createPool({
  host: CONFIG.db.mysql.host,
  user: CONFIG.db.mysql.user,
  password: CONFIG.db.mysql.password,
  database: CONFIG.db.mysql.database,
  connectionLimit: CONFIG.db.mysql.connectionLimit,
});

const query = function (sql: string, values?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          connection.release();
          if (err) {
            return reject(err);
          } else {
            return resolve(rows);
          }
        });
      }
    });
  });
};

export default query;
