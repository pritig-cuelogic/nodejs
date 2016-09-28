var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);

//module.exports.db = db;
module.exports.mongoose = mongoose;




