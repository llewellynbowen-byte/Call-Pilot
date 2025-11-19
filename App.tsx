import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ProcessingState from './components/ProcessingState';
import TranscriptView from './components/TranscriptView';
import { transcribeAudio } from './services/geminiService';
import { TranscriptionResult, ProcessingState as ProcState } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [processingState, setProcessingState] = useState<ProcState>({ status: 'idle' });
  const [result, setResult] = useState<TranscriptionResult | null>(null);

  const handleFileSelected = async (file: File) => {
    setProcessingState({ status: 'processing' });
    setResult(null);

    try {
      const data = await transcribeAudio(file);
      setResult(data);
      setProcessingState({ status: 'complete' });
    } catch (error: any) {
      setProcessingState({ 
        status: 'error', 
        error: error.message || "An unexpected error occurred." 
      });
    }
  };

  const resetApp = () => {
    setProcessingState({ status: 'idle' });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 flex flex-col">
        {processingState.status === 'error' && (
          <div className="max-w-2xl mx-auto mt-6 w-full px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Transcription Failed</h3>
                <p className="text-sm text-red-700 mt-1">{processingState.error}</p>
                <button 
                  onClick={resetApp}
                  className="text-sm font-medium text-red-800 hover:text-red-900 underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {processingState.status === 'idle' && (
          <UploadSection 
            onFileSelected={handleFileSelected} 
            isProcessing={false} 
          />
        )}

        {processingState.status === 'processing' && (
          <ProcessingState />
        )}

        {processingState.status === 'complete' && result && (
          <TranscriptView result={result} onReset={resetApp} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CallScript AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;