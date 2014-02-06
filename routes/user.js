exports.get_user = function (database) {
	return function (req, res) {
		var user = req.params.user;

		database.query('select * from user where id=?', [user, user], function (error, user_result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');
			}

			if (user_result.length == 1) {
				var all_tweet ='select \
                            id, \
                            username, \
                            image, \
                            tweet, \
                            created_at \
                        from \
                        (select \
							user.id, \
							user.username, \
							user.image, \
							post.tweet, \
							post.created_at \
						  from post \
							inner join user on \
								post.user_id = user.id where post.user_id=? UNION ALL \
						  select \
							US.id, \
							US.username, \
							US.image, \
							post.tweet, \
							post.created_at \
						  from user \
							inner join follow on \
								follow.user_id = user.id \
							inner join post on \
								post.user_id = follow.follow_user_id \
							inner join user US on \
								US.id = follow.follow_user_id \
						  where user.id=?) SE \
                          order by created_at desc';

				database.query(all_tweet, [user, user], function (error, posts) {
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