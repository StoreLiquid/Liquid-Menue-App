import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="de">
        <Head>
          <meta name="application-name" content="Liquid Menü" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Liquid Menü" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#3a2a5a" />
          <meta name="apple-mobile-web-app-status-bar" content="#3a2a5a" />
          <meta name="background-color" content="#3a2a5a" />
          
          {/* iOS Vollbild-Modus */}
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no" />
          <meta name="apple-touch-fullscreen" content="yes" />
          
          {/* iOS Homescreen Icons - Using PNG for better compatibility */}
          <link rel="apple-touch-icon" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" sizes="192x192" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" sizes="512x512" href="/icons/smartphone-icon-512.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icons/tablet-icon-512.png" />
          <link rel="apple-touch-icon" sizes="1024x1024" href="/icons/tablet-icon-1024.png" />
          
          {/* Device-specific App Icons - Using PNG for better compatibility */}
          <link rel="apple-touch-icon" media="(device-width: 320px) and (device-height: 568px)" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" media="(device-width: 375px) and (device-height: 667px)" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" media="(device-width: 414px) and (device-height: 736px)" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" media="(device-width: 375px) and (device-height: 812px)" href="/icons/smartphone-icon-192.png" />
          <link rel="apple-touch-icon" media="(device-width: 768px) and (device-height: 1024px)" href="/icons/tablet-icon-512.png" />
          <link rel="apple-touch-icon" media="(device-width: 834px) and (device-height: 1112px)" href="/icons/tablet-icon-512.png" />
          <link rel="apple-touch-icon" media="(device-width: 1024px) and (device-height: 1366px)" href="/icons/tablet-icon-1024.png" />
          
          {/* iOS Startup Images */}
          <link rel="apple-touch-startup-image" href="/icons/app-icon-512.png" />

          {/* Grundlegende Styles für alle Browser */}
          <style>{`
            :root {
              --app-bg: #1A1820;
              --pwa-app-bg: #3a2a5a;
            }
            
            html, body, #__next {
              background-color: var(--app-bg) !important;
              margin: 0;
              padding: 0;
              min-height: 100%;
              height: 100%;
              overscroll-behavior: none;
              -webkit-overflow-scrolling: touch;
              overflow-x: hidden;
            }
            
            body {
              display: flex;
              flex-direction: column;
              overflow-y: auto !important;
            }
            
            /* Fester Hintergrund für alle Browser */
            body::before {
              content: "";
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: var(--app-bg);
              z-index: -9999;
            }
            
            /* Fester Hintergrund am unteren Rand */
            body::after {
              content: "";
              position: fixed;
              bottom: -50px;
              left: 0;
              right: 0;
              height: 200px;
              background-color: var(--app-bg);
              z-index: 90;
            }
            
            /* PWA-spezifische Styles */
            @media all and (display-mode: standalone) {
              html, body, #__next {
                background-color: var(--pwa-app-bg) !important;
              }
              
              body::before {
                background-color: var(--pwa-app-bg);
              }
              
              body::after {
                background-color: var(--pwa-app-bg);
              }
            }
          `}</style>

          {/* Manifest und Icons */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/icons/app-icon-192.png" />
        </Head>
        <body>
          {/* Fester Hintergrund für alle Browser */}
          <div id="fixed-bg" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '200vh',
            backgroundColor: '#1A1820',
            zIndex: -9999
          }}></div>
          
          <Main />
          <NextScript />
          
          {/* Add to Home Screen Prompt Script */}
          <script src="/add-to-home.js" defer></script>
          
          {/* Chrome-Fix Script */}
          <script src="/chrome-fix.js"></script>
          
          {/* PWA-Background-Fix Script */}
          <script src="/pwa-background-fix.js"></script>
          
          {/* Sofortiger Fix für alle Browser */}
          <script dangerouslySetInnerHTML={{
            __html: `
              // Sofortiger Fix für alle Browser
              (function() {
                // Prüfen, ob wir im PWA-Modus sind
                const isPwa = window.matchMedia('(display-mode: standalone)').matches || 
                              window.navigator.standalone || 
                              document.referrer.includes('android-app://');
                              
                const bgColor = isPwa ? '#3a2a5a' : '#1A1820';
                
                // Setze Hintergrundfarbe für alle Browser
                document.documentElement.style.backgroundColor = bgColor;
                document.body.style.backgroundColor = bgColor;
                
                // Stelle sicher, dass der feste Hintergrund existiert
                if (!document.getElementById('fixed-bg-js')) {
                  const fixedBg = document.createElement('div');
                  fixedBg.id = 'fixed-bg-js';
                  fixedBg.style.cssText = \`
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100vw;
                    height: 200vh;
                    background-color: \${bgColor};
                    z-index: -9999;
                    pointer-events: none;
                  \`;
                  document.body.insertBefore(fixedBg, document.body.firstChild);
                }
                
                // Aktualisiere den bestehenden festen Hintergrund
                const existingFixedBg = document.getElementById('fixed-bg');
                if (existingFixedBg) {
                  existingFixedBg.style.backgroundColor = bgColor;
                }
              })();
            `
          }} />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 