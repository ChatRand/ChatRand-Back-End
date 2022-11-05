/* eslint-disable max-len */
const {ValidationError, Server404Error, DatabaseError} = require('../../../helpers/error/error');
const {errorResponse} = require('../../../utils/responses');

const clientErrorHandler = (err, req, res, next) => {
  switch (err.constructor) {
    case ValidationError:
      return errorResponse(res, err.httpCode, err.message);
    case Server404Error:
      return errorResponse(res, err.httpCode, 'Not Found Error');
    case DatabaseError:
      return errorResponse(res, err.httpCode, err.name, err.details);
    default:
      return errorResponse(res, err.httpCode, 'Something Went Wrong');
  }
};

module.exports = clientErrorHandler;
