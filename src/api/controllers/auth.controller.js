/* eslint-disable max-len */
const _ = require('lodash');

const config = require('../../config/config');
const UserService = require('../../services/user.service');

const {successResponse, errorResponse} = require('../../utils/responses');
const {BAD_REQUEST} = require('../../helpers/constants/statusCodes');
const asyncHandler = require('../../helpers/error/asyncHandler');

const userSignUp = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await UserService.signUp(userData);

  if (user == null) {
    return errorResponse(res, BAD_REQUEST, 'Username already exists');
  }
  const token = UserService.generateToken(user._id, user.username);

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.app.secureCookie,
    sameSite: true,
  });

  // eslint-disable-next-line max-len
  return successResponse(res, _.pick(user, ['_id', 'firstName', 'lastName', 'userName', 'email', 'phoneNumber']));
});

const userSignIn = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await UserService.signIn(userData);

  if ( user === null) {
    return errorResponse(res, BAD_REQUEST, 'username password incorrect!');
  }
  const token = UserService.generateToken(user._id, user.username);

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.app.secureCookie,
    sameSite: true,
  });

  return successResponse(res, _.pick(user, ['_id', 'firstName', 'lastName', 'email']));
});

module.exports = {
  userSignUp,
  userSignIn,
};
