import { Download, File as FileIcon } from 'lucide-react';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ReceivedFilesList = ({ files }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-white mb-4">
        Received Files ({files.length})
      </h3>
      
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {files.map((file, index) => (
          <div key={index} className="bg-primary-900/20 border border-primary-500/20 rounded-xl p-3 flex items-center gap-3 transition-colors hover:bg-primary-900/40">
            <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center flex-shrink-0">
              <FileIcon className="w-5 h-5 text-primary-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{file.name}</p>
              <p className="text-xs text-primary-400/80">{formatBytes(file.size)}</p>
            </div>
            
            <a 
              href={file.blobUrl} 
              download={file.name}
              className="p-2 text-primary-400 hover:text-white hover:bg-primary-500 rounded-full transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedFilesList;
