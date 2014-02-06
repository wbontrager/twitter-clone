exports.index = function (database) {
	return function (req, res) {
		var new_query = 'select \
							user.username, \
							post.user_id, \
							post.tweet, \
							post.created_at \
						from post \
							inner join user on \
								post.user_id = user.id where post.user_id=?';
		database.query(new_query, [req.session.user.id], function (error, result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');	
			}

			res.render('home/index', { posts: result });	
		});
	}
}