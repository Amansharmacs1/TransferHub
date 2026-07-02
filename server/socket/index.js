const logger = require('../utils/logger');
const deviceRegistry = require('./deviceRegistry');
const generateCode = require('../utils/generateCode');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Generate a unique 6-character code
    let pairingCode;
    do {
      pairingCode = generateCode();
    } while (deviceRegistry.getDeviceByCode(pairingCode));

    // Register device
    deviceRegistry.registerDevice(socket.id, pairingCode);
    
    // Send initialization data to the connected client
    socket.emit('init', {
      socketId: socket.id,
      pairingCode: pairingCode,
    });

    // Handle pairing request from this socket to a target code
    socket.on('request-pairing', ({ targetCode }) => {
      const targetDevice = deviceRegistry.getDeviceByCode(targetCode);
      const thisDevice = deviceRegistry.getDeviceBySocketId(socket.id);

      if (!targetDevice) {
        return socket.emit('pairing-error', { message: 'Invalid pairing code.' });
      }
      
      if (targetDevice.socketId === socket.id) {
        return socket.emit('pairing-error', { message: 'Cannot pair with yourself.' });
      }

      if (targetDevice.status !== 'idle') {
        return socket.emit('pairing-error', { message: 'Device is busy.' });
      }

      // Update statuses
      deviceRegistry.updateDeviceStatus(socket.id, 'requesting', targetDevice.socketId);
      deviceRegistry.updateDeviceStatus(targetDevice.socketId, 'incoming_request', socket.id);

      // Notify target device
      io.to(targetDevice.socketId).emit('pairing-requested', {
        requesterId: socket.id,
        requesterCode: thisDevice.pairingCode,
      });
    });

    // Handle response to a pairing request
    socket.on('pairing-response', ({ requesterId, accept }) => {
      const requesterDevice = deviceRegistry.getDeviceBySocketId(requesterId);
      const thisDevice = deviceRegistry.getDeviceBySocketId(socket.id);

      if (!requesterDevice) {
        deviceRegistry.updateDeviceStatus(socket.id, 'idle');
        return socket.emit('pairing-error', { message: 'Requester disconnected.' });
      }

      if (accept) {
        // Both connected
        deviceRegistry.updateDeviceStatus(socket.id, 'connected', requesterId);
        deviceRegistry.updateDeviceStatus(requesterId, 'connected', socket.id);

        io.to(requesterId).emit('pairing-accepted', {
          partnerId: socket.id,
          partnerCode: thisDevice.pairingCode,
        });

        socket.emit('pairing-accepted', {
          partnerId: requesterId,
          partnerCode: requesterDevice.pairingCode,
        });
      } else {
        // Rejected
        deviceRegistry.updateDeviceStatus(socket.id, 'idle');
        deviceRegistry.updateDeviceStatus(requesterId, 'idle');

        io.to(requesterId).emit('pairing-rejected', {
          message: 'Pairing request was rejected.'
        });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      
      const device = deviceRegistry.removeDevice(socket.id);
      
      // Notify partner if they were connected or in the process of connecting
      if (device && device.partnerId) {
        const partner = deviceRegistry.getDeviceBySocketId(device.partnerId);
        if (partner) {
          deviceRegistry.updateDeviceStatus(partner.socketId, 'idle');
          io.to(partner.socketId).emit('partner-disconnected');
        }
      }
    });
  });
};

module.exports = initializeSocket;
