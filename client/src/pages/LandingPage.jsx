import { useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import { useSocket } from '../hooks/useSocket';

const LandingPage = () => {
  const { isConnected, socketId } = useSocket();

  useEffect(() => {
    // This effect runs strictly to trigger the useSocket hook and show logging
    // Real implementation goes here for socket listeners later
  }, [isConnected, socketId]);

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
    </>
  );
};

export default LandingPage;
