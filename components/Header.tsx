import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center py-4">
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => window.location.reload()}
      >
        <div className="flex items-center justify-center w-[42px] h-[42px] bg-brand-gradient rounded-xl text-white text-lg shadow-glow -rotate-6 transition-transform group-hover:rotate-0">
          <i className="fa-solid fa-layer-group"></i>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
          ThumbLug
        </span>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-medium">
        <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
        Free & Unlimited
      </div>
    </header>
  );
};

export default Header;