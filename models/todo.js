// When imported with sequelize, ensure proper format of file.

module.exports = function (sequelize, DataTypes) {

	return sequelize.define('todo', {
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
};