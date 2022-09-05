const express = require('express');
// eslint-disable-next-line new-cap
const indexRouter = express.Router();

const v1Router = require('./v1');

indexRouter.use('/v1', v1Router);

module.exports = indexRouter;
