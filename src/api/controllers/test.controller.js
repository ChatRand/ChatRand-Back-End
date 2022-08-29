const testDefault = async (request, responseFunctions) => {
  return responseFunctions.successResponse(request, {}, 'success');
};


module.exports = {
  testDefault,
};
