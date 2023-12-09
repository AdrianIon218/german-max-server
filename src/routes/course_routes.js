const express = require("express");
const router = express.Router();
const course_ctrl = require("../middlewares/course_ctrl");

router.get("/", course_ctrl.getAllModulesWithLessons);

module.exports = router;
