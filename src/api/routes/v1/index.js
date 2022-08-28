const express = require('express');
// eslint-disable-next-line new-cap
const indexRouter = express.Router();

const authRouter = require('./auth.routes');
const botRouter = require('./bot');
const testRouter = require('./test.routes');

indexRouter.use('/auth', authRouter);
indexRouter.use('/bot', botRouter);
indexRouter.use('/test', testRouter);

module.exports = indexRouter;
