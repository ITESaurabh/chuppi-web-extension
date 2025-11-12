/**
 * Message types for communication between popup and content script
 */
export enum MessageType {
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  GET_CURRENT_STATE = 'GET_CURRENT_STATE',
  APPLY_SETTINGS = 'APPLY_SETTINGS',
}

/**
 * Message structure
 */
export interface Message {
  type: MessageType;
  payload?: any;
}

/**
 * Send message to all tabs
 */
export async function sendMessageToAllTabs(message: Message): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, message);
        } catch (error) {
          // Tab might not have content script, ignore
        }
      }
    }
  }
}

/**
 * Send message to active tab
 */
export async function sendMessageToActiveTab(message: Message): Promise<any> {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      try {
        return await chrome.tabs.sendMessage(tab.id, message);
      } catch (error) {
        // Silently ignore errors - tab might not have content script loaded
        // This is expected behavior when popup is opened on non-meeting pages
        return null;
      }
    }
  }
}

/**
 * Listen for messages
 */
export function addMessageListener(
  callback: (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void
): void {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener(callback);
  }
}
