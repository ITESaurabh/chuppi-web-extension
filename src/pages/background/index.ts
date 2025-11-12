console.log('background script loaded');

const SETTINGS_KEY = 'chuppi_settings';

// Update extension icon based on enabled state
async function updateIcon(isEnabled: boolean) {
  const iconPath = isEnabled ? 'icon-32.png' : 'icon-inactive-32.png';
  
  try {
    await chrome.action.setIcon({
      path: {
        32: iconPath
      }
    });
    console.log(`[Chuppi] Icon updated to: ${iconPath}`);
  } catch (error) {
    console.error('[Chuppi] Error updating icon:', error);
  }
}

// Get enabled state from storage
async function getEnabledState(): Promise<boolean> {
  try {
    // Try chrome.storage.sync first
    if (chrome.storage && chrome.storage.sync) {
      const result = await chrome.storage.sync.get(SETTINGS_KEY);
      if (result[SETTINGS_KEY]) {
        return result[SETTINGS_KEY].enabled !== false;
      }
    }
  } catch (error) {
    console.error('[Chuppi] Error reading storage:', error);
  }
  // Default to enabled
  return true;
}

// Listen for storage changes to update icon
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (changes[SETTINGS_KEY]) {
    const newSettings = changes[SETTINGS_KEY].newValue;
    if (newSettings && typeof newSettings.enabled === 'boolean') {
      await updateIcon(newSettings.enabled);
    }
  }
});

// Initialize icon on startup
chrome.runtime.onStartup.addListener(async () => {
  const isEnabled = await getEnabledState();
  await updateIcon(isEnabled);
});

// Initialize icon when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  const isEnabled = await getEnabledState();
  await updateIcon(isEnabled);
});
