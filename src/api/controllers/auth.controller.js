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
const {BAD_REQUEST} = require('../../helpers/constants/statusCodes');

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

  const userLogins = await prisma.userLogin.findMany({
    where: {
      user_id: userId,
    },
  });

  let current = false;

  const logins = [];

  userLogins.forEach(async (login) => {
    current = false;
    if (tokenId == login.token_id) {
      current = true;
    }

    login.current = current;
    logins.push(login);
  });

  return sendSuccessResponse(userLogins);
};

const deleteUserLogin = async (
    expressParams,
    prisma,
    {
      sendErrorResponse,
      sendSuccessResponse,
    },
) => {
  const loginId = expressParams.req.params.login_id;

  await prisma.userLogin.update({
    where: {
      id: parseInt(loginId),
    },
    data: {
      token_deleted: true,
    },
  });

  return sendSuccessResponse('Token successfully deleted!');
};

const deleteAllUserLogins = async (
    expressParams,
    prisma,
    {
      sendSuccessResponse,
      sendErrorResponse,
    },
) => {
  const userDetail = expressParams.req.user;
  await prisma.user.update({
    where: {
      id: parseInt(userDetail.id),
    },
    data: {
      user_logins: {
        updateMany: {
          where: {
            user_id: userDetail.id,
          },
          data: {
            token_deleted: true,
          },
        },
      },
    },
  });

  return sendSuccessResponse('Successfully deleted all logins!');
};

const deleteAllUserLoginsExceptCurrent = async (
    expressParams,
    prisma,
    {
      sendSuccessResponse,
      sendErrorResponse,
    },
) => {
  const userDetail = expressParams.req.user;

  const userLogins = await prisma.userLogin.findMany({
    where: {
      user_id: userDetail.id,
    },
  });

  // eslint-disable-next-line prefer-const
  let current = false;

  userLogins.forEach(async (login) => {
    current = false;

    if (userDetail.tokenId === login.token_id) {
      current = true;
    }

    if (!current) {
      await prisma.userLogin.update({
        where: {
          token_id: login.token_id,
        },
        data: {
          token_deleted: true,
          logged_out: true,
        },
      });
    }
  });

  return sendSuccessResponse('Token deleted except current!');
};

// const checkEmail = asyncHandler(async (req, res) => {
//   const {email} = req.params;

//   const emailExists = UserService.checkEmailAvailability(email);

//   if (emailExists) {
//     return successResponse(res,
//         {
//           exists: true,
//         }, 'Email exists');
//   } else {
//     return successResponse(res,
//         {
//           exists: false,
//         }, 'Email does not exist');
//   }
// });

// const checkUserName = asyncHandler(async (req, res) => {
//   const {userName} = req.params;

//   const userNameExists = UserService.checkEmailAvailability(userName);

//   if (userNameExists) {
//     return successResponse(res,
//         {
//           exists: true,
//         }, 'userName exists');
//   } else {
//     return successResponse(res,
//         {
//           exists: false,
//         }, 'userName does not exist');
//   }
// });

const verifyAccount = async (
    expressParams,
    prisma,
    {
      sendErrorResponse,
      sendSuccessResponse,
    },
) => {
  const {confirmationCode} = expressParams.req.body;
  const userDetail = expressParams.req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: userDetail.id,
    },
  });

  if (!user) {
    return sendErrorResponse(BAD_REQUEST, 'User not found');
  }

  if (user.confirmation_code !== confirmationCode) {
    return sendErrorResponse(BAD_REQUEST, 'Confirmation code not correct');
  }

  await prisma.user.update({
    where: {
      id: userDetail.id,
    },
    data: {
      Activated: true,
      confirmation_code: '',
    },
  });

  return sendSuccessResponse(
      { },
      'Account activated!');
};

const changePassword = async (
    expressParams,
    prisma,
    {
      sendErrorResponse,
      sendSuccessResponse,
    },
) => {
  const userDetails = expressParams.req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: userDetails.id,
    },
  });

  const {newPassword, oldPassword} = expressParams.req.body;

  if (compareHash(oldPassword, user.password)) {
    const newHashedPassword = await hashText(newPassword);
    await prisma.user.update({
      where: {
        id: userDetails.id,
      },
      data: {
        password: newHashedPassword,
      },
    });

    return sendSuccessResponse({ }, 'Successfully changed password');
  } else {
    return sendErrorResponse(
        BAD_REQUEST,
        'Passwords do not match');
  }
};


module.exports = {
  userSignUp,
  userSignIn,
  // userSignOut,
  showUserLogins,
  deleteUserLogin,
  deleteAllUserLogins,
  deleteAllUserLoginsExceptCurrent,
  // checkEmail,
  // checkUserName,
  verifyAccount,
  changePassword,
};
