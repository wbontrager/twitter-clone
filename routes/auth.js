var crypto = require('crypto');
var mysqltime = require('../utils/mysqltime');

exports.post_login = function(database) {
	return function (req, res) {
		var email = req.body.email;
		var password = req.body.password;

		if (email && password) {
			password = crypto.createHash('md5').update(password).digest('hex');

			database.query('select * from user where email=? and password=?', [email, password], function(error, result) {
				if (error) {
					console.log(error);
					return res.redirect('/');
				}

				if (result.length == 1) {
					// console.log('user ok');
					req.session.user = result[0];
					return res.redirect('/home');
				} else {
					// console.log('user not found');
					return res.redirect('/');
				}
			});
		} else {
			// fields empty
			return res.redirect('/');
		}
	}
}

exports.post_register = function(database) {
	return function (req, res) {
		var email = req.body.email;
		var name = req.body.name;
		var password = req.body.password;
		var password_w = req.body.password_w;

		if (email && name && password && password_w) {
			if (password == password_w) {
				password = crypto.createHash('md5').update(password).digest('hex');

				database.query('select * from user where email=?', [email], function(error, result) {
					if (error) {
						console.log(error);
						return res.redirect('/');
					}

					if (result.length > 0) {
						return res.render('site/index', {message: 'email exists'});
					} else {
						// convert js date to mysql datetime
						var mysqldate = '';
						mysqltime.datetime(function (time) {
							mysqldate = time;
						});

						var user = {
							email: email,
							username: name,
							password: password,
							created_at: mysqldate
						}

						database.query('insert into user set ?', user, function (error) {
							if (error) {
								console.log(error)
								return res.redirect('/');
							}

							database.query('select * from user where email=? and password=?', [email, password], function (error, result) {
								if (error) {
									console.log(error);
									return res.redirect('/');
								}

								if (result.length == 1) {
									// auto login
									req.session.user = result[0];
									return res.redirect('/home');
								} else {
									return res.redirect('/');
								}
							});
						});
					}
				});
			} else {
				return res.render('site/index', {message: 'passwords dont match'});
			}
		} else {
			return res.render('site/index', {message: 'fields are empty'});
		}
	}
}

exports.get_logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
}