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


server.register(require('hapi-auth-jwt'), (err) => {

  server.auth.strategy('jwt', 'jwt',  {
        validateFunc: db.validate,
        key: 'testapipriti'
    });

server.route({
    method: 'GET',
    path: '/getdata',
    handler: function (request, reply) {
      
      db.fetchAllUsers().then(function(rows){
          reply(rows);
       });
    },
    config: {
        auth: 'jwt'
    }
});


server.route({
    method: 'POST',
    path: '/addfriend',
    handler: db.addFriend,
    config: {
        auth: 'jwt',
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
    handler: db.fetchAllFriend,
    config: {
        auth: 'jwt'
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



server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

// generate random token
});

