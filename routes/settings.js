var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

exports.get_settings = function (database) {
	return function (req, res) {
		database.query('select image from user where id=?', [req.session.user.id], function (error, result) {
			if (error) {
				console.log(error);
				res.redirect('/settings');
			}

			if (result.length > 0) {
				var image_path = result[0].image;
				res.render('home/settings', { image: image_path });
			} else {
				res.render('home/settings', { image: '' });
			}
		});
	}
}

exports.post_upload = function (database) {
	return function (req, res) {
		var random_id = crypto.randomBytes(20).toString('hex');
		var filepath = './uploads/' + random_id + '.png';
		var database_filepath = random_id + '.png';

		var tmpPath = req.files.file.path;
		var targetPath = path.resolve(filepath);

		if (path.extname(req.files.file.name).toLowerCase() == '.png') {
			fs.rename(tmpPath, targetPath, function (error) {
				if (error) {
					console.log(error);
					res.redirect('/settings');
				}

				database.query('update user set image=? where id=?', [database_filepath, req.session.user.id], function(error) {
					if (error) {
						console.log(error);
						res.redirect('/settings');
					}
				});
			});
		} else {
			fs.unlink(tmpPath, function (error) {
				if (error) {
					console.log(error);
					res.redirect('/settings');
				}

				res.render('home/settings', { message: 'only png allowed' });
			});
		}
	}
}