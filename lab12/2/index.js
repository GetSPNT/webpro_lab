const express = require("express");
const cookieParser = require("cookie-parser");
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
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const sql = "SELECT * FROM customers LIMIT 1";
  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Error retrieving customers:", err);
      return res.status(500).json({ message: "Failed to retrieve customers" });
    }
    res.render("show", { customers: rows, customerData: req.cookies.customer });
  });
});

app.post("/save", (req, res) => {
  const { customerId, firstName, lastName, email, phone, address } = req.body;

  res.cookie(
    "customer",
    {
      customerId,
      firstName,
      lastName,
      email,
      phone,
      address,
    },
    { maxAge: 1000 * 60 * 60 * 24 }
  );
  res.render("show", { customers: [], customerData: [] });
});

app.get("/show", function (req, res) {
  res.render("show", { customers: [], customerData: req.cookies.customer });
});

app.get("/clear", (req, res) => {
  res.clearCookie("customer");
  res.render("show", { customers: [], customerData: null });
});

app.listen(port, () => {
  console.log(`Starting Node.js server at port ${port}`);
});
