import { Check, X } from 'lucide-react';

const PairingRequestModal = ({ incomingRequest, onAccept, onReject }) => {
  if (!incomingRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="glass w-full max-w-md rounded-2xl p-6 border border-white/20 shadow-2xl transform transition-all">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4 border border-primary-500/30">
            <span className="text-2xl font-bold text-gradient">?</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connection Request</h3>
          <p className="text-gray-400">
            Device <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">{incomingRequest.requesterCode}</span> wants to connect with you.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-white font-medium border border-white/10 hover:border-red-500/50 transition-colors"
          >
            <X className="w-5 h-5 text-red-400" />
            Reject
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
          >
            <Check className="w-5 h-5" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default PairingRequestModal;
