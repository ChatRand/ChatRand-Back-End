const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./database/db.js');
const cors = require('cors');
const v1Routes = require('./api/routes/v1');

app.use(cors());
app.options('*', cors());

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));

// Parse Cookie On req.cookies
app.use(cookieParser());

app.use('/api/v1', v1Routes);
app.all('*', (req, res, next) => {
  console.log(`path ${ req.originalUrl } not Found`);
});

module.exports = app;
