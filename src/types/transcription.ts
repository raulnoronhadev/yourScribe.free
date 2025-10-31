export interface Segment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

export interface TranscriptionPart {
  part: number;
  text: string;
  segments: Segment[];
}

export interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  parts?: TranscriptionPart[];
  total_parts?: number;
  segments?: Segment[];
  language?: string;
  file_type?: string;
  error?: string;
}

export interface UploadOptions {
  file: File;
  language?: string;
  onProgress?: (percent: number) => void;
}