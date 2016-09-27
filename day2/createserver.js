var hp = require('http');

hp.createServer(function(request,response){
	response.write("hello");
	response.end();
}).listen(5600);