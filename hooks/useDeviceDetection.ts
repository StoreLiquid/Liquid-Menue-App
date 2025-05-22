import { useState, useEffect } from 'react';

/**
 * Interface für die Rückgabewerte des Hooks
 */
interface DeviceInfo {
  isPwa: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

/**
 * Custom Hook zur Erkennung verschiedener Gerätetypen und Modi
 * Erkennt PWA-Modus, Mobilgeräte, Tablets und Betriebssysteme
 */
const useDeviceDetection = (): DeviceInfo => {
  const [isPwa, setIsPwa] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  
  useEffect(() => {
    // Prüfen, ob die App im Standalone-Modus (PWA) läuft
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
      
    // Prüfen, ob es ein mobiles Gerät ist
    const detectMobile = () => window.innerWidth <= 767;
    
    // Prüfen, ob es ein Tablet ist
    const detectTablet = () => window.innerWidth > 767 && window.innerWidth <= 1024;
    
    // Prüfen, ob es ein iOS-Gerät ist
    const detectIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Prüfen, ob es ein Android-Gerät ist
    const detectAndroid = () => /Android/.test(navigator.userAgent);
    
    // Setze die States
    setIsPwa(isInStandaloneMode());
    setIsMobile(detectMobile());
    setIsTablet(detectTablet());
    setIsIOS(detectIOS());
    setIsAndroid(detectAndroid());
    
    // Event-Listener für Änderungen im Display-Modus
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsPwa(e.matches);
    
    // Event-Listener für Größenänderungen
    const handleResize = () => {
      setIsMobile(detectMobile());
      setIsTablet(detectTablet());
    };
    
    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleResize);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return { isPwa, isMobile, isTablet, isIOS, isAndroid };
};

export default useDeviceDetection; 