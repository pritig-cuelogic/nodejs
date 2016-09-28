'use strict';
var connection      = require('./dboperation');
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
    	reply(rows);  
    }
});

server.route({
    method: 'POST',
    path: '/insertdata',
    handler: function (request, reply) {
    	
    	var userdata = { name: request.payload.name, email: request.payload.email, mobno: request.payload.mobno};

    	conn.query('insert into user set ?',userdata,function(err,rows){
	  if(err) throw err;
	  reply("data inserted last id :"+rows.insertId);
	  console.log('Last insert ID:', rows.insertId);
	  
	});
     
        
    }
});

server.route({
    method: 'PUT',
    path: '/updatedata/{id}',
    handler: function (request, reply) {
    	
    	var userdata = {name: request.payload.name,email: request.payload.email, mobno: request.payload.mobno};
    	//console.log(userdata);
    	//console.log(encodeURIComponent(request.params.id));
    	conn.query('update user set name = ?,email = ?, mobno=? where id = ? ',[userdata.name,userdata.email,userdata.mobno,encodeURIComponent(request.params.id)],function(err,rows){
	  if(err) throw err;
	  reply(rows.changedRows +"data updated   :");
	  console.log(rows.changedRows +'data updated with id  :');
	  
	});
     
        
    }
});

server.route({
    method: 'DELETE',
    path: '/deletedata/{id}',
    handler: function (request, reply) {
    	
    	conn.query('delete from user where id = ? ',[request.params.id],function(err,rows){
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