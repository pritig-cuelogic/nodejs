'use strict';
var db      = require('./dboperation');
//const Bcrypt = require('bcrypt');

const Hapi = require('hapi');
var Joi = require('joi');
const Basic = require('hapi-auth-basic');


const server = new Hapi.Server();

server.connection({ port: 3000 });

const users = {
    john: {
        username: 'john',
        password: 'secret',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};


       

const validate = function (request, username, password, callback) {
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }

    if(password == user.password){
        callback(null, true, { id: user.id, name: user.name });
    }
    else{
        callback('password not matched', false, { id: user.id, name: user.name });
    }
    /*Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name });
    });*/
};

server.register(Basic, (err) => {

    if (err) {
        throw err;
    }

    server.auth.strategy('simple', 'basic', { validateFunc: validate });


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("hello");
    },
    config: {
        auth: 'simple'
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
        auth: 'simple',
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().alphanum().min(3).max(12).required()
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

