var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');

var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/*//Create Redis Client
let client = redis.createClient();

client.on('connect', function(){
	console.log('Connected to Redis');

});*/

var app = express();

var api = express.Router();
app.use(expressValidator());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
