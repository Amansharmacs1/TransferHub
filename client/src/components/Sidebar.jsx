import { Link, useLocation } from 'react-router-dom';
import { Share2, Clipboard, History, Settings, Monitor, Laptop } from 'lucide-react';
import { useSocketContext } from '../contexts/SocketContext';
import { useWebRTCContext } from '../contexts/WebRTCContext';

const Sidebar = () => {
  const location = useLocation();
  const { status, partnerCode, disconnectPairing } = useSocketContext();
  const { connectionState } = useWebRTCContext();

  const navItems = [
    { name: 'Transfers', path: '/', icon: <Share2 className="w-5 h-5" /> },
    { name: 'Clipboard', path: '/clipboard', icon: <Clipboard className="w-5 h-5" /> },
    { name: 'History', path: '/history', icon: <History className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 h-full bg-background border-r border-border flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Share2 className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">TransferHub</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 rounded-xl bg-muted/30 border border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Connection</h3>
        
        {status === 'connected' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Laptop className="w-4 h-4 text-primary" />
                {partnerCode}
              </div>
              <span className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-destructive'}`}></span>
            </div>
            <button 
              onClick={disconnectPairing}
              className="w-full text-xs py-2 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Monitor className="w-4 h-4" />
            Not connected
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
