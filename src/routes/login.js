const express = require("express");
const router = express.Router();
const user_ctrl = require("../middlewares/user_ctrl");

router.post("/", user_ctrl.areUserCredentialsValid);

router.post("/reset_pass", user_ctrl.resetPass);

router.post("/get_code_expire_time", user_ctrl.code_expire_time);

router.post("/verify_code_reset", user_ctrl.verify_reset_code);

router.post("/changePassword", user_ctrl.newPassword);

module.exports = router;
