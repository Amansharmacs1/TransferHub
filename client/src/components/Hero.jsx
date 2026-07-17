import { ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          <span>Introducing Phase 1</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Transfer Files Instantly <br className="hidden md:block" />
          <span className="text-gradient">Between Any Devices</span>
        </h1>
        
        <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto mb-10">
          Fast, secure, browser-based peer-to-peer file sharing powered by WebRTC. No cables, no limits, no hassle.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
          <a href="#features" className="text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium glass hover:bg-white/10 transition-all border border-white/10">
            Learn More
          </a>
        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-secondary-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
