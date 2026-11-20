import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Clock,
  Delete,
  Eye,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

interface MemoryChallengeScreenProps {
  onLock: () => void;
  onBack?: () => void;
  onSuccess?: () => void;
}

type ChallengePhase = 'memorize' | 'input' | 'failed' | 'timeout' | 'success';

const CODE_LENGTH = 6;
const MEMORIZE_DURATION_MS = 5_000;
const INPUT_DURATION_MS = 20_000;
const MAX_ATTEMPTS = 3;
const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

function generateSixDigitCode(previousCode?: string): string {
  const generateCandidate = (): string => {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      // Rejection sampling to avoid modulo bias over 900,000 values
      const maxUnbiased = Math.floor(0xffffffff / 900_000) * 900_000;
      let randomValue = 0;
      do {
        window.crypto.getRandomValues(array);
        randomValue = array[0];
      } while (randomValue >= maxUnbiased);
      return String(100_000 + (randomValue % 900_000));
    }
    return String(Math.floor(100_000 + Math.random() * 900_000));
  };

  let candidate = generateCandidate();
  if (previousCode && candidate === previousCode) {
    candidate = generateCandidate();
  }
  return candidate;
}

function formatCountdown(seconds: number): string {
  const clamped = Math.max(0, seconds);
  return `00:${String(clamped).padStart(2, '0')}`;
}

function PhaseMountedNotifier({ onMount }: { onMount: () => void }) {
  const onMountRef = useRef(onMount);
  onMountRef.current = onMount;

  useEffect(() => {
    onMountRef.current();
  }, []);

  return null;
}

