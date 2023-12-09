const express = require("express");
const router = express.Router();
const user_ctrl = require("../middlewares/user_ctrl");

router.post("/checkEmail", user_ctrl.isEmailInUse);
router.post("/addNewUser", user_ctrl.addUser);

module.exports = router;
