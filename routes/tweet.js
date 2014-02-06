var mysqltime = require('../utils/mysqltime');

exports.post_tweet = function(database) {
	return function (req, res) {
		var text = req.body.text;

		var mysqldate = '';
		mysqltime.datetime(function (time) {
			mysqldate = time;
		});

		var post = {
			user_id: req.session.user.id,
			tweet: text,
			created_at: mysqldate
		}

		if (text) {
			if (text.length <= 140) {
				database.query('insert into post set ?', post, function (error) {
					if (error) {
						console.log(error);
						return res.redirect('/');
					}

					return res.redirect('/home');
				});
			} else {
				res.render('home/index', { message: 'tweet too long' });	
			}
		} else {
			res.render('home/index', { message: 'tweet empty' });
		}
	}
}