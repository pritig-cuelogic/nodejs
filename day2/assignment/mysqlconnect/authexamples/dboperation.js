
var Promise = require("bluebird");
var connection      = require('./connection');
var jwt   = require('jsonwebtoken');
var conn = connection.con;
var user_id_token;

function generateToken(userid){
    var token =   jwt.sign({id: userid}, 'testapipriti', {expiresIn: "1 days"});
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

function addUser(userdata){
	return new Promise(function(resolve,reject){
    conn.query('insert into user set ?',userdata,function(err,rows,fields){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
}



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


module.exports.signUp = function(request, reply){
	var userdata = { name: request.payload.name, email: request.payload.email, mobno: request.payload.mobno,password:request.payload.password};
    addUser(userdata)
    .then(function(rows){
        var luserdata = {user_id: rows.insertId};
       conn.query('insert into login set ?',luserdata,Promise.promisify(function(err,rows,fields){

        reply("User added Successfully.");
        })); 
    })
    .catch(function(err){
            reply(err);
            });

	
};


module.exports.addFriend = function(request, reply){
    var user_id = request.auth.credentials.id;
    //console.log(user_id);
        if(user_id){
            var frienddata = {friend_id: request.payload.friend_id, user_id: user_id};
    conn.query('insert into friend set ?',frienddata,Promise.promisify(function(err,rows,fields){
        reply("Friend added successfully.")

    })); // query
    }
 else{
           reply("Please Logged in.");   
        }

    
};

module.exports.fetchAllFriend = function(request, reply){
var user_id = request.auth.credentials.id;
        if(user_id){
            var id = user_id;
             conn.query('select u.name from user as u left join friend as f on u.id = f.friend_id where f.user_id = ? ',[id],Promise.promisify(function(err,rows,fields){
                
                reply(rows);
            })); // query
     
 }
 else{
           reply("Please Logged in.");   
        }

    
};

function validate(request, token, callback){
   var token = req.headers.authorization;
  try {
    var decoded = jwt.verify(token, 'testapipriti');
  } catch (e) {
    return authFail(res);
  }
  if(!decoded || decoded.auth !== 'magic') {
    return authFail(res);
  } else {
    return privado(res, token);
  }
}