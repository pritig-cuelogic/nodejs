
var connection      = require('./connection');
const Hapi = require('hapi');
var conn = connection.con;

module.exports.fetchAllData = function(){
	//var data;
	var fun = function(err,rows){
	  if(err) throw err;
	  console.log(rows);
	  console.log('Data received from Db:\n');
	  return rows;
	};
	conn.query('SELECT * FROM  user',fun);
	console.log('fun ==>', fun);
	return fun;
};


