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
    <div className="w-64 h-full glass border-r border-white/10 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <Share2 className="w-6 h-6 text-primary-500" />
        </div>
        <h1 className="text-xl font-bold text-gradient">TransferHub</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary-500/10 text-primary-400 font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 rounded-xl bg-black/20 border border-white/5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Connection</h3>
        
        {status === 'connected' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Laptop className="w-4 h-4 text-green-400" />
                {partnerCode}
              </div>
              <span className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : connectionState === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`}></span>
            </div>
            <button 
              onClick={disconnectPairing}
              className="w-full text-xs py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Monitor className="w-4 h-4" />
            Not connected
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
