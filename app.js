const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const login = require("./src/routes/login");
const course_router = require("./src/routes/course_routes");
const signup = require("./src/routes/signup");
const lessons = require("./src/routes/lessons_routes");
const course_ctrl = require("./src/middlewares/course_ctrl");
const user_ctrl = require("./src/middlewares/user_ctrl");
const message_ctrl = require("./src/middlewares/message_ctrl");

const app = express();
require("dotenv").config();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// https://dashboard.render.com/web/srv-clqder9jvg7s73e66eag/deploys/dep-clqderpjvg7s73e66efg
app.use("/login", login);
app.use("/course_modules", course_router);
app.get("/courses_available", course_ctrl.courses_available);
app.use("/signup", signup);
app.use("/lessons", lessons);
app.use("/contacts", message_ctrl.addMessage);
app.put("/user/update_last_level", user_ctrl.modify_last_level);
app.listen(5000);
