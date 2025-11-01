import { PlatformConfig } from './types';

/**
 * Microsoft Teams platform configuration
 * Note: These selectors are examples and may need adjustment based on Teams' UI
 */
export const teamsConfig: PlatformConfig = {
  detection: {
    urlPattern: /^https?:\/\/teams\.microsoft\.com\//,
    name: 'Microsoft Teams',
  },
  selectors: {
    // Indicators to detect which screen we're on
    screenIndicators: {
      // Preview screen: Look for join button or preview text
      preview: () => {
        // Look for "Join now" button on preview screen
        const joinButton = document.querySelector('button[data-tid="prejoin-join-button"]');
        if (joinButton) return joinButton;
        
        // Look for preview container
        const preview = document.querySelector('[data-tid="prejoin-display-section"]');
        if (preview) return preview;
        
        // Fallback: Look for any "Join" button
        return Array.from(document.querySelectorAll('button'))
          .find(btn => btn.textContent?.includes('Join now')) || null;
      },
      // Joined screen: Look for hang up/leave button
      joined: [
        'button[data-tid="call-hangup"]',
        'button[aria-label*="Hang up"]',
        'button[aria-label*="Leave"]',
      ],
    },
    // Selectors for preview screen
    preview: {
      mic: [
        'button[data-tid="toggle-mute"]',
        'button[aria-label*="Mute"]',
        'button[aria-label*="Unmute"]',
        'button[aria-label*="microphone"]',
      ],
      camera: [
        'button[data-tid="toggle-video"]',
        'button[aria-label*="Turn camera"]',
        'button[aria-label*="camera"]',
      ],
    },
    // Selectors for joined screen
    joined: {
      mic: [
        'button[data-tid="toggle-mute"]',
        'button[aria-label*="Mute"]',
        'button[aria-label*="Unmute"]',
      ],
      camera: [
        'button[data-tid="toggle-video"]',
        'button[aria-label*="Turn camera"]',
        'button[aria-label*="camera"]',
      ],
    },
  },
  state: {
    isMicMuted: (button: Element) => {
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      const ariaPressed = button.getAttribute('aria-pressed');
      // aria-pressed="true" usually means muted
      return ariaPressed === 'true' || ariaLabel.includes('unmute');
    },
    isCameraMuted: (button: Element) => {
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      const ariaPressed = button.getAttribute('aria-pressed');
      return ariaPressed === 'true' || ariaLabel.includes('turn on');
    },
  },
};
