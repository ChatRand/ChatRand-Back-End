const testDefault = async (
    request,
    prisma,
    {sendSuccessResponse},
) => {
  const users = await prisma.user.findMany();
  return sendSuccessResponse({users}, 'success');
};


module.exports = {
  testDefault,
};
