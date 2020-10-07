const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('../api/router');
const error = require('../api/middlewares/error');

/**
 * Express instance
 * @public
 */
const app = express();

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// mount api routes
app.use(router);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;