/**
 * New node file
 */
/*
var User = require('./app/models/user');

exports.email = function(req, res){
	
	console.log('get email');
	
	return User.find(req.params.email, function (err, user){
		if (!user) {
			res.statusCode = 404;
			return res.send({error: 'Not found' });
		}
		if (!err) {
			console.log('email'+ req.params.email);
			return res.send({statusCode : 200, user:req.params.email});
			
		} else {
			res.dtatusCode = 500;        			
			return res.send({error: 'Server error'});
		}
	});
};*/