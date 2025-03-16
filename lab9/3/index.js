const express = require("express");
const path = require("path");
const conn = require("./config/dbconn");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const sql =
    "SELECT s.song_name, a.artist_name, LEFT(s.song_release_date, 4) AS song_release_year, s.song_type FROM songs s JOIN artists a ON s.artist = a.artist_id";
  conn.query(sql, function (err, result) {
    if (err) throw err;
    res.render("show", { songs: result });
  });
});

app.get("/findUserById")

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
