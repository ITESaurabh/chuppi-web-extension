import { PlatformConfig, ScreenState, Selector } from './platforms/types';
import { getPlatformConfig, detectPlatform } from './platforms';
import { SettingsService } from './settings';

/**
 * Auto-mute service for video calling platforms
 */
export class AutoMuteService {
  private config: PlatformConfig | null;
  private observer: MutationObserver | null = null;
  private retryCount = 0;
  private maxRetries = 60; // Increased to 60 attempts (1 minute total)
  private maxObserverTime = 90000; // Stop observer after 90 seconds as absolute safety limit
  private observerTimeout: NodeJS.Timeout | null = null;
  private currentScreenState: ScreenState = 'unknown';
  private isProcessing = false; // Prevent concurrent execution
  private hasCompleted = false; // Track if auto-mute completed successfully

  constructor() {
    this.config = getPlatformConfig();
  }

  /**
   * Find element using CSS selectors or custom function
   */
  private findElement(selector: Selector): Element | null {
    // If it's a function, call it
    if (typeof selector === 'function') {
      console.log('[Chuppi] Calling custom selector function...');
      try {
        const result = selector();
        console.log('[Chuppi] Custom function result:', result);
        return result;
      } catch (error) {
        console.error('[Chuppi] Error in custom selector function:', error);
        return null;
      }
    }

    // If it's a string or array of strings, use querySelector
    const selectorArray = Array.isArray(selector) ? selector : [selector];
    
    for (const sel of selectorArray) {
      try {
        const element = document.querySelector(sel);
        if (element) {
          console.log(`[Chuppi] Found element with selector: ${sel}`);
          return element;
        }
      } catch (error) {
        console.error(`[Chuppi] Invalid selector: ${sel}`, error);
      }
    }
    
    return null;
  }

  /**
   * Detect current screen state based on indicators
   */
  private detectScreenState(): ScreenState {
    if (!this.config?.selectors.screenIndicators) {
      console.log('[Chuppi] No screen indicators configured');
      return 'unknown';
    }

    const { screenIndicators } = this.config.selectors;

    // Check for preview screen first
    if (screenIndicators.preview) {
      console.log('[Chuppi] Checking for preview screen...');
      const previewElement = this.findElement(screenIndicators.preview);
      if (previewElement) {
        console.log('[Chuppi] ✅ Preview screen element found:', previewElement);
        return 'preview';
      } else {
        console.log('[Chuppi] ❌ Preview screen element NOT found');
      }
    }

    // Check for joined screen
    if (screenIndicators.joined) {
      console.log('[Chuppi] Checking for joined screen...');
      const joinedElement = this.findElement(screenIndicators.joined);
      if (joinedElement) {
        console.log('[Chuppi] ✅ Joined screen element found:', joinedElement);
        return 'joined';
      } else {
        console.log('[Chuppi] ❌ Joined screen element NOT found');
      }
    }

    return 'unknown';
  }

  /**
   * Get selectors for current screen state
   */
  private getSelectorsForCurrentState(): { mic: Selector, camera: Selector } | null {
    if (!this.config) return null;

    const { selectors } = this.config;
    
    // If we have common selectors that work everywhere, use them
    if (selectors.common) {
      return selectors.common;
    }

    // Otherwise, use state-specific selectors
    switch (this.currentScreenState) {
      case 'preview':
        return selectors.preview || null;
      case 'joined':
        return selectors.joined || null;
      default:
        return null;
    }
  }

  /**
   * Check if microphone is currently muted
   */
  private isMicMuted(button: Element): boolean {
    if (!this.config?.state) return false;

    const { state } = this.config;

    // Use custom function if available
    if (state.isMicMuted) {
      return state.isMicMuted(button);
    }

    // Check using attributes
    if (state.micMutedAttr) {
      const attrValue = button.getAttribute(state.micMutedAttr.name);
      return attrValue === String(state.micMutedAttr.value);
    }

    // Check for unmuted state (opposite)
    if (state.micUnmutedAttr) {
      const attrValue = button.getAttribute(state.micUnmutedAttr.name);
      return attrValue !== String(state.micUnmutedAttr.value);
    }

    return false;
  }

