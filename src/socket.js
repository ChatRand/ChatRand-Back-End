const {registerSocketSubscribers} = require('./subscribers/websocket');

const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
};
const io = require('socket.io')(options);

io.on('connection', (socket) => {
  registerSocketSubscribers(socket);
});


module.exports = io;
