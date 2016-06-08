module.exports = function (db) {
	return {
		//Without next, private code is never gonna run. This code is in server.js, whole block
		//after 'app.get(/todos', . Middleware is run before that code executes.
		requireAuthentication: function (res, res, next) {
			var token = req.get('Auth');

			db.user.findByToken(token).then(function (user) {
				req.user = user;
				next();
			}, function () {
				res.status(401).send();
				//Next is not called, so private code is not run.
			});
		}
	};
};