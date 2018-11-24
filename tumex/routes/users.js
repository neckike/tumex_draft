var express = require('express');
var router = express.Router();
var redis = require('redis');

var User = require('../models/user');
let client = redis.createClient();
//let client = require('./index');
var tmp_user;

/* GET users listing. */
router.get('/', function(req, res, next) {
	//res.render('', {title:'Inicio'});
  res.send('respond with a resource');
});

router.get('/torneos', ensureAuthenticated, function(req, res, next) {
  res.render('torneos', {title:'Torneos'});
});

router.get('/streaming', ensureAuthenticated, function(req, res, next) {
  res.render('streaming', {title:'Streaming'});
});

router.get('/friends', ensureAuthenticated, function(req, res, next) {
  res.render('friends', {title:'Friends', message: req.flash('message')});
});

router.get('/torneos', ensureAuthenticated, function(req, res, next) {
  res.render('torneos', {title:'Torneos'});
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('message', [{class: 'success', message: 'Sesion cerrada'}]);
	res.redirect('/');
});

router.get('/editprofile', ensureAuthenticated, function(req, res, next) {

  res.render('editprofile', {title:'EditProfile'});
});

router.get('/searchfriends', ensureAuthenticated, function(req, res, next) {
  res.locals.searchedUser = tmp_user;
  res.render('friends', {title:'Friends', message: req.flash('message')});
});

router.post('/searchfriends', function(req, res, next) {

  var username = req.body.search;

  //process.nextTick(function(){

    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log('Usuario no encontrado');
        tmp_user=null;
      }
      else{
        tmp_user=user;
        console.log('Nombre: '+user.nombre + ' '+user.apellido);
      }
    });

    res.location('/users/searchfriends');
    res.redirect('/users/searchfriends');
  //});
});
router.post('/editprofile', function(req, res, next) {
	console.log('si entre');
  var edad = req.body.edad;
	var club = req.body.club;
  var altura = req.body.altura;
  var raquetas = req.body.raquetas;
  var acercademi = req.body.acercademi;
  var genero = req.body.genero;
  var mano = req.body.mano;
  var reves = req.body.reves;
  var superficie = req.body.superficie;

  client.hmset('user:'+req.user.id, [
  	'edad', edad,
		'club', club,
  	'altura', altura,
  	'raquetas', raquetas,
  	'acercademi', acercademi,
    'genero', genero,
    'mano', mano,
    'reves', reves,
    'superficie', superficie
  	], function(err, reply){
  		if(err){
  			console.log(err);
  		}
  		console.log(reply);

			req.flash('message', [{class: 'success', message: 'Información guardada'}]);

      res.location('/users/profile');
  		res.redirect('/users/profile');
  	});
});

function ensureAuthenticated(req, res, next){
  res.locals.currentUser = req.isAuthenticated();
	res.locals.username = {user: req.user.username};
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
module.exports = router;
