export interface MemoryQuizQuestion {
  id: number;
  stepLabel: string;
  question: string;
  acceptedAnswers: string[];
  compactAcceptedAnswers?: string[];
  placeholder: string;
  successNote: string;
}

export const MOMENTS_MEMORY_QUIZ_CONFIG = {
  pageEyebrow: 'Before We Continue',
  title: 'Three Small Memories',
  subtitle: 'Answer each remembered detail to open Collected Moments.',
  questions: [
    {
      id: 1,
      stepLabel: '01',
      question: 'What did we go out to enjoy together?',
      acceptedAnswers: ['chai'],
      placeholder: 'Type your answer…',
      successNote: 'A warm beginning — unlocking the next question.',
    },
    {
      id: 2,
      stepLabel: '02',
      question: 'On which date did we go for chai?',
      acceptedAnswers: ['1 january 2026', '01 january 2026'],
      compactAcceptedAnswers: ['1january2026', '01january2026'],
      placeholder: 'Type your answer…',
      successNote: 'That date stays kept in ink — one last memory.',
    },
    {
      id: 3,
      stepLabel: '03',
      question: 'What did we gradually start sharing every day?',
      acceptedAnswers: ['moments'],
      placeholder: 'Type your answer…',
      successNote: 'Every detail remembered.',
    },
  ] satisfies MemoryQuizQuestion[],
  transitionHeading: 'Collected Moments',
  transitionSubtitle: 'All three memories unlocked — opening the pages ahead.',
} as const;
