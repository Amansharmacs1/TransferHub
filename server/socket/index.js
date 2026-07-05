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
    socket.on('request-pairing', (data) => {
      if (!data || typeof data.targetCode !== 'string' || data.targetCode.length !== 6) {
        return socket.emit('pairing-error', { message: 'Invalid payload.' });
      }
      const { targetCode } = data;
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
    socket.on('pairing-response', (data) => {
      if (!data || typeof data.requesterId !== 'string' || typeof data.accept !== 'boolean') {
        return;
      }
      const { requesterId, accept } = data;
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

    socket.on('end-pairing', () => {
      const device = deviceRegistry.getDeviceBySocketId(socket.id);
      if (device && device.partnerId) {
        const partner = deviceRegistry.getDeviceBySocketId(device.partnerId);
        
        // Reset both to idle
        deviceRegistry.updateDeviceStatus(socket.id, 'idle');
        if (partner) {
          deviceRegistry.updateDeviceStatus(partner.socketId, 'idle');
          io.to(partner.socketId).emit('pairing-ended', { message: 'Partner disconnected.' });
        }
        
        socket.emit('pairing-ended', { message: 'Disconnected successfully.' });
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

    // --- WebRTC Signaling ---
    const validateWebRTC = (data) => data && typeof data === 'object';

    socket.on('webrtc-offer', (data) => {
      if (!validateWebRTC(data)) return;
      const device = deviceRegistry.getDeviceBySocketId(socket.id);
      if (device && device.partnerId && device.status === 'connected') {
        io.to(device.partnerId).emit('webrtc-offer', data);
      }
    });

    socket.on('webrtc-answer', (data) => {
      if (!validateWebRTC(data)) return;
      const device = deviceRegistry.getDeviceBySocketId(socket.id);
      if (device && device.partnerId && device.status === 'connected') {
        io.to(device.partnerId).emit('webrtc-answer', data);
      }
    });

    socket.on('webrtc-ice-candidate', (data) => {
      if (!validateWebRTC(data)) return;
      const device = deviceRegistry.getDeviceBySocketId(socket.id);
      if (device && device.partnerId && device.status === 'connected') {
        io.to(device.partnerId).emit('webrtc-ice-candidate', data);
      }
    });

  });
};

module.exports = initializeSocket;
