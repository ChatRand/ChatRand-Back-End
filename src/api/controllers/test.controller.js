const testDefault = async (
    expressParams,
    prisma,
    {sendSuccessResponse},
) => {
  const users = await prisma.user.findMany();
  return sendSuccessResponse({users}, 'success');
};


module.exports = {
  testDefault,
};
