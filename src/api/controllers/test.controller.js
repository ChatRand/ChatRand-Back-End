const testDefault = async (request, {successResponse}) => {
  return successResponse(request, {}, 'success');
};


module.exports = {
  testDefault,
};
