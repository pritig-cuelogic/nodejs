
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

module.exports.updateUser = function(request, reply){
    checkloggedinUser(request.headers.authtoken)
     .then(function(rows1){
        if(rows1.length >=1){
            var userdata = {};
                if(request.payload.name != null){
                    userdata['name'] = request.payload.name;
                }
                if(request.payload.email != null){
                    userdata['email'] = request.payload.email;
                }
                if(request.payload.mobno != null){
                    userdata['mobno'] = request.payload.mobno;
                }
                var id1 = encodeURIComponent(request.params.id);
                var q1 = 'update user set ';
              for(var key in userdata){
                q1 += ''+key+' = "'+userdata[key]+'",';
              }
              q1 = q1.replace(/,\s*$/, "");
              q1 += ' where id='+id1+'';
              
                conn.query(q1,Promise.promisify(function(err,rows){
                    reply(rows.changedRows +"data updated   :");

                })); 
	}
    else{
        reply("Please Logged in.");
    } 
    })
	.catch(function(err){
            reply(err);
       });
};


function deleteUser(id){
	return new Promise(function(resolve,reject){
    conn.query('delete from user where id = ? ',[id],function(err,rows){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
}

module.exports.deleteUserFromLoginT = function(request, reply){
    checkloggedinUser(request.headers.authtoken)
     .then(function(rows1){
    if(rows1.length >=1){
        var id = request.params.id;
        deleteUser(id)
        .then(function(rows2){
            conn.query('delete from login where user_id = ? ',[id],Promise.promisify(function(err,rows3){
            reply("deleted rows  :"+rows3.affectedRows);

    }));
        })
        
    }
    else{
       reply("Please Logged in.");  
    }
     // query
  })
    .catch(function(err){
            reply(err);
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

module.exports.addFriend = function(request, reply){
	checkloggedinUser(request.headers.authtoken)
     .then(function(rows1){
        if(rows1.length >=1){
            var frienddata = {friend_id: request.payload.friend_id, user_id: rows1[0].user_id };
    conn.query('insert into friend set ?',frienddata,Promise.promisify(function(err,rows,fields){
        reply("Friend added successfully.")

    })); // query
}
 else{
           reply("Please Logged in.");   
        }


    })
    .catch(function(err){
            reply(err);
            });
	
};

module.exports.fetchAllFriend = function(request, reply){
    checkloggedinUser(request.headers.authtoken)
     .then(function(rows1){
        if(rows1.length >=1){
            var id = rows1[0].user_id;
             conn.query('select u.name from user as u left join friend as f on u.id = f.friend_id where f.user_id = ? ',[id],Promise.promisify(function(err,rows,fields){
            	
                reply(rows);
            })); // query
     
 }
 else{
           reply("Please Logged in.");   
        }


    })
    .catch(function(err){
            reply(err);
            });
	
};

module.exports.fetchOneFriend = function(request, reply){
	checkloggedinUser(request.headers.authtoken)
     .then(function(rows1){
        if(rows1.length >=1){
            var id1 = request.params.id;
            var user_id = rows1[0].user_id;
            conn.query('select u.name, u.mobno from user as u left join friend as f on u.id = f.friend_id where f.user_id = ? and f.friend_id = ? ',[user_id,id1],Promise.promisify(function(err,rows,fields){
    		reply(rows);
        })); // query
    
 }
 else{
           reply("Please Logged in.");   
        }


    })
    .catch(function(err){
            reply(err);
            });
	
};

module.exports.deleteFriend = function(request, reply){
	checkloggedinUser(request.headers.authtoken)
     .then(function(rows1){
        if(rows1.length >=1){
            var id1 = request.params.id;
            var user_id = rows1[0].user_id;
        conn.query('delete from friend where user_id = ? and friend_id = ? ',[user_id,id1],Promise.promisify(function(err,rows,fields){
    	   reply("Friend Deleted: "+rows.affectedRows);
         }));
        }
        else{
           reply("Please Logged in.");   
        }

    // query

	})
    .catch(function(err){
            reply(err);
            });
};

module.exports.searchFriendByName = function(request, reply){
	 checkloggedinUser(request.headers.authtoken)
     .then(function(rows1){
       
    if(rows1.length >=1){
	var name = request.payload.friend_name;
    var user_id = rows1[0].user_id;
    conn.query('select name, mobno from user where id in(select friend_id from friend where user_id = ?) and name like "%'+name+'%"',[user_id],Promise.promisify(function(err,rows,fields){
        reply(rows);

    }));
    }
    else{
        reply("Please Logged in."); 
    }
    })
    .catch(function(err){
            reply(err);
            });

};


