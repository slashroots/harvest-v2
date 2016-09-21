var setupApp = require('./setup').setupApplication();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var routes = require('./routes/index');

var app_manager = require('./routes/app/router-app-manager'),
    user = require('./routes/user/router-user'),
    farmer = require('./routes/resources/farmer/router-farmer'),
    platform = require('./routes/platform/router-platform');

var app = express();

/**
 * This is probably not necessary - but it establishes a connection
 * with the DB on first startup and prints out the tables
 */
var test_resources = require('./models/resources-db');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var app_manager = require('./routes/app/router-app-manager'),
    user = require('./routes/user/router-user'),
    farmer = require('./routes/resources/farmer/router-farmer');

app.use('/', routes);
app.use('/', app_manager);
app.use('/', user);
app.use('/', platform);
app.use('/api', farmer);

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
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;