import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react';
import {
  MOMENTS_MEMORY_QUIZ_CONFIG,
  type MemoryQuizQuestion,
} from '../config/momentsMemoryQuiz';

interface MomentsMemoryQuizScreenProps {
  onLock: () => void;
  onComplete: () => void;
  onBack?: () => void;
}

type QuizPhase = 'question' | 'question-success' | 'transitioning';

function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCompact(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function isAnswerCorrect(
  rawInput: string,
  question: MemoryQuizQuestion
): boolean {
  const normalized = normalizeAnswer(rawInput);
  if (!normalized) return false;

  if (question.acceptedAnswers.includes(normalized)) {
    return true;
  }

  if (question.compactAcceptedAnswers) {
    const compact = normalizeCompact(rawInput);
    if (question.compactAcceptedAnswers.includes(compact)) {
      return true;
    }
  }

  return false;
}

function OrnamentalHairlineDivider({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C39D5F]/75 sm:w-16" />
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.5 L9.4 6.6 L14.5 8 L9.4 9.4 L8 14.5 L6.6 9.4 L1.5 8 L6.6 6.6 Z"
          fill="#C59F5F"
          fillOpacity="0.82"
        />
      </svg>
      <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C39D5F]/75 sm:w-16" />
    </div>
  );
}

function CornerFiligree({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positionClasses: Record<typeof position, string> = {
    'top-left': 'top-3 left-3 rotate-0',
    'top-right': 'top-3 right-3 rotate-90',
    'bottom-right': 'bottom-3 right-3 rotate-180',
    'bottom-left': 'bottom-3 left-3 -rotate-90',
  };

  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      className={`pointer-events-none absolute opacity-55 ${positionClasses[position]}`}
    >
      <path
        d="M3 22 L3 7 C3 4.8, 4.8 3, 7 3 L22 3"
        stroke="#B89050"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M7 15 C7 10.5, 10.5 7, 15 7"
        stroke="#C9A76C"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="7" cy="7" r="1.4" fill="#B89050" />
    </svg>
  );
}

