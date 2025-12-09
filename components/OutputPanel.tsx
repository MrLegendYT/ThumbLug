import React from 'react';
import { GeneratedImage } from '../types';

interface OutputPanelProps {
  currentImage: GeneratedImage | null;
  isGenerating: boolean;
  onRegenerate: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ currentImage, isGenerating, onRegenerate }) => {

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = `thumblug-${currentImage.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
      if (!currentImage) return;
      try {
          // Fetch the blob from data URL
          const res = await fetch(currentImage.url);
          const blob = await res.blob();
          await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
          ]);
          alert('Copied to clipboard!');
      } catch (err) {
          console.error("Failed to copy", err);
          alert('Failed to copy image to clipboard');
      }
  }

  return (
    <div className="w-full lg:w-3/5 flex flex-col gap-6">
      
      <div className="flex justify-between items-end pb-2 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white">Result</h2>
        <div className="text-sm text-slate-400 flex items-center gap-2">
          <i className="fa-solid fa-ruler-combined"></i> 1280 x 720
        </div>
      </div>

      {/* Canvas / Image Area */}
      <div className="w-full aspect-video bg-[#020617] rounded-2xl border border-slate-700/50 relative overflow-hidden flex items-center justify-center shadow-2xl bg-[linear-gradient(45deg,#0f172a_25%,transparent_25%),linear-gradient(-45deg,#0f172a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0f172a_75%),linear-gradient(-45deg,transparent_75%,#0f172a_75%)] bg-[length:20px_20px]">
        
        {isGenerating ? (
          <div className="loader-ring"></div>
        ) : currentImage ? (
          <img 
            src={currentImage.url} 
            alt={currentImage.prompt} 
            className="w-full h-full object-cover animate-fadeIn"
          />
        ) : (
          <div className="text-center text-slate-500 opacity-60">
            <i className="fa-regular fa-image text-5xl mb-4"></i>
            <p className="font-medium">AI Generation will appear here</p>
          </div>
        )}

      </div>

      {/* Action Bar */}
      <div 
        className={`bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center transition-opacity duration-300 ${!currentImage || isGenerating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="flex gap-3">
          <button 
            onClick={onRegenerate}
            className="w-10 h-10 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white flex items-center justify-center transition-colors"
            title="Regenerate"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
          <button 
             onClick={handleCopy}
            className="w-10 h-10 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white flex items-center justify-center transition-colors"
            title="Copy to Clipboard"
          >
            <i className="fa-regular fa-copy"></i>
          </button>
        </div>

        <button 
          onClick={handleDownload}
          className="bg-white text-black hover:bg-slate-200 px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-download"></i> Download HD
        </button>
      </div>

    </div>
  );
};

export default OutputPanel;