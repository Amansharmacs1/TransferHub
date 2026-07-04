import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { socket } from '../socket';

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within a SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState(null);
  const [pairingCode, setPairingCode] = useState(null);
  const [partnerCode, setPartnerCode] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, requesting, incoming_request, connected
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [error, setError] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId(null);
      setPairingCode(null);
      setPartnerCode(null);
      setStatus('idle');
      setIsInitiator(false);
    }
    
    function onInit({ socketId, pairingCode }) {
      setSocketId(socketId);
      setPairingCode(pairingCode);
    }

    function onPairingError({ message }) {
      setError(message);
      setStatus('idle');
      setIsInitiator(false);
    }

    function onPairingRequested(data) {
      setIncomingRequest(data);
      setStatus('incoming_request');
    }

    function onPairingAccepted({ partnerId, partnerCode }) {
      setPartnerCode(partnerCode);
      setStatus('connected');
      setIncomingRequest(null);
    }

    function onPairingRejected({ message }) {
      setError(message);
      setStatus('idle');
      setIsInitiator(false);
    }

    function onPairingEnded({ message }) {
      setPartnerCode(null);
      setStatus('idle');
      setIsInitiator(false);
    }

    function onPartnerDisconnected() {
      setPartnerCode(null);
      setStatus('idle');
      setIsInitiator(false);
      setError('Partner disconnected.');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('init', onInit);
    socket.on('pairing-error', onPairingError);
    socket.on('pairing-requested', onPairingRequested);
    socket.on('pairing-accepted', onPairingAccepted);
    socket.on('pairing-rejected', onPairingRejected);
    socket.on('pairing-ended', onPairingEnded);
    socket.on('partner-disconnected', onPartnerDisconnected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('init', onInit);
      socket.off('pairing-error', onPairingError);
      socket.off('pairing-requested', onPairingRequested);
      socket.off('pairing-accepted', onPairingAccepted);
      socket.off('pairing-rejected', onPairingRejected);
      socket.off('pairing-ended', onPairingEnded);
      socket.off('partner-disconnected', onPartnerDisconnected);
    };
  }, []);

  const requestPairing = useCallback((targetCode) => {
    setError(null);
    setStatus('requesting');
    setIsInitiator(true);
    socket.emit('request-pairing', { targetCode });
  }, []);

  const respondToPairing = useCallback((accept) => {
    if (incomingRequest) {
      setIsInitiator(false);
      socket.emit('pairing-response', { 
        requesterId: incomingRequest.requesterId, 
        accept 
      });
      if (!accept) {
        setStatus('idle');
        setIncomingRequest(null);
      }
    }
  }, [incomingRequest]);

  const disconnectPairing = useCallback(() => {
    socket.emit('end-pairing');
  }, []);
  
  const clearError = useCallback(() => setError(null), []);

  const value = { 
    isConnected, 
    socketId, 
    pairingCode, 
    partnerCode,
    status,
    incomingRequest,
    error,
    isInitiator,
    requestPairing,
    respondToPairing,
    disconnectPairing,
    clearError
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
