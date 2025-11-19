import React from 'react';
import { TranscriptionResult, SpeakerType } from '../types';
import { User, Headphones, Clock, Copy, Check, PlusCircle } from 'lucide-react';
import Button from './Button';

interface TranscriptViewProps {
  result: TranscriptionResult;
  onReset: () => void;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ result, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const header = [
      `Agent Name: ${result.agentName}`,
      `Customer Name: ${result.customerName}`,
      `Call Duration: ${result.totalDuration}`,
      '',
      'Transcript:'
    ].join('\n');

    const body = result.segments
      .map(s => `[${s.timestamp}] ${s.speakerName}: ${s.text}`)
      .join('\n');

    const fullText = `${header}\n${body}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4 pb-20">
      {/* Meta Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Call Analysis</h2>
            <div className="flex items-center text-slate-500 text-sm gap-2">
              <Clock className="w-4 h-4" />
              <span>Duration: {result.totalDuration}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCopy} className="text-xs h-9">
              {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
            <Button variant="primary" onClick={onReset} className="text-xs h-9">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              New Transcription
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Agent Identified</p>
              <p className="text-lg font-bold text-slate-900">{result.agentName}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-slate-200 rounded-full text-slate-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Customer Identified</p>
              <p className="text-lg font-bold text-slate-900">{result.customerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Feed */}
      <div className="space-y-6">
        {result.segments.map((segment, idx) => {
          const isAgent = segment.speakerType === SpeakerType.AGENT;
          
          return (
            <div key={idx} className={`flex gap-4 ${isAgent ? '' : 'flex-row-reverse'}`}>
               {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 shadow-sm
                ${isAgent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {isAgent ? <Headphones className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col max-w-[80%] ${isAgent ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{segment.speakerName}</span>
                  <span className="text-xs font-mono text-slate-400">{segment.timestamp}</span>
                </div>
                <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm border
                  ${isAgent 
                    ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none' 
                    : 'bg-blue-50 border-blue-100 text-slate-800 rounded-tr-none'}`}
                >
                  {segment.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptView;