export const PERSONAL_MESSAGE_CONFIG = {
  heading: 'A little something I wanted to say...',
  /** Delay between each line appearing (1.5s–2.0s recommended) */
  lineIntervalMs: 1_750,
  /** Pause after the final line before revealing the Continue button */
  finalPauseMs: 2_800,
  /**
   * Temporary replaceable placeholder lines.
   * Edit or replace each string with your own words at any time.
   */
  lines: [
    'Line 1 — Replace this placeholder with your opening thought.',
    'Line 2 — Add a favorite quiet memory you both carry.',
    'Line 3 — Share something heartfelt in your own words here.',
    'Line 4 — Add one more sincere thought just for them.',
    'Line 5 — Replace this with your closing line before the next surprise.',
  ],
} as const;
