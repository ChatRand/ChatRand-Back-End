/* eslint-disable max-len */
const express = require('express');

const AuthController = require('../../controllers/auth.controller');
const asyncHandler = require('../../../helpers/error/asyncHandler');
const {authenticateToken} = require('../../middlewares/auth/tokenControl');
const UserValidator = require('../../middlewares/validators/user.validator');
// eslint-disable-next-line new-cap
const authRouter = express.Router();


authRouter.post('/sign-up', asyncHandler(AuthController.userSignUp, {validator: UserValidator.SignUpValidator}));
authRouter.post('/sign-in', asyncHandler(AuthController.userSignIn, {validator: UserValidator.SignInValidator}));
// authRouter.delete('/sign-out', AuthController.userSignOut);

// authRouter.post('/account/verify/', authenticateToken, AuthController.verifyAccount);
// authRouter.post('/account/change-password', authenticateToken, AuthController.changePassword);

authRouter.get('/user/logins/show', asyncHandler(authenticateToken), asyncHandler(AuthController.showUserLogins));
authRouter.delete('/user/logins/delete/:login_id', asyncHandler(authenticateToken), asyncHandler(AuthController.deleteUserLogin));
// authRouter.delete('/user/logins/delete/all', authenticateToken, AuthController.deleteAllUserLogins);
// authRouter.delete('/user/logins/delete/all/not-current', authenticateToken, AuthController.deleteAllUserLoginsExceptCurrent);

module.exports = authRouter;
