var redis = require('redis');
var bcrypt = require('bcryptjs');

var User = module.exports;
let client = require('../routes/users');

module.exports.getUserById = function(id, callback){
      var err;
      client.hgetall("user:"+id, function(err, user){
        if(err){
         throw err;
         err='error';
       }
        if(user){
          console.log("encontrado!: "+user.username + " email: "+user.email);

          callback(err, user);
        }
      });

}

module.exports.getUserByUsername = function(username, callback){
    var err;
    client.sinter("username:"+username, function(err, obj){
      if(!obj){
        console.log("No encontrado");
      }
      else{
        client.hgetall("user:"+obj, function(err, user){
          if(err){
           throw err;
           err='error';
          }
          if(user){
            console.log("encontrado!: "+user.username + " email: "+user.email+ " id: "+ user.id);
            callback(err, user);
          }
        });
      }

    });

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
