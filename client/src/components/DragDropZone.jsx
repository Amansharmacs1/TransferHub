import { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

const DragDropZone = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
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
      className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all ${
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
      
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 shadow-lg">
        <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`} />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop Files Here</h3>
      <p className="text-gray-400 mb-8">Send images, videos, audio, and documents securely.</p>
      
      <button 
        onClick={() => fileInputRef.current.click()}
        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-full font-medium transition-colors"
      >
        Browse Files
      </button>
    </div>
  );
};

export default DragDropZone;
