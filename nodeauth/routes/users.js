var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var redis = require('redis');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

let client = module.exports = redis.createClient();


client.on('connect', function(){
	console.log('Connected to Redis');

});
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({username: 'username', password: 'password'},function(username, password, done){

  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
		// else{
		// 	console.log('aHORA SIIIIIII, tu dijiste: '+ password + 'y la verdadera es: '+ user.password);
		// }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else{
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));


router.post('/register', upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  if(req.file){
    console.log('Uploading File...');
    var profileimage = req.file.filename;
  } else{
    console.log('No File Uploaded.');
    var profileimage = 'noimage.jpg';
  }

  //Form Validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //Check Errors
  var errors = req.validationErrors();

  if(errors){
    console.log('Errors');
    res.render('register', {
      errors: errors
    });
  } else{ //register fields were well filled.
    console.log('No Errors');

    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        password = hash;

        client.incr('id', function(err, id){
          client.hmset('user:'+id, [
          	'name', name,
          	'email', email,
          	'username', username,
          	'password', password,
            'profileimage', profileimage,
						'id', id
          	], function(err, reply){
          		if(err){
          			console.log(err);
          		}
          		console.log(reply);

              req.flash('success', 'You are now registered and can login');

              res.location('/');
          		res.redirect('/');
          	});
						client.sadd('username:'+username, id, function(err, reply){
							if(err) throw err;

						});
          });
        });
    });

  }
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are now logged out');
	res.redirect('/users/login');
});
module.exports = router;
