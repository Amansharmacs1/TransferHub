const steps = [
  {
    number: '01',
    title: 'Open TransferHub',
    description: 'Open the app on both the sending and receiving devices.'
  },
  {
    number: '02',
    title: 'Connect Devices',
    description: 'Pair devices instantly using a 6-digit code or QR pairing.'
  },
  {
    number: '03',
    title: 'Share Files',
    description: 'Select files and watch them transfer at lightning speed.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to seamless file sharing.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full glass border border-white/20 flex items-center justify-center mb-6 z-10 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <span className="text-3xl font-bold text-gradient">{step.number}</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
