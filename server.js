const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "user-api"
});

connection.connect();

app.get("/getlist", (req, res) => {
  connection.query("SELECT * FROM users", function(error, results, fields) {
    if (error) throw error;
    console.log("Result: ", results);
    console.log(results);
    res.json(results);
  });
});

app.post("/getone/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  console.log(req.user_id);
  connection.query("SELECT * FROM users WHERE user_id = ?", user_id, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    console.log("Resultat: ", results);
    res.json(results);
  });
});

app.put("/", (req, res) => {
  connection.query(
    "UPDATE users SET last_name = ?, first_name = ? WHERE user_id = ?",
    ["Karlsson", "Kalle", 3],
    function(error, results, fields) {
      if (error) throw error;
      console.log("changed " + results.changedRows + " rows");
      res.json("changed " + results.changedRows + " rows");
    }
  );
});

app.delete("/", (req, res) => {
  connection.query("DELETE FROM users WHERE user_id = 3", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    console.log("deleted " + results.affectedRows + " rows");
    res.json("deleted " + results.affectedRows + " rows");
  });
});

app.get('/import', (req, res, next) => {
  res.render(path.join(__dirname, "views", "index.html"));
});

app.post('/import', (req, res, next) => {

});

app.post("/", (req, res) => {
  var post = {
    user_id: 3,
    last_name: "Svensson",
    first_name: "Sven",
    mobile: 70478372,
    email: "sven@gmail.com",
    age: "30",
    gender: "m"
  };
  var query = connection.query("INSERT INTO users SET ?", post, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    // Neat!
  });
  console.log(query.sql);
  res.json(query.sql);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is up and running at port: ${port}`);
});
