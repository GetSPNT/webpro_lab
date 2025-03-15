const express = require("express");
const path = require("path");
const conn = require("./config/dbconn");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("show");
});

app.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstname,
      lastname,
      age,
      address,
      phone,
    } = req.body;

    const userData = {
      username,
      password,
      email,
      firstname,
      lastname,
      age,
      address,
      phone,
    };

    const sql = `
      INSERT INTO Users (username, password, email, firstname, lastname, age, address, phone) 
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

    conn.query(sql, Object.values(userData), (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res
          .status(500)
          .json({ message: "Registration failed. Please try again." });
      }

      res.status(200).json({ message: "Registration successful" });
    });
  } catch (error) {
    console.error("Error in registration process:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
