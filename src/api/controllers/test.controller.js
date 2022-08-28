const {successResponse} = require('../../utils/responses');

const testDefault = async (req, res, next) => {
  return successResponse(res, {}, 'success');
};


module.exports = {
  testDefault,
};
