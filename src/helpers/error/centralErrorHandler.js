const BaseError = require('./BaseError');

const isOperational = (err) => {
  if (err instanceof BaseError) {
    return err.isOperational;
  }
  return false;
};

const centralErrorHandler = (err) => {
  const errorMessage = JSON.stringify({
    message: err.message,
    type: err.constructor.name,
  });

  if (isOperational(err)) {
    console.warn(errorMessage);
  } else {
    console.error(errorMessage);

    //  Restart Server
  }
};

module.exports = centralErrorHandler;
