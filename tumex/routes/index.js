var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Inicio', message: req.flash('message')});
});

function ensureAuthenticated(req, res, next){
  res.locals.currentUser = req.isAuthenticated();
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
