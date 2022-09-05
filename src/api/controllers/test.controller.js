const testDefault = async ({req, res, next}, {sendSuccessResponse}) => {
  return sendSuccessResponse({}, 'success');
};


module.exports = {
  testDefault,
};
