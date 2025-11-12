import { AutoMuteService } from '../../services/auto-mute';
import { addMessageListener, MessageType, Message } from '../../services/messaging';
import './style.css';

// Initialize auto-mute service
let autoMuteService: AutoMuteService | null = null;

function initializeAutoMute() {
  try {
    console.log('[Chuppi] Content script loaded');
    autoMuteService = new AutoMuteService();
    autoMuteService.init();
  } catch (e) {
    console.error('[Chuppi] Error initializing auto-mute service:', e);
  }
}

// Listen for messages from popup
addMessageListener((message: Message, sender, sendResponse) => {
  console.log('[Chuppi] Received message:', message);
  
  if (message.type === MessageType.SETTINGS_UPDATED) {
    console.log('[Chuppi] Settings updated, applying changes...');
    if (autoMuteService) {
      // Apply settings after a short delay to ensure localStorage is updated
      setTimeout(() => {
        autoMuteService?.applyCurrentSettings();
      }, 100);
    }
    sendResponse({ success: true });
  }
  
  return true; // Required for async sendResponse
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAutoMute);
} else {
  initializeAutoMute();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (autoMuteService) {
    autoMuteService.destroy();
  }
});
