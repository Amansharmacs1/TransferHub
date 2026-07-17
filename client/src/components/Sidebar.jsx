import { Link, useLocation } from 'react-router-dom';
import { Share2, Clipboard, History, Settings, Monitor, Laptop } from 'lucide-react';
import { useSocketContext } from '../contexts/SocketContext';
import { useWebRTCContext } from '../contexts/WebRTCContext';

const Sidebar = () => {
  const location = useLocation();
  const { status, partnerCode, disconnectPairing } = useSocketContext();
  const { connectionState } = useWebRTCContext();

  const navItems = [
    { name: 'Transfers', path: '/app', icon: <Share2 className="w-6 h-6 md:w-5 md:h-5" /> },
    { name: 'Clipboard', path: '/app/clipboard', icon: <Clipboard className="w-6 h-6 md:w-5 md:h-5" /> },
    { name: 'History', path: '/app/history', icon: <History className="w-6 h-6 md:w-5 md:h-5" /> },
    { name: 'Settings', path: '/app/settings', icon: <Settings className="w-6 h-6 md:w-5 md:h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:relative md:z-0 md:w-64 md:h-full bg-background/90 backdrop-blur-md md:bg-background md:backdrop-blur-none border-t md:border-t-0 md:border-r border-border flex flex-row md:flex-col justify-around md:justify-start pb-[env(safe-area-inset-bottom)] md:pb-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-none">
      <div className="hidden md:flex p-6 items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Share2 className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">TransferHub</h1>
      </div>

      <nav className="flex flex-row md:flex-col w-full md:w-auto md:flex-1 md:px-4 md:space-y-1 md:mt-2 justify-around md:justify-start px-2 py-2 md:py-0">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-3 md:py-2.5 rounded-lg transition-all text-[10px] md:text-sm font-medium flex-1 md:flex-none ${
                isActive 
                  ? 'text-primary md:bg-accent md:text-accent-foreground scale-110 md:scale-100' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <div className={isActive ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] md:drop-shadow-none' : ''}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block p-4 m-4 rounded-xl bg-muted/30 border border-border">
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
