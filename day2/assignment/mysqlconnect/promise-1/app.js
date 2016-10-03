'use strict';
var db      = require('./dboperation');
var jwt   = require('jsonwebtoken');

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
        var arrp = [];
        db.checkValiduser(request.payload.email,request.payload.password)
        .then(function(rows){
         arrp.push(rows);
         var token = generateToken(rows[0].id);
            arrp.push(db.updateToken(1,token,rows[0].id));
            arrp.push(token);
            return arrp;
       })
       .spread(function (rows,rows1,token){
            reply({token : token});
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
    	var arrp = [];
    	var userdata = { name: request.payload.name, email: request.payload.email, mobno: request.payload.mobno,password:request.payload.password};
        db.addUser(userdata)
        .then(function(rows){
            arrp.push(rows);
           var luserdata = {user_id: rows.insertId};
            arrp.push(db.addLoggedinUser(luserdata));
            return arrp;
           })
        .spread(function (rows,rows1){
            reply("User added Successfully.");
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
    	 var arrp = [];
         db.checkloggedinUser(request.headers.authtoken)
         .then(function(rows){
            arrp.push(rows);
            if(rows.length >=1){
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
                arrp.push(db.updateUser(userdata,id1));
                return arrp;
        }
            else{
               reply("Please Logged in.");
            }
        })
         .spread(function (rows,rows1){
            reply(rows1.changedRows +"data updated   :");
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
        var arrp = [];
    	db.checkloggedinUser(request.headers.authtoken)
        .then(function(rows){
            arrp.push(rows);
            if(rows.length >=1){
                var id1 = request.params.id;
                arrp.push(db.deleteUser(id1));
                return arrp;
            }
            else{
               reply("Please Logged in."); 
            }

        })
        .spread(function (rows,rows1){
            return [rows,rows1,db.deleteUserFromLoginT(request.params.id)];
            
        })
        .spread(function (rows,rows1,rows2){
            
            reply("deleted rows  :"+rows2.affectedRows);
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
        var arrp = [];
        db.checkloggedinUser(request.headers.authtoken)
        .then(function(rows){
           arrp.push(rows);
         if(rows.length >=1){
            var frienddata = {friend_id: request.payload.friend_id, user_id: rows[0].user_id };
            arrp.push(db.addFriend(frienddata));
            return arrp;
         }
         else{
            reply("Please Logged in.");
         }
         })
        .spread(function (rows,rows1){
            reply("Friend added Successfully.");
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
        var arrp = [];
        db.checkloggedinUser(request.headers.authtoken)
        .then(function(rows){
            arrp.push(rows);
            if(rows.length >=1){
                arrp.push(db.fetchAllFriend(rows[0].user_id));
                return arrp;
            }
            else{

            }
        })
        .spread(function (rows,rows1){
            reply(rows1);
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
        var arrp = [];
        db.checkloggedinUser(request.headers.authtoken)
        .then(function(rows){
            arrp.push(rows);
             if(rows.length >=1){
                var id1 = request.params.id;
                arrp.push(db.fetchOneFriend(rows[0].user_id,id1));
                return arrp;
            }
            else{
                reply("Please Logged in."); 
            }
        })
        .spread(function(rows,rows1){
            reply(rows1);
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
        var arrp = [];
        db.checkloggedinUser(request.headers.authtoken)
        .then(function(rows){
                arrp.push(rows);
                if(rows.length >=1){
                    var id1 = request.params.id;
                    arrp.push(db.deleteFriend(rows[0].user_id,id1));
                    return arrp;
                }
                else{
                   reply("Please Logged in."); 
                }
        })
        .spread(function (rows,rows1){
             reply("Friend Deleted: "+rows1.affectedRows);
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
        var arrp = [];
        db.checkloggedinUser(request.headers.authtoken)
            .then(function(rows){
                arrp.push(rows);
                if(rows.length >=1){
                  var name = request.payload.friend_name;
                  arrp.push(db.searchFriendByName(rows[0].user_id,name));
                  return arrp;
                }
                else{
                   reply("Please Logged in."); 
                } 
            })
            .spread(function(rows,rows1){
                reply(rows1);
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

function generateToken(userid){
    var token =   jwt.sign(userid, 'testapipriti');
    return token;
} 
