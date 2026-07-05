import { useState, useRef, useCallback } from 'react';
import { UploadCloud, FolderUp, FileUp } from 'lucide-react';

const DragDropZone = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

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
        onFilesSelected(Array.from(e.dataTransfer.files));
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
      const selectedFilesArray = Array.from(e.target.files);
      onFilesSelected(selectedFilesArray);
      e.target.value = ''; // reset input
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02] shadow-md' 
          : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50 hover:shadow-lg'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm transition-all duration-300 ${isDragging ? 'bg-primary/20 scale-110' : 'bg-background border border-border'}`}>
        <UploadCloud className={`w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      
      <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">Drag & Drop Files or Folders</h3>
      <p className="text-muted-foreground mb-8 max-w-sm font-medium text-sm">Send images, videos, documents, or entire folders securely.</p>
      
      <div className="flex gap-4">
        <label className="btn-secondary px-6 py-3 relative cursor-pointer overflow-hidden">
          <FileUp className="w-4 h-4" />
          Select Files
          <input 
            type="file" 
            multiple 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
        </label>
        
        <label className="btn-secondary px-6 py-3 relative cursor-pointer overflow-hidden">
          <FolderUp className="w-4 h-4" />
          Select Folder
          <input 
            type="file" 
            webkitdirectory="true"
            directory="true"
            multiple 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default DragDropZone;
