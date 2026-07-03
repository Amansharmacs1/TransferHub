import { FolderOpen } from 'lucide-react';

const EmptyState = ({ message = "No files yet" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl mt-8">
      <FolderOpen className="w-12 h-12 mb-3 opacity-20" />
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