export function MomentsMemoryQuizScreen({
  onLock,
  onComplete,
  onBack,
}: MomentsMemoryQuizScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const grainId = useId().replace(/:/g, '');
  const inputId = useId();

  const questions = MOMENTS_MEMORY_QUIZ_CONFIG.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [phase, setPhase] = useState<QuizPhase>('question');
  const [hasError, setHasError] = useState(false);
  const [shakeTick, setShakeTick] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const currentQuestion = questions[currentIndex];
  const isFinalQuestion = currentIndex === questions.length - 1;

  const clearPendingTimers = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (completeTimerRef.current !== null) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPendingTimers();
    };
  }, [clearPendingTimers]);

  useEffect(() => {
    if (phase !== 'question') return;
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, reduced ? 40 : 220);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [currentIndex, phase, reduced]);

  const finishToCollectedMoments = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearPendingTimers();
    onCompleteRef.current();
  }, [clearPendingTimers]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase !== 'question') return;

    if (isAnswerCorrect(answerInput, currentQuestion)) {
      setHasError(false);
      setPhase('question-success');

      const successPause = reduced ? 550 : 1150;
      advanceTimerRef.current = window.setTimeout(() => {
        advanceTimerRef.current = null;
        if (isFinalQuestion) {
          setPhase('transitioning');
          const revealDelay = reduced ? 700 : 1850;
          completeTimerRef.current = window.setTimeout(() => {
            completeTimerRef.current = null;
            finishToCollectedMoments();
          }, revealDelay);
        } else {
          setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
          setAnswerInput('');
          setHasError(false);
          setPhase('question');
        }
      }, successPause);
      return;
    }

    setHasError(true);
    setShakeTick((prev) => prev + 1);
    inputRef.current?.focus();
  };

  return (
    <motion.div
      key="moments-memory-quiz-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden text-[#3B2C22]"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #F1E7D6 0%, #E8D9C2 54%, #DCC7A8 100%)',
      }}
    >
      {/* Soft warm ivory lighting & delicate vintage vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(251, 246, 236, 0.68) 0%, rgba(241, 231, 214, 0.18) 46%, rgba(220, 199, 168, 0.44) 100%)',
          boxShadow: 'inset 0 0 115px rgba(176, 144, 102, 0.34)',
        }}
      />

      {/* Subtle parchment paper texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.038] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='quizPaper-${grainId}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23quizPaper-${grainId})'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Minimal Header matching Letter & Collected Moments */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 pt-5 pb-2 sm:px-10 sm:pt-7">
        <div>
          {onBack && phase !== 'transitioning' && (
            <button
              type="button"
              onClick={() => {
                clearPendingTimers();
                onBack();
              }}
              className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-[#6B5442] transition-colors duration-150 hover:text-[#2D2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Letter</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered Memory Challenge Stage */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-5 pt-4 pb-12 sm:px-10 sm:pb-16">
        <AnimatePresence mode="wait">
          {phase === 'transitioning' ? (
            /* BEAUTIFUL TRANSITION INTO COLLECTED MOMENTS */
            <motion.section
              key="quiz-complete-transition"
              aria-labelledby="moments-unlocked-heading"
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[540px] flex-col items-center overflow-hidden rounded-[10px] border border-[#CDB794] px-7 py-12 text-center shadow-[0_26px_60px_-22px_rgba(88,63,38,0.26),0_8px_20px_-10px_rgba(88,63,38,0.12)] sm:px-12 sm:py-16"
              style={{
                background:
                  'radial-gradient(circle at 50% 42%, #FFFDF8 0%, #FAF3E5 62%, #EFE2CB 100%)',
              }}
            >
              {/* Subtle warm inner frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-[7px] border border-[#E6D5B8]"
              />
              <CornerFiligree position="top-left" />
              <CornerFiligree position="top-right" />
              <CornerFiligree position="bottom-left" />
              <CornerFiligree position="bottom-right" />

              {/* Gentle golden light bloom behind seal */}
              <motion.div
                aria-hidden="true"
                initial={reduced ? { opacity: 0.55 } : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.7, scale: 1.05 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(226, 193, 131, 0.42) 0%, rgba(250, 243, 229, 0) 72%)',
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={reduced ? false : { scale: 0.65, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 18,
                  }}
                  className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C6A163] bg-[#F8EFE0] text-[#8A6734] shadow-[0_12px_26px_-12px_rgba(142,107,56,0.42)]"
                >
                  {!reduced && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scale: 0.9, opacity: 0.75 }}
                      animate={{ scale: 1.65, opacity: 0 }}
                      transition={{
                        duration: 1.4,
                        delay: 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute inset-0 rounded-full border border-[#C6A163]"
                    />
                  )}
                  <Check className="h-7 w-7 stroke-[2]" aria-hidden="true" />
                </motion.div>

                <p className="font-handwritten text-[1.45rem] leading-none text-[#8B6B43]">
                  03 of 03 Remembered
                </p>

                <h1
                  id="moments-unlocked-heading"
                  className="font-editorial mt-3 text-[clamp(2rem,4.6vw,2.75rem)] leading-[1.12] font-medium tracking-[-0.01em] text-[#3E2B1E]"
                  style={{ textWrap: 'balance' }}
                >
                  {MOMENTS_MEMORY_QUIZ_CONFIG.transitionHeading}
                </h1>

                <OrnamentalHairlineDivider className="my-4" />

                <p className="font-editorial max-w-[32ch] text-[1.12rem] italic leading-relaxed text-[#644E3D] sm:text-[1.22rem]">
                  {MOMENTS_MEMORY_QUIZ_CONFIG.transitionSubtitle}
                </p>

                {/* Delicate muted-gold reveal progress bar */}
                <div
                  aria-hidden="true"
                  className="mt-7 h-[2px] w-36 overflow-hidden rounded-full bg-[#E5D5BC]"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: reduced ? 0.5 : 1.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full origin-left bg-gradient-to-r from-[#C8A464] via-[#B48743] to-[#C8A464]"
                  />
                </div>

                <button
                  type="button"
                  onClick={finishToCollectedMoments}
                  className="mt-7 inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 text-[12.5px] font-medium tracking-[0.04em] text-[#7D6247] transition-colors duration-150 hover:text-[#3E2B1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60"
                >
                  <span>Enter Now</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </motion.section>
          ) : (
            /* ACTIVE QUESTION CARD */
            <motion.section
              key="quiz-card-shell"
              aria-labelledby="moments-quiz-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-[560px]"
            >
              {/* Soft layered parchment sheet peeking gently behind */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-1.5 translate-y-2 -rotate-[1.4deg] rounded-[10px] border border-[#CBB592]/70 bg-[#E6D5BA] shadow-[0_14px_28px_-16px_rgba(88,63,38,0.22)] sm:-translate-x-2.5 sm:translate-y-2.5"
              />

              {/* Main Vintage Ivory Question Card */}
              <div
                className="relative z-10 overflow-hidden rounded-[10px] border border-[#CDB794] px-6 py-8 shadow-[0_24px_54px_-20px_rgba(88,63,38,0.24),0_6px_18px_-10px_rgba(88,63,38,0.12)] sm:px-11 sm:py-11"
                style={{
                  background:
                    'radial-gradient(circle at 50% 38%, #FFFDF8 0%, #FAF3E5 66%, #F1E5CF 100%)',
                }}
              >
                {/* Inner archival hairline border */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-2.5 rounded-[7px] border border-[#E7D8BF]"
                />
                <CornerFiligree position="top-left" />
                <CornerFiligree position="top-right" />
                <CornerFiligree position="bottom-left" />
                <CornerFiligree position="bottom-right" />

                {/* Intro Title & Unboxed Editorial Step Progress */}
                <div className="relative z-10 text-center">
                  <p className="font-editorial text-[11.5px] font-medium tracking-[0.22em] text-[#8E704D] uppercase">
                    {MOMENTS_MEMORY_QUIZ_CONFIG.pageEyebrow}
                  </p>

                  <h1
                    id="moments-quiz-heading"
                    className="font-editorial mt-1.5 text-[clamp(1.75rem,3.8vw,2.35rem)] leading-[1.12] font-medium tracking-[-0.01em] text-[#3E2B1E]"
                    style={{ textWrap: 'balance' }}
                  >
                    {MOMENTS_MEMORY_QUIZ_CONFIG.title}
                  </h1>

                  {/* Quiet Antique-Gold Step Progress (Zero-Pill) */}
                  <div
                    className="mt-4 flex flex-col items-center"
                    aria-label={`Step ${currentIndex + 1} of ${questions.length}`}
                  >

                    <div
                      aria-hidden="true"
                      className="flex w-full max-w-[210px] items-center gap-2"
                    >
                      {questions.map((q, idx) => {
                        const isDone =
                          idx < currentIndex ||
                          (idx === currentIndex &&
                            phase === 'question-success');
                        const isActive =
                          idx === currentIndex && phase === 'question';
                        return (
                          <div
                            key={q.id}
                            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                              isDone
                                ? 'bg-[#B88946]'
                                : isActive
                                  ? 'bg-[#D5B57B]'
                                  : 'bg-[#E5D7C0]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <OrnamentalHairlineDivider className="mt-5 mb-6" />
                </div>

                {/* Single Question Body (Unlocked Sequentially) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`question-step-${currentQuestion.id}`}
                    initial={
                      reduced ? { opacity: 0 } : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      reduced ? { opacity: 0 } : { opacity: 0, y: -8 }
                    }
                    transition={{
                      duration: reduced ? 0.15 : 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative z-10"
                  >
                    <form onSubmit={handleSubmit} noValidate>
                      <label
                        htmlFor={inputId}
                        className="font-editorial block text-center text-[clamp(1.38rem,3.1vw,1.78rem)] leading-[1.3] font-medium text-[#3A291F]"
                        style={{ textWrap: 'balance' }}
                      >
                        {currentQuestion.question}
                      </label>

                      <motion.div
                        animate={
                          shakeTick > 0 && !reduced
                            ? { x: [0, -7, 7, -5, 5, -2, 2, 0] }
                            : { x: 0 }
                        }
                        transition={{ duration: 0.34, ease: 'easeOut' }}
                        className="mt-6"
                      >
                        <div className="relative">
                          <input
                            ref={inputRef}
                            id={inputId}
                            type="text"
                            value={answerInput}
                            onChange={(e) => {
                              setAnswerInput(e.target.value);
                              if (hasError) setHasError(false);
                            }}
                            disabled={phase !== 'question'}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder={currentQuestion.placeholder}
                            aria-invalid={hasError}
                            className={`font-editorial w-full rounded-[8px] border bg-[#FFFDF9] px-4 py-3.5 text-center text-[1.22rem] text-[#3A291F] placeholder:italic placeholder:text-[#A99278] shadow-[inset_0_1px_4px_rgba(88,63,38,0.06)] transition-all duration-200 focus:outline-none sm:text-[1.32rem] ${
                              phase === 'question-success'
                                ? 'border-[#B88946] bg-[#FBF5E7] pr-11 text-[#4A3524]'
                                : hasError
                                  ? 'border-[#C18976] focus:border-[#A86D59] focus:ring-2 focus:ring-[#C18976]/25'
                                  : 'border-[#D5C09F] focus:border-[#B88946] focus:ring-2 focus:ring-[#C8A464]/25'
                            }`}
                          />

                          {/* Subtle inline checkmark seal on success */}
                          <AnimatePresence>
                            {phase === 'question-success' && (
                              <motion.span
                                initial={
                                  reduced
                                    ? { opacity: 0 }
                                    : { opacity: 0, scale: 0.55 }
                                }
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 280,
                                  damping: 20,
                                }}
                                aria-hidden="true"
                                className="absolute top-1/2 right-3.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#C6A163] bg-[#F5EBD5] text-[#8A6734]"
                              >
                                <Check className="h-4 w-4 stroke-[2.2]" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Feedback Area: Subtle Success Animation OR Try again */}
                      <div
                        className="mt-4 flex min-h-[42px] items-center justify-center"
                        aria-live="polite"
                      >
                        <AnimatePresence mode="wait">
                          {phase === 'question-success' ? (
                            <motion.div
                              key="success-feedback"
                              initial={
                                reduced
                                  ? { opacity: 0 }
                                  : { opacity: 0, y: 6, scale: 0.96 }
                              }
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.35,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="relative flex items-center gap-2.5 rounded-[6px] border border-[#D4BA8B]/80 bg-[#F9F1DF] px-4 py-2 text-center shadow-[0_6px_16px_-10px_rgba(142,107,56,0.35)]"
                            >
                              {!reduced && (
                                <motion.span
                                  aria-hidden="true"
                                  initial={{ scale: 0.85, opacity: 0.6 }}
                                  animate={{ scale: 1.5, opacity: 0 }}
                                  transition={{
                                    duration: 0.85,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  className="pointer-events-none absolute inset-0 rounded-[6px] border border-[#C6A163]"
                                />
                              )}
                              <Check
                                className="h-4 w-4 shrink-0 text-[#8A6734] stroke-[2.2]"
                                aria-hidden="true"
                              />
                              <span className="font-editorial text-[0.98rem] italic text-[#5B4229] sm:text-[1.04rem]">
                                {currentQuestion.successNote}
                              </span>
                            </motion.div>
                          ) : hasError ? (
                            <motion.p
                              key={`error-feedback-${shakeTick}`}
                              role="alert"
                              initial={
                                reduced
                                  ? { opacity: 0 }
                                  : { opacity: 0, y: -3 }
                              }
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="font-editorial text-[1.02rem] italic text-[#8F4E3D]"
                            >
                              Try again
                            </motion.p>
                          ) : null}
                        </AnimatePresence>
                      </div>

                      {/* Primary Submit Action */}
                      <div className="mt-5 flex justify-center">
                        <button
                          type="submit"
                          disabled={phase !== 'question'}
                          className="inline-flex min-h-[44px] min-w-[184px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#E7D8C0]/45 bg-[#3E2B1E] px-7 py-2.5 text-[13.5px] font-medium tracking-[0.03em] text-[#FAF3EA] shadow-[0_12px_24px_-12px_rgba(88,63,38,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2F2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF3E5] disabled:cursor-default disabled:opacity-65 disabled:hover:translate-y-0"
                        >
                          <span>Continue</span>
                          <ArrowRight
                            className="h-3.5 w-3.5 stroke-[1.9]"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
