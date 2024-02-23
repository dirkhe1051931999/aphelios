import moment from "moment";
import { makeSalt, encryptPassword } from "./helper";
import sqlQuery from "./mysql-async";
import CONFIG from "../config";

const account = {
  name: CONFIG.adminName,
  password: CONFIG.adminPassword,
};

export async function saveAdminAccount() {
  try {
    let salt = makeSalt();
    let hashedPassword = encryptPassword(account.password, salt);

    let selectAdmin = await sqlQuery(`SELECT * FROM user WHERE role='ADMIN'`);
    if (selectAdmin.length > 0) {
      let id = selectAdmin[0].id;
      await sqlQuery(
        `UPDATE user SET hashedPassword = ?, salt = ? WHERE id = ?`,
        [hashedPassword, salt, id]
      );
    } else {
      let newAdmin = {
        userName: account.name,
        hashedPassword: hashedPassword,
        salt: salt,
        role: "ADMIN",
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      await sqlQuery(`INSERT INTO user SET ?`, newAdmin);
    }
  } catch (error) {
    console.log("saveAdminAccount", error);
  }
}
