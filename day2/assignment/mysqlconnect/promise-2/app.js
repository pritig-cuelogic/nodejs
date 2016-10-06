'use strict';
var db      = require('./dboperation');


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
    handler: db.login,
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
    handler: db.signUp,
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
    handler: db.updateUser,
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
    handler: db.deleteUserFromLoginT,
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
    handler: db.updateToken,
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
    handler: db.addFriend,
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
    handler: db.fetchAllFriend
});

server.route({
    method: 'GET',
    path: '/viewfriend/{id}',
    handler: db.fetchOneFriend,
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
    handler: db.deleteFriend,
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
    handler: db.searchFriendByName,
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


