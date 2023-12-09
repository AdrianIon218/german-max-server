const db_mysql = require("../util/database_msql");

module.exports.addMessage = (req, res) => {
  const { email, topic, message } = req.body;
  db_mysql
    .execute(
      "INSERT INTO message (email_sender, topic, message) VALUES (?, ?, ? )",
      [email, topic, message],
    )
    .then(() => {
      res.json({ status: "sent" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: "error" });
    });
};
