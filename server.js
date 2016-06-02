var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Get groceries',
	completed: false
}, {
	id: 2,
	description: 'Work out',
	completed: false
}, {
	id: 3,
	description: 'Study',
	completed: true
}];

//Homepage
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// Get all to-do items
app.get('/todos', function (req, res) {
	//Converts to json
	res.json(todos);
});

//Get individual to-do's.   GET /todos/:id
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

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!')
});