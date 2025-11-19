export enum SpeakerType {
  AGENT = 'Agent',
  CUSTOMER = 'Customer',
  UNKNOWN = 'Unknown'
}

export interface TranscriptSegment {
  timestamp: string;
  speakerName: string;
  speakerType: SpeakerType;
  text: string;
}

export interface TranscriptionResult {
  agentName: string;
  customerName: string;
  totalDuration: string;
  segments: TranscriptSegment[];
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
  error?: string;
}
