// When imported with sequelize, ensure proper format of file.
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {

	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false

		}
	}, {
		validate: {
			descriptionIsString: function() {
				if (!_.isString(this.description)) {
					throw new Error('Description must be a string.')
				}
			}
		}
	});
};