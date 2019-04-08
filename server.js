const path = require("path");
const bodyParser = require("body-parser");
const fs = require('fs');

const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json({ limit: '10mb' }));

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kallebassi1",
  database: "rent-me-direct"
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
  res.render(path.join(__dirname, "views", "import.ejs"), {pageTitle: 'Import users'});
});

app.post('/imported', urlencodedParser, function (req, res, next) {
  var jsondata = req.body;
  var values = [];
  for(var i = 0; i < jsondata.length; i++) {
    if (jsondata[i].gender == 'Male') {
      jsondata[i].gender = 'm';
    } else if (jsondata[i].gender == 'Female') {
      jsondata[i].gender = 'f';
    } else {
      jsondata[i].gender = 'u';
    }
    values.push([jsondata[i].ip_address,jsondata[i].last_name,jsondata[i].first_name,jsondata[i].Mobile,jsondata[i].email,jsondata[i].gender,jsondata[i].City,jsondata[i].job_title]);
  };

  connection.query('INSERT INTO users (password, last_name, first_name, mobile, email, gender, city, title) VALUES ?', [values], function(err, result) {
    console.log('value', values);
    console.log('err', err);
    console.log('result', result);
    if(err) {
      res.send('Error');
    }
    else {
      res.send('Success');
    }
  })
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
