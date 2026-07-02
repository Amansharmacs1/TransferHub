import { Zap, Shield, QrCode, MonitorSmartphone } from 'lucide-react';

const featuresData = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: 'Lightning Fast',
    description: 'Peer-to-peer connection ensures maximum transfer speeds by skipping the middleman server.'
  },
  {
    icon: <Shield className="w-6 h-6 text-green-400" />,
    title: 'Secure',
    description: 'Your files are transferred directly between devices using secure WebRTC encryption.'
  },
  {
    icon: <QrCode className="w-6 h-6 text-blue-400" />,
    title: 'QR Pairing (Coming Soon)',
    description: 'Quickly connect devices by scanning a QR code with your mobile device.'
  },
  {
    icon: <MonitorSmartphone className="w-6 h-6 text-purple-400" />,
    title: 'Cross Platform',
    description: 'Works seamlessly across Windows, macOS, Linux, Android, and iOS browsers.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why use TransferHub?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to share files securely and blazingly fast without leaving your browser.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)] border border-white/5 hover:border-white/20 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
