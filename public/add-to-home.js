// Add to Home Screen Prompt script

let deferredPrompt;
const addToHomeBtn = document.createElement('div');
addToHomeBtn.style.display = 'none';
addToHomeBtn.className = 'add-to-home-prompt';

// Prüft, ob das Gerät ein Mobilgerät ist (Smartphone oder Tablet)
function isMobileDevice() {
  // Erkennt Smartphones und Tablets anhand des User-Agents
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;
  return mobileRegex.test(navigator.userAgent);
}

// Get appropriate icon based on device type
function getAppropriateIcon() {
  const isTablet = window.innerWidth >= 768 || /iPad/i.test(navigator.userAgent);
  if (isTablet) {
    return '/icons/tablet-icon-512.png';
  } else {
    return '/icons/smartphone-icon-512.png';
  }
}

// Check if the app is already in standalone mode or installed
function isAppInstalled() {
  console.log("Prüfe App-Installation Status...");
  
  // Check if in standalone mode (PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log("App läuft im Standalone-Modus (PWA)");
    return true;
  }
  
  // Check for iOS standalone mode
  if (navigator.standalone) {
    console.log("App läuft im iOS Standalone-Modus");
    return true;
  }
  
  // Check localStorage for installation flag
  if (localStorage.getItem('appInstalled') === 'true') {
    console.log("App wurde laut localStorage bereits installiert");
    return true;
  }
  
  // Zusätzliche Prüfung für iOS Safari (Homescreen)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS && window.navigator.standalone === true) {
    console.log("App läuft auf iOS vom Homescreen");
    localStorage.setItem('appInstalled', 'true');
    return true;
  }
  
  console.log("App ist nicht installiert");
  return false;
}

// Create prompt UI
function createPromptUI() {
  const promptContainer = document.createElement('div');
  promptContainer.className = 'pwa-prompt';
  promptContainer.innerHTML = `
    <div class="pwa-prompt-container">
      <div class="pwa-prompt-header">
        <img src="${getAppropriateIcon()}" alt="App Icon" class="pwa-prompt-icon">
        <div class="pwa-prompt-title">Liquid Menü</div>
        <button class="pwa-prompt-close-btn">&times;</button>
      </div>
      <div class="pwa-prompt-content">
        Füge die App zu deinem Homescreen hinzu für schnelleren Zugriff und ein besseres Erlebnis!
      </div>
      <div class="pwa-prompt-buttons">
        <button class="pwa-prompt-cancel-btn">Später</button>
        <button class="pwa-prompt-add-btn">Hinzufügen</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(promptContainer);
  
  // Add event listeners
  const closeBtn = promptContainer.querySelector('.pwa-prompt-close-btn');
  const cancelBtn = promptContainer.querySelector('.pwa-prompt-cancel-btn');
  const addBtn = promptContainer.querySelector('.pwa-prompt-add-btn');
  
  function closePrompt() {
    promptContainer.style.display = 'none';
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  }
  
  closeBtn.addEventListener('click', closePrompt);
  cancelBtn.addEventListener('click', closePrompt);
  
  addBtn.addEventListener('click', async () => {
    promptContainer.style.display = 'none';
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const userChoice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      
      if (userChoice.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        localStorage.setItem('appInstalled', 'true');
      } else {
        console.log('User dismissed the install prompt');
      }
    } else {
      // Show instructions for manual installation
      showManualInstructions();
    }
  });
  
  return promptContainer;
}

// Show manual instructions if browser doesn't support automatic prompt
function showManualInstructions() {
  let instructionsText = '';
  const iconPath = getAppropriateIcon();
  
  // iOS Safari
  if (navigator.userAgent.match(/iPhone|iPad|iPod/i) && navigator.userAgent.match(/Safari/i)) {
    instructionsText = `
      <div>
        <p>Um diese App zu installieren:</p>
        <ol>
          <li>Tippe auf <b>Teilen</b> <span style="font-size: 1.5em">⎙</span> unten im Browser</li>
          <li>Scrolle und tippe auf <b>Zum Home-Bildschirm</b></li>
        </ol>
        <p class="icon-preview">Dein Icon wird so aussehen: <img src="${iconPath}" alt="App Icon" class="preview-icon"></p>
      </div>
    `;
  } 
  // Android Chrome
  else if (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Chrome/i)) {
    instructionsText = `
      <div>
        <p>Um diese App zu installieren:</p>
        <ol>
          <li>Tippe auf das Menü ⋮ oben rechts</li>
          <li>Wähle <b>Zum Startbildschirm hinzufügen</b></li>
        </ol>
        <p class="icon-preview">Dein Icon wird so aussehen: <img src="${iconPath}" alt="App Icon" class="preview-icon"></p>
      </div>
    `;
  } 
  // Fallback
  else {
    instructionsText = `
      <div>
        <p>Um diese App zu installieren:</p>
        <ol>
          <li>Öffne das Menü deines Browsers</li>
          <li>Suche nach der Option "Zum Startbildschirm hinzufügen" oder "Installieren"</li>
        </ol>
        <p class="icon-preview">Dein Icon wird so aussehen: <img src="${iconPath}" alt="App Icon" class="preview-icon"></p>
      </div>
    `;
  }
  
  const instructionsContainer = document.createElement('div');
  instructionsContainer.className = 'manual-install-instructions';
  instructionsContainer.innerHTML = `
    <div class="instructions-container">
      <div class="instructions-header">
        <h3>Anleitung zum Hinzufügen</h3>
        <button class="instructions-close-btn">&times;</button>
      </div>
      <div class="instructions-content">
        ${instructionsText}
      </div>
      <div class="instructions-footer">
        <button class="instructions-done-btn">Fertig</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(instructionsContainer);
  
  const closeBtn = instructionsContainer.querySelector('.instructions-close-btn');
  const doneBtn = instructionsContainer.querySelector('.instructions-done-btn');
  
  function closeInstructions() {
    instructionsContainer.style.display = 'none';
    localStorage.setItem('manualInstallShown', 'true');
  }
  
  closeBtn.addEventListener('click', closeInstructions);
  doneBtn.addEventListener('click', () => {
    closeInstructions();
    localStorage.setItem('appInstalled', 'true');
  });
}

