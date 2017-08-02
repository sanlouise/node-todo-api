// When imported with sequelize, ensure proper format of file.
const _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250],
				descriptionIsString: function() {
					if (!_.isString(this.description)) {
						throw new Error('Description must be string.')
					}
				}
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};