  /**
   * Check if camera is currently muted
   */
  private isCameraMuted(button: Element): boolean {
    if (!this.config?.state) return false;

    const { state } = this.config;

    // Use custom function if available
    if (state.isCameraMuted) {
      return state.isCameraMuted(button);
    }

    // Check using attributes
    if (state.cameraMutedAttr) {
      const attrValue = button.getAttribute(state.cameraMutedAttr.name);
      return attrValue === String(state.cameraMutedAttr.value);
    }

    // Check for unmuted state (opposite)
    if (state.cameraUnmutedAttr) {
      const attrValue = button.getAttribute(state.cameraUnmutedAttr.name);
      return attrValue !== String(state.cameraUnmutedAttr.value);
    }

    return false;
  }

  /**
   * Mute microphone if not already muted
   */
  private async muteMicrophone(): Promise<boolean> {
    // Check if mic muting is enabled in settings
    const micMuteEnabled = await SettingsService.isMicMuteEnabled();
    if (!micMuteEnabled) {
      console.log('[Chuppi] Microphone muting disabled in settings');
      return true; // Return true to not block camera muting
    }

    const stateSelectors = this.getSelectorsForCurrentState();
    if (!stateSelectors) {
      console.log('[Chuppi] No selectors available for current state');
      return false;
    }

    const micButton = this.findElement(stateSelectors.mic);
    
    if (!micButton) {
      console.log('[Chuppi] Microphone button not found yet...');
      return false;
    }

    // Debug: Log button attributes
    console.log('[Chuppi] Mic button element:', micButton);
    console.log('[Chuppi] Mic button aria-label:', micButton.getAttribute('aria-label'));
    console.log('[Chuppi] Mic button data-is-muted:', micButton.getAttribute('data-is-muted'));

    const isMuted = this.isMicMuted(micButton);
    console.log('[Chuppi] Is mic currently muted?', isMuted);
    
    if (!isMuted) {
      console.log('[Chuppi] Clicking microphone button to mute...');
      
      // Small delay to ensure button is interactive
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try clicking with native mouse event for better compatibility
      (micButton as HTMLElement).click();
      
      // Also try dispatching a click event
      micButton.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      
      // Wait longer for state update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the click worked
      const isNowMuted = this.isMicMuted(micButton);
      console.log('[Chuppi] After click, is mic muted?', isNowMuted);
      return true;
    } else {
      console.log('[Chuppi] Microphone already muted');
      return true;
    }
  }

  /**
   * Disable camera if not already disabled
   */
  private async disableCamera(): Promise<boolean> {
    // Check if camera muting is enabled in settings
    const cameraMuteEnabled = await SettingsService.isCameraMuteEnabled();
    if (!cameraMuteEnabled) {
      console.log('[Chuppi] Camera muting disabled in settings');
      return true; // Return true to not block mic muting
    }

    const stateSelectors = this.getSelectorsForCurrentState();
    if (!stateSelectors) {
      console.log('[Chuppi] No selectors available for current state');
      return false;
    }

    const cameraButton = this.findElement(stateSelectors.camera);
    
    if (!cameraButton) {
      console.log('[Chuppi] Camera button not found yet...');
      return false;
    }

    // Debug: Log button attributes
    console.log('[Chuppi] Camera button element:', cameraButton);
    console.log('[Chuppi] Camera button aria-label:', cameraButton.getAttribute('aria-label'));
    console.log('[Chuppi] Camera button data-is-muted:', cameraButton.getAttribute('data-is-muted'));

    const isMuted = this.isCameraMuted(cameraButton);
    console.log('[Chuppi] Is camera currently muted?', isMuted);
    
    if (!isMuted) {
      console.log('[Chuppi] Clicking camera button to disable...');
      
      // Small delay to ensure button is interactive
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try clicking with native mouse event for better compatibility
      (cameraButton as HTMLElement).click();
      
      // Also try dispatching a click event
      cameraButton.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      
      // Wait longer for state update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the click worked
      const isNowMuted = this.isCameraMuted(cameraButton);
      console.log('[Chuppi] After click, is camera muted?', isNowMuted);
      return true;
    } else {
      console.log('[Chuppi] Camera already disabled');
      return true;
    }
  }

