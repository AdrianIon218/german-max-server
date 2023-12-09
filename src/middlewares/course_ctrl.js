const db_mysql = require("../util/database_msql");

module.exports.getAllModulesWithLessons = (req, res) => {
  const { level: lvl, email: userMail } = req.query;
  db_mysql
    .execute(
      `SELECT course_module.id , course_module.title
       FROM course_module 
       WHERE course_module.level = ? `,
      [lvl],
    )
    .then(([modules]) => {
      const modulesIds = modules.map((m) => m.id);

      db_mysql
        .execute(
          `SELECT lesson.id, lesson.title, lesson.moduleId, lesson.type
          FROM lesson
          WHERE lesson.moduleId IN (${modulesIds})`,
        )
        .then(([lessons]) => {
          if (!userMail) {
            res.json({ modules: modules, lessons: lessons });
          } else {
            const lessonIds = lessons.map((l) => l.id);
            if (lessonIds.length === 0) {
              res.json({ modules: modules, lessons: [] });
            } else {
              db_mysql
                .execute(
                  `SELECT finished_lesson.progressStatus, finished_lesson.lessonId 
              FROM finished_lesson JOIN user ON finished_lesson.userEmail = user.email  
              WHERE finished_lesson.userEmail = ? AND finished_lesson.lessonId IN (${lessonIds})`,
                  [userMail],
                )
                .then(([finishedLessons]) => {
                  res.json({
                    modules: modules,
                    lessons: lessons,
                    finishedLessons: finishedLessons,
                  });
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({ modules: modules, lessons: [] });
        });
    })
    .catch((err) => {
      console.log(lvl);
      console.log(err);
      res.json({ modules: [], lessons: [] });
    });
};

module.exports.getWords = (req, res) => {
  const { moduleId } = req.body;
  db_mysql
    .execute("SELECT * FROM word WHERE moduleId = ?", [moduleId])
    .then(([rez]) => {
      res.json(rez);
    });
};

module.exports.courses_available = (req, res) => {
  const errorHandler = (err) => {
    console.error(err);
    res.json({ status: false });
  };

  const response = ["A1", "A2", "B1", "B2", "C1"].map((lvl) => ({
    level: lvl,
    wordsNum: 0,
    lessonsNum: 0,
    testsNum: 0,
  }));

  db_mysql
    .execute(
      `SELECT COUNT(word.id) AS wordsNumber, cm.level AS level
        FROM word 
        JOIN course_module AS cm
        ON word.moduleId = cm.id
        GROUP BY moduleId`,
    )
    .then(([wordsRez]) => {
      wordsRez.forEach((element) => {
        const index = response.findIndex(
          (item) => item.level === element.level,
        );
        if (index !== -1) {
          response[index].wordsNum += element.wordsNumber;
        }
      });

      db_mysql
        .execute(
          `SELECT COUNT(lesson.id) AS lessonsNumber, cm.level AS level
          FROM lesson JOIN course_module AS cm
          ON lesson.moduleId = cm.id
          GROUP BY moduleId`,
        )
        .then(([lessonsRez]) => {
          lessonsRez.forEach((element) => {
            const index = response.findIndex(
              (item) => item.level === element.level,
            );
            if (index !== -1) {
              response[index].lessonsNum += element.lessonsNumber;
            }
          });

          db_mysql
            .execute(
              `SELECT COUNT(lesson.id) AS lessonsNumber, cm.level AS level
             FROM lesson JOIN course_module AS cm
             ON lesson.moduleId = cm.id
             WHERE lesson.type = 'test'
             GROUP BY moduleId`,
            )
            .then(([testRez]) => {
              testRez.forEach((element) => {
                const index = response.findIndex(
                  (item) => item.level === element.level,
                );
                if (index !== -1) {
                  response[index].testsNum += element.lessonsNumber;
                }
              });
              res.json({ status: true, courses: response });
            })
            .catch(errorHandler);
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);
};
