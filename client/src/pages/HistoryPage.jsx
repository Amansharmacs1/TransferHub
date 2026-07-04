import { useState, useEffect } from 'react';
import { History, Trash2, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { success } = useToast();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('transferhub_history') || '[]');
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('transferhub_history');
    setHistory([]);
    success('History cleared successfully');
  };

  const filteredHistory = history.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transfer History</h1>
          <p className="text-gray-400">View a record of files you've sent and received.</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      <div className="glass rounded-3xl border border-white/10 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-black/20">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by file name..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="text-sm text-gray-400">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p>No transfer history found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.direction === 'received' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {item.direction === 'received' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-400">{formatBytes(item.size)} • Partner: {item.partner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
