import { AutoMuteService } from '../../services/auto-mute';
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
