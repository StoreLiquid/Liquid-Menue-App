// Add to Home Screen Prompt script

let deferredPrompt;
const addToHomeBtn = document.createElement('div');
addToHomeBtn.style.display = 'none';
addToHomeBtn.className = 'add-to-home-prompt';

// Get appropriate icon based on device type
function getAppropriateIcon() {
  const isTablet = window.innerWidth >= 768 || /iPad/i.test(navigator.userAgent);
  if (isTablet) {
    return '/icons/tablet-icon-512.png';
  } else {
    return '/icons/smartphone-icon-512.png';
  }
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
    </div>
  `;
  
  document.body.appendChild(instructionsContainer);
  
  const closeBtn = instructionsContainer.querySelector('.instructions-close-btn');
  closeBtn.addEventListener('click', () => {
    instructionsContainer.style.display = 'none';
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
      background-color: #2A2832;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
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
    }
    
    .pwa-prompt-add-btn {
      background-color: white;
      color: #2A2832;
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
      background-color: #2A2832;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
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
      line-height: 1.5;
    }
    
    .instructions-content ol {
      padding-left: 24px;
    }
    
    .instructions-content li {
      margin-bottom: 12px;
    }

    .icon-preview {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .preview-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
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

// Check if prompt should be shown
function shouldShowPrompt() {
  // Check if the app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }
  
  // Check if the prompt was recently dismissed
  const lastDismissed = localStorage.getItem('pwaPromptDismissed');
  if (lastDismissed) {
    const dismissedTime = parseInt(lastDismissed, 10);
    const now = Date.now();
    const daysSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Don't show again for 7 days after dismissal
    if (daysSinceDismissed < 7) {
      return false;
    }
  }
  
  return true;
}

// Main initialization
window.addEventListener('load', () => {
  addPromptStyles();
  
  // On mobile devices only
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) {
    return;
  }
  
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome from showing the default prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show the prompt after a delay to allow the page to load
    if (shouldShowPrompt()) {
      setTimeout(() => {
        const promptUI = createPromptUI();
        promptUI.style.display = 'block';
      }, 2000);
    }
  });
  
  // For iOS Safari, which doesn't support beforeinstallprompt
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent) && !window.navigator.standalone) {
    // Check if we should show the prompt
    if (shouldShowPrompt()) {
      // Show the prompt after a delay
      setTimeout(() => {
        const promptUI = createPromptUI();
        promptUI.style.display = 'block';
      }, 2000);
    }
  }
}); 