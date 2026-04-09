import React, { useEffect, useState } from 'react';
import { Activity, Radio, Cpu } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Set to 3 seconds for a medium-speed transition
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[100]">
      {/* Subtle Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      
      {/* Ultra-Minimalist Digital T Logo */}
      <div className="relative mb-12 flex flex-col items-center">
        <div className="w-16 h-1 bg-cyan-400 rounded-full mb-1"></div>
        <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
        <div className="absolute -bottom-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
      </div>

      <div className="relative text-center">
        <h1 className="text-4xl font-bold text-white tracking-widest mb-2">
          TWIN<span className="text-cyan-400">CITY</span>
        </h1>
        <div className="flex justify-center flex-col items-center gap-3">
          <div className="h-1 w-16 bg-cyan-500 rounded-full animate-[loading_3s_ease-in-out_infinite]"></div>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase animate-pulse">Initializing City OS</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading {
          0% { width: 0%; opacity: 0; transform: scaleX(0); }
          50% { width: 100%; opacity: 1; transform: scaleX(1); }
          100% { width: 0%; opacity: 0; transform: scaleX(0); }
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
