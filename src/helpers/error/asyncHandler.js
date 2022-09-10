const ServerError = require('./ServerError');
const ValidationError = require('./ValidationError');
const {successResponse, errorResponse} = require('../../utils/responses');

const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

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
