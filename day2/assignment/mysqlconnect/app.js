'use strict';
var connection      = require('./connection');


var conn = connection.con;
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
    	conn.query('SELECT * FROM  user',function(err,rows){
	  if(err) throw err;
	  reply(rows);
	  console.log('Data received from Db:\n');
	  
	});
     
        
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
    
        
    },
    config: {
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                mobno: Joi.number().integer().required()
            }
        }
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