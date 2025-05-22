import { useEffect } from 'react';

/**
 * AutoRefresh Komponente
 * Lädt die App automatisch neu, wenn sie nach einer bestimmten Inaktivitätszeit wieder geöffnet wird
 * 
 * @param {number} inactivityTimeout - Zeit in Millisekunden, nach der die App neu geladen werden soll (Standard: 2 Minuten)
 */
const AutoRefresh: React.FC<{ inactivityTimeout?: number }> = ({ 
  inactivityTimeout = 120000 // 2 Minuten als Standard
}) => {
  useEffect(() => {
    let lastActivity = Date.now();
    let visibilityChanged = false;
    
    // Funktion, um die letzte Aktivitätszeit zu aktualisieren
    const updateLastActivity = () => {
      lastActivity = Date.now();
    };
    
    // Funktion, die beim Wechsel der Sichtbarkeit ausgeführt wird
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App wurde wieder sichtbar/geöffnet
        console.log('App wurde wieder geöffnet');
        
        // Prüfe, ob die Inaktivitätszeit überschritten wurde
        const timeSinceLastActivity = Date.now() - lastActivity;
        
        if (timeSinceLastActivity > inactivityTimeout && visibilityChanged) {
          console.log(`Inaktivitätszeit von ${inactivityTimeout}ms überschritten, lade neu...`);
          window.location.reload();
        }
        
        // Aktualisiere die letzte Aktivitätszeit
        updateLastActivity();
      } else {
        // App wurde minimiert/geschlossen
        console.log('App wurde minimiert oder geschlossen');
        visibilityChanged = true;
      }
    };
    
    // Event-Listener für Benutzeraktivitäten
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('touchstart', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);
    
    // Event-Listener für Sichtbarkeitsänderungen
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Aufräumen beim Unmount der Komponente
    return () => {
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('touchstart', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [inactivityTimeout]);
  
  // Diese Komponente rendert nichts sichtbares
  return null;
};

export default AutoRefresh; 