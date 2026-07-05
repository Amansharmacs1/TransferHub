import { useState } from 'react';
import { Clipboard, Send, AlertCircle } from 'lucide-react';
import { useSocketContext } from '../contexts/SocketContext';
import { useWebRTCContext } from '../contexts/WebRTCContext';

const ClipboardPage = () => {
  const { status } = useSocketContext();
  const { sendClipboard, receivedClipboards } = useWebRTCContext();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      sendClipboard(text.trim());
      setText('');
    }
  };

  if (status !== 'connected') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 shadow-sm">
          <AlertCircle className="w-8 h-8 text-yellow-500 opacity-80" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Not Connected</h2>
        <p className="text-muted-foreground font-medium text-sm">You must be paired with another device in the Transfers tab to share clipboard data.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Clipboard Sharing</h1>
        <p className="text-muted-foreground text-sm font-medium">Send text or URLs directly to your partner's clipboard.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 flex-1 flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Clipboard className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Send Text</h2>
        </div>

        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          className="input-field w-full h-32 resize-none mb-4 font-mono shadow-inner hover:shadow-sm"
        />

        <div className="flex justify-end mb-8">
          <button 
            onClick={handleSend}
            disabled={!text.trim()}
            className="btn-primary px-6 py-3"
          >
            <Send className="w-4 h-4" />
            Send to Partner
          </button>
        </div>

        {receivedClipboards.length > 0 && (
          <>
            <div className="w-full h-px bg-border my-2"></div>
            <div className="mt-6 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">Received Text</h3>
              <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1 max-h-[300px]">
                {receivedClipboards.map((item) => (
                  <div key={item.id} className="bg-muted/30 border border-border rounded-xl p-4 group transition-all hover:shadow-md hover:border-primary/20">
                    <p className="text-foreground whitespace-pre-wrap break-words text-sm mb-3 font-mono bg-background p-3 rounded-lg border border-border shadow-inner group-hover:border-primary/20 transition-colors">{item.text}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-medium">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.text).then(() => {
                            const btn = document.getElementById(`copy-btn-${item.id}`);
                            if(btn) {
                              const orig = btn.innerText;
                              btn.innerText = 'Copied!';
                              setTimeout(() => btn.innerText = orig, 2000);
                            }
                          });
                        }}
                        id={`copy-btn-${item.id}`}
                        className="btn-secondary px-3 py-1.5 text-xs font-medium"
                      >
                        <Clipboard className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClipboardPage;
