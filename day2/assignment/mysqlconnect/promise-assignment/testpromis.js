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


var arrp = [];
insertdata1()
.then(function(row){
    arrp.push(row.insertId);
    var tabdat2 = {tab1_id: row.insertId, name: "neha"};
   return new Promise(function(resolve,reject){
    
    conn.query('insert into table2 set ?',tabdat2,Promise.promisify(function(err,rows1,fields){

        if(err){                
            return reject(err);
        }else{  
            
            return resolve(rows1);
        }

    }));// query
  });
})
.then(function(rows1){
    arrp.push(rows1.insertId);
                var tabdat3 = {tab2_id: rows1.insertId, name: "parul"};
   return new Promise(function(resolve,reject){
    
    conn.query('insert into table3 set ?',tabdat3,Promise.promisify(function(err,rows2,fields){

        if(err){                
            return reject(err);
        }else{  
            
            return resolve(rows2);
        }

    }));// query
  });
})
.then(function(rows2){
    arrp.push(rows2.insertId);
    return arrp;
})
.spread(function(v1,v2,v3){
   // console.log(arrp[0]);
   console.log(v1);
   console.log(v2);
   console.log(v3);
});
