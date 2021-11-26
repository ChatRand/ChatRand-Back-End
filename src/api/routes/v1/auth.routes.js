/* eslint-disable max-len */
const express = require('express');

const AuthController = require('../../controllers/auth.controller');
const UserValidator = require('../../middlewares/validators/user.validator');

// eslint-disable-next-line new-cap
const authRouter = express.Router();


authRouter.post('/sign-up', UserValidator.SignUpValidator, AuthController.userSignUp);
authRouter.post('/sign-in', UserValidator.signInValidator, AuthController.userSignIn);

module.exports = authRouter;
