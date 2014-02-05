var site = require('./routes/site');
var auth = require('./routes/auth');
var home = require('./routes/home');

module.exports = function (app, database) {
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
    app.get('/home', home.index);
}
