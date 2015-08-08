var mongoose = require('mongoose');
mongoose.connect('mongodb://xyclr:gjj123456@localhost/bs');
mongoose.Obj = mongoose.ObjectID;
module.exports = mongoose;
