import React, { useState, useEffect } from "react";
import LogoSVG from "@assets/img/logo.svg";
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

export default function Popup() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [muteMicrophone, setMuteMicrophone] = useState(true);
  const [muteCamera, setMuteCamera] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return (
    <div className="flex h-full flex-col bg-[#FFF9F0] dark:bg-[#1C1917] text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-bold tracking-tighter">Chuppi</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-fit">
            <button className="peer ... cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-[#c30000] hover:bg-gray-100 dark:hover:bg-[#6c0808] shadow-md dark:shadow-none transition-colors">
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
            <button className="peer ... cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-[#38383c] hover:bg-gray-100 dark:hover:bg-[#505053] shadow-md dark:shadow-none transition-colors">
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
            <button className="peer ... cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-[#38383c] hover:bg-gray-100 dark:hover:bg-[#505053] shadow-md dark:shadow-none transition-colors">
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
      <div className="flex flex-grow flex-col items-center px-6 pt-5 pb-12">
        {/* Emoji Icon */}
        <div className="mb-4">
          <img src={LogoSVG} alt="Chuppi Logo" className="w-25 h-25" />
          {/* <div className="text-8xl">🤐</div> */}
        </div>

        {/* Website Info */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            meet.google.com
          </p>
          <h2 className="text-2xl font-bold">Chuppi is Enabled</h2>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => setIsEnabled(!isEnabled)}
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
        <div className="flex items-center justify-between bg-white dark:bg-[#44403c] rounded-xl p-2 shadow-sm">
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
            onClick={() => setMuteMicrophone(!muteMicrophone)}
            className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
              muteMicrophone
                ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
                : "bg-gray-300 dark:bg-[#646467]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                muteMicrophone ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Mute Camera */}
        <div className="flex items-center justify-between bg-white dark:bg-[#44403c] rounded-xl p-2 shadow-sm">
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
            onClick={() => setMuteCamera(!muteCamera)}
            className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
              muteCamera
                ? "bg-gradient-to-r from-[#FF8C61] to-[#FF6B47]"
                : "bg-gray-300 dark:bg-[#646467]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                muteCamera ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-[#FDE047] dark:bg-[#646467] px-4 py-2 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Do you like Chuppi?
        </p>
        <div className="flex items-center gap-3">
          <button className="cursor-pointer px-2.5 py-1.5 bg-[#FF8C61] hover:bg-[#FF6B47] dark:hover:bg-[#535354] dark:bg-[#414145] text-white rounded-lg font-medium transition-colors tracking-wider">
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
