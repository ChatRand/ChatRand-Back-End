const {Prisma} = require('@prisma/client');
const {DatabaseError} = require('../error/error');
const handleDatabaseError = require('../error/prismaErrorHandler');

const runDatabaseQuery = async (query) => {
  try {
    const result = await query();
    return result;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const errorObject = handleDatabaseError(err);
      console.log(`\n\n\n ${errorObject}`);
      return new DatabaseError(errorObject.message, errorObject.details);
    } else {
      return new DatabaseError('Internal Server Error');
    }
  };
};

module.exports = runDatabaseQuery;
