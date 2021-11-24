const express = require('express');
// eslint-disable-next-line new-cap
const indexRouter = express.Router();

const authRouter = require('./auth.routes');

indexRouter.use(authRouter);

module.exports = indexRouter;
