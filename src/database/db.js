const mongoose = require('mongoose');

const config = require('../config/config');

const dbURI = `mongodb://${ config.db.host }:${ config.db.port }/${ config.db.name }`;

const connectToDatabase = () => {
  mongoose.connect(dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  // Connection events
  mongoose.connection.on('connecting', () => {
    console.log('Connecting to the database...');
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to the database...');
  });

  mongoose.connection.on('error', (error) => {
    console.log(`Error while connecting to the database \n Reason: ${ error }`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from the database');
  });

  //  If the app terminates close Mongoose connection
  process.on('SIGINT', () => {
    // eslint-disable-next-line max-len
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
};


module.exports = connectToDatabase;
