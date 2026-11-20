export const VINTAGE_LETTER_CONFIG = {
  /** Small handwritten opening at the top of the letter */
  opening: "There are a few things I've always wanted to say...",

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
    "I don't really know how to put everything into words, but I do know that I'm glad we got to share those moments.",
    'Sometimes I think about our little moments and end up smiling at the simplest things.',
    "I may not express everything, and sometimes I don't even know what to say, but that doesn't mean I don't feel it.",
    'But I genuinely hope we never change the little things that make us who we are.',
    "And if there's one thing I want you to know, it's that I'm a little bit happy.",
  ],

  /** Handwritten-style closing near the bottom */
  closing:
    "That's all I wanted to say, at least for now. ♡ Just forget it, they're just thoughts.",
} as const;
