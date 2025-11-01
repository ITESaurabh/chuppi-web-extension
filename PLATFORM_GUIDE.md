# Adding New Video Platform Support

This guide explains how to add support for new video calling platforms to the Chuppi auto-mute extension.

## Overview

The platform system is designed to be scalable and easy to extend. Each platform configuration defines:
- URL patterns to detect the platform
- CSS selectors for mic and camera buttons
- State checking logic (how to determine if mic/camera is muted)
- Platform-specific initialization if needed

## Step-by-Step Guide

### 1. Create Platform Configuration File

Create a new file in `src/services/platforms/` named after your platform (e.g., `webex.ts`).

```typescript
import { PlatformConfig } from './types';

export const webexConfig: PlatformConfig = {
  detection: {
    // URL pattern to match the platform
    urlPattern: /^https?:\/\/.*\.webex\.com\//,
    name: 'Cisco Webex',
  },
  
  selectors: {
    // CSS selectors for microphone button
    // Can be a string or array of strings (tries each in order)
    mic: [
      'button[aria-label*="Mute"]',
      'button[aria-label*="Unmute"]',
      '.microphone-button',
    ],
    
    // CSS selectors for camera button
    camera: [
      'button[aria-label*="Stop video"]',
      'button[aria-label*="Start video"]',
      '.camera-button',
    ],
  },
  
  state: {
    // Option 1: Use attribute checking
    micMutedAttr: {
      name: 'data-muted',
      value: 'true', // or boolean true
    },
    
    // Option 2: Use custom function
    isMicMuted: (button: Element) => {
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      return ariaLabel.includes('unmute');
    },
    
    isCameraMuted: (button: Element) => {
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      return ariaLabel.includes('start video');
    },
  },
  
  // Optional: Wait time after page load (milliseconds)
  waitTime: 2000,
  
  // Optional: Custom initialization
  onInit: () => {
    console.log('[Chuppi] Webex-specific initialization');
  },
};
```

### 2. Register Platform

Add your platform to `src/services/platforms/index.ts`:

```typescript
import { webexConfig } from './webex';

export const platformConfigs: Record<PlatformName, PlatformConfig | null> = {
  'google-meet': googleMeetConfig,
  'zoom': zoomConfig,
  'microsoft-teams': teamsConfig,
  'webex': webexConfig, // Add here
  'generic': null,
};
```

### 3. Update TypeScript Types

Add your platform name to the type definition in `src/services/platforms/types.ts`:

```typescript
export type PlatformName = 
  | 'google-meet' 
  | 'zoom' 
  | 'microsoft-teams' 
  | 'webex'  // Add here
  | 'generic';
```

### 4. Update Manifest

Add the platform URL to the content script matches in `manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": [
        "https://meet.google.com/*",
        "https://*.zoom.us/*",
        "https://teams.microsoft.com/*",
        "https://*.webex.com/*"
      ],
      ...
    }
  ]
}
```

### 5. Update Options Page (Optional)

Add the platform option in `src/pages/options/Options.tsx`:

```tsx
<div className="setting-item">
  <label>
    <input
      type="checkbox"
      checked={settings.platforms['webex']?.enabled ?? false}
      onChange={() => handlePlatformToggle('webex')}
      disabled={!settings.enabled}
    />
    <span>Cisco Webex</span>
  </label>
</div>
```

### 6. Update Default Settings

Add default setting in `src/services/settings.ts`:

```typescript
const DEFAULT_SETTINGS: AutoMuteSettings = {
  enabled: true,
  muteMic: true,
  muteCamera: true,
  platforms: {
    'google-meet': { enabled: true },
    'zoom': { enabled: true },
    'microsoft-teams': { enabled: true },
    'webex': { enabled: true }, // Add here
    'generic': { enabled: false },
  },
};
```

## Finding Selectors

### Using Browser DevTools

