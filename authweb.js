/*
 * Copyright (C) 2016-Present The MoonLake (mcmoonlake@hotmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var express = require('express');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

/** properties */

var config = require('./config');
var mysql = require('./util/mysql');
var AuthError = function (error, message, cause) {
    this.error = error;
    this.message = message;
    this.cause = cause;
};
var AuthErrorThrow = function (status, error, message, cause) {
    var err = new AuthError(error, message, cause);
    err.status = status;
    throw err;
};
var AuthErrorRes = function (res, status, error, message, cause) {
    res.status(status || 500);
    res.json({ error: error, errorMessage: message, cause: cause });
    res.end();
};

app.set('config', config);
app.set('mysql', mysql);
app.set('AuthError', AuthError);
app.set('AuthErrorThrow', AuthErrorThrow);
app.set('AuthErrorRes', AuthErrorRes);

/** MySQL Test */

if(config.mysql.test || false) {
    mysql.test(function (err) {
        if(!err) {
            console.info('The MySQL is successfully connected.')
        } else {
            console.error('Unable to connect to the MySQL.');
            console.error(err);
            process.exit(1);
        }
    });
}

/** Base */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

/** Routes */

app.use('/', require('./routes/index'));
app.use('/yggdrasil', require('./routes/yggdrasil/index'));
app.use('/authserver', require('./routes/authserver/index'));

/** Error Handler */

app.use(function(err, req, res, next) {
    if(err instanceof AuthError) {
        if(err.status === undefined)
            err.status = 500;
        next(err);
    } else {
        var error = new AuthError(err.status || 500, err.message);
        error.status = err.status;
        next(error)
    }
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err.error, errorMessage: err.message, cause: err.cause });
    res.end();
});

/** Error */

if(module.parent !== null) {
    module.exports = app;
} else {
    var http = require('http');
    var server = http.createServer(app);
    server.listen(app.get('config').http.port, function () {
        var port = server.address().port;
        console.info('-----------------------------------------------------------------------------------------------------');
        console.info('|   A Minecraft Yggdrasil Web Server of Node.js & MySQL');
        console.info('|   https://github.com/McMoonLakeDevAuth/authweb');
        console.info('|   by lgou2w');
        console.info('-----------------------------------------------------------------------------------------------------');
        console.info('|   AuthWeb Server Listening on http://localhost:' + port);
        console.info('|   Listening request...');
        console.info('-----------------------------------------------------------------------------------------------------');
    });
}
