'use strict';
var con = require('./connectionm');
const Hapi = require('hapi');
var mongoosec = con.mongoose;

const server = new Hapi.Server();
server.connection({ port: 3000 });


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("hello");
    }
});
mongoosec.connect('mongodb://localhost/test_db');

var userSchema = new mongoosec.Schema({
  id: { type: Number }
, name: String
, age: Number

});

var user1 = mongoosec.model('user', userSchema,'user');
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
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});