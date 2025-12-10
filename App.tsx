import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import OutputPanel from './components/OutputPanel';
import HistoryStrip from './components/HistoryStrip';
import { GeneratedImage, ReferenceImage } from './types';
import { generateThumbnail } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with a dummy history item on mount
  useEffect(() => {
    // Only if history is empty
    if (history.length === 0) {
        // Optional: Preload a dummy image or just leave empty
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setCurrentImage(null); // Clear current view to show loader
    setError(null); // Clear previous errors

    try {
      const base64Image = await generateThumbnail(prompt, referenceImages);
      
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: base64Image,
        prompt: prompt,
        timestamp: Date.now()
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 5)); // Keep last 5
    } catch (error: any) {
      console.error(error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistory = (image: GeneratedImage) => {
    setCurrentImage(image);
    setError(null);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 pb-10 flex flex-col gap-8">
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <ControlPanel 
          prompt={prompt}
          setPrompt={setPrompt}
          referenceImages={referenceImages}
          setReferenceImages={setReferenceImages}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
        
        <OutputPanel 
          currentImage={currentImage}
          isGenerating={isGenerating}
          onRegenerate={handleGenerate}
          error={error}
        />
      </div>

      <HistoryStrip 
        history={history}
        onSelect={handleSelectHistory}
      />
    </div>
  );
};

export default App;