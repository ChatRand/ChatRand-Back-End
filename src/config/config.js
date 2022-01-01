const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV;

const development = {
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    secret: process.env.APP_SECRET || 'Sec896543MJQRU,*^&',
    secureCookie: false,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'randChat',
  },
};

const production = {
  app: {
    port: parseInt(process.env.APP_PORT, 10),
    secret: process.env.SECRET,
    secureCookie: true,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
};

const config = {
  development,
  production,
};

module.exports = config[env];
