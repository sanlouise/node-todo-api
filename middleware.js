var cryptojs = require('crypto-js');

module.exports = function (db) {
	return {
		//Without next, private code is never gonna run. This code is in server.js, whole block
		//after 'app.get(/todos', . Middleware is run before that code executes.
		requireAuthentication: function (req, res, next) {
			var token = req.get('Auth') || '';

			//Looking for a token in the database, created via login
			db.token.findOne({
				where: {
					//Looking for the hashed value
					tokenHash: cryptojs.MD5(token).toString()
				}
			//If the tokenHash was found in db, run the text block of code
			}).then(function (tokenInstance) {
				if(!tokenInstance)
					throw new Error();
				}

				req.token = tokenInstance;
				rturn db.user.findByToken(token);

				//If findByToken is successfull, this code will run
			}).then (function(user) {
				req.user = user;
				next();

			})catch(function () {
				res.status(401).send();

			});
		}
	};
};