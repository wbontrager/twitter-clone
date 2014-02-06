exports.index = function (database) {
	return function (req, res) {
		//tweets from follower
		var all_tweet ='select \
                            id, \
                            follow_user_id, \
                            username, \
                            tweet, \
                            created_at \
                        from \
                        (select \
							user.id, \
							null follow_user_id, \
							user.username, \
							post.tweet, \
							post.created_at \
						  from post \
							inner join user on \
								post.user_id = user.id where post.user_id=? UNION ALL \
						  select \
							US.id, \
							follow.follow_user_id, \
							US.username, \
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

		database.query(all_tweet, [req.session.user.id, req.session.user.id], function (error, result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');	
			}

			res.render('home/index', { posts: result });	
		});
	}
}