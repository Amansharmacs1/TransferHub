import { useState, useRef, useCallback } from 'react';
import { UploadCloud, FolderUp, FileUp } from 'lucide-react';

const DragDropZone = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const traverseFileTree = async (item, path = '') => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file) => {
          // You could attach the relative path here if needed: file.filepath = path + file.name;
          resolve([file]);
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries) => {
          let files = [];
          for (let i = 0; i < entries.length; i++) {
            const result = await traverseFileTree(entries[i], path + item.name + '/');
            files = files.concat(result);
          }
          resolve(files);
        });
      }
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!e.dataTransfer.items) {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files);
      }
      return;
    }

    let allFiles = [];
    const items = e.dataTransfer.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        const files = await traverseFileTree(item);
        allFiles = allFiles.concat(files);
      }
    }
    
    if (allFiles.length > 0) {
      onFilesSelected(allFiles);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = null; // reset input
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
        isDragging 
          ? 'border-primary-500 bg-primary-500/10 scale-[1.02]' 
          : 'border-white/20 bg-white/5 hover:border-primary-500/50 hover:bg-white/10'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      <input 
        type="file" 
        webkitdirectory="true"
        directory="true"
        multiple 
        className="hidden" 
        ref={folderInputRef} 
        onChange={handleFileChange}
      />
      
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl transition-all duration-300 ${isDragging ? 'bg-primary-500/20 scale-110' : 'bg-black/20'}`}>
        <UploadCloud className={`w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`} />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop Files or Folders</h3>
      <p className="text-gray-400 mb-8 max-w-sm">Send images, videos, documents, or entire folders securely.</p>
      
      <div className="flex gap-4">
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <FileUp className="w-4 h-4" />
          Select Files
        </button>
        <button 
          onClick={() => folderInputRef.current.click()}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <FolderUp className="w-4 h-4" />
          Select Folder
        </button>
      </div>
    </div>
  );
};

export default DragDropZone;
