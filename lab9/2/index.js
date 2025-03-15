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

app.post("/signin", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const userData = { usernameOrEmail, password };

    const sql = "SELECT * FROM Users WHERE username = ? OR email = ?";

    conn.query(
      sql,
      [userData.usernameOrEmail, userData.usernameOrEmail],
      (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return res
            .status(500)
            .json({ message: "Internal server error. Please try again." });
        }

        if (result.length > 0) {
          if (result[0].password === userData.password) {
            return res.status(200).json({ message: "Login successful" });
          } else {
            return res.status(401).json({ message: "Invalid password" });
          }
        }

        return res.status(404).json({ message: "User not found" });
      }
    );
  } catch (err) {
    console.error("Error in sign-in process:", err);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
