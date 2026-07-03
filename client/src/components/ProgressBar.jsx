const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-black/40 rounded-full h-3 border border-white/10 overflow-hidden relative">
      <div 
        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-300 relative overflow-hidden" 
        style={{ width: `${progress}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
