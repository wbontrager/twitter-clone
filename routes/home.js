exports.index = function (database) {
	return function (req, res) {
		//tweets from follower
		var all_tweet ='select \
                            id, \
                            follow_user_id, \
                            username, \
                            image, \
                            tweet, \
                            created_at \
                        from \
                        (select \
							user.id, \
							null follow_user_id, \
							user.username, \
                            user.image, \
							post.tweet, \
							post.created_at \
						  from post \
							inner join user on \
								post.user_id = user.id where post.user_id=? UNION ALL \
						  select \
							US.id, \
							follow.follow_user_id, \
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

		database.query(all_tweet, [req.session.user.id, req.session.user.id], function (error, result) {
			if (error) {
				console.log(error);
				return res.redirect('/home');	
			}
            var tweets_count, follows_count, follower_count = 0;

            // tweets
            database.query('select * from post where user_id=?', [req.session.user.id], function (error, tweets) {
                if (error) {
                    console.log(error);
                    return res.render('home/index', { posts: result });   
                }

                tweets_count = tweets.length;

                database.query('select * from follow where user_id=?', [req.session.user.id], function (error, follows) {
                    if (error) {
                        console.log(error);
                        return res.render('home/index', { posts: result, tweets: tweets_count, follows: follows_count, follower: follower_count });   
                    }

                    follows_count = follows.length;

                    database.query('select * from follow where follow_user_id=?', [req.session.user.id], function (error, follower) {
                        if (error) {
                            console.log(error);
                            return res.render('home/index', { posts: result, tweets: tweets_count, follows: follows_count, follower: follower_count });   
                        }

                        follower_count = follower.length;

                        return res.render('home/index', { posts: result, tweets: tweets_count, follows: follows_count, follower: follower_count });   
                    });

                });
            });	
		});
	}
}