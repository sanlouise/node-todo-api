// When imported with sequelize, ensure proper format of file.
module.exports = function(sequelize, DataTypes) {

	return sequelize.define('user', {
		email: {
			type: Datatypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			}
		}
	});
}