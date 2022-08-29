const testDefault = async ({req, res, next}, {successResponse}) => {
  return successResponse({}, 'success');
};


module.exports = {
  testDefault,
};
