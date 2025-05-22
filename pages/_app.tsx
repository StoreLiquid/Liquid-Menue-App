import '../styles/globals.css';
import '../styles/swipe-navigation.css';
import '../styles/ios-fixes.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';

// Einfachere Typdefinition
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  // State für PWA-Erkennung
  const [isPwa, setIsPwa] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isChrome, setIsChrome] = useState<boolean>(false);
  
  // Einfacheres useEffect ohne riskante DOM-Manipulationen
  useEffect(() => {
    // Browser-Erkennung
    const detectIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const detectChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const detectStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone ||
                         document.referrer.includes('android-app://');
    
    setIsIOS(detectIOS);
    setIsChrome(detectChrome);
    setIsPwa(detectStandalone);

    // Stelle sicher, dass Scrollen funktioniert
    if (detectIOS) {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.overscrollBehavior = 'none';
      
      // Stellt sicher, dass der Scrollbereich immer voll verfügbar ist
      document.body.style.position = 'relative';
      document.body.style.overflow = 'auto';
      // TypeScript-freundliche Variante für WebKit-Overflow
      (document.body.style as any)['-webkit-overflow-scrolling'] = 'touch';
      
      // Zusätzlicher Hintergrund für iOS im PWA-Modus
      if (detectStandalone) {
        const iosPwaBg = document.createElement('div');
        iosPwaBg.className = 'ios-pwa-bg';
        document.body.appendChild(iosPwaBg);
        
        // Setze die Hintergrundfarbe für den Status-Bar-Bereich
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#3a2a5a');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#3a2a5a');
      }
    }
    
    // Chrome-spezifische Anpassungen
    if (detectChrome) {
      // Stelle sicher, dass der Hintergrund korrekt angezeigt wird
      document.documentElement.style.backgroundColor = detectStandalone ? '#3a2a5a' : '#1A1820';
      document.body.style.backgroundColor = detectStandalone ? '#3a2a5a' : '#1A1820';
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.minHeight = '100%';
      document.body.style.minHeight = '100%';
      document.body.style.position = 'relative';
      
      // Stelle sicher, dass fixed-positionierte Elemente korrekt angezeigt werden
      const fixedElements = document.querySelectorAll('.fixed, [id^="app-"]');
      fixedElements.forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          el.style.position = 'fixed';
          el.style.pointerEvents = 'none';
          
          // Erhöhe die Opazität im PWA-Modus
          if (detectStandalone && el.id && el.id.startsWith('app-') && el.style.opacity) {
            el.style.opacity = (parseFloat(el.style.opacity) * 1.5).toString();
          }
        }
      });
      
      // Stelle sicher, dass der Container scrollbar ist
      const mainContainer = document.querySelector('main.container');
      if (mainContainer instanceof HTMLElement) {
        mainContainer.style.position = 'relative';
        mainContainer.style.zIndex = '5';
        mainContainer.style.overflowY = 'visible';
      }
      
      // Stelle sicher, dass der Next.js-Container korrekt dargestellt wird
      const nextContainer = document.getElementById('__next');
      if (nextContainer) {
        nextContainer.style.backgroundColor = 'transparent';
        nextContainer.style.minHeight = '100vh';
        nextContainer.style.overflowY = 'visible';
        nextContainer.style.position = 'relative';
      }
    }
    
    // Event-Listener für Änderungen im Display-Modus
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsPwa(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Debug-Ausgabe
    console.log(`Device: ${detectIOS ? 'iOS' : 'Nicht-iOS'}, Chrome: ${detectChrome}, Standalone: ${detectStandalone}`);
    console.log('Scroll-Einstellungen initialisiert');
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content={isPwa ? "#3a2a5a" : "#1A1820"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 