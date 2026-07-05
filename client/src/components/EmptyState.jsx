import { FolderOpen } from 'lucide-react';

const EmptyState = ({ message = "No files yet" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed border-border rounded-2xl mt-8 bg-card shadow-sm">
      <FolderOpen className="w-12 h-12 mb-3 opacity-20" />
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
