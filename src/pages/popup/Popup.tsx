import React, { useState, useEffect } from "react";
import LogoSVG from "@assets/img/logo.svg";
import LogoInactiveSVG from "@assets/img/logo-inactive.svg";
import GetSupportDarkSVG from "@assets/svgs/get-support-dark.svg";
import GetSupportLightSVG from "@assets/svgs/get-support-light.svg";
import GithubLogoLighSVG from "@assets/svgs/github-light.svg";
import GithubLogoDarkSVG from "@assets/svgs/github-dark.svg";
import SettingsDarkSVG from "@assets/svgs/settings-dark.svg";
import SettingsLightSVG from "@assets/svgs/settings-light.svg";
import MicDarkSVG from "@assets/svgs/mic-dark.svg";
import MicLightSVG from "@assets/svgs/mic-light.svg";
import CameraDarkSVG from "@assets/svgs/camera-dark.svg";
import CameraLightSVG from "@assets/svgs/camera-light.svg";
import SmileDarkSVG from "@assets/svgs/smile-dark.svg";
import SmileLightSVG from "@assets/svgs/smile-light.svg";
import { SettingsService } from "@src/services/settings";
import { sendMessageToActiveTab, MessageType } from "@src/services/messaging";
import { LINKS, openInNewTab } from "@src/constants/config";

