const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const initializeSocket = require('../socket');
const deviceRegistry = require('../socket/deviceRegistry');

describe('Socket.IO Signaling & Pairing', () => {
  let io, serverSocket, clientSocket1, clientSocket2;
  let port;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    initializeSocket(io);
    httpServer.listen(() => {
      port = httpServer.address().port;
      done();
    });
  });

  afterAll(() => {
    io.close();
  });

  beforeEach(() => {
    deviceRegistry.devices.clear(); // Reset registry
  });

  afterEach(() => {
    if (clientSocket1 && clientSocket1.connected) clientSocket1.disconnect();
    if (clientSocket2 && clientSocket2.connected) clientSocket2.disconnect();
  });

  test('should register and initialize a client with a pairing code', (done) => {
    clientSocket1 = new Client(`http://localhost:${port}`);
    clientSocket1.on('init', (data) => {
      expect(data).toHaveProperty('socketId');
      expect(data).toHaveProperty('pairingCode');
      expect(data.pairingCode.length).toBe(6);
      done();
    });
  });


  test('should reject malformed pairing payload', (done) => {
    clientSocket1 = new Client(`http://localhost:${port}`);
    clientSocket1.on('pairing-error', (data) => {
      expect(data.message).toBe('Invalid payload.');
      done();
    });
    clientSocket1.on('connect', () => {
      clientSocket1.emit('request-pairing', { invalid: 'payload' });
    });
  });

  test('should handle pairing request and response', (done) => {
    let client1Code = '';
    let client2Code = '';

    clientSocket1 = new Client(`http://localhost:${port}`);
    clientSocket2 = new Client(`http://localhost:${port}`);

    clientSocket1.on('init', (data) => { client1Code = data.pairingCode; });
    
    clientSocket2.on('init', (data) => {
      client2Code = data.pairingCode;
      setTimeout(() => {
        clientSocket1.emit('request-pairing', { targetCode: client2Code });
      }, 50);
    });

    clientSocket2.on('pairing-requested', (data) => {
      expect(data.requesterCode).toBe(client1Code);
      clientSocket2.emit('pairing-response', {
        requesterId: data.requesterId,
        accept: true
      });
    });

    clientSocket1.on('pairing-accepted', (data) => {
      expect(data.partnerCode).toBe(client2Code);
      done();
    });
  });
});
