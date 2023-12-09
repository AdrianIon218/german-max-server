const db_mysql = require("../util/database_msql");

module.exports.getWords = (req, res) => {
  const { moduleId } = req.body;
  db_mysql
    .execute("SELECT * FROM word WHERE moduleId = ?", [moduleId])
    .then(([rez]) => {
      res.json(rez);
    });
};

module.exports.addProgres = (req, res) => {
  const { email, lessonId } = req.body;
  let { status } = req.body;
  const lessonIdValue = +lessonId;
  status = +status;
  status = status === 1 ? "good" : status === 2 ? "very good" : "perfect";
  db_mysql
    .execute(
      "SELECT id FROM finished_lesson WHERE userEmail = ? AND lessonId = ?",
      [email, lessonIdValue],
    )
    .then(([rez]) => {
      if (rez.length > 0) {
        db_mysql.execute(
          "UPDATE finished_lesson SET progressStatus = ? WHERE (id = ?)",
          [status, rez[0].id],
        );
      } else {
        db_mysql.execute(
          "INSERT INTO finished_lesson (progressStatus, userEmail, lessonId) VALUES (?, ?, ?)",
          [status, email, lessonIdValue],
        );
      }
      res.json({ status: "saved" });
    });
};

module.exports.getGrammerLesson = (req, res) => {
  const { lessonId } = req.body;
  db_mysql
    .execute(
      "SELECT title, paragraph FROM grammer_info WHERE lessonId = ? ORDER BY id",
      [lessonId],
    )
    .then(([rez]) => {
      res.json(rez);
    });
};

module.exports.getGrammerExercises = (req, res) => {
  const { lessonId } = req.body;
  db_mysql
    .execute(
      `SELECT ex.type, ex.structure 
          FROM exercise AS ex
          JOIN lesson_management AS lm 
          ON lm.exerciseId = ex.id  
          WHERE lm.lessonId = ? 
          ORDER BY ex.id `,
      [lessonId],
    )
    .then(([rez]) => {
      res.json(rez);
    });
};
