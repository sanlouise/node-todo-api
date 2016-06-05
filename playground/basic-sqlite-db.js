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

sequelize.sync().then(function () {
	console.log('Everything is synched');

	Todo.create({
		description: 'Walk the dog',
		completed: false
	}).then(function (todo) {
		console.log('Finished!');
		console.log(todo);
	});
});