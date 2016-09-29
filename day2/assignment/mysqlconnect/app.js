'use strict';
var db      = require('./dboperation');
var crypt   = require('crypto');

const Hapi = require('hapi');
var Joi = require('joi');


const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("hello");
    }
});

server.route({
    method: 'GET',
    path: '/getdata',
    handler: function (request, reply) {
      
      db.fetchAllUsers().then(function(rows){
          reply(rows);
       });
    }
});

server.route({
    method: 'POST',
    path: '/login',
    handler: function (request, reply) {
        
        db.checkValiduser(request.payload.email,request.payload.password).then(function(rows){
         
         //reply(rows[0].id);
         generateToken().then(function(token){
            db.updateToken(1,token,rows[0].id).then(function(rows){
                reply({token : token});
            })
            .catch(function(err){
            reply(err);
            });
         });
       })
       .catch(function(err){
            reply(err);
       });
       
    },
    config: {
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().alphanum().min(3).max(12).required()
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/insertdata',
    handler: function (request, reply) {
    	
    	var userdata = { name: request.payload.name, email: request.payload.email, mobno: request.payload.mobno,password:request.payload.password};
        db.addUser(userdata).then(function(rows){
           var luserdata = {user_id: rows.insertId};
            db.addLoggedinUser(luserdata).then(function(rows){
                reply("User Added Successfully.");
            })
                .catch(function(err){
                    reply("Error :"+err);
               });
           })
       .catch(function(err){
            reply("Error :"+err);
       });
       
    },
    config: {
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                mobno: Joi.number().integer().required(),
                password: Joi.string().alphanum().min(3).max(12).required()
            }
        }
    }
});

server.route({
    method: 'PUT',
    path: '/updatedata/{id}',
    handler: function (request, reply) {
    	
         db.checkloggedinUser(request.headers.authtoken).then(function(rows){
            if(rows.length >=1){
            
                var userdata = {name: request.payload.name,email: request.payload.email, mobno: request.payload.mobno};
                var id1 = encodeURIComponent(request.params.id);
                db.updateUser(userdata,id1).then(function(rows){
                  reply(rows.changedRows +"data updated   :");
               });
           
        }
            else{
               reply("Please Logged in.");
            }
        })
        .catch(function(err){
            reply("Error :"+err);
       });   	
    },
    config: {
        validate: {
            params: {
                id: Joi.number().integer().required()
            },
            payload: {
                name: Joi.string(),
                email: Joi.string().email(),
                mobno: Joi.number().integer()
            }
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/deletedata/{id}',
    handler: function (request, reply) {
    	db.checkloggedinUser(request.headers.authtoken).then(function(rows){
            if(rows.length >=1){
                var id1 = request.params.id;
                db.deleteUser(id1).then(function(rows){
                  reply("deleted rows  :"+rows.affectedRows);
               });
            }
            else{
               reply("Please Logged in."); 
            }

        })
        .catch(function(err){
            reply("Error :"+err);
       }); 
    },
    config: {
        validate: {
            params: {
                id: Joi.number().integer().required()
            }
        }
    }
});

server.route({
    method: 'PUT',
    path: '/loggedout/{id}',
    handler: function (request, reply) {
        var id1 = request.params.id;
        db.updateToken(0,'',id1).then(function(rows){
                reply('User Logout successfully.');
            })
            .catch(function(err){
            reply(err);
            });
    },
    config: {
        validate: {
            params: {
                id: Joi.number().integer().required()
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/addfriend',
    handler: function (request, reply) {
        db.checkloggedinUser(request.headers.authtoken).then(function(rows){

         if(rows.length >=1){
            var frienddata = {friend_id: request.payload.friend_id, user_id: rows[0].user_id };
            db.addFriend(frienddata).then(function(rows){
                reply("Friend added Successfully.");
            })
            .catch(function(err){
            reply("Error :"+err);
            });
         }
         else{
            reply("Please Logged in.");
         }
         })
        .catch(function(err){
            reply("Error :"+err);
       });   
        

    },
    config: {
        validate: {
            payload: {
                friend_id: Joi.number().integer().required()
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/getAllfriend',
    handler: function (request, reply) {
        db.checkloggedinUser(request.headers.authtoken).then(function(rows){
                if(rows.length >=1){
                    db.fetchAllFriend(rows[0].user_id).then(function(rows){
                        reply(rows);
                    })
                    .catch(function(err){
                        reply(err);
                        });
                }
                else{
                   reply("Please Logged in."); 
                }
        })
        .catch(function(err){
            reply(err);
            });
    }
});

server.route({
    method: 'GET',
    path: '/viewfriend/{id}',
    handler: function (request, reply) {
        db.checkloggedinUser(request.headers.authtoken).then(function(rows){
                if(rows.length >=1){
                    var id1 = request.params.id;
                    db.fetchOneFriend(rows[0].user_id,id1).then(function(rows){
                        reply(rows);
                    })
                    .catch(function(err){
                        reply(err);
                        });
                }
                else{
                   reply("Please Logged in."); 
                }
        })
        .catch(function(err){
            reply(err);
            });
    },
    config: {
        validate: {
            params: {
                id: Joi.number().integer().required()
            }
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/removefriend/{id}',
    handler: function (request, reply) {
        db.checkloggedinUser(request.headers.authtoken).then(function(rows){
                if(rows.length >=1){
                    var id1 = request.params.id;
                    db.deleteFriend(rows[0].user_id,id1).then(function(rows){
                        reply("Friend Deleted: "+rows.affectedRows);
                    })
                    .catch(function(err){
                        reply(err);
                        });
                }
                else{
                   reply("Please Logged in."); 
                }
        })
        .catch(function(err){
            reply(err);
            });
    },
    config: {
        validate: {
            params: {
                id: Joi.number().integer().required()
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/searchfriend',
    handler: function (request, reply) {
        db.checkloggedinUser(request.headers.authtoken)
            .then(function(rows){
                if(rows.length >=1){
                    return rows
                }
                else{
                   reply("Please Logged in."); 
                } 
            })
            .then(function(rows){
                var name = request.payload.friend_name;
                return db.searchFriendByName(rows[0].user_id,name);
                    // .then(function(rows){
                    //     reply(rows);
                    // })
                    // .catch(function(err){
                    //     reply(err);
                    // });
            })
            .then(function(result){
                reply(result);
            })
            .catch(function(err){
                reply(err);
            });
    },
    config: {
        validate: {
            
            payload: {
                friend_name: Joi.string().required()
            }
        }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

// generate random token

var generateToken = function(){
    return new Promise(function(resolve,reject){
    crypt.randomBytes(20, function(err, buffer) {
    var token = buffer.toString('hex');
    if(err){             
            return reject(err);
        }else{ 
                  
            return resolve(token);
        }
    });
    }) ;
}
