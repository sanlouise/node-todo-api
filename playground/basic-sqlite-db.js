const Sequelize = require('sequelize');
//Create a new instance of sequelize
const sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-db.sqlite'
});

//Create Todo model
const Todo = sequelize.define('todo', {
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



const User = sequelize.define('user', {
	email: Sequelize.STRING
});

//Set up associations
Todo.belongsTo(User);
User.hasMany(Todo);


sequelize.sync({
	// force: true
}).then(function() {
	console.log('Everything is synched');

	// User.create({
	// 	email: 'sandra@example.com'
	// }).then(function () {
	// 	return Todo.create({
	// 		description: "Clean the house"
	// 	})
	// }).then(function (todo) {
	// 	User.findById(1).then(function (user) {
	// 		//Inbuilt method of sequelize
	// 		user.addTodo(todo);
	// 	});
	// });

	// User.findById(1).then(function (user){
	// 	user.getTodos().then(function (todos) {
	// 		todos.forEach(function (todo) {
	// 			console.log(todo.toJSON());
	// 		})
	// 	})
	// })
});
