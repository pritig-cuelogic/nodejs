var Promise = require("bluebird");
var connection      = require('./connection');

var conn = connection.con;

var insertdata1 = function(){
    var userdata = {name: 'Priti'}; 
    return new Promise(function(resolve,reject){
    
    conn.query('insert into table1 set ?',userdata,function(err,rows,fields){

        if(err){                
            return reject(err);
        }else{  

            return resolve(rows);
        }

    });// query
  }); 
    
};

var insertdata2 = function(){

	var tabdat2 = {tab1_id: a.insertId, name: "neha"};
   return new Promise(function(resolve,reject){
    
    conn.query('insert into table2 set ?',tabdat2,Promise.promisify(function(err,rows1,fields){

        if(err){                
            return reject(err);
        }else{  
            
            return resolve(rows1);
        }

    }));// query
  });
};

var insertdata3 = function(){

                var tabdat3 = {tab2_id: b.insertId, name: "parul"};
   return new Promise(function(resolve,reject){
    
    conn.query('insert into table3 set ?',tabdat3,Promise.promisify(function(err,rows2,fields){

        if(err){                
            return reject(err);
        }else{  
            
            return resolve(rows2);
        }

    }));// query
  });
};


var a = insertdata1();
var b = a.then(insertdata2);
var c = b.then(insertdata3);
Promise.all([a,b,c])
.then(function(rows2){
	console.log(rows2[0].insertId);
	console.log(rows2[1].insertId);
	console.log(rows2[2].insertId);
})
.catch(function(err){
            console.log(err);
       });