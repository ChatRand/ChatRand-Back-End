const registerSocketSubscribers = (socket) => {
  socket.emit('welcome', {
    message: 'welcome to eazify',
    socketId: socket.id,
  });

  socket.on('disconnect', (reason) => {
    console.log('Closed socket connection');
  });
};

module.exports = {
  registerSocketSubscribers,
};
