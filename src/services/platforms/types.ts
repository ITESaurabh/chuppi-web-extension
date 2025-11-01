/**
 * Platform configuration types for auto-mute functionality
 */

/**
 * Screen state types for video platforms
 */
export type ScreenState = 'preview' | 'joined' | 'unknown';

/**
 * Selector can be a CSS selector string, array of selectors, or a custom function
 */
export type Selector = string | string[] | (() => Element | null);

/**
 * Screen indicators to detect current screen state
 * Can use CSS selectors or custom functions for complex detection
 */
export interface ScreenIndicators {
  /** Selector or function to detect preview/ready-to-join screen */
  preview?: Selector;
  /** Selector or function to detect joined/in-meeting screen */
  joined?: Selector;
}

/**
 * Selectors for controls on different screen states
 */
export interface ScreenSelectors {
  /** Selectors or function for microphone button */
  mic: Selector;
  /** Selectors or function for camera button */
  camera: Selector;
}

export interface PlatformSelector {
  /** Indicators to determine screen state */
  screenIndicators: ScreenIndicators;
  /** Selectors for preview screen controls */
  preview?: ScreenSelectors;
  /** Selectors for joined screen controls */
  joined?: ScreenSelectors;
  /** Common selectors that work on all screens */
  common?: ScreenSelectors;
}

export interface PlatformState {
  /** Attribute to check if mic is muted */
  micMutedAttr?: {
    name: string;
    value: string | boolean;
  };
  /** Attribute to check if mic is unmuted */
  micUnmutedAttr?: {
    name: string;
    value: string | boolean;
  };
  /** Attribute to check if camera is disabled */
  cameraMutedAttr?: {
    name: string;
    value: string | boolean;
  };
  /** Attribute to check if camera is enabled */
  cameraUnmutedAttr?: {
    name: string;
    value: string | boolean;
  };
  /** Custom function to check if mic is muted */
  isMicMuted?: (button: Element) => boolean;
  /** Custom function to check if camera is muted */
  isCameraMuted?: (button: Element) => boolean;
}

export interface PlatformDetection {
  /** URL pattern to match the platform */
  urlPattern: RegExp;
  /** Platform name for logging */
  name: string;
}

export interface PlatformConfig {
  detection: PlatformDetection;
  selectors: PlatformSelector;
  state: PlatformState;
  /** Optional: Additional wait time after page load (ms) */
  waitTime?: number;
  /** Optional: Custom initialization logic */
  onInit?: () => void;
  /**
   * Optional helper to determine whether the current URL (or provided url)
   * contains a valid meeting identifier for this platform.
   */
  hasMeetingId?: (url?: string) => boolean;
}

export type PlatformName = 'google-meet' | 'zoom' | 'microsoft-teams' | 'generic';
