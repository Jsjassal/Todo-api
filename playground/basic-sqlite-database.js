var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect' : 'sqlite',
	'storage' : 'basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync().then(function () {
	console.log('Everything is synced');

	Todo.findById(2).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Not Found');
		}
	});

	// Todo.create({
	// 	description: 'Data to be store',
	// 	completed: false
	// }).then(function(todo) {
	// 	return Todo.create({
	// 		description: 'Another Data'
	// 	});
	// }).then(function () {
	// 		//return Todo.findById(1);
	// 		return Todo.findAll({
	// 			where: {
	// 				description: {
	// 					$like: '%store%'
	// 				}
	// 			}
	// 		});
	// }).then(function (todos) {
	// 	if(todos) {
	// 		todos.forEach(function (todo) {
	// 		console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log('no todo found');
	// 	}
	// }).catch(function (e) {
	// 	console.log(e);
	// });
});