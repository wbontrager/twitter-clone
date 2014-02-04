var site = require('./routes/site');

module.exports = function (app,database) {
    app.get('/', site.index);
}
