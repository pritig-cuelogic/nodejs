'use strict';
var connection      = require('./connection');
var conn = connection.con;
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

server.route({
    method: 'GET',
    path: '/getdata',
    handler: function (request, reply) {
    	conn.query('SELECT * FROM  user',function(err,rows){
	  if(err) throw err;
	  reply(rows);
	  console.log('Data received from Db:\n');
	  
	});
     
        
    }
});

server.route({
    method: 'GET',
    path: '/insertdata',
    handler: function (request, reply) {
    	var userdata = { name: 'ritu', email: 'ritu@gmail.com', mobno: 8234567890 };
    	conn.query('insert into user set ?',userdata,function(err,rows){
	  if(err) throw err;
	  reply("data inserted last id :"+rows.insertId);
	  console.log('Last insert ID:', rows.insertId);
	  
	});
     
        
    }
});

server.route({
    method: 'GET',
    path: '/updatedata/{id}',
    handler: function (request, reply) {
    	
    	conn.query('update user set name = ? where id = ? ',['nimmy',encodeURIComponent(request.params.id)],function(err,rows){
	  if(err) throw err;
	  reply(rows.changedRows +"data updated   :");
	  console.log(rows.changedRows +'data updated with id  :');
	  
	});
     
        
    }
});

server.route({
    method: 'GET',
    path: '/deletedata/{id}',
    handler: function (request, reply) {
    	
    	conn.query('delete from user where id = ? ',[encodeURIComponent(request.params.id)],function(err,rows){
	  if(err) throw err;
	  reply("deleted rows  :"+rows.affectedRows);
	  console.log('deleted rows :', rows.affectedRows);
	  
	});
     
        
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});