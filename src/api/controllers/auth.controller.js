const _ = require('lodash');
const {emailEvent} = require('../../subscribers/send_email_confirmation');

// const config = require('../../config/config');
// const UserService = require('../../services/user.service');
// const UserLoginsService = require('../../services/userLogins.service');

const {createToken} = require('../../utils/token');

// const {successResponse, errorResponse} = require('../../utils/responses');
// // eslint-disable-next-line max-len
// const {
//   BAD_REQUEST,
//   UNAUTHORIZED,
//   FORBIDDEN,
// } = require('../../helpers/constants/statusCodes');
// const asyncHandler = require('../../helpers/error/asyncHandler');
const {serverLogger} = require('../../helpers/logger/serverLogger');
const {compareHash, hashText} = require('../../utils/hashGenerators');

// const {compareHash, hashText} = require('../../utils/hashGenerators');

const userSignUp = async (
    expressParams,
    prisma,
    {
      sendSuccessResponse,
    },
) => {
  const userData = expressParams.req.body;

  const confirmationCode = (Math.floor(10000 + Math.random() * 900000))
      .toString();

  const hashedPassword = await hashText(userData.password);

  userData.password = hashedPassword;
  userData.confirmation_code = confirmationCode;


  // Database actions take up here
  const user = await prisma.user.create({
    data: {
      ...userData,
    },
  });

  const token = await createToken(user, expressParams.req, prisma);

  user.accessToken = token;

  serverLogger.info(`User With Id ${user.id} Successfully Registered`);
  emailEvent.emit('user_regsistered', user);

  return sendSuccessResponse(
      _.pick(user,
          [
            '_id',
            'first_name',
            'last_name',
            'username',
            'email',
            'phone_number',
            'accessToken',
          ],
      ), 'User Saved To Database');
};

const userSignIn = async (
    expressParams,
    prisma,
    {
      sendSuccessResponse,
      sendErrorResponse,
    },
) => {
  const userData = expressParams.req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: userData.username,
    },
  });

  if (!user) {
    return sendErrorResponse(400, {
      message: 'User not found',
    });
  }

  console.log(userData.password, user.password);
  const correctPassword = await compareHash(userData.password, user.password);

  if (!correctPassword) {
    return sendErrorResponse(400, 'Password incorrect');
  }

  const token = await createToken(user, expressParams.req, prisma);

  user.accessToken = token;

  serverLogger.info(`User With Id ${user.id} Successfully Logged In`);

  return sendSuccessResponse(
      _.pick(user,
          [
            'id',
            'first_name',
            'last_name',
            'email',
            'accessToken',
          ],
      ), 'Successful Login');
};

// const userSignOut = asyncHandler(async (req, res) => {
//   const authHeader = req.headers['authorization'];

//   const bearer = authHeader && authHeader.split(' ')[0];

//   if (bearer != 'Bearer') {
//     return errorResponse(res,
//         UNAUTHORIZED,
//         'Auth token required');
//   }

//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) {
//     return errorResponse(
//         res,
//         UNAUTHORIZED,
//         'Auth token required',
//     );
//   }

//   const blackListed = await UserLoginsService.blackListAToken(token);

//   if (blackListed.success) {
//     return successResponse(res, { }, 'Successfully Signed Out');
//   } else {
//     switch (blackListed.code) {
//       case UNAUTHORIZED:
//         return errorResponse(res,
//             UNAUTHORIZED,
//             'Token blacklisted. Cannot use this token');
//       case FORBIDDEN:
//         return errorResponse(res,
//             FORBIDDEN,
//             'Unable to verify token');
//     }
//   }
// });

const showUserLogins = async (
    expressParams,
    prisma,
    {
      sendErrorResponse,
      sendSuccessResponse,
    },
) => {
  const userId = expressParams.req.user.id;
  const tokenId = expressParams.req.user.tokenId;

  const userLogins = await UserLoginsService.showUserLogins(userId, tokenId);

  if (!userLogins) {
    return errorResponse(res,
        BAD_REQUEST,
        'Something went wrong try again!');
  } else {
    return successResponse(res, userLogins);
  }
};

// const deleteUserLogin = asyncHandler(async (req, res) => {
//   const loginId = req.params.login_id;
//   const userDetail = req.user;
//   const deletedLogin = await UserLoginsService.deleteUserLogin(loginId,
//       userDetail);

//   if (deletedLogin.success) {
//     return successResponse(res, { }, 'Successfully deleted a login');
//   } else {
//     switch (deletedLogin.code) {
//       case UNAUTHORIZED:
//         return errorResponse(res,
//             UNAUTHORIZED,
//             'You can only delete your login');
//       case BAD_REQUEST:
//         return errorResponse(res,
//             BAD_REQUEST,
//             'Something went wrong!');
//     }
//   }
// });

// const deleteAllUserLogins = asyncHandler(async (req, res) => {
//   const userDetail = req.user;
//   const deletedLogin = await UserLoginsService.deleteAllUserLogins(userDetail);

//   if (deletedLogin.success) {
//     return successResponse(res,
//         { }, 'Successfully deleted all logins!');
//   } else {
//     switch (deletedLogin.code) {
//       case BAD_REQUEST:
//         return errorResponse(res,
//             BAD_REQUEST,
//             'Something went wrong!');
//     }
//   }
// });

// const deleteAllUserLoginsExceptCurrent = asyncHandler(async (req, res) => {
//   const userDetail = req.user;

//   // eslint-disable-next-line max-len
//   const deletedLogin = await UserLoginsService.deleteAllUserLoginsExceptCurrent(userDetail);

//   if (deletedLogin.success) {
//     return successResponse(res,
//         { }, 'Successfully deleted all logins but this one!');
//   } else {
//     switch (deletedLogin.code) {
//       case BAD_REQUEST:
//         return errorResponse(res,
//             BAD_REQUEST,
//             'Something went wrong!');
//     }
//   }
// });

// const verifyAccount = asyncHandler(async (req, res) => {
//   const {confirmationCode} = req.body;
//   const user = req.user;

//   const requestedUser = await UserService.findById(user.id);

//   if (!(requestedUser.found)) {
//     return errorResponse(res,
//         BAD_REQUEST,
//         requestedUser.message);
//   }
//   if (requestedUser.data.confirmationCode == confirmationCode) {
//     requestedUser.data.activated = true;
//     requestedUser.data.confirmationCode = '';

//     await requestedUser.data.save();
//     return successResponse(res,
//         { },
//         'Account activated!');
//   } else {
//     errorResponse(res,
//         BAD_REQUEST,
//         'Confirmation code not correct!');
//   }
// });

// const changePassword = asyncHandler(async (req, res) => {
//   const user = req.user;

//   const {data} = await UserService.findById(user.id);

//   const {newPassword, oldPassword} = req.body;

//   if (compareHash(oldPassword, data.password)) {
//     data.password = await hashText(newPassword);
//     await data.save();

//     return successResponse(res, { }, 'Successfully changed password');
//   } else {
//     return errorResponse(res,
//         BAD_REQUEST,
//         'Passwords do not match');
//   }
// });


module.exports = {
  userSignUp,
  userSignIn,
  // userSignOut,
  showUserLogins,
  // deleteUserLogin,
  // deleteAllUserLogins,
  // deleteAllUserLoginsExceptCurrent,
  // verifyAccount,
  // changePassword,
};
