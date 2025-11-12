import { PlatformConfig } from "./types";

/**
 * Google Meet platform configuration
 */
export const googleMeetConfig: PlatformConfig = {
  detection: {
    urlPattern: /^https?:\/\/meet\.google\.com\//,
    name: "Google Meet",
  },
  /**
   * Optional helper to determine if current URL contains a valid meeting id
   */
  hasMeetingId(url?: string) {
    const u = url || window.location.href;
    // Google Meet meeting codes are either 3 groups (xxx-xxxx-xxx) or 4 groups (xxxx-xxxx)
    // Common patterns: /bap-zgqa-jgr or /xzj-jrod-kvw
    const path = new URL(u).pathname.replace(/^\//, "");
    const firstSegment = path.split("/")[0] || "";
    
    // Special case: /new is valid as it redirects to a meeting with an ID
    if (firstSegment === "new") {
      return true;
    }
    
    // Accept ids that match groups of letters/numbers separated by hyphens of length 3 or 4 segments
    const meetIdRegex =
      /^([a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{3}|[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}|[a-z0-9]{4}-[a-z0-9]{4})$/i;
    return meetIdRegex.test(firstSegment);
  },
  selectors: {
    // Indicators to detect which screen we're on
    screenIndicators: {
      // Preview screen: Look for "Ready to join?" text using custom function
      preview: () => {
        // Find div with exact text "Ready to join?"
        return (
          Array.from(document.querySelectorAll("div")).find(
            (el) => el.textContent?.trim() === "Ready to join?"
          ) || null
        );
      },
      // Joined screen: Look for "Leave call" button
      joined: 'button[aria-label="Leave call"]',
    },
    // Selectors for preview screen (div with role="button")
    preview: {
      mic: [
        'div[role="button"][aria-label="Turn off microphone"]',
        'div[role="button"][aria-label="Turn on microphone"]',
      ],
      camera: [
        'div[role="button"][aria-label="Turn off camera"]',
        'div[role="button"][aria-label="Turn on camera"]',
      ],
    },
    // Selectors for joined screen (button elements)
    joined: {
      mic: [
        'button[aria-label="Turn off microphone"]',
        'button[aria-label="Turn on microphone"]',
      ],
      camera: [
        'button[aria-label="Turn off camera"]',
        'button[aria-label="Turn on camera"]',
      ],
    },
  },
  state: {
    // For mic: data-is-muted="false" means mic is ON (unmuted)
    // data-is-muted="true" means mic is muted (OFF)
    micMutedAttr: {
      name: "data-is-muted",
      value: "true",
    },
    micUnmutedAttr: {
      name: "data-is-muted",
      value: "false",
    },
    // For camera: data-is-muted="true" means camera is OFF
    // data-is-muted="false" means camera is ON
    cameraMutedAttr: {
      name: "data-is-muted",
      value: "true",
    },
    cameraUnmutedAttr: {
      name: "data-is-muted",
      value: "false",
    },
  },
  // No need for waitTime - we use meetingJoinedIndicator instead for faster, safer auto-mute
};
