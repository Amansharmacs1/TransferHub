import { useState } from 'react';
import { Clipboard, Send, AlertCircle } from 'lucide-react';
import { useSocketContext } from '../contexts/SocketContext';
import { useWebRTCContext } from '../contexts/WebRTCContext';

const ClipboardPage = () => {
  const { status } = useSocketContext();
  const { sendClipboard } = useWebRTCContext();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      sendClipboard(text.trim());
      setText('');
    }
  };

  if (status !== 'connected') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-yellow-500 opacity-80" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Not Connected</h2>
        <p className="text-gray-400">You must be paired with another device in the Transfers tab to share clipboard data.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Clipboard Sharing</h1>
        <p className="text-gray-400">Send text or URLs directly to your partner's clipboard.</p>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/10 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Clipboard className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-medium text-white">Send Text</h2>
        </div>

        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none mb-4"
        />

        <div className="flex justify-end">
          <button 
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send to Partner
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClipboardPage;
