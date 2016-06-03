var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//Create empty array to populate later.
var todos = [];
//Increment id for each item (temporary solution).
var todoNextId = 1;

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
//Get individual to-do's.   
app.get('/todos/:id', function (req, res) {
	//Both need to be integers.
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo;
	todos.forEach(function(todo){
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	});

	if (matchedTodo) {
		res.json(matchedTodo)
	} else  { res.status(404).send();
	}

});

// POST /todos
app.post('/todos', function (req, res) {

});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!')
});