import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { socket } from '../socket';
import { useSocketContext } from './SocketContext';
import { useToast } from './ToastContext';

const CHUNK_SIZE = 16 * 1024; // 16KB

const WebRTCContext = createContext();

export const useWebRTCContext = () => {
  const context = useContext(WebRTCContext);
  if (!context) throw new Error('useWebRTCContext must be used within a WebRTCProvider');
  return context;
};

export const WebRTCProvider = ({ children }) => {
  const { status, isInitiator, partnerCode } = useSocketContext();
  const { info, success, error } = useToast();

  const [connectionState, setConnectionState] = useState('disconnected');
  const [activeTransfers, setActiveTransfers] = useState({});
  const [receivedFiles, setReceivedFiles] = useState([]);
  
  const pc = useRef(null);
  const dc = useRef(null);
  
  // Receive state
  const receiveBuffer = useRef([]);
  const receivedSize = useRef(0);
  const incomingMetadata = useRef(null);
  
  // Send state queue
  const sendQueue = useRef([]);
  const isSending = useRef(false);
  const iceCandidateQueue = useRef([]);

  // Control state
  const pausedTransfers = useRef(new Set());
  const cancelledTransfers = useRef(new Set());

  // History Helper
  const saveToHistory = useCallback((fileData, direction) => {
    try {
      const history = JSON.parse(localStorage.getItem('transferhub_history') || '[]');
      history.unshift({
        ...fileData,
        direction,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('transferhub_history', JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history', err);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (dc.current) {
      dc.current.close();
      dc.current = null;
    }
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    setConnectionState('disconnected');
    receiveBuffer.current = [];
    receivedSize.current = 0;
    incomingMetadata.current = null;
    iceCandidateQueue.current = [];
    pausedTransfers.current.clear();
    cancelledTransfers.current.clear();
  }, []);

  useEffect(() => {
    if (status !== 'connected') {
      cleanup();
      return;
    }

    setConnectionState('connecting');

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    pc.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-ice-candidate', event.candidate);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      setConnectionState(peerConnection.connectionState);
    };

    const setupDataChannel = (channel) => {
      channel.binaryType = 'arraybuffer';
      channel.bufferedAmountLowThreshold = 64 * 1024 * 2; // 128KB

      const handleOpen = () => {
        setConnectionState('connected');
        processSendQueue();
      };

      if (channel.readyState === 'open') {
        handleOpen();
      } else {
        channel.onopen = handleOpen;
      }

      channel.onclose = () => setConnectionState('disconnected');

      channel.onmessage = (event) => {
        if (typeof event.data === 'string') {
          const message = JSON.parse(event.data);
          
          if (message.type === 'clipboard') {
            navigator.clipboard.writeText(message.data).then(() => {
              success('Copied text from partner to clipboard!');
            }).catch(() => {
              info(`Received text: ${message.data}`);
            });
            return;
          }

          if (message.type === 'file-cancel') {
            const id = message.id;
            setActiveTransfers(prev => {
              if (!prev[id]) return prev;
              return { ...prev, [id]: { ...prev[id], status: 'cancelled' } };
            });
            if (incomingMetadata.current?.id === id) {
              receiveBuffer.current = [];
              receivedSize.current = 0;
              incomingMetadata.current = null;
            }
            return;
          }

          if (message.type === 'file-start') {
            incomingMetadata.current = message.metadata;
            receiveBuffer.current = [];
            receivedSize.current = 0;
            
            setActiveTransfers(prev => ({
              ...prev,
              [message.metadata.id]: {
                ...message.metadata,
                progress: 0,
                status: 'receiving',
                speed: 0,
                eta: 0
              }
            }));
            
            incomingMetadata.current.startTime = Date.now();
            incomingMetadata.current.lastUpdateTime = Date.now();
            incomingMetadata.current.lastUpdateSize = 0;
            
          } else if (message.type === 'file-done') {
            if (!incomingMetadata.current) return;
            const meta = incomingMetadata.current;
            const blob = new Blob(receiveBuffer.current, { type: meta.fileType });
            const url = URL.createObjectURL(blob);
            
            const newFile = { ...meta, blobUrl: url };
            setReceivedFiles(prev => [...prev, newFile]);
            
            setActiveTransfers(prev => ({
              ...prev,
              [meta.id]: { ...prev[meta.id], progress: 100, status: 'completed', speed: 0, eta: 0 }
            }));

            saveToHistory({ name: meta.name, size: meta.size, partner: partnerCode }, 'received');
            success(`Received ${meta.name}`);

            receiveBuffer.current = [];
            receivedSize.current = 0;
            incomingMetadata.current = null;
          }
        } else {
          // ArrayBuffer chunk
          if (!incomingMetadata.current) return;

          receiveBuffer.current.push(event.data);
          receivedSize.current += event.data.byteLength;
          
          const now = Date.now();
          const meta = incomingMetadata.current;
          
          if (now - meta.lastUpdateTime > 500 || receivedSize.current === meta.size) {
            const timeDiff = (now - meta.lastUpdateTime) / 1000;
            const sizeDiff = receivedSize.current - meta.lastUpdateSize;
            const speed = timeDiff > 0 ? sizeDiff / timeDiff : 0;
            const remainingBytes = meta.size - receivedSize.current;
            const eta = speed > 0 ? remainingBytes / speed : 0;
            
            meta.lastUpdateTime = now;
            meta.lastUpdateSize = receivedSize.current;
            
            setActiveTransfers(prev => ({
              ...prev,
              [meta.id]: {
                ...prev[meta.id],
                progress: Math.round((receivedSize.current / meta.size) * 100),
                speed,
                eta
              }
            }));
          }
        }
      };
      
      dc.current = channel;
    };

    if (isInitiator) {
      const channel = peerConnection.createDataChannel('fileTransfer', { ordered: true });
      setupDataChannel(channel);
      peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => socket.emit('webrtc-offer', peerConnection.localDescription))
        .catch(console.error);
    } else {
      peerConnection.ondatachannel = (event) => setupDataChannel(event.channel);
    }

    const handleOffer = async (offer) => {
      if (!pc.current) return;
      try {
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        while (iceCandidateQueue.current.length > 0) {
          await pc.current.addIceCandidate(new RTCIceCandidate(iceCandidateQueue.current.shift()));
        }
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socket.emit('webrtc-answer', pc.current.localDescription);
      } catch (err) {
        console.error('Error handling offer', err);
      }
    };

    const handleAnswer = async (answer) => {
      if (!pc.current) return;
      try {
        await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
        while (iceCandidateQueue.current.length > 0) {
          await pc.current.addIceCandidate(new RTCIceCandidate(iceCandidateQueue.current.shift()));
        }
      } catch (err) {
        console.error('Error handling answer', err);
      }
    };

    const handleIceCandidate = async (candidate) => {
      if (!pc.current) return;
      try {
        if (!pc.current.remoteDescription) {
          iceCandidateQueue.current.push(candidate);
          return;
        }
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding ice candidate', err);
      }
    };

    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleIceCandidate);

    return () => {
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleIceCandidate);
      cleanup();
    };
  }, [status, isInitiator, cleanup, partnerCode, saveToHistory, success, info]);

  const processSendQueue = async () => {
    if (isSending.current || !dc.current || dc.current.readyState !== 'open' || sendQueue.current.length === 0) {
      return;
    }

    isSending.current = true;
    const task = sendQueue.current.shift();
    const { file, id } = task;

    if (cancelledTransfers.current.has(id)) {
      isSending.current = false;
      processSendQueue();
      return;
    }

    try {
      dc.current.send(JSON.stringify({
        type: 'file-start',
        metadata: { id, name: file.name, size: file.size, fileType: file.type }
      }));

      setActiveTransfers(prev => ({ ...prev, [id]: { ...prev[id], status: 'sending' } }));

      let offset = 0;
      let lastUpdateTime = Date.now();
      let lastUpdateSize = 0;

      const readNextChunk = async () => {
        const chunkBlob = file.slice(offset, offset + CHUNK_SIZE);
        return await chunkBlob.arrayBuffer();
      };

      const waitForResume = () => {
        return new Promise(resolve => {
          const check = setInterval(() => {
            if (!pausedTransfers.current.has(id) || cancelledTransfers.current.has(id)) {
              clearInterval(check);
              resolve();
            }
          }, 200);
        });
      };

      while (offset < file.size) {
        if (cancelledTransfers.current.has(id)) {
          dc.current.send(JSON.stringify({ type: 'file-cancel', id }));
          throw new Error('Transfer cancelled');
        }

        if (pausedTransfers.current.has(id)) {
          setActiveTransfers(prev => ({ ...prev, [id]: { ...prev[id], status: 'paused', speed: 0, eta: 0 } }));
          await waitForResume();
          if (cancelledTransfers.current.has(id)) continue;
          setActiveTransfers(prev => ({ ...prev, [id]: { ...prev[id], status: 'sending' } }));
          lastUpdateTime = Date.now();
          lastUpdateSize = offset;
        }

        if (dc.current.bufferedAmount > dc.current.bufferedAmountLowThreshold) {
          await new Promise(resolve => {
            dc.current.onbufferedamountlow = () => {
              dc.current.onbufferedamountlow = null;
              resolve();
            };
          });
        }

        if (dc.current.readyState !== 'open') throw new Error('DataChannel closed');

        const chunk = await readNextChunk();
        dc.current.send(chunk);
        offset += chunk.byteLength;

        const now = Date.now();
        if (now - lastUpdateTime > 500 || offset === file.size) {
          const timeDiff = (now - lastUpdateTime) / 1000;
          const sizeDiff = offset - lastUpdateSize;
          const speed = timeDiff > 0 ? sizeDiff / timeDiff : 0;
          const remainingBytes = file.size - offset;
          const eta = speed > 0 ? remainingBytes / speed : 0;
          
          lastUpdateTime = now;
          lastUpdateSize = offset;

          setActiveTransfers(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              progress: Math.round((offset / file.size) * 100),
              speed,
              eta
            }
          }));
        }
      }

      dc.current.send(JSON.stringify({ type: 'file-done', id }));
      setActiveTransfers(prev => ({
        ...prev,
        [id]: { ...prev[id], progress: 100, status: 'completed', speed: 0, eta: 0 }
      }));
      
      saveToHistory({ name: file.name, size: file.size, partner: partnerCode }, 'sent');
      success(`Sent ${file.name}`);

    } catch (err) {
      if (err.message === 'Transfer cancelled') {
        setActiveTransfers(prev => ({ ...prev, [id]: { ...prev[id], status: 'cancelled' } }));
      } else {
        console.error('File transfer failed', err);
        setActiveTransfers(prev => ({ ...prev, [id]: { ...prev[id], status: 'failed' } }));
        error(`Failed to send ${file.name}`);
      }
    } finally {
      isSending.current = false;
      processSendQueue();
    }
  };

  const sendFiles = (files) => {
    Array.from(files).forEach(file => {
      const id = Math.random().toString(36).substring(2, 9);
      setActiveTransfers(prev => ({
        ...prev,
        [id]: { id, name: file.name, size: file.size, progress: 0, status: 'preparing', speed: 0, eta: 0, file }
      }));
      sendQueue.current.push({ file, id });
    });
    processSendQueue();
  };

  const pauseTransfer = (id) => pausedTransfers.current.add(id);
  const resumeTransfer = (id) => pausedTransfers.current.delete(id);
  const cancelTransfer = (id) => {
    cancelledTransfers.current.add(id);
    pausedTransfers.current.delete(id); // unpause if it was paused to let it cancel
  };
  
  const retryTransfer = (id) => {
    const transfer = activeTransfers[id];
    if (transfer && transfer.file) {
      cancelledTransfers.current.delete(id);
      setActiveTransfers(prev => ({ ...prev, [id]: { ...prev[id], status: 'preparing', progress: 0 } }));
      sendQueue.current.push({ file: transfer.file, id });
      processSendQueue();
    }
  };

  const sendClipboard = (text) => {
    if (dc.current && dc.current.readyState === 'open') {
      dc.current.send(JSON.stringify({ type: 'clipboard', data: text }));
      success('Clipboard sent!');
    } else {
      error('Cannot send clipboard: not connected');
    }
  };

  return (
    <WebRTCContext.Provider value={{
      connectionState,
      activeTransfers,
      receivedFiles,
      sendFiles,
      pauseTransfer,
      resumeTransfer,
      cancelTransfer,
      retryTransfer,
      sendClipboard
    }}>
      {children}
    </WebRTCContext.Provider>
  );
};
