const express = require("express");
const body_parser = require("body-parser");
const { compare } = require("bcrypt");
const database = require("../lib/database");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

let router = express.Router();
router.use(body_parser.json());
router.use(cookieParser());
router.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 120000 },
  })
);

router.get("/api/logout", (req, res) => {
  req.session.loggedIn = false;
  res.redirect("../");
});
router.post("/login", (req, res) => {
  //req.body.password
  //req.body.email
  database.query(
    `SELECT password FROM users WHERE email = '${req.body.email}';`,
    (err, rows) => {
      if (err) throw err;
      else {
        if (rows.length == 1) {
          compare(
            req.body.password,
            Buffer.from(rows[0].password, "binary").toString(),
            (err, same) => {
              if (err) throw err;
              else if (same) {
                req.session.loggedIn = true;
                res.status(200).send(true);
              } else {
                res.status(401).send(false);
              }
            }
          );
        } else {
          res.sendStatus(409);
        }
      }
    }
  );
});
router.post("/staff", (req, res) => {
  //req.body.teacher
  //req.body.class
  //req.body.subject
  database.query(
    `INSERT INTO exb_subject (teacher, subject) VALUES ('${req.body.teacher}', '${req.body.subject}')`,
    (err) => {
      if (err) res.sendStatus(409);
      else {
        database.query(
          `INSERT INTO exb_class (teacher, class) VALUES ('${req.body.teacher}', '${req.body.class}')`,
          (err) => {
            if (err) res.sendStatus(409);
            else res.status(200).send(true);
          }
        );
      }
    }
  );
});
router.post("/schedule", (req, res) => {
  //req.body.class
  //req.body.time
  //req.body.day
  //req.body.teacher
  //req.body.subject
  database.query(
    `SELECT subject FROM exb_subject WHERE teacher = '${req.body.teacher}' AND subject = '${req.body.subject}'`,
    (err, rows) => {
      if (err) throw err;
      else {
        database.query(
          `SELECT class FROM exb_class WHERE teacher = '${req.body.teacher}' AND class = '${req.body.class}'`,
          (err, rows) => {
            if (err) throw err;
            else {
              if (rows.length == 1) {
                database.query(
                  `INSERT INTO exb_session (time, day, teacher) VALUES ('${req.body.time}', '${req.body.day}', '${req.body.teacher}');`,
                  (err) => {
                    if (err) res.sendStatus(409);
                    else res.status(200).send(true);
                  }
                );
              } else {
                res.sendStatus(409);
              }
            }
          }
        );
      }
    }
  );
});

router.get("/api/schedule", (req, res) => {
  database.query(
    `SELECT class, day, time, teacher, subject from exb_subject NATURAL JOIN exb_class NATURAL JOIN exb_session;`,
    (err, rows) => {
      if (err) throw err;
      else if (rows.length < 1) res.sendStatus(404);
      else res.status(200).send(rows);
    }
  );
});
router.get("/api/staff", (req, res) => {
  database.query("SELECT * FROM exb_class NATURAL JOIN exb_subject;", (err, rows) => {
    if (err) throw err;
    else if (rows.length < 1) res.sendStatus(404);
    else res.status(200).send(rows);
  });
});
router.get("/api/max/:table/:field", (req, res) => {
  database.query(
    `SELECT MAX(${req.params.field}) FROM ${req.params.table};`,
    (err, result) => {
      if (err) throw err;
      else res.status(200).send(result[0]);
    }
  );
});
router.get("/api/min/:table/:field", (req, res) => {
  database.query(
    `SELECT MIN(${req.params.field}) FROM ${req.params.table};`,
    (err, result) => {
      if (err) throw err;
      else res.status(200).send(result[0]);
    }
  );
});
router.get("/api/count/:table/:field", (req, res) => {
  database.query(
    `SELECT COUNT(${req.params.field}) FROM ${req.params.table};`,
    (err, result) => {
      if (err) throw err;
      else res.status(200).send(result[0]);
    }
  );
});
// router.get("/api/avg/:table/:field", (req, res) => {
//   database.query(
//     `SELECT AVG(${req.params.field}) FROM ${req.params.table};`,
//     (err, result) => {
//       if (err) throw err;
//       else res.status(200).send(result);
//     }
//   );
// });
// router.get("/api/sum/:table/:field", (req, res) => {
//   database.query(
//     `SELECT SUM(${req.params.field}) FROM ${req.params.table};`,
//     (err, result) => {
//       if (err) throw err;
//       else res.status(200).send(result);
//     }
//   );
// });
router.get("/api/session", (req, res) => {
  if (req.session.loggedIn) {
    res.status(200).send(true);
  } else {
    res.status(401).send(false);
  }
});

router.put("/schedule", (req, res) => {
  //req.body.class
  //req.body.day
  //req.body.time
  //req.body.teacher
  //req.body.subject
  database.query(
    `SELECT subject FROM exb_subject WHERE teacher = '${req.body.teacher}' AND subject = '${req.body.subject}'`,
    (err, rows) => {
      if (err) throw err;
      else {
        database.query(
          `SELECT class FROM exb_class WHERE teacher = '${req.body.teacher}' AND class = '${req.body.class}'`,
          (err, rows) => {
            if (err) throw err;
            else {
              if (rows.length == 1) {
                database.query(
                  "UPDATE exb_session SET teacher = ? WHERE day = ? AND time = ?",
                  [req.body.teacher, req.body.day, req.body.time],
                  (err) => {
                    if (err) throw err;
                    else res.status(200).send(true);
                  }
                );
              } else {
                res.sendStatus(409);
              }
            }
          }
        );
      }
    }
  );
});
router.put("/staff", (req, res) => {
  //req.body.teacher
  //req.body.subject
  database.query(
    "UPDATE exb_subject SET subject = ? WHERE teacher = ?",
    [req.body.subject, req.body.teacher],
    (err) => {
      if (err) throw err;
      else res.status(200).send(true);
    }
  );
});

module.exports = router;
