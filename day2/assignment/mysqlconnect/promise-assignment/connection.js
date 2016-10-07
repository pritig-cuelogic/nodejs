var mysql      = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testdb"
});

con.connect(function(err){
  if(err){
  	console.log(err);
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

module.exports.con = con;