const ServerError = require('./ServerError');
const ValidationError = require('./ValidationError');

const Joi = require('joi');

const asyncHandler = (fn, options) => {
  return async (req, res, next) => {
    try {
      if (options.validator) {
        await options.validator(req);
      }

      await fn(req, res, next);
    } catch (err) {
      switch (err.constructor) {
        case Joi.ValidationError:
          return next(new ValidationError(err.message));
        default:
          console.log(err);
          return next(new ServerError(err.message));
      }
    }
  };
};

module.exports = asyncHandler;
