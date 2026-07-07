import { useState } from 'react';
import { Smartphone, Monitor, AlertCircle, Loader2 } from 'lucide-react';
import { useSocketContext } from '../contexts/SocketContext';
import { useWebRTCContext } from '../contexts/WebRTCContext';
import PairingRequestModal from '../components/PairingRequestModal';
import DragDropZone from '../components/DragDropZone';
import SelectedFileList from '../components/SelectedFileList';
import TransferCard from '../components/TransferCard';
import ReceivedFilesList from '../components/ReceivedFilesList';
import EmptyState from '../components/EmptyState';

const TransferPage = () => {
  const { 
    isConnected, 
    pairingCode, 
    status,
    incomingRequest,
    error,
    requestPairing,
    respondToPairing
  } = useSocketContext();
  
  const [targetCodeInput, setTargetCodeInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const { activeTransfers, receivedFiles, sendFiles } = useWebRTCContext();

  const handleFilesSelected = (files) => {
    setSelectedFiles(prev => [...prev, ...Array.from(files)]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (selectedFiles.length > 0) {
      sendFiles(selectedFiles);
      setSelectedFiles([]);
    }
  };

  const handleConnect = (e) => {
    e.preventDefault();
    if (targetCodeInput.length === 6) {
      requestPairing(targetCodeInput.toUpperCase());
    }
  };

  if (status !== 'connected') {
    return (
      <div className="h-full flex items-center justify-center">
        <PairingRequestModal 
          incomingRequest={incomingRequest} 
          onAccept={() => respondToPairing(true)}
          onReject={() => respondToPairing(false)}
        />
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 opacity-50"></div>
            <div className="w-20 h-20 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Monitor className="w-10 h-10 text-foreground opacity-80" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">Your Device Code</h2>
            <div className="my-6 w-full">
              {pairingCode ? (
                <div className="bg-muted/30 border border-border rounded-2xl py-6 px-2 sm:px-4 shadow-inner">
                  <span className="text-4xl sm:text-5xl font-mono font-bold tracking-widest sm:tracking-[0.2em] text-primary">{pairingCode}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[104px]">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}
            </div>
            <p className="text-sm font-medium">
              {isConnected ? (
                <span className="flex items-center justify-center gap-2 text-green-600 dark:text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Connected to server
                </span>
              ) : (
                <span className="text-destructive flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
                  Disconnected from server
                </span>
              )}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-sm">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">Pair Device</h2>
              <p className="text-muted-foreground mb-8 text-sm">Enter the 6-character code shown on the other device to establish a secure connection.</p>
              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={targetCodeInput}
                    onChange={(e) => setTargetCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                    placeholder="e.g. A1B2C3" 
                    className="input-field h-14 text-center text-xl sm:text-2xl font-mono tracking-widest sm:tracking-[0.2em] uppercase"
                    disabled={status === 'requesting'}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-fade-in">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={targetCodeInput.length !== 6 || status === 'requesting'}
                  className="btn-primary w-full h-14 text-lg mt-2"
                >
                  {status === 'requesting' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Connecting...</>
                  ) : 'Connect'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Send & Receive Files</h1>
        <p className="text-muted-foreground text-sm font-medium">Secure, peer-to-peer file transfer directly between devices.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm">
        <DragDropZone onFilesSelected={handleFilesSelected} />
      </div>

      <SelectedFileList files={selectedFiles} onRemove={removeSelectedFile} onSend={handleSend} />

      {Object.values(activeTransfers).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Active Transfers</h3>
          <div className="space-y-3">
            {Object.values(activeTransfers).map(transfer => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </div>
        </div>
      )}

      {receivedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Received Files</h3>
          <ReceivedFilesList files={receivedFiles} />
        </div>
      )}

      {Object.values(activeTransfers).length === 0 && selectedFiles.length === 0 && receivedFiles.length === 0 && (
        <EmptyState />
      )}
    </div>
  );
};

export default TransferPage;
