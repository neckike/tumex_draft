var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');
var session = require('express-session');
var exhbs = require('express-handlebars');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');

var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var hbs = exhbs.create({
  // Specify helpers which are only registered on this instance.
  defaultLayout:'main',
  extname:'hbs',

  helpers: {
    ifEquals: function(arg1, arg2, options) {
     return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
 }

  }
});

var app = express();

var api = express.Router();
app.use(expressValidator());

//View Engine
//app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'main'}));
//app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());//"secret"
app.use(express.static(path.join(__dirname, 'public')));


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
  // cookie: {
  //   httpOnly: true,
  //   secure: false // for http and true for https
  // }
}));
//app.use(flash());
// Passport
app.use(passport.initialize());
app.use(passport.session());


//app.use(require('connect-flash')());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// app.get('*', function(req, res, next){
//   res.locals.user = req.user || null;
//   next();
// });


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
