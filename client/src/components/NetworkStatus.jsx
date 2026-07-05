import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-2.5 rounded-full flex items-center gap-2 backdrop-blur-md shadow-lg">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">You are offline. Reconnecting...</span>
      </div>
    </div>
  );
};

export default NetworkStatus;
