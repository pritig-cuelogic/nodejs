var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
setInterval(function() {
  console.log(process.memoryUsage().rss);
}, 30000);
