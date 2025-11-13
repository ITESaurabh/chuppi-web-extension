import { useEffect, useState } from "react";
import { SettingsService, AutoMuteSettings } from "../../services/settings";
import LogoSVG from "@assets/img/logo.svg";
import IndFlagSVG from "@assets/svgs/flag-india.svg";
import { LINKS, openInNewTab } from "@src/constants/config";

// Get extension version from manifest
const getExtensionVersion = (): string => {
  if (typeof chrome !== "undefined" && chrome.runtime) {
    return chrome.runtime.getManifest().version;
  }
  return "1.0.0"; // Fallback version
};

export default function Options() {
  const [settings, setSettings] = useState<AutoMuteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await SettingsService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      setMessage("Error loading settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    setMessage("");

    try {
      await SettingsService.saveSettings(settings);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error saving settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof AutoMuteSettings) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handlePlatformToggle = (
    platform: keyof AutoMuteSettings["platforms"]
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      platforms: {
        ...settings.platforms,
        [platform]: {
          enabled: !settings.platforms[platform]?.enabled,
        },
      },
    });
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all settings to default?")) {
      return;
    }

    setSaving(true);
    try {
      await SettingsService.resetSettings();
      await loadSettings();
      setMessage("Settings reset to default");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error resetting settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] dark:bg-[#1C1917] flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-lg">
          Loading settings...
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] dark:bg-[#1C1917] flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 text-lg">
          Failed to load settings
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] dark:bg-[#1C1917] text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-[#292524] shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <img src={LogoSVG} alt="Chuppi Logo" className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Chuppi Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure your auto-mute preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Success/Error Message */}
        {message && (
          <div
            className={`rounded-xl p-4 shadow-sm ${
              message.includes("Error")
                ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Platform Settings */}
        <div className="bg-white dark:bg-[#292524] rounded-2xl shadow-sm p-6 hidden">
          <h2 className="text-xl font-bold mb-2">Platform Settings (coming soon)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enable or disable auto-mute for specific platforms
          </p>

          <div className="space-y-3">
            {/* Google Meet */}
            <div
              className={`flex items-center justify-between p-4 bg-[#FFF9F0] dark:bg-[#44403c] rounded-xl ${
                !settings.enabled ? "opacity-50" : ""
              }`}
            >
              <h3 className="font-semibold">Google Meet</h3>
              <button
                onClick={() => handlePlatformToggle("google-meet")}
                disabled={!settings.enabled}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                  settings.platforms["google-meet"]?.enabled && settings.enabled
                    ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
                    : "bg-gray-300 dark:bg-[#646467]"
                } ${!settings.enabled ? "cursor-not-allowed" : ""}`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                    settings.platforms["google-meet"]?.enabled &&
                    settings.enabled
                      ? "translate-x-[26px]"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Zoom */}
            <div
              className={`flex items-center justify-between p-4 bg-[#FFF9F0] dark:bg-[#44403c] rounded-xl ${
                !settings.enabled ? "opacity-50" : ""
              }`}
            >
              <h3 className="font-semibold">Zoom</h3>
              <button
                onClick={() => handlePlatformToggle("zoom")}
                disabled={!settings.enabled}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                  settings.platforms["zoom"]?.enabled && settings.enabled
                    ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
                    : "bg-gray-300 dark:bg-[#646467]"
                } ${!settings.enabled ? "cursor-not-allowed" : ""}`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                    settings.platforms["zoom"]?.enabled && settings.enabled
                      ? "translate-x-[26px]"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Microsoft Teams */}
            <div
              className={`flex items-center justify-between p-4 bg-[#FFF9F0] dark:bg-[#44403c] rounded-xl ${
                !settings.enabled ? "opacity-50" : ""
              }`}
            >
              <h3 className="font-semibold">Microsoft Teams</h3>
              <button
                onClick={() => handlePlatformToggle("microsoft-teams")}
                disabled={!settings.enabled}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                  settings.platforms["microsoft-teams"]?.enabled &&
                  settings.enabled
                    ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
                    : "bg-gray-300 dark:bg-[#646467]"
                } ${!settings.enabled ? "cursor-not-allowed" : ""}`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                    settings.platforms["microsoft-teams"]?.enabled &&
                    settings.enabled
                      ? "translate-x-[26px]"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-[#FDE047] dark:bg-[#646467] rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-3">How it works</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Auto-mute activates only on your <strong>first join</strong> to
                a meeting
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                After that, you can freely toggle your mic and camera as needed
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Each new meeting session will auto-mute again (if enabled)
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Settings are saved locally and sync across all your meetings
              </span>
            </li>
          </ul>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-[#292524] rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">About Chuppi</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img src={LogoSVG} alt="Chuppi Logo" className="w-12 h-12" />
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">
                  Chuppi - Auto Mute Extension
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Never worry about joining a meeting unmuted again. Chuppi
                  automatically mutes your microphone and camera when you join
                  video meetings, giving you control and privacy.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Version
                  </span>
                  <p className="font-semibold">{getExtensionVersion()}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    License
                  </span>
                  <p className="font-semibold">GPL v3.0</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Developer
                  </span>
                  <p className="font-semibold">ITESaurabh</p>
                </div>
                {/* <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Platforms
                  </span>
                  <p className="font-semibold">Meet, Zoom, Teams</p>
                </div> */}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold mb-2 text-sm">Links</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openInNewTab(LINKS.github)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#44403c] hover:bg-gray-200 dark:hover:bg-[#52504e] rounded-lg text-sm font-medium transition-colors"
                >
                  GitHub Repository
                </button>
                <button
                  onClick={() => openInNewTab(LINKS.support)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#44403c] hover:bg-gray-200 dark:hover:bg-[#52504e] rounded-lg text-sm font-medium transition-colors"
                >
                  Report an Issue
                </button>
                {/* <button
                  onClick={() => openInNewTab(LINKS.chromeWebStore)}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF8C61] to-[#FF6B47] hover:from-[#FF9B75] hover:to-[#FF7A5B] text-white rounded-lg text-sm font-medium transition-all"
                >
                  Rate on Chrome Store
                </button> */}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-base text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-1">
                Made with ❤️ in
                <img
                  src={IndFlagSVG}
                  alt="India"
                  className="ml-1 h-4 rounded"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end hidden">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-6 py-3 bg-gray-200 dark:bg-[#44403c] hover:bg-gray-300 dark:hover:bg-[#52504e] text-gray-900 dark:text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Default
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-[#FF8C61] to-[#FF6B47] hover:from-[#FF9B75] hover:to-[#FF7A5B] text-white rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
