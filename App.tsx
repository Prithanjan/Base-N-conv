
import React from 'react';
import BaseConverter from './components/BaseConverter';
import AnimatedBackground from './components/AnimatedBackground';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <AnimatedBackground />
      <BaseConverter />
    </div>
  );
};

export default App;
