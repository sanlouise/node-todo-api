var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite', 
	'storage': 'basic-sqlite-db'
});

//Create models 
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING
	}, 
	completed: {
		type: Sequelize.BOOLEAN
	}
})

sequelize.sync().then(function () {
	console.log('Everything is synched');
});