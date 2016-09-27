'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply({name:"priti gupta", fname: "Mahesh Gupta"});
    }
});

server.route({
    method: 'GET',
    path: '/heloo/{name}',
    handler: function (request, reply) {

        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});
// optional parameter
server.route({
    method: 'GET',
    path: '/hello/{user?}',
    handler: function (request, reply) {
        const user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';
        reply('Hello ' + user + '!');
    }
});
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});