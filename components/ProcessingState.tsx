import React, { useEffect, useState } from 'react';
import { Loader2, Radio } from 'lucide-react';

const LOADING_MESSAGES = [
  "Uploading audio file...",
  "Analyzing audio waveform...",
  "Detecting speakers (Agent vs Customer)...",
  "Extracting names and entities...",
  "Formatting final transcript...",
  "Polishing output..."
];

const ProcessingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center px-4">
      <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-slate-100">
             <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2 animate-fade-in">
          Processing Transcription
        </h3>
        <p className="text-slate-500 min-h-[1.5rem] transition-all duration-500 ease-in-out">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        
        <div className="w-64 h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); width: 60%; }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingState;