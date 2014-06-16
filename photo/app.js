var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');

var routes = require('./routes/index');
var users = require('./routes/users');
var photos = require('./routes/photos');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');

app.use(favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// app.use('/', routes);
app.use('/users', users);
app.use(logger('dev'));
app.get('/', photos.list);
app.get('/upload', photos.form);
app.get('/photo/:id/download', photos.download(app.get('photos')));

var multipartMiddleware = multipart();
app.post('/upload', multipartMiddleware, photos.submit(app.get('photos')));

//app.post('/upload', photos.submit(app.get('photos')));

// app.post('/upload', function (req, res) {
//     console.log(req.body);

//     res.send("well done");
//     return;
// })

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
