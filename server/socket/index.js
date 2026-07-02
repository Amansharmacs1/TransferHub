const logger = require('../utils/logger');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });

    // In future phases, WebRTC signaling events will go here
  });
};

module.exports = initializeSocket;
