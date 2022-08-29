const ServerError = require('./ServerError');
const ValidationError = require('./ValidationError');
const {successResponse, errorResponse} = require('../../utils/responses');

const Joi = require('joi');

const asyncHandler = (fn, options) => {
  return async (req, res, next) => {
    const sendSuccessResponse = (payload, message) => {
      successResponse(res, payload, message);
    };

    const sendErrorResponse = (httpCode, payload) => {
      errorResponse(res, httpCode, payload);
    };

    try {
      if (options.validator) {
        await options.validator(req);
      }

      await fn({req, res, next}, {sendSuccessResponse, sendErrorResponse});
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
