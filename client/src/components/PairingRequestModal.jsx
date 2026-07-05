import { Check, X } from 'lucide-react';

const PairingRequestModal = ({ incomingRequest, onAccept, onReject }) => {
  if (!incomingRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl p-6 border border-border shadow-2xl transform transition-all animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <span className="text-2xl font-bold text-primary">?</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Connection Request</h3>
          <p className="text-muted-foreground text-sm font-medium">
            Device <span className="font-mono text-foreground bg-muted px-2 py-1 rounded">{incomingRequest.requesterCode}</span> wants to connect with you.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onReject}
            className="flex-1 btn-secondary h-12 text-base font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-5 h-5" />
            Reject
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 btn-primary h-12 text-base font-semibold shadow-md"
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
