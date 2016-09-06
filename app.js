var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var moment = require('moment');
var fs = require('fs');
var morgan = require('morgan');
var logger = require('./common/logging/logger.js');

var mongoose = require('mongoose');

var model = require('./models/db');

var acl = require('acl');

var client = require('redis').createClient(6379, process.env.REDIS_HOST_URI, {no_ready_check: true});

var redisBackend = new acl.redisBackend(client);

acl = new acl(redisBackend);

acl.allow('aggregate', '/crops', 'get')

acl.addUserRoles('Alesha', 'aggregate')

acl.allowedPermissions('Alesha', ['crops','units'], function(err, permissions){
  console.log(permissions)
})

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(session({secret: 'ssshhhhh'}));

app.use(function (req, res, next) {

  req.session.userId = process.env.USERNAME;//sets the session user name to whatever is set in the USERNAME environment variable

  console.log('Requested Type:', req.method);

  next();

});

app.get('/crops', acl.middleware(), function(req, res, next){

  console.log('Request Type:', req.session.userId);

  next();

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//using Morgan to monitor requests and winston to log them and everything else 
var accessLogStream = fs.createWriteStream(__dirname + '/requests.log', {flags: 'a'});

//overriding morgan's token ... ... ... breaking De'Morgan's Law lol
morgan.token('remote-user', function getId (req) {
    return req.session.userId
})

//formatting Morgan's token output
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', {stream: accessLogStream}));
app.use(morgan('dev'));
logger.debug("Overriding 'Express' logger");
app.use(require('morgan')('combined',{ "stream": logger.stream }));
//app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
