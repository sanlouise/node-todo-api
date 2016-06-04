var express = require('express');
var bodyParser = require('body-parser');
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
	var body = req.body;

	body.id = todoNextId ++;
	todos.push(body);
	
	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!')
});