export function MemoryChallengeScreen({
  onLock,
  onBack,
  onSuccess,
}: MemoryChallengeScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);

  const [challengeId, setChallengeId] = useState(1);
  const [targetCode, setTargetCode] = useState<string>(() =>
    generateSixDigitCode()
  );
  const [phase, setPhase] = useState<ChallengePhase>('memorize');

  const [memorizeMsLeft, setMemorizeMsLeft] = useState(MEMORIZE_DURATION_MS);
  const [inputMsLeft, setInputMsLeft] = useState(INPUT_DURATION_MS);

  const [enteredDigits, setEnteredDigits] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_ATTEMPTS);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [shakeTick, setShakeTick] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isInputTimerActive, setIsInputTimerActive] = useState(false);

  const checkTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);
  const enteredDigitsRef = useRef('');
  const isCheckingRef = useRef(false);
  const phaseRef = useRef<ChallengePhase>(phase);
  const targetCodeRef = useRef<string>(targetCode);
  const attemptsRef = useRef<number>(attemptsRemaining);
  const inputDeadlineRef = useRef<number>(0);
  const successNotifiedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    targetCodeRef.current = targetCode;
  }, [targetCode]);

  useEffect(() => {
    attemptsRef.current = attemptsRemaining;
  }, [attemptsRemaining]);

  const clearAllTimers = useCallback(() => {
    if (checkTimerRef.current !== null) {
      window.clearTimeout(checkTimerRef.current);
      checkTimerRef.current = null;
    }
    if (phaseTimerRef.current !== null) {
      window.clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Phase 1: Display random 6-digit number for exactly 5 seconds, then hide
  useEffect(() => {
    if (phase !== 'memorize') return;

    setIsInputTimerActive(false);
    const deadline = Date.now() + MEMORIZE_DURATION_MS;
    setMemorizeMsLeft(MEMORIZE_DURATION_MS);

    const localInterval = window.setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      setMemorizeMsLeft(remaining);
    }, 50);
    intervalRef.current = localInterval;

    const localTimer = window.setTimeout(() => {
      window.clearInterval(localInterval);
      if (intervalRef.current === localInterval) intervalRef.current = null;
      if (phaseTimerRef.current === localTimer) phaseTimerRef.current = null;
      setMemorizeMsLeft(0);
      setInputMsLeft(INPUT_DURATION_MS);
      enteredDigitsRef.current = '';
      setEnteredDigits('');
      setFeedbackError(null);
      setPhase('input');
    }, MEMORIZE_DURATION_MS);
    phaseTimerRef.current = localTimer;

    return () => {
      window.clearInterval(localInterval);
      window.clearTimeout(localTimer);
      if (intervalRef.current === localInterval) intervalRef.current = null;
      if (phaseTimerRef.current === localTimer) phaseTimerRef.current = null;
    };
  }, [challengeId, phase]);

  // Phase 2: Start 20-second countdown strictly after Screen 1 disappears & Screen 2 mounts
  useEffect(() => {
    if (phase !== 'input' || !isInputTimerActive) return;

    const deadline = Date.now() + INPUT_DURATION_MS;
    inputDeadlineRef.current = deadline;
    setInputMsLeft(INPUT_DURATION_MS);

    const localInterval = window.setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      setInputMsLeft(remaining);
      if (remaining <= 0 && phaseRef.current === 'input' && !isCheckingRef.current) {
        window.clearInterval(localInterval);
        if (intervalRef.current === localInterval) intervalRef.current = null;
        setIsInputTimerActive(false);
        enteredDigitsRef.current = '';
        setEnteredDigits('');
        setFeedbackError(null);
        setPhase('timeout');
      }
    }, 50);
    intervalRef.current = localInterval;

    const localTimer = window.setTimeout(() => {
      if (phaseRef.current === 'input' && !isCheckingRef.current) {
        window.clearInterval(localInterval);
        if (intervalRef.current === localInterval) intervalRef.current = null;
        if (phaseTimerRef.current === localTimer) phaseTimerRef.current = null;
        setIsInputTimerActive(false);
        setInputMsLeft(0);
        enteredDigitsRef.current = '';
        setEnteredDigits('');
        setFeedbackError(null);
        setPhase('timeout');
      }
    }, INPUT_DURATION_MS);
    phaseTimerRef.current = localTimer;

    return () => {
      window.clearInterval(localInterval);
      window.clearTimeout(localTimer);
      if (intervalRef.current === localInterval) intervalRef.current = null;
      if (phaseTimerRef.current === localTimer) phaseTimerRef.current = null;
    };
  }, [challengeId, isInputTimerActive, phase]);

  // Phase 3 (Success): Show ACCESS GRANTED briefly (~1.5s), then automatically open Our Memories Gallery
  useEffect(() => {
    if (phase !== 'success') return;

    const transitionDelay = reduced ? 700 : 1500;
    const successTimer = window.setTimeout(() => {
      if (!successNotifiedRef.current) {
        successNotifiedRef.current = true;
        onSuccessRef.current?.();
      }
    }, transitionDelay);

    return () => {
      window.clearTimeout(successTimer);
    };
  }, [phase, reduced]);

  const handleInputMounted = useCallback(() => {
    if (phaseRef.current === 'input') {
      setIsInputTimerActive(true);
    }
  }, []);

  const startNewChallenge = useCallback(() => {
    clearAllTimers();
    isCheckingRef.current = false;
    successNotifiedRef.current = false;
    setIsChecking(false);
    setIsInputTimerActive(false);
    enteredDigitsRef.current = '';
    setEnteredDigits('');
    setAttemptsRemaining(MAX_ATTEMPTS);
    attemptsRef.current = MAX_ATTEMPTS;
    setFeedbackError(null);
    setShakeTick(0);
    setMemorizeMsLeft(MEMORIZE_DURATION_MS);
    setInputMsLeft(INPUT_DURATION_MS);

    const nextCode = generateSixDigitCode(targetCodeRef.current);
    targetCodeRef.current = nextCode;
    setTargetCode(nextCode);
    setChallengeId((prev) => prev + 1);
    setPhase('memorize');
  }, [clearAllTimers]);

  const evaluateCandidate = useCallback(
    (candidate: string) => {
      if (
        isCheckingRef.current ||
        phaseRef.current !== 'input' ||
        candidate.length !== CODE_LENGTH ||
        !/^\d{6}$/.test(candidate)
      ) {
        return;
      }

      isCheckingRef.current = true;
      setIsChecking(true);
      setFeedbackError(null);

      const checkDelay = reduced ? 120 : 240;
      checkTimerRef.current = window.setTimeout(() => {
        checkTimerRef.current = null;
        if (phaseRef.current !== 'input') {
          isCheckingRef.current = false;
          setIsChecking(false);
          return;
        }

        if (candidate === targetCodeRef.current) {
          clearAllTimers();
          isCheckingRef.current = false;
          setIsChecking(false);
          setIsInputTimerActive(false);
          setPhase('success');
          return;
        }

        const nextAttempts = Math.max(0, attemptsRef.current - 1);
        attemptsRef.current = nextAttempts;
        setAttemptsRemaining(nextAttempts);

        if (nextAttempts <= 0) {
          clearAllTimers();
          isCheckingRef.current = false;
          setIsChecking(false);
          setIsInputTimerActive(false);
          enteredDigitsRef.current = '';
          setEnteredDigits('');
          setFeedbackError(null);
          setPhase('failed');
          return;
        }

        if (Date.now() >= inputDeadlineRef.current) {
          clearAllTimers();
          isCheckingRef.current = false;
          setIsChecking(false);
          setIsInputTimerActive(false);
          setInputMsLeft(0);
          enteredDigitsRef.current = '';
          setEnteredDigits('');
          setFeedbackError(null);
          setPhase('timeout');
          return;
        }

        setShakeTick((prev) => prev + 1);
        enteredDigitsRef.current = '';
        setEnteredDigits('');
        setFeedbackError(
          nextAttempts === 1
            ? 'Incorrect code — 1 attempt remaining.'
            : `Incorrect code — ${nextAttempts} attempts remaining.`
        );
        isCheckingRef.current = false;
        setIsChecking(false);
      }, checkDelay);
    },
    [clearAllTimers, reduced]
  );

  const handleDigitInput = useCallback(
    (digit: string) => {
      if (
        phaseRef.current !== 'input' ||
        isCheckingRef.current ||
        !/^[0-9]$/.test(digit)
      ) {
        return;
      }

      const current = enteredDigitsRef.current;
      if (current.length >= CODE_LENGTH) {
        return;
      }

      const next = current + digit;
      enteredDigitsRef.current = next;
      setEnteredDigits(next);

      setFeedbackError(null);

      if (next.length === CODE_LENGTH) {
        evaluateCandidate(next);
      }
    },
    [evaluateCandidate]
  );

  const handleBackspace = useCallback(() => {
    if (phaseRef.current !== 'input' || isCheckingRef.current) {
      return;
    }

    const current = enteredDigitsRef.current;
    if (current.length === 0) {
      return;
    }

    const next = current.slice(0, -1);
    enteredDigitsRef.current = next;
    setEnteredDigits(next);
    setFeedbackError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (phaseRef.current !== 'input' || isCheckingRef.current) {
      return;
    }
    enteredDigitsRef.current = '';
    setEnteredDigits('');
    setFeedbackError(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (phaseRef.current !== 'input') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        handleDigitInput(event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleClear, handleDigitInput]);

  const memorizeSecondsLeft = Math.ceil(memorizeMsLeft / 1000);
  const memorizeProgress = Math.max(
    0,
    Math.min(1, memorizeMsLeft / MEMORIZE_DURATION_MS)
  );

  const inputSecondsLeft = Math.ceil(inputMsLeft / 1000);
  const inputProgress = Math.max(
    0,
    Math.min(1, inputMsLeft / INPUT_DURATION_MS)
  );
  const isUrgentTime = phase === 'input' && inputSecondsLeft <= 5;

  const groupedTargetDigits = `${targetCode.slice(0, 3)} ${targetCode.slice(3)}`;

  return (
    <motion.div
      key="memory-challenge-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#F8F5EF] text-[#403128]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 38%, rgba(243, 237, 228, 0.82) 0%, rgba(248, 245, 239, 0.98) 74%)',
      }}
    >
      {/* Subtle organic paper grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='challengePaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23challengePaper)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Minimal Header matching BirthdayExperience */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-6 pt-5 pb-2 sm:px-10 sm:pt-7">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                clearAllTimers();
                onBack();
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#7A685B] transition-colors duration-150 hover:text-[#403128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77]/40 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Previous</span>
            </button>
          )}
          <span className="text-[12px] font-medium tracking-[0.18em] text-[#A18C77] uppercase whitespace-nowrap">
            Memory Challenge
          </span>
        </div>
      </header>

      {/* Main Challenge Stage */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-5 sm:px-8 sm:py-8">
        <AnimatePresence mode="wait">
          {/* SCREEN 1 — REMEMBER THE NUMBER (5 seconds) */}
          {phase === 'memorize' && (
            <motion.section
              key={`challenge-memorize-${challengeId}`}
              aria-labelledby="memory-memorize-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.96,
                      filter: 'blur(6px)',
                      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                    }
              }
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[490px] flex-col items-center overflow-hidden rounded-3xl border border-[#DFD1BC] bg-[#FDFBF7]/95 px-6 py-9 text-center shadow-[0_28px_72px_-24px_rgba(64,49,40,0.16),0_10px_26px_-14px_rgba(161,140,119,0.16)] sm:px-11 sm:py-12"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-[#EFE6D9]"
              />

              <div className="relative z-10 flex w-full flex-col items-center">
                <div
                  aria-hidden="true"
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#E5D9C9] bg-[#F5EFE6] text-[#8E6F46]"
                >
                  <Eye className="h-4 w-4 stroke-[1.65]" />
                </div>

                <p className="text-[11px] font-medium tracking-[0.24em] text-[#A18C77] uppercase">
                  Secret Access · Step 01
                </p>

                <h1
                  id="memory-memorize-heading"
                  className="font-editorial mt-2.5 text-[clamp(1.9rem,4.4vw,2.55rem)] leading-[1.12] font-medium tracking-[-0.015em] text-[#403128]"
                  style={{ textWrap: 'balance' }}
                >
                  Remember the number
                </h1>

                <p className="mt-2.5 max-w-[34ch] text-[14.5px] leading-relaxed text-[#6E5D52] sm:text-[15px]">
                  Keep these six digits in mind — they will vanish in a few
                  seconds.
                </p>

                {/* Prominent 6-digit display terminal */}
                <div className="mt-7 w-full rounded-2xl border border-[#DFD2C0] bg-[#FAF6EE] px-4 py-6 shadow-[inset_0_2px_10px_rgba(116,94,72,0.06)] sm:px-7 sm:py-7">
                  <p className="text-[10.5px] font-medium tracking-[0.26em] text-[#A18C77] uppercase">
                    Access Code
                  </p>
                  <p
                    aria-label={`Six digit code ${targetCode.split('').join(' ')}`}
                    className="font-editorial mt-2 text-[clamp(2.45rem,8vw,3.35rem)] leading-none font-semibold tracking-[0.2em] text-[#403128] tabular-nums select-none"
                  >
                    {groupedTargetDigits}
                  </p>
                </div>

                {/* 5-second visual countdown & progress track */}
                <div className="mt-6 w-full max-w-[280px]">
                  <div className="flex items-center justify-between text-[12px] font-medium text-[#8C7564]">
                    <span className="tracking-[0.12em] uppercase">
                      Disappearing in
                    </span>
                    <span className="font-editorial text-[1.1rem] font-semibold text-[#403128] tabular-nums">
                      {memorizeSecondsLeft}s
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EDE3D4]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C2A376] to-[#A68352] transition-[width] duration-75 ease-linear"
                      style={{ width: `${memorizeProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* SCREEN 2 — ENTER THE CODE (20 seconds, 3 attempts) */}
          {phase === 'input' && (
            <motion.section
              key={`challenge-input-${challengeId}`}
              aria-labelledby="memory-input-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[490px] flex-col items-center overflow-hidden rounded-3xl border border-[#DFD1BC] bg-[#FDFBF7]/95 px-5 py-7 text-center shadow-[0_28px_72px_-24px_rgba(64,49,40,0.16),0_10px_26px_-14px_rgba(161,140,119,0.16)] sm:px-10 sm:py-9"
            >
              <PhaseMountedNotifier onMount={handleInputMounted} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-[#EFE6D9]"
              />

              <div className="relative z-10 flex w-full flex-col items-center">
                {/* Large Readable Countdown Timer Bar */}
                <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#E5D9C9] bg-[#FAF6EE] px-4 py-3">
                  <div className="flex items-center gap-2 text-left">
                    <Clock
                      className={`h-4 w-4 stroke-[1.75] ${
                        isUrgentTime ? 'text-[#9C4A3B]' : 'text-[#8E6F46]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-medium tracking-[0.18em] text-[#7A685B] uppercase">
                      Time Left
                    </span>
                  </div>

                  <span
                    aria-live="off"
                    className={`font-editorial text-[1.65rem] leading-none font-semibold tabular-nums transition-colors sm:text-[1.85rem] ${
                      isUrgentTime ? 'text-[#9C4A3B]' : 'text-[#403128]'
                    }`}
                  >
                    {formatCountdown(inputSecondsLeft)}
                  </span>
                </div>

                {/* Smooth countdown progress track */}
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#EDE3D4]">
                  <div
                    className={`h-full rounded-full transition-[width,background-color] duration-75 ease-linear ${
                      isUrgentTime ? 'bg-[#B35D4C]' : 'bg-[#C2A376]'
                    }`}
                    style={{ width: `${inputProgress * 100}%` }}
                  />
                </div>

                <h1
                  id="memory-input-heading"
                  className="font-editorial mt-5 text-[clamp(1.7rem,4vw,2.2rem)] leading-[1.14] font-medium tracking-[-0.015em] text-[#403128]"
                  style={{ textWrap: 'balance' }}
                >
                  Enter the code
                </h1>

                <p className="mt-1.5 text-[13.5px] text-[#7A685B] sm:text-[14.5px]">
                  Type the six-digit number you just saw
                </p>

                {/* Remaining Attempts Indicator */}
                <div
                  className="mt-3.5 flex items-center justify-center gap-2.5"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((dotIndex) => {
                      const active = dotIndex < attemptsRemaining;
                      return (
                        <span
                          key={dotIndex}
                          className={`h-2 w-2 rounded-full transition-all duration-200 ${
                            active
                              ? 'bg-[#C2A376] shadow-[0_0_0_2px_rgba(194,163,118,0.18)]'
                              : 'bg-[#E2D6C5]'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[12px] font-medium tracking-[0.04em] text-[#7A685B] tabular-nums">
                    {attemptsRemaining} of {MAX_ATTEMPTS} attempts remaining
                  </span>
                </div>

                {/* Six Digit Input Boxes */}
                <motion.div
                  animate={
                    shakeTick > 0 && !reduced
                      ? { x: [0, -7, 7, -5, 5, -2, 2, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="mt-5 grid w-full max-w-[336px] grid-cols-6 gap-2 sm:max-w-[366px] sm:gap-2.5"
                  role="group"
                  aria-label="Six-digit memory challenge code entry"
                >
                  {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
                    const char = enteredDigits[slotIndex] ?? '';
                    const isFilled = Boolean(char);
                    const isActiveSlot =
                      !isChecking && enteredDigits.length === slotIndex;

                    return (
                      <div
                        key={slotIndex}
                        className={`flex h-13 w-full items-center justify-center rounded-xl border transition-all duration-150 sm:h-14 ${
                          feedbackError && !isFilled
                            ? 'border-[#C98B7C] bg-[#FAF7F2]'
                            : isActiveSlot
                              ? 'border-[#A18C77] bg-[#FFFFFF] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.25)]'
                              : isFilled
                                ? 'border-[#C2A376] bg-[#FFFFFF]'
                                : 'border-[#E5D9C9] bg-[#FAF7F2]'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {isFilled ? (
                            <motion.span
                              key={`slot-${slotIndex}-${char}`}
                              initial={
                                reduced ? false : { opacity: 0, scale: 0.78 }
                              }
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.78 }}
                              transition={{ duration: 0.12 }}
                              className="font-editorial text-[1.5rem] font-semibold tabular-nums text-[#403128] sm:text-[1.65rem]"
                            >
                              {char}
                            </motion.span>
                          ) : (
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-[#D7C9B8]"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Feedback Message */}
                <div className="mt-3 min-h-[22px]" aria-live="polite">
                  <AnimatePresence mode="wait">
                    {isChecking ? (
                      <motion.p
                        key="checking-code"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[12.5px] font-medium tracking-[0.06em] text-[#8E6F46]"
                      >
                        Verifying code...
                      </motion.p>
                    ) : feedbackError ? (
                      <motion.p
                        key={`feedback-error-${shakeTick}`}
                        role="alert"
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-[13px] font-medium text-[#8C4A3E]"
                      >
                        {feedbackError}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Mobile-Optimized Interactive Numeric Keypad */}
                <div
                  className="mt-3 grid w-full max-w-[264px] grid-cols-3 justify-items-center gap-2.5 sm:max-w-[276px] sm:gap-3"
                  role="group"
                  aria-label="Numeric keypad"
                >
                  {KEYPAD_DIGITS.map((digit) => (
                    <motion.button
                      key={digit}
                      type="button"
                      onClick={() => handleDigitInput(digit)}
                      disabled={isChecking || enteredDigits.length >= CODE_LENGTH}
                      whileHover={
                        reduced || isChecking ? undefined : { y: -1 }
                      }
                      whileTap={
                        reduced || isChecking ? undefined : { scale: 0.93 }
                      }
                      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                      className="flex h-14 w-full touch-manipulation cursor-pointer items-center justify-center rounded-2xl border border-[#E5D9C9] bg-[#FDFBF7] text-[1.15rem] font-medium tabular-nums text-[#403128] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.2)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] active:bg-[#EFE6D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-60 sm:h-[58px]"
                    >
                      {digit}
                    </motion.button>
                  ))}

                  {/* Bottom Row: Clear, 0, Backspace */}
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    disabled={isChecking || enteredDigits.length === 0}
                    aria-label="Clear entered digits"
                    whileTap={
                      reduced || isChecking || enteredDigits.length === 0
                        ? undefined
                        : { scale: 0.93 }
                    }
                    className="flex h-14 w-full touch-manipulation cursor-pointer items-center justify-center rounded-2xl border border-[#E5D9C9] bg-[#FAF7F2] text-[12px] font-medium tracking-[0.06em] text-[#7A685B] uppercase shadow-[0_6px_16px_-10px_rgba(64,49,40,0.14)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] hover:text-[#403128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-45 sm:h-[58px]"
                  >
                    Clear
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => handleDigitInput('0')}
                    disabled={isChecking || enteredDigits.length >= CODE_LENGTH}
                    whileHover={reduced || isChecking ? undefined : { y: -1 }}
                    whileTap={
                      reduced || isChecking ? undefined : { scale: 0.93 }
                    }
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-14 w-full touch-manipulation cursor-pointer items-center justify-center rounded-2xl border border-[#E5D9C9] bg-[#FDFBF7] text-[1.15rem] font-medium tabular-nums text-[#403128] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.2)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] active:bg-[#EFE6D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-60 sm:h-[58px]"
                  >
                    0
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleBackspace}
                    disabled={isChecking || enteredDigits.length === 0}
                    aria-label="Delete last digit"
                    whileTap={
                      reduced || isChecking || enteredDigits.length === 0
                        ? undefined
                        : { scale: 0.93 }
                    }
                    className="flex h-14 w-full touch-manipulation cursor-pointer items-center justify-center rounded-2xl border border-[#E5D9C9] bg-[#FAF7F2] text-[#7A685B] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.14)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] hover:text-[#403128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-45 sm:h-[58px]"
                  >
                    <Delete className="h-[18px] w-[18px] stroke-[1.75]" aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

          {/* CHALLENGE FAILED SCREEN (3 incorrect attempts) */}
          {phase === 'failed' && (
            <motion.section
              key={`challenge-failed-${challengeId}`}
              aria-labelledby="memory-failed-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[490px] flex-col items-center overflow-hidden rounded-3xl border border-[#DFD1BC] bg-[#FDFBF7]/95 px-7 py-11 text-center shadow-[0_28px_72px_-24px_rgba(64,49,40,0.16),0_10px_26px_-14px_rgba(161,140,119,0.16)] sm:px-12 sm:py-14"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-[#EFE6D9]"
              />

              <div className="relative z-10 flex flex-col items-center">
                <div
                  aria-hidden="true"
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#E4CBC4] bg-[#FAF0ED] text-[#8C4A3E]"
                >
                  <ShieldAlert className="h-5 w-5 stroke-[1.65]" />
                </div>

                <p className="text-[11px] font-medium tracking-[0.24em] text-[#A18C77] uppercase">
                  Challenge Failed
                </p>

                <h1
                  id="memory-failed-heading"
                  className="font-editorial mt-2.5 text-[clamp(1.95rem,4.4vw,2.55rem)] leading-[1.12] font-medium text-[#403128]"
                  style={{ textWrap: 'balance' }}
                >
                  Out of attempts
                </h1>

                <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-[#6E5D52]">
                  All three attempts were used for this code. Ready to try again
                  with a fresh six-digit number?
                </p>

                <motion.button
                  type="button"
                  onClick={startNewChallenge}
                  whileHover={reduced ? undefined : { y: -1.5 }}
                  whileTap={reduced ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 inline-flex min-h-[46px] min-w-[172px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#403128] px-7 py-3 text-[14.5px] font-medium tracking-[0.025em] text-[#FFFFFF] shadow-[0_10px_24px_-12px_rgba(64,49,40,0.45)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
                >
                  <RotateCcw className="h-4 w-4 stroke-[1.8]" aria-hidden="true" />
                  <span>Retry</span>
                </motion.button>
              </div>
            </motion.section>
          )}

          {/* TIME'S UP SCREEN (20-second timer expired) */}
          {phase === 'timeout' && (
            <motion.section
              key={`challenge-timeout-${challengeId}`}
              aria-labelledby="memory-timeout-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[490px] flex-col items-center overflow-hidden rounded-3xl border border-[#DFD1BC] bg-[#FDFBF7]/95 px-7 py-11 text-center shadow-[0_28px_72px_-24px_rgba(64,49,40,0.16),0_10px_26px_-14px_rgba(161,140,119,0.16)] sm:px-12 sm:py-14"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-[#EFE6D9]"
              />

              <div className="relative z-10 flex flex-col items-center">
                <div
                  aria-hidden="true"
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#E2D2BA] bg-[#F8F1E5] text-[#8E6F46]"
                >
                  <Clock className="h-5 w-5 stroke-[1.65]" />
                </div>

                <p className="text-[11px] font-medium tracking-[0.24em] text-[#A18C77] uppercase">
                  Timer Expired
                </p>

                <h1
                  id="memory-timeout-heading"
                  className="font-editorial mt-2.5 text-[clamp(1.95rem,4.4vw,2.55rem)] leading-[1.12] font-medium text-[#403128]"
                  style={{ textWrap: 'balance' }}
                >
                  Time&apos;s Up
                </h1>

                <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-[#6E5D52]">
                  The twenty-second timer ended before the code was completed.
                  Start a new round with a fresh number.
                </p>

                <motion.button
                  type="button"
                  onClick={startNewChallenge}
                  whileHover={reduced ? undefined : { y: -1.5 }}
                  whileTap={reduced ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 inline-flex min-h-[46px] min-w-[172px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#403128] px-7 py-3 text-[14.5px] font-medium tracking-[0.025em] text-[#FFFFFF] shadow-[0_10px_24px_-12px_rgba(64,49,40,0.45)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
                >
                  <RotateCcw className="h-4 w-4 stroke-[1.8]" aria-hidden="true" />
                  <span>Retry</span>
                </motion.button>
              </div>
            </motion.section>
          )}

          {/* SUCCESS SCREEN */}
          {phase === 'success' && (
            <motion.section
              key={`challenge-success-${challengeId}`}
              aria-labelledby="memory-success-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[520px] flex-col items-center overflow-hidden rounded-3xl border border-[#DCC8A8] bg-[#FDFBF7]/95 px-7 py-12 text-center shadow-[0_28px_76px_-22px_rgba(142,111,70,0.22),0_10px_28px_-14px_rgba(64,49,40,0.12)] sm:px-12 sm:py-16"
            >
              {/* Soft golden radial aura */}
              <motion.div
                aria-hidden="true"
                initial={reduced ? { opacity: 0.5 } : { opacity: 0, scale: 0.75 }}
                animate={{ opacity: 0.65, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(220, 189, 134, 0.35) 0%, rgba(248, 245, 239, 0) 72%)',
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-[#EDE1CD]"
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Animated success seal */}
                <motion.div
                  initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 18,
                    delay: reduced ? 0 : 0.08,
                  }}
                  className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A978] bg-[#F7EFE1] text-[#8E6F46] shadow-[0_12px_28px_-12px_rgba(142,111,70,0.38)]"
                >
                  {!reduced && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scale: 0.9, opacity: 0.7 }}
                      animate={{ scale: 1.55, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute inset-0 rounded-full border border-[#C9A978]"
                    />
                  )}
                  <Check className="h-7 w-7 stroke-[2]" aria-hidden="true" />
                </motion.div>

                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: reduced ? 0 : 0.22 }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.24em] text-[#A18C77] uppercase"
                >
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[1.75]" aria-hidden="true" />
                  <span>Access Granted</span>
                </motion.div>

                <motion.div
                  aria-hidden="true"
                  initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: reduced ? 0 : 0.32 }}
                  className="mt-4 h-px w-14 bg-gradient-to-r from-[#DFD2C0] via-[#C3A474] to-[#DFD2C0]"
                />

                <motion.h1
                  id="memory-success-heading"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: reduced ? 0 : 0.42,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-editorial mt-6 max-w-[22ch] text-[clamp(1.75rem,4.2vw,2.45rem)] leading-[1.2] font-medium tracking-[-0.015em] text-[#403128]"
                  style={{ textWrap: 'balance' }}
                >
                  Correct! You&apos;ve unlocked the next surprise...
                </motion.h1>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
