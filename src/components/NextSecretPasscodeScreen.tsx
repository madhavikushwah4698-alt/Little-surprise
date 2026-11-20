import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Delete, Lock } from 'lucide-react';

interface NextSecretPasscodeScreenProps {
  onSuccess: () => void;
}

const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const WRONG_PASSCODE_MESSAGE =
  "Oops! That's not the right passcode. Try again ♡";

type DigitStatus = 'empty' | 'checking' | 'valid' | 'invalid';

export function NextSecretPasscodeScreen({
  onSuccess,
}: NextSecretPasscodeScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [slots, setSlots] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [slotStatuses, setSlotStatuses] = useState<
    [DigitStatus, DigitStatus, DigitStatus, DigitStatus]
  >(['empty', 'empty', 'empty', 'empty']);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shakeTick, setShakeTick] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const slotsRef = useRef<[string, string, string, string]>(['', '', '', '']);
  const slotStatusesRef = useRef<
    [DigitStatus, DigitStatus, DigitStatus, DigitStatus]
  >(['empty', 'empty', 'empty', 'empty']);
  const slotRequestTokensRef = useRef<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const timersRef = useRef<number[]>([]);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const verifyPasscode = useCallback(
    async (candidate: string) => {
      if (isVerifying || isSuccess || hasCompletedRef.current) {
        return;
      }
      setIsVerifying(true);
      setError(null);

      try {
        const response = await fetch('/api/verify-next-secret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: candidate }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { ok: true }
          | { ok: false; error?: string }
          | null;

        if (response.ok && payload && payload.ok) {
          setIsSuccess(true);
          const id = window.setTimeout(() => {
            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true;
              onSuccess();
            }
          }, prefersReducedMotion ? 400 : 850);
          timersRef.current.push(id);
          return;
        }

        const emptySlots: [string, string, string, string] = ['', '', '', ''];
        const emptyStatuses: [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ] = ['empty', 'empty', 'empty', 'empty'];
        slotsRef.current = emptySlots;
        slotStatusesRef.current = emptyStatuses;
        slotRequestTokensRef.current = [
          slotRequestTokensRef.current[0] + 1,
          slotRequestTokensRef.current[1] + 1,
          slotRequestTokensRef.current[2] + 1,
          slotRequestTokensRef.current[3] + 1,
        ];
        setSlots(emptySlots);
        setSlotStatuses(emptyStatuses);
        setSelectedSlot(null);
        setError(
          payload && !payload.ok && payload.error
            ? payload.error
            : WRONG_PASSCODE_MESSAGE
        );
        setShakeTick((prev) => prev + 1);
      } catch {
        const emptySlots: [string, string, string, string] = ['', '', '', ''];
        const emptyStatuses: [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ] = ['empty', 'empty', 'empty', 'empty'];
        slotsRef.current = emptySlots;
        slotStatusesRef.current = emptyStatuses;
        setSlots(emptySlots);
        setSlotStatuses(emptyStatuses);
        setSelectedSlot(null);
        setError(WRONG_PASSCODE_MESSAGE);
        setShakeTick((prev) => prev + 1);
      } finally {
        setIsVerifying(false);
      }
    },
    [isSuccess, isVerifying, onSuccess, prefersReducedMotion]
  );

  const validateDigitAtSlot = useCallback(
    async (slotIndex: number, digit: string, requestToken: number) => {
      try {
        const response = await fetch('/api/verify-next-secret-digit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index: slotIndex, digit }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { ok: true; valid: boolean }
          | { ok: false }
          | null;

        if (
          slotRequestTokensRef.current[slotIndex] !== requestToken ||
          slotsRef.current[slotIndex] !== digit
        ) {
          return;
        }

        const isValidDigit = Boolean(
          response.ok && payload && 'valid' in payload && payload.valid
        );

        const nextStatuses = [...slotStatusesRef.current] as [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ];
        nextStatuses[slotIndex] = isValidDigit ? 'valid' : 'invalid';
        slotStatusesRef.current = nextStatuses;
        setSlotStatuses(nextStatuses);

        if (!isValidDigit) {
          setShakeTick((prev) => prev + 1);
          return;
        }

        if (
          slotsRef.current.every((d) => d.length === 1) &&
          slotStatusesRef.current.every((s) => s === 'valid')
        ) {
          void verifyPasscode(slotsRef.current.join(''));
        }
      } catch {
        if (
          slotRequestTokensRef.current[slotIndex] !== requestToken ||
          slotsRef.current[slotIndex] !== digit
        ) {
          return;
        }
        const nextStatuses = [...slotStatusesRef.current] as [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ];
        nextStatuses[slotIndex] = 'invalid';
        slotStatusesRef.current = nextStatuses;
        setSlotStatuses(nextStatuses);
        setShakeTick((prev) => prev + 1);
      }
    },
    [verifyPasscode]
  );

  const handleDigitInput = useCallback(
    (digit: string) => {
      if (isVerifying || isSuccess || !/^[0-9]$/.test(digit)) {
        return;
      }

      if (error) {
        setError(null);
      }

      const targetIndex =
        selectedSlot !== null
          ? selectedSlot
          : slotsRef.current.findIndex((d) => d === '');

      if (targetIndex < 0 || targetIndex >= 4) {
        return;
      }

      const nextSlots = [...slotsRef.current] as [
        string,
        string,
        string,
        string,
      ];
      nextSlots[targetIndex] = digit;
      slotsRef.current = nextSlots;
      setSlots(nextSlots);

      const nextStatuses = [...slotStatusesRef.current] as [
        DigitStatus,
        DigitStatus,
        DigitStatus,
        DigitStatus,
      ];
      nextStatuses[targetIndex] = 'checking';
      slotStatusesRef.current = nextStatuses;
      setSlotStatuses(nextStatuses);

      setSelectedSlot(null);

      const nextToken = slotRequestTokensRef.current[targetIndex] + 1;
      slotRequestTokensRef.current[targetIndex] = nextToken;
      void validateDigitAtSlot(targetIndex, digit, nextToken);
    },
    [error, isSuccess, isVerifying, selectedSlot, validateDigitAtSlot]
  );

  const clearSlotAt = useCallback((slotIndex: number) => {
    const nextSlots = [...slotsRef.current] as [string, string, string, string];
    nextSlots[slotIndex] = '';
    slotsRef.current = nextSlots;
    setSlots(nextSlots);

    slotRequestTokensRef.current[slotIndex] += 1;

    const nextStatuses = [...slotStatusesRef.current] as [
      DigitStatus,
      DigitStatus,
      DigitStatus,
      DigitStatus,
    ];
    nextStatuses[slotIndex] = 'empty';
    slotStatusesRef.current = nextStatuses;
    setSlotStatuses(nextStatuses);
  }, []);

  const handleBackspace = useCallback(() => {
    if (isVerifying || isSuccess) {
      return;
    }
    if (error) {
      setError(null);
    }

    if (selectedSlot !== null) {
      if (slotsRef.current[selectedSlot] !== '') {
        clearSlotAt(selectedSlot);
        return;
      }
      if (selectedSlot > 0 && slotsRef.current[selectedSlot - 1] !== '') {
        clearSlotAt(selectedSlot - 1);
        setSelectedSlot(selectedSlot - 1);
        return;
      }
    }

    let lastFilledIndex = -1;
    for (let i = 3; i >= 0; i -= 1) {
      if (slotsRef.current[i] !== '') {
        lastFilledIndex = i;
        break;
      }
    }

    if (lastFilledIndex >= 0) {
      clearSlotAt(lastFilledIndex);
      setSelectedSlot(null);
    }
  }, [clearSlotAt, error, isSuccess, isVerifying, selectedSlot]);

  const handleClearRetry = useCallback(() => {
    if (isVerifying || isSuccess) return;
    const emptySlots: [string, string, string, string] = ['', '', '', ''];
    const emptyStatuses: [DigitStatus, DigitStatus, DigitStatus, DigitStatus] =
      ['empty', 'empty', 'empty', 'empty'];
    slotsRef.current = emptySlots;
    slotStatusesRef.current = emptyStatuses;
    slotRequestTokensRef.current = [
      slotRequestTokensRef.current[0] + 1,
      slotRequestTokensRef.current[1] + 1,
      slotRequestTokensRef.current[2] + 1,
      slotRequestTokensRef.current[3] + 1,
    ];
    setSlots(emptySlots);
    setSlotStatuses(emptyStatuses);
    setSelectedSlot(null);
    setError(null);
  }, [isSuccess, isVerifying]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        handleDigitInput(event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleClearRetry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleClearRetry, handleDigitInput]);

  const filledCount = slots.filter((d) => d !== '').length;
  const firstEmptyIndex = slots.findIndex((d) => d === '');
  const hasInvalidDigit = slotStatuses.some((status) => status === 'invalid');
  const hasValidSoFar =
    !hasInvalidDigit &&
    filledCount > 0 &&
    slotStatuses.some((status) => status === 'valid');

  return (
    <motion.main
      key="next-secret-passcode-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.99,
        transition: {
          duration: prefersReducedMotion ? 0.15 : 0.55,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-[#F8F5EF] px-5 py-10 text-[#403128] sm:px-8 sm:py-14"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 42%, rgba(243, 237, 228, 0.78) 0%, rgba(248, 245, 239, 0.98) 72%)',
      }}
    >
      {/* Subtle organic paper grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nextPasscodePaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nextPasscodePaper)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.section
        aria-labelledby="next-secret-passcode-heading"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-[460px] flex-col items-center rounded-3xl border border-[#E5D9C9] bg-[#FDFBF7]/90 px-7 py-9 text-center shadow-[0_24px_60px_-24px_rgba(64,49,40,0.12)] sm:px-11 sm:py-11"
      >
        <div
          aria-hidden="true"
          className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#E5D9C9] bg-[#F5EFE6] text-[#5C493E]"
        >
          <Lock className="h-4 w-4 stroke-[1.6]" />
        </div>

        <h1
          id="next-secret-passcode-heading"
          className="font-editorial text-[clamp(1.95rem,4vw,2.55rem)] leading-[1.14] font-medium tracking-[-0.015em] text-[#403128]"
          style={{ textWrap: 'balance' }}
        >
          One more little secret...
        </h1>

        <p className="mt-2.5 max-w-[34ch] text-[15px] leading-relaxed text-[#7A685B] sm:text-[15.5px]">
          Enter the next secret passcode
        </p>

        {/* Four Digit Indicators */}
        <motion.div
          animate={
            shakeTick > 0 && !prefersReducedMotion
              ? { x: [0, -7, 7, -5, 5, -2, 2, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.36, ease: 'easeOut' }}
          className="mt-7 flex items-center justify-center gap-3 sm:gap-3.5"
          role="group"
          aria-label="Four-digit passcode entry"
        >
          {[0, 1, 2, 3].map((slotIndex) => {
            const char = slots[slotIndex];
            const status = slotStatuses[slotIndex];
            const isFilled = Boolean(char);
            const isActiveSlot =
              !isSuccess &&
              !isVerifying &&
              (selectedSlot !== null
                ? selectedSlot === slotIndex
                : firstEmptyIndex === slotIndex);

            return (
              <button
                key={slotIndex}
                type="button"
                disabled={isVerifying || isSuccess}
                onClick={() =>
                  setSelectedSlot((prev) =>
                    prev === slotIndex ? null : slotIndex
                  )
                }
                aria-label={
                  isFilled
                    ? `Digit ${slotIndex + 1}, ${char}${status === 'invalid' ? ', incorrect' : ''}`
                    : `Digit ${slotIndex + 1}, empty`
                }
                aria-invalid={status === 'invalid'}
                className={`flex h-14 w-12 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default sm:h-[60px] sm:w-[54px] ${
                  isSuccess
                    ? 'border-[#C2A376] bg-[#F5EFE6] shadow-[0_0_0_2px_rgba(194,163,118,0.22)]'
                    : status === 'invalid'
                      ? `border-[#C97165] bg-[#FDF1EF] shadow-[0_0_0_2px_rgba(201,113,101,0.18)] ${
                          isActiveSlot ? 'ring-2 ring-[#C97165]/35' : ''
                        }`
                      : status === 'valid'
                        ? `border-[#9DB091] bg-[#F7FAF5] ${
                            isActiveSlot
                              ? 'shadow-[0_0_0_2px_rgba(157,176,145,0.28)]'
                              : ''
                          }`
                        : error && !isFilled
                          ? 'border-[#C98B7C] bg-[#FAF7F2]'
                          : isActiveSlot
                            ? 'border-[#A18C77] bg-[#FFFFFF] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.22)]'
                            : isFilled
                              ? 'border-[#C2A376] bg-[#FFFFFF]'
                              : 'border-[#E5D9C9] bg-[#FAF7F2]'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isFilled ? (
                    <motion.span
                      key={`digit-${slotIndex}-${char}`}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, scale: 0.75 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      transition={{ duration: 0.14 }}
                      className={`font-editorial text-[1.65rem] font-medium tabular-nums transition-colors ${
                        status === 'invalid' ? 'text-[#963B30]' : 'text-[#403128]'
                      }`}
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
              </button>
            );
          })}
        </motion.div>

        {/* Status / Feedback Area */}
        <div className="mt-3.5 min-h-[28px]" aria-live="polite">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.p
                key="next-passcode-success"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 font-editorial text-[1.2rem] italic text-[#8E6F46]"
              >
                <Check className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                <span>Unlocked ♡</span>
              </motion.p>
            ) : hasInvalidDigit ? (
              <motion.p
                key="next-passcode-digit-error"
                role="alert"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-[13.5px] font-medium leading-snug text-[#963B30]"
              >
                Incorrect digit. Try again.
              </motion.p>
            ) : error ? (
              <motion.div
                key={`next-passcode-error-${shakeTick}`}
                role="alert"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-1"
              >
                <p className="text-[13.5px] leading-snug text-[#8C4A3E]">
                  {error}
                </p>
              </motion.div>
            ) : hasValidSoFar ? (
              <motion.p
                key="next-passcode-digit-valid"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#667859]"
              >
                <Check className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                <span>Correct so far</span>
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Circular Numeric Keypad */}
        <div
          className="mt-4 grid w-full max-w-[236px] grid-cols-3 justify-items-center gap-3 sm:max-w-[252px] sm:gap-3.5"
          role="group"
          aria-label="Numeric keypad"
        >
          {KEYPAD_DIGITS.map((digit) => (
            <motion.button
              key={digit}
              type="button"
              onClick={() => handleDigitInput(digit)}
              disabled={isVerifying || isSuccess}
              whileHover={
                prefersReducedMotion || isVerifying || isSuccess
                  ? undefined
                  : { y: -1 }
              }
              whileTap={
                prefersReducedMotion || isVerifying || isSuccess
                  ? undefined
                  : { scale: 0.93 }
              }
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#E5D9C9] bg-[#FDFBF7] text-[1.1rem] font-medium tabular-nums text-[#403128] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.22)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-65 sm:h-[60px] sm:w-[60px]"
            >
              {digit}
            </motion.button>
          ))}

          {/* Bottom Row: Spacer, 0, Backspace */}
          <div aria-hidden="true" className="h-14 w-14 sm:h-[60px] sm:w-[60px]" />

          <motion.button
            type="button"
            onClick={() => handleDigitInput('0')}
            disabled={isVerifying || isSuccess}
            whileHover={
              prefersReducedMotion || isVerifying || isSuccess
                ? undefined
                : { y: -1 }
            }
            whileTap={
              prefersReducedMotion || isVerifying || isSuccess
                ? undefined
                : { scale: 0.93 }
            }
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#E5D9C9] bg-[#FDFBF7] text-[1.1rem] font-medium tabular-nums text-[#403128] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.22)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-65 sm:h-[60px] sm:w-[60px]"
          >
            0
          </motion.button>

          <motion.button
            type="button"
            onClick={handleBackspace}
            disabled={isVerifying || isSuccess || filledCount === 0}
            aria-label="Delete last digit"
            whileHover={
              prefersReducedMotion || isVerifying || isSuccess || filledCount === 0
                ? undefined
                : { y: -1 }
            }
            whileTap={
              prefersReducedMotion || isVerifying || isSuccess || filledCount === 0
                ? undefined
                : { scale: 0.93 }
            }
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#E5D9C9] bg-[#FAF7F2] text-[#7A685B] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.16)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] hover:text-[#403128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-45 sm:h-[60px] sm:w-[60px]"
          >
            <Delete className="h-[18px] w-[18px] stroke-[1.75]" aria-hidden="true" />
          </motion.button>
        </div>
      </motion.section>
    </motion.main>
  );
}
