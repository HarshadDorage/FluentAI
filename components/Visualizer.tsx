import React from 'react';

const Visualizer: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return <div className="h-8 flex items-center justify-center text-gray-400 text-sm">Tap mic to speak</div>;

  return (
    <div className="flex items-center justify-center h-8 space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 bg-primary rounded-full animate-sound"
          style={{
            animation: `sound 0.8s -0.${i * 2}s linear infinite alternate`,
            height: '40%'
          }}
        ></div>
      ))}
      <span className="ml-2 text-sm text-primary font-medium">Listening...</span>
      <style>{`
        @keyframes sound {
          0% { height: 20%; opacity: 0.5; }
          100% { height: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Visualizer;