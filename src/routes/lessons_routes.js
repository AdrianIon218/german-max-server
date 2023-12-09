const express = require("express");
const router = express.Router();
const lessonsCtrl = require("../middlewares/lessons_ctrl");

router.post("/getWords", lessonsCtrl.getWords);

router.post("/addProgress", lessonsCtrl.addProgres);

router.post("/grammer", lessonsCtrl.getGrammerLesson);

router.post("/grammer/getExercises", lessonsCtrl.getGrammerExercises);
module.exports = router;
