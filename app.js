
/**
 * Module dependencies.
 */
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
var express = require('express');

var routes = require('./routes');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');

var flash = require('connect-flash');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var multer  = require('multer');
app.use(multer({
  dest: settings.uploadPath,
  rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
  },
  limits: {
    fileSize: 10000000
  },
  onFileSizeLimit: function(file){
    //������100M,ɾ����
    if(file.size > 100000000) {
      fs.unlink('./' + file.path) // delete the partially written file
    }

  }
}))



// all environments
app.set('port', process.env.PORT || 3031);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
//app.use(express.logger('dev'));

app.use(express.bodyParser({ keepExtensions: true, uploadDir: settings.staticSever,defer:true }));
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    url: 'mongodb://ndesig:gjj123456@45.79.9.136:27017/bs'
  })
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, settings.staticSever)));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


