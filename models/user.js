var bcrypt = require('bcrypt');
var _ = require('underscore');

// When imported with sequelize, ensure proper format of file.
module.exports = function(sequelize, DataTypes) {

	var user = sequelize.define('user', {
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			//In combination with bcrypt. Adds random set of chars before/after password before it is hashed.
			salt: {
				type: DataTypes.STRING
			},
			password_hash: {
				type: DataTypes.STRING
			},
			password: {
				//Virtual is not stored in db but is accessible.
				type: DataTypes.VIRTUAL,
				allowNull: false,
				validate: {
					len: [7, 100]
				},
				set: function(value) {
					//Takes nr of chars you want to add to password.
					var salt = bcrypt.genSaltSync(10);
					var hashedPassword = bcrypt.hashSync(value, salt);

					this.setDataValue('password', value);
					this.setDataValue('salt', salt);
					this.setDataValue('password_hash', hashedPassword);
				}
			}
		}, {
			hooks: {
				// Runs before validate
				beforeValidate: function(user, options) {
					//Convert string emails to lowercase
					if (typeof user.email === 'string') {
						user.email = user.email.toLowerCase();
					}
				}
			},
			classMethods: {
				authenticate: function(body) {
					return new Promise(function(resolve, reject) {

						if (typeof body.email !== 'string' || typeof body.password !== 'string') {
							reject();
						}
						user.findOne({
							where: {
								email: body.email
							}
						}).then(function(user) {
							if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
								// Authentication failed
								reject();
							}
							resolve(user);
						}, function(e) {
							reject();
						});
					});
				}
			}

		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}

	});

	return user;
};