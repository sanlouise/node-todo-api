var Sequelize = require('sequelize');
//Create a new instance of sequelize
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-node-todos.sqlite'
});

var db = {};

//Loads in models from other files
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;