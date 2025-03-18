const express = require("express");
const sessions = require("express-session");
const port = 3000;
const app = express();
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./db/customers.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  sessions({
    secret: "thisismysecretkey",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const sql = "SELECT * FROM customers LIMIT 1";
  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Error retrieving customers:", err);
      return res.status(500).json({ message: "Failed to retrieve customers" });
    }
    res.render("show", { customers: rows, sessionData: req.session.customer });
  });
});

app.post("/save", (req, res) => {
  const { customerId, firstName, lastName, email, phone, address } = req.body;

  req.session.customer = {
    customerId,
    firstName,
    lastName,
    email,
    phone,
    address,
  };
  res.render("show", { customers: [], sessionData: [] });
});

app.get("/show", function (req, res) {
  res.render("show", { customers: [], sessionData: req.session.customer });
});

app.get("/clear", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to destroy session" });
    }
    res.render("show", { customers: [], sessionData: [] });
  });
});

app.listen(port, () => {
  console.log(`Starting Node.js server at port ${port}`);
});
