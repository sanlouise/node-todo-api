var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jsonwt = require('jsonwebtoken');

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
						return reject();
					}
					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							// Authentication failed
							return reject();
						}
						return resolve(user);
					}, function(e) {
						return reject();
					});
				});
			}

		},

		//Use instance methods when working with existig models.
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},

			generateToken: function (type) {
				if (!_.isString(type)) {
					return undefined;
				}
				try {
					//Encrypt user information and create new JSON web token.
					//Type is authentication in this case.
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
					var token = jsonwt.sign({
						//Body of token
						token: encryptedData
						//Jsonwebtoken password
					}, 'qwerty098');
					return token;
				} catch (e) {
					return undefined;
				}
			}
		}

	});

	return user;
};