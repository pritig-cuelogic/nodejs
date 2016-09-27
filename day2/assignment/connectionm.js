'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("hello");
    }
});
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
mongoose.connect('mongodb://localhost/test_db');

var userSchema = new mongoose.Schema({
  id: { type: Number }
, name: String
, age: Number

});

var user1 = mongoose.model('user', userSchema,'user');
server.route({
    method: 'GET',
    path: '/userdata',
    handler: function (request, reply) {
    	user1.find(function(err, userr) {
		  if (err) return console.error(err);
		  
		  reply(userr);
		});
        
    }
});



