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
    <div className="h-full flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Transfer History</h1>
          <p className="text-muted-foreground text-sm font-medium">View a record of files you've sent and received.</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl transition-colors border border-destructive/20 font-medium text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      <div className="bg-card rounded-3xl border border-border flex-1 flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/30">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by file name..."
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm shadow-inner"
            />
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-sm">No transfer history found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((item, index) => (
                <div key={index} className="bg-muted/30 border border-border rounded-xl p-4 flex items-center justify-between transition-all hover:bg-muted/50 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      item.direction === 'received' ? 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {item.direction === 'received' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium text-sm">{item.name}</h4>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">{formatBytes(item.size)} • Partner: {item.partner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mt-0.5">
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