  /**
   * Check if we're ready to auto-mute (either on preview or joined screen)
   */
  private isReadyToAutoMute(): boolean {
    const screenState = this.detectScreenState();
    
    console.log(`[Chuppi] Current screen state: ${screenState}`);
    
    if (screenState === 'preview') {
      console.log('[Chuppi] Preview screen detected - ready to auto-mute');
      this.currentScreenState = 'preview';
      return true;
    }
    
    if (screenState === 'joined') {
      console.log('[Chuppi] Joined screen detected - ready to auto-mute');
      this.currentScreenState = 'joined';
      return true;
    }
    
    // Unknown state - not ready yet
    this.currentScreenState = 'unknown';
    return false;
  }

  /**
   * Attempt to auto-mute with retry logic
   */
  private async attemptAutoMute(): Promise<void> {
    // Prevent concurrent execution
    if (this.isProcessing || this.hasCompleted) {
      return;
    }

    this.isProcessing = true;

    try {
      if (!this.config) {
        console.log('[Chuppi] Platform not supported');
        return;
      }

      // Step 1: Detect screen state
      if (!this.isReadyToAutoMute()) {
        // Don't log on every DOM change - too spammy
        if (this.retryCount % 10 === 0) {
          console.log('[Chuppi] Waiting for preview or joined screen...');
        }
        return; // Observer will call us again on next DOM change
      }

      // Step 2: Attempt to mute based on current screen state
      const micMuted = await this.muteMicrophone();
      const cameraMuted = await this.disableCamera();

      if (micMuted && cameraMuted) {
        console.log(`[Chuppi] ✅ Auto-mute completed successfully on ${this.currentScreenState} screen!`);
        this.hasCompleted = true;
        this.stopObserver();
      } else if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        // Only log every 5th retry to reduce noise
        if (this.retryCount % 5 === 0) {
          console.log(`[Chuppi] Retrying auto-mute on ${this.currentScreenState} screen (${this.retryCount}/${this.maxRetries})...`);
        }
        // Don't schedule setTimeout - let observer handle retries
      } else {
        console.log('[Chuppi] ⚠️ Max retries reached, stopping auto-mute attempts');
        this.stopObserver();
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Start observing DOM for button availability
   */
  private startObserver(): void {
    this.observer = new MutationObserver(() => {
      // Immediately check on every DOM change (no debouncing for privacy)
      this.attemptAutoMute();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Set a hard timeout to stop observer after max time
    this.observerTimeout = setTimeout(() => {
      console.log('[Chuppi] Max observer time reached, stopping...');
      this.stopObserver();
    }, this.maxObserverTime);
  }

  /**
   * Stop observing DOM
   */
  private stopObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.observerTimeout) {
      clearTimeout(this.observerTimeout);
      this.observerTimeout = null;
    }
  }

  /**
   * Initialize auto-mute service
   */
  public async init(): Promise<void> {
    if (!this.config) {
      console.log('[Chuppi] Platform not supported, skipping auto-mute');
      return;
    }

    console.log(`[Chuppi] Initializing for ${this.config.detection.name}`);

    // If platform provides a meeting id checker, skip auto-mute when no meeting id is present
    if (this.config.hasMeetingId && !this.config.hasMeetingId(window.location.href)) {
      console.log('[Chuppi] No meeting id detected in URL, skipping auto-mute');
      return;
    }

    console.log('[Chuppi] Starting auto-mute on page load');

    // Run custom init if available
    if (this.config.onInit) {
      this.config.onInit();
    }

    // Start observer immediately - no initial delay for privacy
    // The observer will detect screen state and auto-mute when ready
    this.attemptAutoMute();
    this.startObserver();
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.stopObserver();
  }
}