// Styles for the prompt
function addPromptStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .pwa-prompt {
      position: fixed;
      bottom: 20px;
      left: 0;
      right: 0;
      margin: 0 auto;
      max-width: 90%;
      width: 400px;
      z-index: 10000;
      animation: slideUp 0.3s ease-out;
    }
    
    .pwa-prompt-container {
      background-color: #1A1820;
      background-image: linear-gradient(to bottom right, #2A2832, #1A1820);
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .pwa-prompt-header {
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .pwa-prompt-icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      border-radius: 6px;
    }
    
    .pwa-prompt-title {
      flex-grow: 1;
      font-weight: bold;
      font-size: 18px;
    }
    
    .pwa-prompt-close-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
    
    .pwa-prompt-content {
      padding: 16px;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .pwa-prompt-buttons {
      display: flex;
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      justify-content: flex-end;
    }
    
    .pwa-prompt-cancel-btn, .pwa-prompt-add-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      border: none;
    }
    
    .pwa-prompt-cancel-btn {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      margin-right: 8px;
      transition: all 0.2s ease;
    }
    
    .pwa-prompt-cancel-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .pwa-prompt-add-btn {
      background-color: white;
      color: #1A1820;
      transition: all 0.2s ease;
    }
    
    .pwa-prompt-add-btn:hover {
      background-color: #f0f0f0;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .manual-install-instructions {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    }
    
    .instructions-container {
      background-color: #1A1820;
      background-image: linear-gradient(to bottom right, #2A2832, #1A1820);
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      overflow: hidden;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .instructions-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .instructions-header h3 {
      margin: 0;
      font-size: 18px;
    }
    
    .instructions-close-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
    
    .instructions-content {
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .instructions-content ol {
      padding-left: 20px;
      margin-bottom: 16px;
    }
    
    .instructions-content li {
      margin-bottom: 8px;
    }
    
    .instructions-footer {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .instructions-done-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      border: none;
      background-color: white;
      color: #1A1820;
      transition: all 0.2s ease;
    }
    
    .instructions-done-btn:hover {
      background-color: #f0f0f0;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .icon-preview {
      display: flex;
      align-items: center;
      margin-top: 16px;
    }
    
    .preview-icon {
      width: 48px;
      height: 48px;
      margin-left: 8px;
      border-radius: 8px;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

// Check if we should show the prompt
function shouldShowPrompt() {
  // Prüfe zuerst, ob es ein Mobilgerät ist - wenn nicht, zeige keinen Prompt
  if (!isMobileDevice()) {
    console.log("Kein Mobilgerät erkannt, Prompt wird nicht angezeigt");
    return false;
  }
  
  // Don't show if app is already installed
  if (isAppInstalled()) {
    console.log("App is already installed, not showing prompt");
    return false;
  }
  
  // Check if user has dismissed the prompt recently (within 3 days)
  const lastDismissed = localStorage.getItem('pwaPromptDismissed');
  if (lastDismissed) {
    const dismissedTime = parseInt(lastDismissed, 10);
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    if (Date.now() - dismissedTime < threeDaysInMs) {
      console.log("Prompt was recently dismissed, not showing again yet");
      return false;
    }
  }
  
  // Check if user has seen manual instructions recently
  const manualInstallShown = localStorage.getItem('manualInstallShown');
  if (manualInstallShown === 'true') {
    console.log("Manual install instructions were shown, not showing prompt");
    return false;
  }
  
  return true;
}

// Main function to handle the PWA prompt
window.addEventListener('load', () => {
  // Add styles first
  addPromptStyles();
  
  // Check if the app is already in standalone mode (PWA)
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    console.log('App is already running in standalone mode');
    localStorage.setItem('appInstalled', 'true');
    return;
  }
  
  // Wenn kein Mobilgerät, dann früh beenden
  if (!isMobileDevice()) {
    console.log('Kein Mobilgerät erkannt, PWA-Prompt wird nicht initialisiert');
    return;
  }
  
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 76+ from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the prompt if conditions are met
    setTimeout(() => {
      if (shouldShowPrompt()) {
        console.log('Showing install prompt');
        const promptUI = createPromptUI();
      }
    }, 2000);
  });
  
  // For browsers that don't support beforeinstallprompt (like iOS Safari)
  if (isMobileDevice() && 
      !window.matchMedia('(display-mode: standalone)').matches && 
      !navigator.standalone && 
      !localStorage.getItem('manualInstallShown') && 
      shouldShowPrompt()) {
    
    // Show manual instructions after a delay
    setTimeout(() => {
      console.log('Showing manual install instructions for iOS/Safari');
      showManualInstructions();
    }, 3000);
  }
}); 