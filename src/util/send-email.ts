import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
export const sendMail = async (data): Promise<void> => {
  const { to, subject, html } = data;
  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: true,
      auth: {
        user: "1051931999@qq.com",
        pass: "ryqgvrfrrxzobbff",
      },
    })
  );
  const mailOptions = {
    from: "1051931999@qq.com",
    to,
    subject,
    html: html,
  };
  try {
    // 发送邮件
    await transporter.sendMail(mailOptions);
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
};
