const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV;

const development = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
    secret: process.env.SECRET || 'Sec896543MJQRU,*^&',
    secureCookie: false,
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'randChat',
  },
};

const production = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10),
    secret: process.env.SECRET,
    secureCookie: true,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};

const config = {
  development,
  production,
};

module.exports = config[env];
