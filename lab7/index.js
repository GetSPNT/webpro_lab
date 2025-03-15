const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/birds", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/birds.html"));
});

app.get("/cats", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/cats.html"));
});

app.get("/dogs", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/dogs.html"));
});
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./views/404.html"));
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
