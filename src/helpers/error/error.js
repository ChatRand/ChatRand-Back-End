/* eslint-disable max-len */
const {NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER} = require('../constants/statusCodes');

/* eslint-disable require-jsdoc */
class BaseError extends Error {
  constructor(name, httpCode, isOperational, description) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
};

class Server404Error extends BaseError {
  constructor(description = 'Not Found Error') {
    super('Not Found Error', NOT_FOUND, true, description);
  }
};


class ServerError extends BaseError {
  constructor(description = 'Internal Server Error') {
    super('Internal Server Error', INTERNAL_SERVER, true, description);
  }
};

class ValidationError extends BaseError {
  constructor(description = 'Validation Error') {
    super('Validation Error', BAD_REQUEST, true, description);
  }
};

module.exports = {
  BaseError,
  Server404Error,
  ServerError,
  ValidationError,
};