1. **Open the video platform** (e.g., join a test meeting)
2. **Open DevTools** (F12 or Right-click → Inspect)
3. **Use the Element Picker** (Ctrl+Shift+C or click the pointer icon)
4. **Click on the mic/camera button**
5. **Look for unique attributes**:
   - `aria-label`
   - `data-*` attributes
   - CSS classes
   - `id` attributes

### Testing State Detection

Run this in the browser console to test your selectors:

```javascript
// Find button
const micButton = document.querySelector('button[aria-label*="Mute"]');
console.log('Button found:', micButton);

// Check attributes
console.log('Attributes:', {
  ariaLabel: micButton?.getAttribute('aria-label'),
  dataMuted: micButton?.getAttribute('data-muted'),
  ariaPressed: micButton?.getAttribute('aria-pressed'),
  classes: micButton?.className,
});

// Simulate click
micButton?.click();
```

## State Checking Patterns

### Pattern 1: Attribute-based (Simple)

When the button has a clear attribute indicating muted state:

```typescript
state: {
  micMutedAttr: {
    name: 'data-is-muted',
    value: 'true',
  },
}
```

### Pattern 2: Opposite Logic

When you know the unmuted state but not muted:

```typescript
state: {
  micUnmutedAttr: {
    name: 'data-active',
    value: 'true',
  },
  // Absence of this means muted
}
```

### Pattern 3: Custom Function (Complex)

When you need custom logic:

```typescript
state: {
  isMicMuted: (button: Element) => {
    const label = button.getAttribute('aria-label')?.toLowerCase() || '';
    const pressed = button.getAttribute('aria-pressed');
    
    // Check multiple conditions
    if (label.includes('unmute')) return true;
    if (pressed === 'true') return true;
    if (button.classList.contains('muted')) return true;
    
    return false;
  },
}
```

### Pattern 4: Class-based

```typescript
state: {
  isMicMuted: (button: Element) => {
    return button.classList.contains('muted') || 
           button.classList.contains('audio-off');
  },
}
```

## Testing Your Configuration

1. **Build the extension**: `npm run build`
2. **Load in browser**: 
   - Chrome: chrome://extensions → Load unpacked → Select `dist_chrome`
   - Firefox: about:debugging → Load Temporary Add-on
3. **Join a test meeting**
4. **Check console logs**: Look for `[Chuppi]` messages
5. **Verify behavior**: Mic and camera should auto-mute on first join

## Common Issues

### Buttons not found
- Check if selectors are correct
- Try increasing `waitTime`
- Check if buttons load dynamically (use MutationObserver - already handled)

### State detection wrong
- Verify attributes in DevTools
- Add console.log to your state checking function
- Check if attributes change when toggling

### Auto-mute not triggering
- Verify URL pattern matches
- Check if platform is enabled in settings
- Ensure content script is running (`run_at: "document_start"`)

## Example: Google Meet Configuration

Here's the complete Google Meet configuration as a reference:

```typescript
export const googleMeetConfig: PlatformConfig = {
  detection: {
    urlPattern: /^https?:\/\/meet\.google\.com\//,
    name: 'Google Meet',
  },
  selectors: {
    mic: [
      'button[aria-label="Turn off microphone"]',
      'button[aria-label="Turn on microphone"]',
      'button[data-tooltip-id*="microphone"]',
    ],
    camera: [
      'button[aria-label="Turn off camera"]',
      'button[aria-label="Camera problem. Show more info"]',
      'button[aria-label="Turn on camera"]',
      'button[data-tooltip-id*="camera"]',
    ],
  },
  state: {
    micUnmutedAttr: {
      name: 'data-tooltip-enabled',
      value: 'false',
    },
    cameraMutedAttr: {
      name: 'data-is-muted',
      value: 'true',
    },
    cameraUnmutedAttr: {
      name: 'data-is-muted',
      value: 'false',
    },
  },
  waitTime: 2000,
};
```

## Need Help?

- Check existing platform configurations for examples
- Review the `types.ts` file for all available options
- Use browser DevTools to inspect the platform's DOM
- Test incrementally (selectors first, then state detection)
