module.exports = function (sequelize, Datatypes) {
	return sequelize.define('todo', {
	description: {
		type: Datatypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	completed: {
		type: Datatypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});
};