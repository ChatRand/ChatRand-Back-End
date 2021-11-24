const http = require('http');
const app = require('./app');
const config = require('./config/config');

const port = config.app.port;

const server = http.createServer(app);

server.listen(port);
