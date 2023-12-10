require("dotenv").config();
const db_mysql = require("../util/database_msql");
const bcrypt = require("bcrypt");
const sendMailWithCode = require("../util/send_mail");
const { generateCode } = require("../util/simple_functions");
const { selectUserByEmail, insertUser } = require("../supabase-services/user_api");

module.exports.areUserCredentialsValid = (req, res) => {
  const { email, password } = req.body;

  selectUserByEmail(email).then(async (users)=>{
    if (users.length === 0) {
      res.json({ status: "NO_USER" });
    } else {
      if (await bcrypt.compare(password, users[0].password)) {
        res.json({ status: "USER_OK", lastLevel: users[0].last_level });
      } else {
        console.log(password, users[0])
        res.json({ status: "PASS_INCORECT" });
      } 
    }
  }).catch((err) => {
    console.log(err);
    res.json({ status: "ERROR" });
  });
};

module.exports.isEmailInUse = (req, res) => {
  const { email } = req.body;
  
  selectUserByEmail(email).then((users)=>{
      if (users.length > 0) {
        res.json({ isEmailAvailable: false });
      } else {
        res.json({ isEmailAvailable: true });
      }
   }).catch((err) => {
    console.log(err);
  });
};

module.exports.addUser = async (req, res) => {
  const { email, name, password, level } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPass = await bcrypt.hash(password, salt);

  insertUser(email, hashPass, name, level).then(() => {
    res.json({ isUserAdded: true });
  })
  .catch((err) => {
    console.log(err);
    res.json({ isUserAdded: false });
  });
};

module.exports.resetPass = async (req, res) => {
  const { email } = req.body;
  db_mysql.execute("DELETE FROM expiring_code WHERE email = ?", [email]);

  const succesHandler = (email, code) => {
    setTimeout(
      () => {
        db_mysql.execute(
          "DELETE FROM expiring_code WHERE email = ? AND code = ?",
          [email, code],
        );
      },
      10 * 60 * 1000,
    );
    res.json({ status: true });
  };

  try {
    const code = generateCode(6);
    const result = await sendMailWithCode({
      from: process.env.USER,
      to: email,
      subject: "Resetare parolă cont GermanMax",
      text: "",
      code: code,
      successfulSend: () => {
        succesHandler(email, code);
      },
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      status: false,
    });
  }
};

module.exports.code_expire_time = (req, res) => {
  const { email } = req.body;
  db_mysql
    .execute(
      "SELECT expire_at FROM expiring_code WHERE email = ? ORDER BY id DESC",
      [email],
    )
    .then(([code]) => {
      if (code.length > 0) {
        res.json({ status: true, expire_at: code[0].expire_at });
      } else {
        res.json({ status: false });
      }
    });
};

module.exports.verify_reset_code = (req, res) => {
  const { email, enteredCode } = req.body;
  db_mysql
    .execute(
      "SELECT code FROM expiring_code WHERE email = ? ORDER BY id DESC",
      [email],
    )
    .then(([codes]) => {
      const { code } = codes[0];
      res.json({ status: true, isCorrect: code.trim() === enteredCode });
    })
    .catch((err) => {
      console.log("Error :", err);
      res.json({ status: false, isCorrect: false });
    });
};

module.exports.newPassword = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPass = await bcrypt.hash(password, salt);
  db_mysql
    .execute("UPDATE user SET password = ? WHERE email = ?", [hashPass, email])
    .then(() => {
      res.json({ status: true });
    })
    .catch((err) => {
      console.error(err);
      res.json({ status: false });
    });
};

module.exports.modify_last_level = (req, res) => {
  const { userEmail, level } = req.body;
  db_mysql
    .execute("UPDATE user SET last_level = ? WHERE email = ?", [
      level,
      userEmail,
    ])
    .then(() => {
      res.json({ status: true });
    })
    .catch((err) => {
      console.error(err);
      res.json({ status: false });
    });
};
