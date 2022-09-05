const {OK} = require('../helpers/constants/statusCodes');

const errorResponse = (res, httpCode, message) => {
  res.status(httpCode).json({
    success: false,
    message: message,
  });
};

const successResponse = (res, payload, message) => {
  res.status(OK).json({
    success: true,
    message: message,
    data: payload,
  });
};


module.exports = {
  errorResponse,
  successResponse,
};
