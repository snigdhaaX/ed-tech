import React from 'react';

export const AnimatedGridBg: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Very subtle ambient light gradients */}
      <div 
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full opacity-40 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 75%)',
        }}
      />
      <div 
        className="absolute top-[60%] -left-[10%] w-[600px] h-[450px] rounded-full opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        }}
      />
      
      {/* Clean micro-dot grid pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.45]" />
      
      {/* Top subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60 pointer-events-none" />
    </div>
  );
};
