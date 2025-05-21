import '../styles/globals.css';
import '../styles/swipe-navigation.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

// Einfachere Typdefinition
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  // Einfacheres useEffect ohne riskante DOM-Manipulationen
  useEffect(() => {
    // Browser-Erkennung
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone;

    // Stelle sicher, dass Scrollen funktioniert
    if (isIOS) {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.overscrollBehavior = 'none';
      
      // Stellt sicher, dass der Scrollbereich immer voll verfügbar ist
      document.body.style.position = 'relative';
      document.body.style.overflow = 'auto';
      // TypeScript-freundliche Variante für WebKit-Overflow
      (document.body.style as any)['-webkit-overflow-scrolling'] = 'touch';
    }
    
    // Chrome-spezifische Anpassungen
    if (isChrome) {
      // Stelle sicher, dass der Hintergrund korrekt angezeigt wird
      document.documentElement.style.backgroundColor = '#1A1820';
      document.body.style.backgroundColor = '#1A1820';
      
      // Stelle sicher, dass fixed-positionierte Elemente korrekt angezeigt werden
      const fixedElements = document.querySelectorAll('.fixed');
      fixedElements.forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          el.style.position = 'fixed';
          el.style.zIndex = '-1';
        }
      });
    }
    
    // Debug-Ausgabe
    console.log(`Device: ${isIOS ? 'iOS' : 'Nicht-iOS'}, Chrome: ${isChrome}, Standalone: ${isStandalone}`);
    console.log('Scroll-Einstellungen initialisiert');
  }, []);

  return (
    <>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#1A1820" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 