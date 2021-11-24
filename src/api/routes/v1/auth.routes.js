const express = require('express');

const AuthController = require('../../controllers/auth.controller');

// eslint-disable-next-line new-cap
const authRouter = express.Router();


authRouter.post('/sign-up', AuthController.userSignUp);
authRouter.post('/sign-in', AuthController.userSignIn);

module.exports = authRouter;
