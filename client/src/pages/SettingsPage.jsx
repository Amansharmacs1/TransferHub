import { useState, useEffect } from 'react';
import { Settings, User, Monitor, Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  
  const [deviceName, setDeviceName] = useState('My Device');
  const [systemInfo, setSystemInfo] = useState({ os: 'Unknown', browser: 'Unknown' });

  useEffect(() => {
    const savedName = localStorage.getItem('transferhub_device_name');
    if (savedName) setDeviceName(savedName);

    // Basic User Agent Parsing
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    if (ua.indexOf('Win') !== -1) os = 'Windows';
    if (ua.indexOf('Mac') !== -1) os = 'MacOS';
    if (ua.indexOf('Linux') !== -1) os = 'Linux';
    if (ua.indexOf('Android') !== -1) os = 'Android';
    if (ua.indexOf('like Mac') !== -1) os = 'iOS';

    let browser = 'Unknown Browser';
    if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
    if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
    if (ua.indexOf('Edge') !== -1) browser = 'Edge';

    setSystemInfo({ os, browser });
  }, []);

  const handleSaveName = () => {
    localStorage.setItem('transferhub_device_name', deviceName);
    success('Device name saved successfully!');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your device identity and application preferences.</p>
      </div>

      <div className="glass rounded-3xl p-8 border border-white/10 max-w-2xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-400" />
          Device Identity
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Device Name</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Enter a name for this device"
              />
              <button 
                onClick={handleSaveName}
                className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">This name will be visible to devices you connect with in future updates.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Operating System</span>
              <div className="flex items-center gap-2 text-white font-medium">
                <Laptop className="w-4 h-4 text-gray-400" />
                {systemInfo.os}
              </div>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Browser</span>
              <div className="flex items-center gap-2 text-white font-medium">
                <Monitor className="w-4 h-4 text-gray-400" />
                {systemInfo.browser}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 my-8"></div>

        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-secondary-400" />
          Appearance
        </h2>

        <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-xl p-4">
          <div>
            <h3 className="text-white font-medium">Theme Preference</h3>
            <p className="text-sm text-gray-400">Toggle between light and dark mode</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
