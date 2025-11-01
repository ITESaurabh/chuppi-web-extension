import { PlatformConfig, PlatformName } from './types';
import { googleMeetConfig } from './google-meet';
import { zoomConfig } from './zoom';
import { teamsConfig } from './microsoft-teams';

/**
 * Registry of all supported platforms
 */
export const platformConfigs: Record<PlatformName, PlatformConfig | null> = {
  'google-meet': googleMeetConfig,
  'zoom': zoomConfig,
  'microsoft-teams': teamsConfig,
  'generic': null, // Fallback for unsupported platforms
};

/**
 * Detect which platform the current page belongs to
 */
export function detectPlatform(url: string): PlatformName {
  for (const [name, config] of Object.entries(platformConfigs)) {
    if (config && config.detection.urlPattern.test(url)) {
      return name as PlatformName;
    }
  }
  return 'generic';
}

/**
 * Get platform configuration for the current page
 */
export function getPlatformConfig(url?: string): PlatformConfig | null {
  const currentUrl = url || window.location.href;
  const platformName = detectPlatform(currentUrl);
  return platformConfigs[platformName];
}

export * from './types';
export { googleMeetConfig } from './google-meet';
export { zoomConfig } from './zoom';
export { teamsConfig } from './microsoft-teams';
