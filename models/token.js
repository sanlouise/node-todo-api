//We need to store the hashed value token to log out users.

const cryptojs = require('crypto-js');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('token', {
		token: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [1]
			},
			set: function(value) {
				const hash = cryptojs.MD5(value).toString();
				this.setDataValue('token', value);
				//Set tokenHash equal to hash
				this.setDataValue('tokenHash', hash)
			}
		},
		tokenHash: DataTypes.STRING
	});
};
