const handleDatabaseError = (error) => {
  const code = error.code;
  const meta = error.meta;
  let errorObject;
  console.log(code);
  switch (code) {
    case 'P2002':
      errorObject = {
        message: 'Duplicate documents',
        meta: meta,
      };
    default:
      errorObject = {
        message: 'Unknown Code',
        meta: null,
      };
  }

  return errorObject;
};


module.exports = handleDatabaseError;
