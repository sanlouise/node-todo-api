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
	var body = req.body;

	// Check if the completed object is not a boolean or description not a string
	// Trim removes the spaces before and after - if string is " " this will be converted to empty string
	if (!_.isBool(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.id = todoNextId ++;
	todos.push(body);
	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!')
});















