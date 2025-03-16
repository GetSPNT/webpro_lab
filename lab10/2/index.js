const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let db = new sqlite3.Database("./db/questions.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});

app.get("/", (req, res) => {
  const sql = "SELECT * FROM questions";
  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    res.render("show", { questions: rows });
  });
});

app.listen(port, () => {
  console.log("Server started.");
});
