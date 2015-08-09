var mongoose = require('mongoose');
mongoose.connect('mongodb://ndesig:gjj123456@localhost/bs');
mongoose.Obj = mongoose.ObjectID;
module.exports = mongoose;
