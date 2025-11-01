<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1>Chuppi - Auto Mute for Video Calls</h1>
Automatically mute your microphone and disable your camera when joining video meetings. Works on your <b>first join</b> to each meeting, then lets you control your settings freely.
</div>


## ✨ Features

- **🎯 Smart Auto-Mute**: Automatically mutes mic and camera only on first join
- **🌐 Multi-Platform Support**: 
  - ✅ Google Meet
  - 🚧 Zoom (Not Ready)
  - 🚧 Microsoft Teams (Not Ready)
  - 🔧 Easy to add more platforms
- **⚙️ Customizable Settings**:
  - Enable/disable auto-mute globally
  - Choose to mute mic only, camera only, or both
  - Enable/disable per platform
- **🔒 Privacy First**: All settings stored locally
- **🚀 Lightweight**: Minimal performance impact
- **🎨 Clean UI**: Simple and intuitive settings page

## 🚀 Installation
## Extension is still in development so for now its not available on webstores yet.. but will be soon!
### Chrome/Edge
1. Download or clone this repository
2. Run `npm install` and `yarn build:chrome`
3. Open `chrome://extensions/` (or `edge://extensions/`)
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the `dist_chrome` folder

### Firefox
1. Download or clone this repository
2. Run `npm install` and `yarn build:firefox`
3. Open `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select any file in the `dist_firefox` folder

## 📖 How It Works

1. **First Join**: When you join a meeting for the first time, Chuppi automatically mutes your mic and/or camera based on your settings
2. **User Control**: After auto-mute, you can toggle your mic and camera freely
3. **New Meetings**: Each new meeting session will auto-mute again

## ⚙️ Configuration

### Access Settings
Click the extension icon and go to "Options" or right-click → "Options"

### Available Settings

#### General Settings
- **Enable Auto-Mute**: Master switch for the extension
- **Mute Microphone**: Auto-mute microphone on first join
- **Disable Camera**: Auto-disable camera on first join

#### Platform Settings
Enable or disable auto-mute for specific platforms:
- Google Meet
- Zoom
- Microsoft Teams

## 🐛 Troubleshooting

### Auto-mute not working
1. Check browser console for `[Chuppi]` logs
2. Verify platform is enabled in settings
3. Check if selectors are correct (platforms update their UI)
4. Clear localStorage and try again

### Buttons not found
- Platform may have updated their UI
- Check DevTools to find new selectors
- Update platform configuration

### Extension not loading
- Verify all dependencies are installed
- Rebuild the extension
- Check for TypeScript errors

## 🤝 Contributing

Contributions are welcome! Especially:
- New platform configurations
- Bug fixes
- UI improvements
- Documentation

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 🔐 Privacy

- **No data collection**: Nothing is sent to external servers
- **Local storage only**: All settings stored in browser
- **No tracking**: No analytics or telemetry
- **Open source**: Full transparency

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/), [React](https://react.dev/)
- Project bootstrapped on [JohnBra/vite-web-extension](https://github.com/JohnBra/vite-web-extension) (thanks to make my journey easy!)
- Inspired by the need for privacy in video calls

## 📧 Support

- Issues: [GitHub Issues](https://github.com/ITESaurabh/chuppi-web-extension/issues)
- Questions: Create a discussion

---

**Note**: This extension works by simulating button clicks on the video platform's UI. Platform UI changes may require updates to selectors. Contributions to keep selectors up-to-date are appreciated!

# Contributing <a name="contributing"></a>
Feel free to open PRs or raise issues!

# More info for nerds
- [README for Power Users](./README_ADVANCED.md)
- [PLATFORM GUIDE for developers](./PLATFORM_GUIDE.md)
