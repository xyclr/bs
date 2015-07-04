var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bs');
module.exports = mongoose;