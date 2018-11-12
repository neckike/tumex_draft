var redis = require('redis');
var bcrypt = require('bcryptjs');

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  // Load hash from your password DB.
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      // res === true
      callback(null, isMatch);
  });

}
/*redis*//*
//Add User Page
app.get('/user/add', function(req, res, next){
	res.render('adduser');
});

//Process Add User Page
app.post('/user/add', function(req, res, next){
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let name = req.body.name;
	let profileimage = req.body.profileimage;

	client.hmset(id, [
	'first_name', first_name,
	'last_name', last_name,
	'email', email,
	'phone', phone
	], function(err, reply){
		if(err){
			console.log(err);
		}
		console.log(reply);
		res.redirect('/');


	});
});*/

/*redis end*/
//var User = module.exports =
