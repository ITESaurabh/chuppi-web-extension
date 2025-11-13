/**
 * Extension configuration and external links
 */

/**
 * Chrome Web Store Extension ID
 * 
 * How to find your extension ID:
 * 1. After publishing to Chrome Web Store, go to the Developer Dashboard
 * 2. Your extension ID will be visible in the extension details
 * 3. Or find it in the URL: chrome://extensions/ (enable Developer mode)
 * 4. The ID is a 32-character string like: "abcdefghijklmnopqrstuvwxyzabcdef"
 * 
 * Once you have it, replace 'YOUR_EXTENSION_ID_HERE' with your actual ID
 */
export const CHROME_EXTENSION_ID = 'YOUR_EXTENSION_ID_HERE';

/**
 * External links for the extension
 */
export const LINKS = {
  // Chrome Web Store review page
  chromeWebStore: `https://chromewebstore.google.com/detail/${CHROME_EXTENSION_ID}`,
  
  // GitHub repository
  github: 'https://github.com/ITESaurabh/chuppi-web-extension',
  
  // Support/Issues page
  support: 'https://github.com/ITESaurabh/chuppi-web-extension/issues',
};

/**
 * Open a URL in a new tab
 */
export function openInNewTab(url: string): void {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}
