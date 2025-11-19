import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, X } from 'lucide-react';
import Button from './Button';

interface UploadSectionProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelected, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid audio file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleProcess = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Turn Conversations into Clarity
        </h2>
        <p className="text-lg text-slate-600">
          Upload your call recording. We'll detect speakers, identify names, and transcribe perfectly.
        </p>
      </div>

      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-slate-400'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Click or drag audio file here
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              MP3, WAV, AAC, or M4A (Max 20MB)
            </p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="audio/*" 
              className="hidden" 
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              Select Audio File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
             <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
              <FileAudio className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1 max-w-md truncate px-4">
              {selectedFile.name}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <div className="flex gap-3">
              <Button onClick={clearFile} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleProcess} isLoading={isProcessing}>
                Start Transcription
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;