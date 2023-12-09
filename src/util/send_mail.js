const db_mysql = require("../util/database_msql");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const sendMailWithCode = async (mailObj) => {
  const { from, to, subject, text, code, successfulSend } = mailObj;
  try {
    let transporter = nodemailer.createTransport({
      service: "yahoo",
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      logger: true,
    });

    ejs.renderFile(
      path.resolve(__dirname, "mail.ejs"),
      { code: code },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          transporter.sendMail(
            { from: from, to: to, subject: subject, text: text, html: data },
            (error, info) => {
              if (error) {
                console.log(error);
                transporter.close();
              } else {
                console.log("Email sent: " + info.response);
                const expire_at = new Date();
                expire_at.setMinutes(expire_at.getMinutes() + 10);
                const expire_at_mysql = expire_at
                  .toLocaleTimeString()
                  .replace("AM", "")
                  .replace("PM", "")
                  .trim();
                db_mysql.execute(
                  "INSERT INTO expiring_code(email, code, expire_at) VALUES (?, ?, ?)",
                  [to, code, expire_at_mysql],
                );
                transporter.close();
                successfulSend();
              }
              console.log("MessageId : ", info.messageId);
            },
          );
        }
      },
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`,
    );
  }
};

module.exports = sendMailWithCode;
