var mongoose = require('mongoose');
mongoose.connect('mongodb://ndesig:gjj123456@45.79.9.136/bs');
mongoose.Obj = mongoose.ObjectID;
module.exports = mongoose;
