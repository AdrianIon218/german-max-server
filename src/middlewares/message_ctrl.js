const { insertMessage } = require("../supabase-services/contact_api");

module.exports.addMessage = (req, res) => {
  const { email, topic, message } = req.body;
  
  insertMessage(email, topic, message)
    .then(() => {
      res.json({ status: "sent" });
    })
    .catch((err) => {
      console.error(err);
      res.json({ status: "error" });
    });
};
