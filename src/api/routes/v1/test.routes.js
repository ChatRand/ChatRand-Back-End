/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const asyncHandler = require('../../../helpers/error/asyncHandler.js');

const testRouter = express.Router();

const UserValidationSchema = require('../../middlewares/validators/user.validator');

const {testDefault} = require('../../controllers/test.controller.js');

const options = {
  validator: UserValidationSchema.signInValidator,
};

testRouter.post('/', asyncHandler(testDefault, options));

module.exports = testRouter;
