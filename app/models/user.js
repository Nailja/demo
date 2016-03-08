
// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
    	id			 : String,
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
//module.exports = mongoose.model('User', userSchema);

var User = mongoose.model('User', userSchema);
module.exports = User;

/*
var findUserEmail = function(db, callback) {
	   var cursor =db.collection('email').find( );
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         console.dir(doc);
	      } else {
	         callback();
	      }
	   });
};

MongoClient.connect(url, function(err, db_userData) {
	  assert.equal(null, err);
	  findUserEmail(db_userData, function() {
		  
		  db_userData.close();
	  });
	});
*/