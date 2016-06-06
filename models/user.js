var bcrypt = require('bcrypt');
var _ = require('underscore');

// When imported with sequelize, ensure proper format of file.
module.exports = function(sequelize, DataTypes) {

	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			}
		}
	}, {
		hooks: {
			// Runs before validate
			beforeValidate: function (user, options) {
				//Convert string emails to lowercase
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			} 
		}
	});
}