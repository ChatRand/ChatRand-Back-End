const registerSocketSubscribers = (socket) => {
  socket.emit('welcome', {
    message: 'welcome to chatRand',
    socketId: socket.id,
  });

  socket.on('disconnect', (reason) => {
    console.log('Closed socket connection');
  });
};

module.exports = {
  registerSocketSubscribers,
};
