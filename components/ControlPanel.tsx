import React, { useRef } from 'react';
import { ReferenceImage } from '../types';
import { SAMPLE_PROMPTS } from '../constants';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (val: string) => void;
  referenceImages: ReferenceImage[];
  setReferenceImages: (imgs: ReferenceImage[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  referenceImages,
  setReferenceImages,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Explicitly type as File[] to avoid 'unknown' type inference issue
      const files: File[] = Array.from(e.target.files);
      const remainingSlots = 3 - referenceImages.length;
      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setReferenceImages(prev => [
              ...prev, 
              {
                id: Math.random().toString(36).substr(2, 9),
                data: ev.target!.result as string,
                file: file
              }
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input so same file can be selected again if cleared
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setReferenceImages(referenceImages.filter(img => img.id !== id));
  };

  const autoFillPrompt = () => {
    const random = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(random);
  };

  return (
    <div className="w-full lg:w-2/5 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 shadow-xl h-fit">
      
      {/* 1. Reference Images */}
      <div>
        <h3 className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Source Material <span className="font-normal opacity-60">(Max 3)</span>
        </h3>
        
        <div 
          className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center transition-all hover:border-purple-500 hover:bg-purple-500/10 cursor-pointer bg-black/20 group"
          onClick={() => referenceImages.length < 3 && fileInputRef.current?.click()}
        >
          <i className="fa-solid fa-images text-3xl text-slate-500 mb-3 transition-colors group-hover:text-purple-500"></i>
          <div className="font-medium text-white">Click or Drag images</div>
          <div className="text-xs text-slate-400 mt-1">Supports PNG, JPG</div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange}
            disabled={referenceImages.length >= 3}
          />
        </div>

        {referenceImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {referenceImages.map((img) => (
              <div key={img.id} className="relative w-[70px] h-[70px] rounded-lg border border-slate-600 group">
                <img src={img.data} alt="ref" className="w-full h-full object-cover rounded-lg" />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Text Prompt */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Prompt</h3>
        <div className="relative">
          <textarea 
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-4 min-h-[140px] text-white text-base leading-relaxed outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            placeholder="Describe your thumbnail... e.g. Shocked gamer face reacting to victory, neon background, bold yellow text 'IMPOSSIBLE'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button 
            onClick={autoFillPrompt}
            className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-2 py-1 rounded transition-colors"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i> Surprise Me
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <button 
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-4 rounded-2xl text-white text-lg font-bold transition-all shadow-lg flex items-center justify-center gap-3 relative overflow-hidden group
          ${isGenerating || !prompt.trim() ? 'bg-slate-700 cursor-not-allowed opacity-70' : 'bg-brand-gradient hover:-translate-y-0.5 hover:shadow-purple-500/30'}
        `}
      >
        {isGenerating ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
          </>
        ) : (
          <>
            <i className="fa-solid fa-bolt"></i> Generate Now
          </>
        )}
        {!isGenerating && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none"></div>}
      </button>

    </div>
  );
};

export default ControlPanel;