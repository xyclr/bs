var mongoose = require('mongoose');
mongoose.connect('mongodb://ndesig:gjj123456@45.79.9.136:27017/bs');
mongoose.Obj = mongoose.ObjectID;
module.exports = mongoose;
