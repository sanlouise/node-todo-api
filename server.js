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

// GET
// Get all to-do items
app.get('/todos', function (req, res) {
	//Converts to json
	res.json(todos);
});

// GET /todos/:id

app.get('/todos/:id', function (req, res) {
	//Both need to be integers.
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo)
	} else  { res.status(404).send();
	}

});

// POST /todos
app.post('/todos', function (req, res) {

	//Whitelist fields. Gets rid of all unwanted fields.
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

// PUT (Update)

app.put('todos/:id', function (res, req) {

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	//If the todo with this ID does not exist, error.
	if (!matchedTodo) {
		return res.status(404).send();
	} 

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if 
		//If provided and not a boolean.
		(body.hasOwnProperty('completed')) {
			return res.status(400).send();
	} 
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if 
		//If provided and not a boolean.
		(body.hasOwnProperty('description')) {
			return res.status(400).send();
	} 
	//Update the matchedTodo with new data.
	_.extend(matchedTodo, validAttributes);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!')
});















