var express = require('express');
var bodyParser = require('body-parser');
var _ = require("underscore");
var db = require ('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

/*var todos = [{
	id: 1,
	description: 'Do home task',
	completed: false
}, {
	id: 2,
	description: 'Do office task',
	completed: false
}, {
	id: 3,
	description: 'Go for grocery',
	completed: true
}];

app.get('/', function (req, res) {
	res.send('Todo API Root');
});*/

//GET /todos
app.get('/todos', function(req, res) {
	var queryparam = req.query;
	var where = {};

	if(queryparam.hasOwnProperty('completed') && queryparam.completed == 'true') {
		where.completed = true;
	} else if (queryparam.hasOwnProperty('completed') && queryparam.completed == 'false') {
		where.completed = false;
	}

	if (queryparam.hasOwnProperty('q') && queryparam.q.length > 0) {
		where.description = {
			$like: '%' + queryparam.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function (todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	})
	// var filteredTodos = todos;

	// if (queryparam.hasOwnProperty('completed') && queryparam.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryparam.hasOwnProperty('completed') && queryparam.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// if (queryparam.hasOwnProperty('q') && queryparam.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.indexOf(queryparam.q) > -1;
	// 	});
	// }

	// res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);

	db.todo.findById(todoID).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});

	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoID
	// });

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
	
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();

	// body.id = todoNextId++;
	// todos.push(body);

	// res.json(body);
})

app.delete('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoID
		}
	}).then(function (rowsDeleted) {
			if (rowsDeleted == 0) {
				res.status(404).json({
					error: 'No todo with id'
				});
			} else {
				res.status(204).send();
			}
	}, function () {
			res.status(500).send();
	});
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoID
	// });

	// if (!matchedTodo) {
	// 	res.status(404).json({
	// 		"error": "no todo found with provided id"
	// 	});
	// } else {
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// }
});

app.put('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoID
	// });

	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	// if (!matchedTodo) {
	// 	return res.status(404).send();
	// }

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// _.extend(matchedTodo, attributes);
	// res.json(matchedTodo);

	db.todo.findById(todoID).then(function (todo) {
		if (todo) {
			todo.update(attributes).then(function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});
});

app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function() {
		console.log('Express listening: ' + PORT);
});
});