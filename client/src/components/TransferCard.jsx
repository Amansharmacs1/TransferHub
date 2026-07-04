import { File, CheckCircle2, XCircle, Loader2, Pause, Play, X, RotateCcw } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useWebRTCContext } from '../contexts/WebRTCContext';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatTime = (seconds) => {
  if (!seconds || seconds === Infinity || isNaN(seconds)) return '';
  if (seconds < 60) return `${Math.round(seconds)}s left`;
  return `${Math.round(seconds / 60)}m left`;
};

const TransferCard = ({ transfer }) => {
  const { pauseTransfer, resumeTransfer, cancelTransfer, retryTransfer } = useWebRTCContext();
  const { id, name, size, progress, status, speed, eta } = transfer;

  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isCancelled = status === 'cancelled';
  const isPaused = status === 'paused';
  const isSending = status === 'sending';
  const isReceiving = status === 'receiving';
  const isActive = isSending || isReceiving;

  // The sender is the one who can pause/resume/cancel easily since they control the loop.
  // We'll show these controls if it's sending, paused, or failed.
  // Actually, WebRTCContext supports cancel from either side if we implemented it, 
  // but we only implemented it for sender loop. Let's assume sender can control it.
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-white/10 group relative">
      <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center flex-shrink-0">
        <File className="w-6 h-6 text-primary-400" />
      </div>
      
      <div className="flex-1 min-w-0 pr-16">
        <div className="flex justify-between items-center mb-1">
          <p className="text-white font-medium truncate pr-4">{name}</p>
          {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />}
          {isFailed && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
          {isCancelled && <XCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />}
          {(isActive || isPaused) && <span className="text-xs font-mono text-primary-400">{progress}%</span>}
          {status === 'preparing' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
          <span>{formatBytes(size)}</span>
          {isActive && speed > 0 && <span>{formatBytes(speed)}/s • {formatTime(eta)}</span>}
          {isPaused && <span className="text-yellow-500">Paused</span>}
          {(!isActive && !isPaused) && <span className="capitalize">{status}</span>}
        </div>

        {(isActive || isPaused) && <ProgressBar progress={progress} />}
      </div>

      {/* Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-2 rounded-xl backdrop-blur-md">
        {isSending && (
          <button onClick={() => pauseTransfer(id)} className="p-1.5 text-gray-300 hover:text-yellow-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <Pause className="w-4 h-4" />
          </button>
        )}
        {isPaused && (
          <button onClick={() => resumeTransfer(id)} className="p-1.5 text-gray-300 hover:text-green-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <Play className="w-4 h-4" />
          </button>
        )}
        {(isSending || isPaused || status === 'preparing') && (
          <button onClick={() => cancelTransfer(id)} className="p-1.5 text-gray-300 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
        {(isFailed || isCancelled) && transfer.file && (
          <button onClick={() => retryTransfer(id)} className="p-1.5 text-gray-300 hover:text-blue-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransferCard;
