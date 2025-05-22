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
          <meta name="theme-color" content="#1A1820" />
          <meta name="apple-mobile-web-app-status-bar" content="#1A1820" />
          
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

          {/* PWA Splash Screen Background Color */}
          <style>{`
            :root {
              --app-background: #1A1820;
            }
            
            html {
              background-color: var(--app-background);
              height: 100%;
              overscroll-behavior: none;
            }
            
            body {
              background-color: var(--app-background);
              margin: 0;
              padding: 0;
              min-height: 100%;
              overscroll-behavior: none;
              display: flex;
              flex-direction: column;
            }
            
            /* Chrome-spezifische Anpassungen */
            @media screen and (-webkit-min-device-pixel-ratio:0) and (min-resolution:.001dpcm) {
              body, html, #__next {
                background-color: var(--app-background) !important;
              }
              
              .fixed {
                position: fixed !important;
                z-index: -1 !important;
              }
            }
            
            /* Verbesserte iOS Pull-to-Refresh-Steuerung für Hintergrundfarbe */
            @supports (-webkit-overflow-scrolling: touch) {
              body::before {
                content: "";
                position: fixed;
                top: -150vh;
                height: 150vh;
                left: 0;
                right: 0;
                background-color: var(--app-background);
                z-index: -10;
              }
              
              #__next {
                min-height: 100vh;
                width: 100%;
              }
            }
          `}</style>

          {/* Manifest und Icons */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/icons/app-icon-192.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          
          {/* Add to Home Screen Prompt Script */}
          <script src="/add-to-home.js" defer></script>
          
          {/* Chrome-Detektor für spezifische Fixes */}
          <script src="/chrome-detector.js"></script>
          
          {/* Chrome-Hintergrund-Fix */}
          <script src="/chrome-background.js"></script>
          
          {/* Direkter Chrome-Fix */}
          <script src="/chrome-fix.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument; 