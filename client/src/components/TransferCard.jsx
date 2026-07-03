import { File, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const TransferCard = ({ transfer }) => {
  const { name, size, progress, status, speed } = transfer;

  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isActive = status === 'sending' || status === 'receiving';

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-white/10">
      <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center flex-shrink-0">
        <File className="w-6 h-6 text-primary-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <p className="text-white font-medium truncate pr-4">{name}</p>
          {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />}
          {isFailed && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
          {isActive && <span className="text-xs font-mono text-primary-400">{progress}%</span>}
          {status === 'preparing' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
          <span>{formatBytes(size)}</span>
          {isActive && speed > 0 && <span>{formatBytes(speed)}/s</span>}
          {!isActive && <span className="capitalize">{status}</span>}
        </div>

        {isActive && <ProgressBar progress={progress} />}
      </div>
    </div>
  );
};

export default TransferCard;
