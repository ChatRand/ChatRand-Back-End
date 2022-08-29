const ServerError = require('./ServerError');
const ValidationError = require('./ValidationError');

const {OK} = require('../constants/statusCodes');

const Joi = require('joi');

const asyncHandler = (fn, options) => {
  return async (req, res, next) => {
    const successResponse = (payload, message) => {
      res.status(OK).json({
        success: true,
        message: message,
        data: payload,
      });
    };

    const errorResponse = (httpCode, payload) => {
      res.status(httpCode).json({
        success: false,
        message: payload,
      });
    };

    try {
      if (options.validator) {
        await options.validator(req);
      }

      await fn({req, res, next}, {successResponse, errorResponse});
    } catch (err) {
      switch (err.constructor) {
        case Joi.ValidationError:
          return next(new ValidationError(err.message));
        default:
          return next(new ServerError(err.message));
      }
    }
  };
};

module.exports = asyncHandler;
