const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden relative border border-border">
      <div 
        className="bg-primary h-full rounded-full transition-all duration-300 relative overflow-hidden" 
        style={{ width: `${progress}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
