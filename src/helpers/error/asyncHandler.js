const ServerError = require('./ServerError');

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next)
      .catch((err) => {
        return next(new ServerError(err.message));
      });
};

module.exports = asyncHandler;
