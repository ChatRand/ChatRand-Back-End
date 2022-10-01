/* eslint-disable max-len */
const UserValidationSchema = require('../../../helpers/dataValidator/user.schema');

const SignInValidator = async (req) => {
  await UserValidationSchema.signInSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
};

const SignUpValidator = async (req) => {
  await UserValidationSchema.signUpSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
};

module.exports = {
  SignInValidator,
  SignUpValidator,
};
