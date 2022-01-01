const _ = require('lodash');
const {emailEvent} = require('../../subscribers/send_email_confirmation');

const config = require('../../config/config');
const UserService = require('../../services/user.service');
const UserLoginsService = require('../../services/userLogins.service');

const {createToken} = require('../../utils/token');

const {successResponse, errorResponse} = require('../../utils/responses');
// eslint-disable-next-line max-len
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('../../helpers/constants/statusCodes');
const asyncHandler = require('../../helpers/error/asyncHandler');
const {serverLogger} = require('../../helpers/logger/serverLogger');

const userSignUp = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await UserService.signUp(userData);

  if (user == null) {
    return errorResponse(res, BAD_REQUEST, 'Username already exists');
  }

  const token = await createToken(user, req);

  user.accessToken = token;

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
            'accessToken',
          ],
      ), 'User Saved To Database');
});

const userSignIn = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await UserService.signIn(userData);

  if ( user === null) {
    return errorResponse(res, BAD_REQUEST, 'username or password incorrect!');
  }
  const token = await createToken(user, req);

  user.accessToken = token;

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
            'accessToken',
          ],
      ), 'Successful Login');
});

const userSignout = asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];

  const bearer = authHeader && authHeader.split(' ')[0];

  if (bearer != 'Bearer') {
    return errorResponse(res,
        UNAUTHORIZED,
        'Auth token required');
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return errorResponse(
        res,
        UNAUTHORIZED,
        'Auth token required',
    );
  }

  const blackListed = UserLoginsService.blackListAToken(token);

  if (blackListed.success) {
    return successResponse(res, { }, 'Successfully Signed Out');
  } else {
    switch (blackListed.code) {
      case UNAUTHORIZED:
        return errorResponse(res,
            UNAUTHORIZED,
            'Token blacklisted. Cannot use this token');
      case FORBIDDEN:
        return errorResponse(res,
            FORBIDDEN,
            'Unable to verify token');
    }
  }
});

module.exports = {
  userSignUp,
  userSignIn,
  userSignout,
};
