class DeviceRegistry {
  constructor() {
    // Map of socketId -> { socketId, pairingCode, partnerId, status }
    this.devices = new Map();
    // Map of pairingCode -> socketId (for fast lookup)
    this.codes = new Map();
  }

  registerDevice(socketId, pairingCode) {
    this.devices.set(socketId, {
      socketId,
      pairingCode,
      partnerId: null,
      status: 'idle', // idle, requesting, connected
    });
    this.codes.set(pairingCode, socketId);
  }

  removeDevice(socketId) {
    const device = this.devices.get(socketId);
    if (device) {
      this.codes.delete(device.pairingCode);
      this.devices.delete(socketId);
    }
    return device;
  }

  getDeviceBySocketId(socketId) {
    return this.devices.get(socketId);
  }

  getDeviceByCode(pairingCode) {
    const socketId = this.codes.get(pairingCode);
    return socketId ? this.devices.get(socketId) : null;
  }

  updateDeviceStatus(socketId, status, partnerId = null) {
    const device = this.devices.get(socketId);
    if (device) {
      device.status = status;
      device.partnerId = partnerId;
      this.devices.set(socketId, device);
    }
  }
}

module.exports = new DeviceRegistry();
