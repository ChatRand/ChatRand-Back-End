/* eslint-disable max-len */
const UserValidationSchema = require('../../../helpers/dataValidator/user.schema');

const signInValidator = async (req) => {
  await UserValidationSchema.signInSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
};

const SignUpValidator = async (req) => {
  await UserValidationSchema.signUpSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
};

module.exports = {
  signInValidator,
  SignUpValidator,
};
