import { v4 as uuidv4 } from 'uuid';


// 添加事件踪迹
export const addEventTrack = async (ctx) => {
  // let ip = ctx.request.ip.replace("::ffff:", "");
  // let address: any = await axios(COFNIG.aliCloudApi + ip, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `APPCODE ${COFNIG.aliCloud_APPCODE}`,
  //   },
  // }).catch((e) => {
  //   console.log("addEventTrack(aliCloudApi-error):", e);
  // });
  // try {
  //   let postData = ctx.request.body;
  //   let eventTrack = {
  //     key: postData.key,
  //     ip: ip || "",
  //     data_id: postData.id || "",
  //     keyword: postData.keyword || "",
  //     province: address.province || "",
  //     city: address.city || "",
  //     createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
  //   };
  //   let insert = await ctx.execSql("INSERT INTO event_track SET ?", eventTrack);
  //   if (insert.affectedRows > 0) {
  //     ctx.body = {
  //       success: 1,
  //       message: "",
  //     };
  //   }
  // } catch (error) {
  //   console.log("addEventTrack(insert-error):", error);
  //   ctx.body = {
  //     success: 0,
  //     message: "上传数据出错",
  //   };
  // }
};
export const generateClientId = async (ctx) => {
  ctx.success(ctx, uuidv4());
};