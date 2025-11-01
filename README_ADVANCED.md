
## 📝 Technical Details

### Auto-Mute Logic
1. Content script loads on supported platforms
2. Checks if platform is enabled in settings
3. Checks if this is first join (via localStorage)
4. Waits for buttons to load (with retry logic)
5. Checks current state of mic/camera
6. Clicks buttons only if not already muted
7. Marks session as "auto-muted"

### State Detection
Two methods:
1. **Attribute-based**: Check specific attributes (e.g., `data-is-muted="true"`)
2. **Function-based**: Custom logic to determine state

## 🔧 Development

### Prerequisites
- Node.js 18+
- yarn or npm

### Setup
```bash
# Install dependencies
yarn install

# Development mode (Chrome)
yarn dev

# Development mode (Firefox)
yarn dev:firefox

# Build for production
yarn build:chrome
yarn build:firefox
```

### Project Structure
```
src/
├── pages/
│   ├── content/          # Content script (injected into pages)
│   ├── options/          # Options page UI
│   ├── popup/            # Extension popup
│   └── background/       # Background script
├── services/
│   ├── platforms/        # Platform configurations
│   │   ├── types.ts      # TypeScript types
│   │   ├── google-meet.ts
│   │   ├── zoom.ts
│   │   ├── microsoft-teams.ts
│   │   └── index.ts      # Platform registry
│   ├── auto-mute.ts      # Core auto-mute logic
│   └── settings.ts       # Settings management
└── assets/               # Images, styles, etc.
```

## 🔌 Adding New Platforms

Want to add support for another video platform? See [PLATFORM_GUIDE.md](./PLATFORM_GUIDE.md) for detailed instructions.

Quick overview:
1. Create platform config file in `src/services/platforms/`
2. Define URL pattern, selectors, and state checking
3. Register in `src/services/platforms/index.ts`
4. Update manifest.json matches
5. Test and iterate

Example:
```typescript
export const myPlatformConfig: PlatformConfig = {
  detection: {
    urlPattern: /^https?:\/\/example\.com\//,
    name: 'My Platform',
  },
  selectors: {
    mic: 'button[aria-label="Mute"]',
    camera: 'button[aria-label="Stop Video"]',
  },
  state: {
    isMicMuted: (button) => button.getAttribute('aria-pressed') === 'true',
    isCameraMuted: (button) => button.getAttribute('aria-pressed') === 'true',
  },
};
```