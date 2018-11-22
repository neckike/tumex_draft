var redis = require('redis');
var bcrypt = require('bcryptjs');

var User = module.exports;
let client = require('../routes/index');

module.exports.getUserById = function(id, callback){
      var err;
      client.hgetall("user:"+id, function(err, user){
        if(err){
         throw err;
         err='error';
       }
        if(user){
          //console.log("id encontrado!: "+user.username + " email: "+user.email);

          callback(err, user);
        }
      });

}

module.exports.getUserByUsername = function(username, callback){
    var err;
    client.sinter("username:"+username, function(err, obj){
      client.hgetall("user:"+obj, function(err, user){
      if(err){
         throw err;
         err='error';
       }
      else if(user){
          console.log("nombre encontrado!: "+user.username + " email: "+user.email+ " id: "+ user.id);
          callback(err, user);
        }
        else{
          callback(err,null);
        }
      });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  // Load hash from your password DB.
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      // res === true
      callback(null, isMatch);
  });

}
