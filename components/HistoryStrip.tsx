import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryStripProps {
  history: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const HistoryStrip: React.FC<HistoryStripProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-slate-400 flex items-center gap-2">
        <i className="fa-solid fa-clock-rotate-left"></i> Session History
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative bg-slate-800 border border-slate-700 rounded-xl overflow-hidden aspect-video cursor-pointer transition-all hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg"
          >
            <img 
              src={item.url} 
              alt={item.prompt} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
              <div className="w-8 h-8 bg-white text-black rounded-md flex items-center justify-center">
                <i className="fa-solid fa-eye text-xs"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryStrip;