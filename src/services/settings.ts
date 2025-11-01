import { PlatformName } from './platforms/types';

/**
 * User settings for auto-mute functionality
 */
export interface AutoMuteSettings {
  /** Whether auto-mute is enabled globally */
  enabled: boolean;
  /** Whether to mute microphone */
  muteMic: boolean;
  /** Whether to disable camera */
  muteCamera: boolean;
  /** Platform-specific settings */
  platforms: {
    [K in PlatformName]?: {
      enabled: boolean;
    };
  };
}

/**
 * Default settings
 */
const DEFAULT_SETTINGS: AutoMuteSettings = {
  enabled: true,
  muteMic: true,
  muteCamera: true,
  platforms: {
    'google-meet': { enabled: true },
    'zoom': { enabled: true },
    'microsoft-teams': { enabled: true },
    'generic': { enabled: false },
  },
};

const SETTINGS_KEY = 'chuppi_settings';

/**
 * Settings service for managing user preferences
 */
export class SettingsService {
  /**
   * Get current settings
   */
  static async getSettings(): Promise<AutoMuteSettings> {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...settings };
      }
    } catch (error) {
      console.error('[Chuppi] Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  }

  /**
   * Save settings
   */
  static async saveSettings(settings: AutoMuteSettings): Promise<void> {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('[Chuppi] Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Update specific setting
   */
  static async updateSetting<K extends keyof AutoMuteSettings>(
    key: K,
    value: AutoMuteSettings[K]
  ): Promise<void> {
    const settings = await this.getSettings();
    settings[key] = value;
    await this.saveSettings(settings);
  }

  /**
   * Reset to default settings
   */
  static async resetSettings(): Promise<void> {
    await this.saveSettings(DEFAULT_SETTINGS);
  }

  /**
   * Check if auto-mute is enabled for a specific platform
   */
  static async isPlatformEnabled(platform: PlatformName): Promise<boolean> {
    const settings = await this.getSettings();
    if (!settings.enabled) return false;
    
    const platformSetting = settings.platforms[platform];
    return platformSetting?.enabled ?? false;
  }

  /**
   * Check if microphone muting is enabled
   */
  static async isMicMuteEnabled(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.enabled && settings.muteMic;
  }

  /**
   * Check if camera muting is enabled
   */
  static async isCameraMuteEnabled(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.enabled && settings.muteCamera;
  }
}
