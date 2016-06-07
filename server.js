var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//Set up middleware body-parser.
app.use(bodyParser.json());

//Homepage
app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function(req, res) {
	//Query. Where is a sequelize method.
	var query = req.query;
	var where = {};

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
app.get('/todos/:id', function(req, res) {
	//Both need to be integers
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
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
app.post('/todos', function(req, res) {
	//Whitelist fields. Gets rid of all unwanted fields
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).toJSON(e);
	});

});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});
});

/// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};
	var todoId = parseInt(req.params.id, 10);

	//With sequelize, validations are in the model.
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}
	//Update the data. We have to use instance methods, because the model already exists and is fetched.
	//Model methods start with db.
	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			return todo.update(attributes);
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	})

	//The success callback
	.then(function(todo) {
		res.json(todo.toJSON());

	}, function(e) {
		res.status(400).json(e);
	});

});


//User POST
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());

	}, function(e) {
		//Use .json here, not toJSON to evade no function error.
		res.status(400).json(e);
	});
});

//user POST /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var loggingUser = req.params.id;

	if (typeof body.email !== 'string' || typeof body.password !== 'string') {
		return res.status(400).send();
	}

	db.user.findOne({
		where: {
			email: body.email
		}
	}).then(function (user) {
		if (!user) {
			// Authentication failed
			return res.status(401);
		} 
		res.json(user.toJSON());

	}, function (e) {
		res.status(500).send();
	});

});




//Sync data to db
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!')
	});
});