/* eslint-disable max-len */
const express = require('express');
const cookieParser = require('cookie-parser');
// const connectToDatabase = require('./database/db');
const cors = require('cors');
const routes = require('./api/routes');
const helmet = require('helmet');

// const mongoSanitize = require('express-mongo-sanitize');

const {httpLogger} = require('./helpers/logger/serverLogger');
const {Server404Error} = require('./helpers/error/error');
const {errorHandler} = require('./api/middlewares/error/errorHandler');
const clientErrorHandler = require('./api/middlewares/error/clientErrorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));

app.use(helmet());

app.use(cors());
app.options('*', cors());

// app.use(mongoSanitize());

// Parse Cookie On req.cookies
app.use(cookieParser());

// connectToDatabase();

app.use(httpLogger);

app.use('/api', routes);
app.all('*', (req, res, next) => {
  next(
      new Server404Error(`Path ${req.originalUrl} not found`),
  );
});

app.use(errorHandler);

app.use(clientErrorHandler);

module.exports = app;
