import React, { useState, useEffect } from 'react';

interface HomeScreenPromptProps {
  isIOS: boolean;
  isPwa: boolean;
}

const HomeScreenPrompt: React.FC<HomeScreenPromptProps> = ({ isIOS, isPwa }) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Zeige die Aufforderung nur auf iOS-Geräten und nicht, wenn bereits als PWA
    // Prüfe auch, ob der Nutzer die Aufforderung bereits geschlossen hat
    const hasBeenDismissed = localStorage.getItem('homeScreenPromptDismissed') === 'true';
    
    if (isIOS && !isPwa && !hasBeenDismissed) {
      // Verzögere die Anzeige um 2 Sekunden, damit der Nutzer erst die App sehen kann
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isIOS, isPwa]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('homeScreenPromptDismissed', 'true');
  };

  // Wenn nicht angezeigt werden soll, null zurückgeben
  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-md border-t border-white/20 shadow-lg">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-white mb-2">Zum Homescreen hinzufügen</h3>
        <p className="text-sm text-gray-300 text-center mb-4">
          Füge diese App zu deinem Homescreen hinzu für ein besseres Erlebnis:
        </p>
        
        <div className="flex items-center mb-3 text-sm text-gray-300">
          <span className="mr-2">1.</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span>Tippe auf <b>Teilen</b></span>
        </div>
        
        <div className="flex items-center text-sm text-gray-300">
          <span className="mr-2">2.</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Wähle <b>Zum Home-Bildschirm</b></span>
        </div>
        
        <div className="mt-4 flex justify-center gap-3 w-full">
          <button 
            onClick={handleDismiss} 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            Später
          </button>
          <button 
            onClick={handleDismiss} 
            className="px-4 py-2 bg-white text-black rounded-lg font-medium transition-all"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreenPrompt; 