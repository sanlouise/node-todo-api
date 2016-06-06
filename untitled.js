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
	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			return todo.update(attributes);
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();

	//The success callback
	}).then(function (todo) {
		res.json(todo.toJSON());

	}, function (e) {
		res.status(400).json(e);
	});


});