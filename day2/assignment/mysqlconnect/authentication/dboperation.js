
var Promise = require("bluebird");
var connection      = require('./connection');
var jwt   = require('jsonwebtoken');
var conn = connection.con;

function generateToken(userid){
    var token =   jwt.sign(userid, 'testapipriti');
    return token;
} 

module.exports.promiseobj = Promise;
module.exports.fetchAllUsers = function(){
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



function checkValiduser(email,pass){
    return new Promise(function(resolve,reject){
    conn.query("select id from user where email = ? and password = ? ",[email,pass],function(err,rows,fields){

        if(err){             
            return reject(err);
        }else{ 
                  
            return resolve(rows);
        }

    }); // query
  }); 
}
module.exports.login = function(request, reply){
	checkValiduser(request.payload.email,request.payload.password)
    .then(function(rows1){
        var token = generateToken(rows1[0].id);
       
        conn.query('update login set isloggedin = ?, token = ? where user_id = ?',[1,token,rows1[0].id],Promise.promisify(function(err,rows){
        reply({token : token});

    }));
    })
    .catch(function(err){
            reply(err);
       });
	
};

module.exports.updateToken = function(request, reply){
	var id1 = request.params.id;
    conn.query('update login set isloggedin = ?, token = ? where user_id = ?',[0,'',id1],Promise.promisify(function(err,rows){
        reply('User Logout successfully.');

    })); // query
 
	
};



function checkloggedinUser(token){
    return new Promise(function(resolve,reject){
    conn.query("select user_id from login where token = ? ",[token],function(err,rows,fields){

        if(err){             
            return reject(err);
        }else{ 
                  
            return resolve(rows);
        }

    }); // query
   });
	
};





