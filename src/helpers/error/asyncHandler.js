const {ValidationError, ServerError} = require('./error');
const {successResponse, errorResponse} = require('../../utils/responses');

const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const Joi = require('joi');

const asyncHandler = (fn, options) => {
  return async (req, res, next) => {
    const sendSuccessResponse = (payload, message) => {
      successResponse(res, payload, message);
    };

    const sendErrorResponse = (httpCode, message) => {
      errorResponse(res, httpCode, message);
    };

    try {
      if (options.validator) {
        await options.validator(req);
      }

      await fn(
          {req, res, next},
          prisma,
          {
            sendSuccessResponse,
            sendErrorResponse,
          },
      );
    } catch (err) {
      console.log(err);
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
