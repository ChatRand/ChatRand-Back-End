/* eslint-disable new-cap */
const express = require('express');

const v1Router = express.Router();

const authRouter = require('./auth.routes');
const botRouter = require('./bot');
const testRouter = require('./test.routes');

v1Router.use('/auth', authRouter);
v1Router.use('/bot', botRouter);
v1Router.use('/test', testRouter);

module.exports = v1Router;
