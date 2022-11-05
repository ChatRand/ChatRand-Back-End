const {OK} = require('../helpers/constants/statusCodes');

const errorResponse = (res, httpCode, message, details={}) => {
  res.status(httpCode).json({
    success: false,
    message,
    details,
  });
};

const successResponse = (res, payload, message) => {
  res.status(OK).json({
    success: true,
    message,
    data: payload,
  });
};


module.exports = {
  errorResponse,
  successResponse,
};
