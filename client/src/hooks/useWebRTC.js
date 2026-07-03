import { useState, useEffect, useRef, useCallback } from 'react';
import { socket } from '../socket';

const CHUNK_SIZE = 16 * 1024; // 16KB (Universally safe size for WebRTC DataChannels)

export const useWebRTC = (isInitiator, status) => {
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected, connecting, connected
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
  }, []);

  useEffect(() => {
    if (status !== 'connected') {
      cleanup();
      return;
    }

    setConnectionState('connecting');

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    pc.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-ice-candidate', event.candidate);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        setConnectionState('connected');
      } else if (
        peerConnection.connectionState === 'disconnected' ||
        peerConnection.connectionState === 'failed' ||
        peerConnection.connectionState === 'closed'
      ) {
        setConnectionState('disconnected');
      }
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

      channel.onclose = () => {
        setConnectionState('disconnected');
      };

      channel.onmessage = (event) => {
        if (typeof event.data === 'string') {
          const message = JSON.parse(event.data);
          if (message.type === 'file-start') {
            incomingMetadata.current = message.metadata;
            receiveBuffer.current = [];
            receivedSize.current = 0;
            
            setActiveTransfers(prev => ({
              ...prev,
              [message.metadata.id]: {
                id: message.metadata.id,
                name: message.metadata.name,
                size: message.metadata.size,
                progress: 0,
                status: 'receiving',
                speed: 0
              }
            }));
            
            // Speed tracking
            incomingMetadata.current.startTime = Date.now();
            incomingMetadata.current.lastUpdateTime = Date.now();
            incomingMetadata.current.lastUpdateSize = 0;
            
          } else if (message.type === 'file-done') {
            const blob = new Blob(receiveBuffer.current, { type: incomingMetadata.current.fileType });
            const url = URL.createObjectURL(blob);
            
            const newFile = {
              id: incomingMetadata.current.id,
              name: incomingMetadata.current.name,
              size: incomingMetadata.current.size,
              type: incomingMetadata.current.fileType,
              blobUrl: url
            };
            
            setReceivedFiles(prev => [...prev, newFile]);
            
            setActiveTransfers(prev => ({
              ...prev,
              [incomingMetadata.current.id]: {
                ...prev[incomingMetadata.current.id],
                progress: 100,
                status: 'completed'
              }
            }));

            receiveBuffer.current = [];
            receivedSize.current = 0;
            incomingMetadata.current = null;
          }
        } else {
          // It's an ArrayBuffer chunk
          if (!incomingMetadata.current) return;

          receiveBuffer.current.push(event.data);
          receivedSize.current += event.data.byteLength;
          
          const now = Date.now();
          const meta = incomingMetadata.current;
          
          // Update UI periodically (e.g., every 500ms) to avoid lag
          if (now - meta.lastUpdateTime > 500 || receivedSize.current === meta.size) {
            const timeDiff = (now - meta.lastUpdateTime) / 1000;
            const sizeDiff = receivedSize.current - meta.lastUpdateSize;
            const speed = timeDiff > 0 ? sizeDiff / timeDiff : 0; // bytes per second
            
            meta.lastUpdateTime = now;
            meta.lastUpdateSize = receivedSize.current;
            
            setActiveTransfers(prev => ({
              ...prev,
              [meta.id]: {
                ...prev[meta.id],
                progress: Math.round((receivedSize.current / meta.size) * 100),
                speed: speed
              }
            }));
          }
        }
      };
      
      dc.current = channel;
    };

    if (isInitiator) {
      const channel = peerConnection.createDataChannel('fileTransfer', {
        ordered: true
      });
      setupDataChannel(channel);

      peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit('webrtc-offer', peerConnection.localDescription);
        })
        .catch(console.error);
    } else {
      peerConnection.ondatachannel = (event) => {
        setupDataChannel(event.channel);
      };
    }

    const handleOffer = async (offer) => {
      if (!pc.current) return;
      try {
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        
        while (iceCandidateQueue.current.length > 0) {
          const candidate = iceCandidateQueue.current.shift();
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
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
          const candidate = iceCandidateQueue.current.shift();
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
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
  }, [status, isInitiator, cleanup]);

  const processSendQueue = async () => {
    if (isSending.current || !dc.current || dc.current.readyState !== 'open' || sendQueue.current.length === 0) {
      return;
    }

    isSending.current = true;
    const task = sendQueue.current.shift();
    const { file, id } = task;

    try {
      dc.current.send(JSON.stringify({
        type: 'file-start',
        metadata: {
          id,
          name: file.name,
          size: file.size,
          fileType: file.type
        }
      }));

      setActiveTransfers(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          status: 'sending'
        }
      }));

      let offset = 0;
      let startTime = Date.now();
      let lastUpdateTime = startTime;
      let lastUpdateSize = 0;

      const readNextChunk = () => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          const slice = file.slice(offset, offset + CHUNK_SIZE);
          reader.readAsArrayBuffer(slice);
        });
      };

      while (offset < file.size) {
        if (dc.current.bufferedAmount > dc.current.bufferedAmountLowThreshold) {
          await new Promise(resolve => {
            const onBufferLow = () => {
              dc.current.removeEventListener('bufferedamountlow', onBufferLow);
              resolve();
            };
            dc.current.addEventListener('bufferedamountlow', onBufferLow);
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
          
          lastUpdateTime = now;
          lastUpdateSize = offset;

          setActiveTransfers(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              progress: Math.round((offset / file.size) * 100),
              speed
            }
          }));
        }
      }

      dc.current.send(JSON.stringify({ type: 'file-done', id }));
      
      setActiveTransfers(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          progress: 100,
          status: 'completed',
          speed: 0
        }
      }));

    } catch (err) {
      console.error('File transfer failed', err);
      setActiveTransfers(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          status: 'failed'
        }
      }));
    } finally {
      isSending.current = false;
      processSendQueue();
    }
  };

  const sendFiles = (files) => {
    Array.from(files).forEach(file => {
      const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      
      setActiveTransfers(prev => ({
        ...prev,
        [id]: {
          id,
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'preparing',
          speed: 0
        }
      }));

      sendQueue.current.push({ file, id });
    });

    processSendQueue();
  };

  return {
    connectionState,
    activeTransfers,
    receivedFiles,
    sendFiles
  };
};
