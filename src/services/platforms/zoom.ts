import { PlatformConfig } from './types';

/**
 * Zoom platform configuration
 * Note: These selectors are examples and may need adjustment based on Zoom's UI
 */
export const zoomConfig: PlatformConfig = {
  detection: {
    urlPattern: /^https?:\/\/.*\.zoom\.us\//,
    name: 'Zoom',
  },
  selectors: {
    // Indicators to detect which screen we're on
    screenIndicators: {
      // Preview screen: Look for join button or preview text
      preview: () => {
        // Look for "Join" or "Join Audio" button on preview screen
        const joinButton = document.querySelector('button[aria-label*="Join"]');
        if (joinButton) return joinButton;
        
        // Look for preview container
        const preview = document.querySelector('[class*="preview"]');
        return preview;
      },
      // Joined screen: Look for leave/end button
      joined: [
        'button[aria-label*="Leave"]',
        'button[aria-label*="End"]',
        '.footer-button__leave-btn',
      ],
    },
    // Selectors for preview screen
    preview: {
      mic: [
        'button[aria-label*="Mute"]',
        'button[aria-label*="Unmute"]',
        'button[aria-label*="microphone"]',
      ],
      camera: [
        'button[aria-label*="Stop Video"]',
        'button[aria-label*="Start Video"]',
        'button[aria-label*="camera"]',
      ],
    },
    // Selectors for joined screen
    joined: {
      mic: [
        'button[aria-label*="Mute"]',
        'button[aria-label*="Unmute"]',
        '.audio-button',
      ],
      camera: [
        'button[aria-label*="Stop Video"]',
        'button[aria-label*="Start Video"]',
        '.video-button',
      ],
    },
  },
  state: {
    // Custom functions for Zoom as it may use different state management
    isMicMuted: (button: Element) => {
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      return ariaLabel.includes('unmute') || button.classList.contains('muted');
    },
    isCameraMuted: (button: Element) => {
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      return ariaLabel.includes('start video') || button.classList.contains('video-off');
    },
  },
};