export default function Popup() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [muteMicrophone, setMuteMicrophone] = useState(true);
  const [muteCamera, setMuteCamera] = useState(true);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await SettingsService.getSettings();
      setIsEnabled(settings.enabled);
      setMuteMicrophone(settings.muteMic);
      setMuteCamera(settings.muteCamera);
    };
    loadSettings();
  }, []);

  // Get current tab domain
  useEffect(() => {
    const getCurrentTab = async () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab.url) {
            const url = new URL(tab.url);
            const hostname = url.hostname;
            
            // Check if it's a supported domain
            if (hostname.includes('meet.google.com')) {
              setCurrentDomain('Google Meet');
            } else if (hostname.includes('zoom.us')) {
              setCurrentDomain('Zoom');
            } else if (hostname.includes('teams.microsoft.com')) {
              setCurrentDomain('Microsoft Teams');
            } else {
              setCurrentDomain('Not a meeting page');
            }
          }
        } catch (error) {
          console.error('[Chuppi] Error getting current tab:', error);
          setCurrentDomain('Unknown');
        }
      }
    };
    getCurrentTab();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle main toggle change
  const handleMainToggle = async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    await SettingsService.updateSetting("enabled", newEnabled);

    // Notify content script of settings change
    await sendMessageToActiveTab({
      type: MessageType.SETTINGS_UPDATED,
      payload: { enabled: newEnabled },
    });
  };

  // Handle microphone toggle change
  const handleMicToggle = async () => {
    if (!isEnabled) return; // Don't allow changes when main toggle is off

    const newMuteMic = !muteMicrophone;
    setMuteMicrophone(newMuteMic);
    await SettingsService.updateSetting("muteMic", newMuteMic);

    // Notify content script of settings change
    await sendMessageToActiveTab({
      type: MessageType.SETTINGS_UPDATED,
      payload: { muteMic: newMuteMic },
    });
  };

  // Handle camera toggle change
  const handleCameraToggle = async () => {
    if (!isEnabled) return; // Don't allow changes when main toggle is off

    const newMuteCamera = !muteCamera;
    setMuteCamera(newMuteCamera);
    await SettingsService.updateSetting("muteCamera", newMuteCamera);

    // Notify content script of settings change
    await sendMessageToActiveTab({
      type: MessageType.SETTINGS_UPDATED,
      payload: { muteCamera: newMuteCamera },
    });
  };

  // Handle external link clicks
  const handleSupportClick = () => openInNewTab(LINKS.support);
  const handleGithubClick = () => openInNewTab(LINKS.github);
  const handleSettingsClick = () => {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.openOptionsPage();
    }
  };
  const handleRateClick = () => openInNewTab(LINKS.chromeWebStore);

  return (
    <div className="flex h-full flex-col bg-[#FFF9F0] dark:bg-[#1C1917] text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-bold tracking-tighter">Chuppi</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-fit">
            <button
              onClick={handleSupportClick}
              className="peer ... cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-[#c30000] hover:bg-gray-100 dark:hover:bg-[#6c0808] shadow-md dark:shadow-none transition-colors"
            >
              <img
                src={isDarkMode ? GetSupportDarkSVG : GetSupportLightSVG}
                className="h-5 pointer-events-none"
                alt="logo"
              />
            </button>

            <span
              className="top-full left-1/2 -translate-x-1/2 absolute mt-2
    text-stone-50 text-xs bg-stone-800 opacity-0 px-2 py-1 rounded-md w-max
    -translate-y-0.5 peer-hover:-translate-y-1 peer-hover:opacity-100 transition-all"
            >
              Report an Issue
            </span>
          </div>

          {/* GitHub Icon */}
          <div className="relative w-fit">
            <button
              onClick={handleGithubClick}
              className="peer ... cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-[#38383c] hover:bg-gray-100 dark:hover:bg-[#505053] shadow-md dark:shadow-none transition-colors"
            >
              <img
                src={isDarkMode ? GithubLogoDarkSVG : GithubLogoLighSVG}
                className="h-5 pointer-events-none"
                alt="logo"
              />
            </button>

            <span
              className="top-full left-1/2 -translate-x-1/2 absolute mt-2
    text-stone-50 text-xs bg-stone-800 opacity-0 px-2 py-1 rounded-md w-max
    -translate-y-0.5 peer-hover:-translate-y-1 peer-hover:opacity-100 transition-all"
            >
              Github Repository
            </span>
          </div>

          {/* Settings Icon */}
          <div className="relative w-fit">
            <button
              onClick={handleSettingsClick}
              className="peer ... cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-[#38383c] hover:bg-gray-100 dark:hover:bg-[#505053] shadow-md dark:shadow-none transition-colors"
            >
              <img
                src={isDarkMode ? SettingsDarkSVG : SettingsLightSVG}
                className="h-5 pointer-events-none"
                alt="logo"
              />
            </button>

            <span
              className="top-full left-1/2 -translate-x-1/2 absolute mt-2
    text-stone-50 text-xs bg-stone-800 opacity-0 px-2 py-1 rounded-md w-max
    -translate-y-0.5 peer-hover:-translate-y-1 peer-hover:opacity-100 transition-all"
            >
              Settings
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow flex-col items-center px-6 pt-3">
        {/* Emoji Icon */}
        <div className="mb-4">
          <img
            src={isEnabled ? LogoSVG : LogoInactiveSVG}
            alt="Chuppi Logo"
            className="w-25 h-25"
          />
        </div>

        {/* Website Info */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {currentDomain || 'Loading...'}
          </p>
          <h2 className="text-2xl font-bold">
            {isEnabled ? "Chuppi is Enabled" : "Chuppi is Disabled"}
          </h2>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleMainToggle}
          className={`my-auto cursor-pointer relative w-28 h-14 rounded-full transition-colors duration-300 ease-in-out ${
            isEnabled
              ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
              : "bg-gray-300 dark:bg-[#646467]"
          }`}
        >
          <div
            className={`absolute top-1 w-12 h-12 bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out ${
              isEnabled ? "translate-x-[60px]" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Control Options */}
      <div className="px-4 space-y-3 mb-6">
        {/* Mute Microphone */}
        <div
          className={`flex items-center justify-between bg-white dark:bg-[#44403c] rounded-xl p-2 shadow-sm ${
            !isEnabled ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={isDarkMode ? MicDarkSVG : MicLightSVG}
              className="ml-0.5 h-5 pointer-events-none"
            />
            <span className="font-semibold text-gray-900 dark:text-white">
              Mute Microphone
            </span>
          </div>
          <button
            onClick={handleMicToggle}
            disabled={!isEnabled}
            className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
              muteMicrophone && isEnabled
                ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
                : "bg-gray-300 dark:bg-[#646467]"
            } ${!isEnabled ? "cursor-not-allowed" : ""}`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                muteMicrophone && isEnabled
                  ? "translate-x-[22px]"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Mute Camera */}
        <div
          className={`flex items-center justify-between bg-white dark:bg-[#44403c] rounded-xl p-2 shadow-sm ${
            !isEnabled ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={isDarkMode ? CameraDarkSVG : CameraLightSVG}
              className="ml-0.5 h-5 pointer-events-none"
            />
            <span className="font-semibold text-gray-900 dark:text-white">
              Mute Camera
            </span>
          </div>
          <button
            onClick={handleCameraToggle}
            disabled={!isEnabled}
            className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
              muteCamera && isEnabled
                ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
                : "bg-gray-300 dark:bg-[#646467]"
            } ${!isEnabled ? "cursor-not-allowed" : ""}`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                muteCamera && isEnabled
                  ? "translate-x-[22px]"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-[#FDE047] dark:bg-[#646467] px-4 py-2 flex items-center justify-between hidden">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Do you like Chuppi?
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRateClick}
            className="cursor-pointer px-2.5 py-1.5 bg-[#ec8e4c] hover:bg-[#ef9e64] dark:hover:bg-[#535354] dark:bg-[#414145] text-white rounded-lg font-medium transition-colors tracking-wider"
          >
            Rate it!
          </button>
          <img
            src={isDarkMode ? SmileDarkSVG : SmileLightSVG}
            className="ml-0.5 h-7 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
