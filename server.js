const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db.js');
const bcrypt = require('bcrypt');
const middleware = require('./middleware.js')(db)

const app = express();
const PORT = process.env.PORT || 3000;
const todos = [];
const todoNextId = 1;

//Set up middleware body-parser.
app.use(bodyParser.json());

//Homepage
app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', middleware.requireAuthentication, function(req, res) {
	const query = req.query;
	const where = {
		userId: req.user.get('id')
	};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);

	}, function(e) {
		res.status(500).send();
	})

});

// GET /todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	//Both need to be integers
	const todoId = parseInt(req.params.id, 10);
	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}

	}).then(function(todo) {
		//!! Converts a thruthy or falsy object into a boolean
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		//Something went wrong on the server's end
		res.status(500).send();
	});

});

// POST /todos
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	//Whitelist fields. Gets rid of all unwanted fields
	const body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		req.user.addTodo(todo).then(function() {
			return todo.reload();
		}).then(function(todo) {
			res.json(todo.toJSON());
		});
	}, function(e) {
		res.status(400).toJSON(e);
	});

});

// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	const todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with this id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});
});

/// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	const todoId = parseInt(req.params.id, 10);
	const body = _.pick(req.body, 'description', 'completed');
	const attributes = {};

	// With Sequelize, validations are in the model
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});
});


//User POST
app.post('/users', function(req, res) {
	const body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		//Use .json here, not toJSON to evade no function error.
		res.status(400).json(e);
	});
});

//user POST /users/login
app.post('/users/login', function(req, res) {
	const body = _.pick(req.body, 'email', 'password');
	const userInstance;

	db.user.authenticate(body).then(function(user) {
		//The header contains the secret json web token.
		const token = user.generateToken('authentication');
		userInstance = user;
		//Store token in db to enable logout later
		return db.token.create({
			token: token
		});

		//This runs after token.create finishes
	}).then(function(tokenInstance) {

		//Auth in header is set equal to token
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function() {
		// Authentication failed
		res.status(401).send();
	});
});

//DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function(req, res) {
	req.token.destroy().then(function() {
		res.status(204).send();
	}).catch(function() {
		res.status(500).send()
	});
});


//Sync data to db
db.sequelize.sync({
	force: true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!')
	});
});
