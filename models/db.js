var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bs');
mongoose.Obj = mongoose.ObjectID;
module.exports = mongoose;