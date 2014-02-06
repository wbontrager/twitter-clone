exports.get_user = function (database) {
	return function (req, res) {
		var user = req.params.user;

		database.query('select * from user where id=?', [user], function (error, user_result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');
			}

			if (user_result.length == 1) {
				database.query('select * from post where user_id=?', [user], function (error, posts) {
					if (error) {
						console.log(error);
						return res.redirect('/home');
					}

					database.query('select * from follow where user_id=? and follow_user_id=?', [req.session.user.id, user], function (error, result) {
						if (error) {
							console.log(error);
							return res. redirect('/');
						}

						var follow = false;
						if (result.length > 0) {
							follow = true;
						} else {
							follow = false;
						}

						res.render('home/user', {posts: posts, user_open: user_result[0], follow: follow });
					});
				});
			} else {
				return res.redirect('/home');
			}
		});
	}
}

exports.get_follow = function (database) {
	return function (req, res) {
		var user_id = req.params.id;

		var follow = {
			user_id: req.session.user.id,
			follow_user_id: user_id
		}

		database.query('insert into follow set ?', follow, function (error) {
			if (error) {
				console.log(error);
				return res.redirect('/user/' + user_id);
			}

			res.redirect('/home');
		});
	}
}

exports.get_unfollow = function (database) {
	return function (req, res) {
		var user_id = req.params.id;

		database.query('delete from follow where user_id=? and follow_user_id=?', [req.session.user.id, user_id], function (error) {
			if (error) {
				console.log(error);
				return res.redirect('/user/' + user_id);
			}

			res.redirect('/home');
		});
	}
}