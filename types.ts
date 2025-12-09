export interface ReferenceImage {
  id: string;
  data: string; // Base64 string including mime type header
  file: File;
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 or Blob URL
  prompt: string;
  timestamp: number;
}
