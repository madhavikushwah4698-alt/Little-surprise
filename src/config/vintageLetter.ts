export const VINTAGE_LETTER_CONFIG = {
  /** Small handwritten opening at the top of the letter */
  opening: 'Dear PJ,',

  /** Base handwriting speed per character (ms, naturally varied per character) */
  charDelayMs: 36,

  /** Natural pause between completing one sentence and starting the next (ms) */
  sentencePauseMs: 560,

  /** Brief pause after the final body sentence before writing the closing signature (ms) */
  closingPauseMs: 620,

  /**
   * Handwritten letter thoughts lines.
   */
  lines: [
    'Hey PJ,',
    'You know, sometimes I wonder how so many random little things turn into memories.',
    'Our conversations, those discussions, random updates, pictures of food, and all those times we ended up talking about something completely different from what we started with.',
    "I don't think every moment needs a reason to be special. Sometimes it's just the people, the conversations, and the little things that make them memorable.",
    "And honestly, that's what I wanted to put together here.",
    "So, PJ, You might find a few things you remember, and maybe a few things you've forgotten.",
    'I just try to bring all these little memories together in one place.',
  ],

  /** Handwritten-style closing near the bottom */
  closing: '– Chikku',
} as const;
