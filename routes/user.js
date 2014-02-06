exports.get_user = function (database) {
	return function (req, res) {
		var user = req.params.user;

		database.query('select * from user where id=?', [user], function (error, result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');
			}

			if (result.length == 1) {
				database.query('select * from post where user_id=?', [user], function (error, posts) {
					if (error) {
						console.log(error);
						return res.redirect('/home');
					}

					res.render('home/user', {posts: posts, user: result[0] });
				});
			} else {
				return res.redirect('/home');
			}
		});
	}
}