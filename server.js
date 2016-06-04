var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//Set up middleware body-parser.
app.use(bodyParser.json());

//Homepage
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function (req, res) {
	//Query
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.description.indexOf(queryParams.q) > -1;
		});
	}

	//Converts to json
	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	//Both need to be integers
	var todoId = parseInt(req.params.id, 10);
	//findWhere returns a single object
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo)
	} else  {res.status(404).send();
	}

});

// POST /todos
app.post('/todos', function (req, res) {

	//Whitelist fields. Gets rid of all unwanted fields
	var body = _.pick(req.body, 'description', 'completed');

	// Check if the completed object is not a boolean or description not a string
	// Trim removes the spaces before and after - if string is " " this will be converted to empty string
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	//Description should be trimmed value.
	body.description = body.description.trim();

	body.id = todoNextId ++;
	todos.push(body);
	res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
	//Both need to be integers.
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "Oops, no todo found with that ID!"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}

});

/// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!')
});