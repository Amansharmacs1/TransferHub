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
    <div className="h-full flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm font-medium">Manage your device identity and application preferences.</p>
      </div>

      <div className="bg-card rounded-3xl p-8 border border-border max-w-2xl shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Device Identity
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Device Name</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="input-field flex-1 text-base"
                placeholder="Enter a name for this device"
              />
              <button 
                onClick={handleSaveName}
                className="btn-primary px-6"
              >
                Save
              </button>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-2">This name will be visible to devices you connect with in future updates.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col shadow-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Operating System</span>
              <div className="flex items-center gap-2 text-foreground font-medium text-sm mt-1">
                <Laptop className="w-4 h-4 text-muted-foreground" />
                {systemInfo.os}
              </div>
            </div>
            <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col shadow-sm">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Browser</span>
              <div className="flex items-center gap-2 text-foreground font-medium text-sm mt-1">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                {systemInfo.browser}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border my-8"></div>

        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Appearance
        </h2>

        <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4 shadow-sm">
          <div>
            <h3 className="text-foreground font-medium">Theme Preference</h3>
            <p className="text-sm font-medium text-muted-foreground mt-0.5">Toggle between light and dark mode</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center transition-colors hover:bg-muted/50 shadow-sm"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
