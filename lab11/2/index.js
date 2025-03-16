const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const port = 3000;
const app = express();

let db = new sqlite3.Database("./db/todos.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

const sql = `CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TEXT NOT NULL
);`;

db.run(sql, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table created or already exists.");
  }
});

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const sql = "SELECT * FROM todos ";
  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Error retrieving todos:", err);
      return res.status(500).json({ message: "Failed to retrieve todos" });
    }
    res.render("show", { todos: rows });
  });
});

app.get("/add-todo", (req, res) => {
  res.render("add-todo");
});

app.post("/createTodo", (req, res) => {
  const todoData = {
    title: req.body.todoTitle,
    description: req.body.todoDescription,
    deadline: req.body.todoDeadline,
  };
  const sql = "INSERT INTO todos (title, description, deadline) VALUES (?,?,?)";
  db.run(
    sql,
    [todoData.title, todoData.description, todoData.deadline],
    (err) => {
      if (err) {
        console.error("Error inserting todo:", err);
        return res.status(500).json({ message: "Failed to create todo" });
      }
      res.redirect("/");
      console.log("Todo created successfully");
    }
  );
});

app.listen(port, () => {
  console.log(`Starting Node.js server at port ${port}`);
});
