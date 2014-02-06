var site = require('./routes/site');
var auth = require('./routes/auth');
var home = require('./routes/home');
var tweet = require('./routes/tweet');
var user = require('./routes/user')
var settings = require('./routes/settings');

module.exports = function (app, database) {
    function checkAuthentication (req, res, next) {
        if (!req.session.user) {
            res.redirect('/');
            return;
        }
        next();
    };
    app.get('*', function (req, res, next) {
        if (req.session.user) {
            //make user visible in jade templates
            res.locals.user = req.session.user || null;
        }
        next();
    });

    app.get('/', site.index);
    app.post('/login', auth.post_login(database));
    app.post('/register', auth.post_register(database));
    app.get('/logout', auth.get_logout);

    app.get('/home', checkAuthentication, home.index(database));

    app.post('/tweet', checkAuthentication, tweet.post_tweet(database));
    app.get('/user/:user', checkAuthentication, user.get_user(database));

    app.get('/follow/:id', checkAuthentication, user.get_follow(database));
    app.get('/unfollow/:id', checkAuthentication, user.get_unfollow(database));

    app.get('/settings', checkAuthentication, settings.get_settings(database));
    app.post('/upload', checkAuthentication, settings.post_upload(database));
}
