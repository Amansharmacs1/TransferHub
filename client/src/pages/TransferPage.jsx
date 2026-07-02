import { useState } from 'react';
import { Share2, Smartphone, Monitor, AlertCircle, Loader2 } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import PairingRequestModal from '../components/PairingRequestModal';

const TransferPage = () => {
  const { 
    isConnected, 
    pairingCode, 
    partnerCode,
    status,
    incomingRequest,
    error,
    requestPairing,
    respondToPairing,
    clearError
  } = useSocket();
  
  const [targetCodeInput, setTargetCodeInput] = useState('');

  const handleConnect = (e) => {
    e.preventDefault();
    if (targetCodeInput.length === 6) {
      requestPairing(targetCodeInput.toUpperCase());
    }
  };

  return (
    <div className="min-h-[calc(100vh-144px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-600/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

      <PairingRequestModal 
        incomingRequest={incomingRequest} 
        onAccept={() => respondToPairing(true)}
        onReject={() => respondToPairing(false)}
      />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        
        {/* Left Column: This Device */}
        <div className="glass rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-50"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform">
            <Monitor className="w-10 h-10 text-white opacity-80" />
          </div>
          
          <h2 className="text-xl font-medium text-gray-300 mb-2">Your Device Code</h2>
          
          <div className="my-6 w-full">
            {pairingCode ? (
              <div className="bg-black/40 border border-white/10 rounded-2xl py-6 px-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                <span className="text-5xl font-mono font-bold tracking-[0.2em] text-gradient">{pairingCode}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[104px]">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            )}
          </div>
          
          <p className="text-gray-400 text-sm">
            {isConnected ? (
              <span className="flex items-center justify-center gap-2 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Connected to server
              </span>
            ) : (
              <span className="text-red-400">Disconnected from server</span>
            )}
          </p>
        </div>

        {/* Right Column: Connect to Partner */}
        <div className="glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden">
          
          {status === 'connected' ? (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <Share2 className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Connected!</h2>
              <p className="text-gray-400 mb-6">You are securely paired with device:</p>
              <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 font-mono text-xl text-white tracking-widest">
                {partnerCode}
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                  <Smartphone className="w-8 h-8 text-white opacity-80" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Pair Device</h2>
                <p className="text-gray-400 mb-8">Enter the 6-character code shown on the other device to establish a secure connection.</p>
                
                <form onSubmit={handleConnect} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      value={targetCodeInput}
                      onChange={(e) => setTargetCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                      placeholder="e.g. A1B2C3" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl font-mono text-white tracking-[0.2em] placeholder:text-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all uppercase"
                      disabled={status === 'requesting'}
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={targetCodeInput.length !== 6 || status === 'requesting'}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium text-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
                  >
                    {status === 'requesting' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : 'Connect'}
                  </button>
                </form>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default TransferPage;
