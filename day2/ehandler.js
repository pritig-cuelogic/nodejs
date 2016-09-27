var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('dooropen',function(){
	console.log('Ring -2');
});

emitter.emit('dooropen');