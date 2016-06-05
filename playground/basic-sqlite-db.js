var Sequelize = require('sequelize');
//Create a new instance of sequelize
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-db.sqlite'
});

//Create Todo model
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false

	}
});

sequelize.sync({
	force: true
}).then(function() {
	console.log('Everything is synched');

	Todo.create({
		description: 'Walk the dog'

	}).then(function(todo) {
		return Todo.create({
			description: 'Clean Office'
		});
		// Fetch data
	}).then(function() {
		// return Todo.findById(1)
		return Todo.findAll({
			where: {
				description: {

					//Capitalization is not important
					$like: '%clean%'
				}
			}
		});

		//JSONify fetched data
	}).then(function(todos) {
		if (todos) {
			//Loop over individually fetched items
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});

		} else {
			console.log("Oops, no todo found!");
		}

	}).catch(function(e) {
		console.log(e);
	});
});