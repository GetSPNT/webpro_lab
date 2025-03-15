const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "10.0.15.21",
  user: "s64070240",
  password: "3ZS3EB5Y",
  database: "d64070240",
});

conn.connect((error) => {
  if (error) throw error;
  console.log("Connected!");
});

module.exports = conn;
