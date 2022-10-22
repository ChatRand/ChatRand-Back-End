const {ServerError, ValidationError} = require('./error');

const Joi = require('joi');

const middlewareHandler = (fn) => (req, res, next) => {
  fn(req, res, next)
      .catch((err) => {
        switch (err.constructor) {
          case Joi.ValidationError:
            return next(new ValidationError(err.message));
          default:
            return next(new ServerError(err.message));
        }
      });
};

module.exports = middlewareHandler;
