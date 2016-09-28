
var connection      = require('./connection');
const Hapi = require('hapi');
var conn = connection.con;

module.exports.fetchAllData = function(){
	//var data;
	conn.query('SELECT * FROM  user',function(err,rows){
	  if(err) throw err;
	  console.log(rows);
	  console.log('Data received from Db:\n');
	  
	});
};


