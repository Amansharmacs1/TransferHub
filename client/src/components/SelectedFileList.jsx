import { File as FileIcon, X } from 'lucide-react';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const SelectedFileList = ({ files, onRemove, onSend }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4 flex items-center justify-between">
        Selected Files ({files.length})
        <button 
          onClick={onSend}
          className="btn-primary px-4 py-1.5 rounded-full text-sm"
        >
          Send All
        </button>
      </h3>
      
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {Array.from(files).map((file, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-sm transition-all hover:bg-muted/30 hover:shadow-md hover:border-primary/20">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 border border-border">
              <FileIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground font-medium">{formatBytes(file.size)}</p>
            </div>
            
            <button 
              onClick={() => onRemove(index)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedFileList;
