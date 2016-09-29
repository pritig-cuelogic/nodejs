var Promise = require("promise");
var connection      = require('./connection');

var conn = connection.con;

module.exports.fetchAllData = function(){
	return new Promise(function(resolve,reject){
    conn.query("select * from user",function(err,rows,fields){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};


