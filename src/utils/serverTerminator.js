const {serverLogger} = require('../helpers/logger/serverLogger');

const serverTerminator = () => {
  global.server.close((err) => {
    if (err) {
      serverLogger.error(err.message);
      process.exit(1);
    }
  });
};

module.exports = serverTerminator;
