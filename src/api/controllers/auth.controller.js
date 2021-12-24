const _ = require('lodash');
const {emailEvent} = require('../../subscribers/send_email_confirmation');

const config = require('../../config/config');
const UserService = require('../../services/user.service');

const {successResponse, errorResponse} = require('../../utils/responses');
const {BAD_REQUEST} = require('../../helpers/constants/statusCodes');
const asyncHandler = require('../../helpers/error/asyncHandler');
const {serverLogger} = require('../../helpers/logger/serverLogger');

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
  serverLogger.info(`User With Id ${user._id} Successfully Registered`);
  emailEvent.emit('user_regsistered', user);

  return successResponse(
      res,
      _.pick(user,
          [
            '_id',
            'firstName',
            'lastName',
            'userName',
            'email',
            'phoneNumber',
          ],
      ), 'User Saved To Database');
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
  serverLogger.info(`User With Id ${user._id} Successfully Logged In`);

  return successResponse(
      res,
      _.pick(user,
          [
            '_id',
            'firstName',
            'lastName',
            'email',
          ],
      ), 'Successful Login');
});

module.exports = {
  userSignUp,
  userSignIn,
};
