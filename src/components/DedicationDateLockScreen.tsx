import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface DedicationDateLockScreenProps {
  onLock: () => void;
  onUnlock: () => void;
  onBack?: () => void;
}

const ACCEPTED_DEDICATION_DATES = new Set([
  '21 november 2026',
  '21st november 2026',
  '21 nov 2026',
  '21st nov 2026',
  '21/11/2026',
  '21-11-2026',
  '21.11.2026',
]);

function isCorrectDedicationDate(raw: string): boolean {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return false;
  return ACCEPTED_DEDICATION_DATES.has(normalized);
}

function CornerFiligree({
  positionClass,
  flipX = false,
  flipY = false,
}: {
  positionClass: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 42 42"
      fill="none"
      className={`pointer-events-none absolute h-7 w-7 text-[#C49E5A] opacity-65 sm:h-8 sm:w-8 ${positionClass} ${
        flipX ? '-scale-x-100' : ''
      } ${flipY ? '-scale-y-100' : ''}`}
    >
      <path
        d="M3 26 L3 8 C3 5, 5 3, 8 3 L26 3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M7 18 C7 11.5, 11.5 7, 18 7"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="1.35" fill="currentColor" />
      <circle cx="29.5" cy="3" r="1.1" fill="currentColor" fillOpacity="0.7" />
      <circle cx="3" cy="29.5" r="1.1" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function VintageLockEmblem({
  isUnlocking,
  reduced,
}: {
  isUnlocking: boolean;
  reduced: boolean;
}) {
  const uid = useId().replace(/:/g, '');

  return (
    <div className="relative flex items-center justify-center">
      {/* Subtle champagne-gold glow */}
      <motion.div
        aria-hidden="true"
        animate={
          isUnlocking
            ? { opacity: 0.95, scale: reduced ? 1 : 1.24 }
            : { opacity: 0.45, scale: 1 }
        }
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute h-28 w-28 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(226, 192, 132, 0.56) 0%, rgba(252, 247, 236, 0) 72%)',
        }}
      />

      {!reduced && isUnlocking && (
        <motion.span
          aria-hidden="true"
          initial={{ scale: 0.72, opacity: 0.85 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute h-20 w-20 rounded-full border border-[#C6A163]"
        />
      )}

      <svg
        aria-hidden="true"
        viewBox="0 0 96 108"
        fill="none"
        className="relative z-10 h-20 w-[72px] drop-shadow-[0_10px_16px_rgba(88,63,38,0.2)] sm:h-24 sm:w-[86px]"
      >
        <defs>
          <linearGradient
            id={`dedShackle-${uid}`}
            x1="28"
            y1="10"
            x2="68"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F4E0B6" />
            <stop offset="48%" stopColor="#C8A058" />
            <stop offset="100%" stopColor="#8E672B" />
          </linearGradient>
          <linearGradient
            id={`dedBody-${uid}`}
            x1="18"
            y1="42"
            x2="78"
            y2="98"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F8E9CA" />
            <stop offset="38%" stopColor="#E0C38B" />
            <stop offset="82%" stopColor="#C09752" />
            <stop offset="100%" stopColor="#9A7234" />
          </linearGradient>
          <radialGradient
            id={`dedKeyholeGlow-${uid}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFF8DE" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#E4BD70" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.g
          animate={
            isUnlocking
              ? reduced
                ? { y: -4 }
                : { y: -7, rotate: -19 }
              : { y: 0, rotate: 0 }
          }
          transition={{ type: 'spring', stiffness: 205, damping: 16 }}
          style={{ transformOrigin: '64px 44px' }}
        >
          <path
            d="M31 48 V32 C31 20.5, 39 13, 48 13 C57 13, 65 20.5, 65 32 V48"
            stroke={`url(#dedShackle-${uid})`}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M31 46 V32 C31 20.5, 39 13, 48 13 C57 13, 65 20.5, 65 32 V46"
            stroke="#5A3E24"
            strokeOpacity="0.65"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M34.5 34 C34.5 23, 40.5 16.5, 48 16.5"
            stroke="#FFF8E2"
            strokeOpacity="0.72"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>

        <rect
          x="20"
          y="44"
          width="56"
          height="50"
          rx="11"
          fill={`url(#dedBody-${uid})`}
          stroke="#6A4A28"
          strokeWidth="1.5"
        />
        <rect
          x="25.5"
          y="49.5"
          width="45"
          height="39"
          rx="7"
          stroke="#7A5731"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="2.5 2"
        />
        <path
          d="M28 46.8 H68"
          stroke="#FFF7DF"
          strokeOpacity="0.72"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="29" cy="53" r="1.35" fill="#7D5A33" />
        <circle cx="67" cy="53" r="1.35" fill="#7D5A33" />
        <circle cx="29" cy="85" r="1.35" fill="#7D5A33" />
        <circle cx="67" cy="85" r="1.35" fill="#7D5A33" />

        {isUnlocking && (
          <circle
            cx="48"
            cy="68"
            r="14"
            fill={`url(#dedKeyholeGlow-${uid})`}
          />
        )}

        <circle
          cx="48"
          cy="68.5"
          r="10.5"
          fill="#FAF0D8"
          fillOpacity="0.5"
          stroke="#7C5832"
          strokeWidth="1"
        />
        <path
          d="M48 61.5 C45.2 61.5, 43.2 63.6, 43.2 66.2 C43.2 68.1, 44.3 69.7, 45.8 70.4 L44.7 77 H51.3 L50.2 70.4 C51.7 69.7, 52.8 68.1, 52.8 66.2 C52.8 63.6, 50.8 61.5, 48 61.5 Z"
          fill={isUnlocking ? '#8A6329' : '#3E281A'}
        />
      </svg>
    </div>
  );
}

export function DedicationDateLockScreen({
  onLock,
  onUnlock,
  onBack,
}: DedicationDateLockScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const grainId = useId().replace(/:/g, '');
  const inputId = useId();

  const [dateInput, setDateInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [shakeTick, setShakeTick] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const unlockTimerRef = useRef<number | null>(null);
  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;

  const clearUnlockTimer = useCallback(() => {
    if (unlockTimerRef.current !== null) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearUnlockTimer();
    };
  }, [clearUnlockTimer]);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, reduced ? 40 : 280);
    return () => window.clearTimeout(focusTimer);
  }, [reduced]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUnlocking) return;

    if (isCorrectDedicationDate(dateInput)) {
      setHasError(false);
      setIsUnlocking(true);
      unlockTimerRef.current = window.setTimeout(
        () => {
          unlockTimerRef.current = null;
          onUnlockRef.current();
        },
        reduced ? 450 : 1050
      );
      return;
    }

    setHasError(true);
    setShakeTick((prev) => prev + 1);
    inputRef.current?.focus();
  };

  return (
    <motion.div
      key="dedication-date-lock-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden text-[#3E2C21]"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #F6EFE2 0%, #EFE2CD 54%, #E6D3B6 100%)',
      }}
    >
      {/* Subtle parchment texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.036] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='dedLockGrain-${grainId}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23dedLockGrain-${grainId})'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft warm ivory lighting & delicate vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255, 250, 236, 0.65) 0%, rgba(244, 224, 186, 0.18) 44%, rgba(210, 182, 142, 0.34) 100%)',
          boxShadow: 'inset 0 0 110px rgba(172, 138, 96, 0.28)',
        }}
      />

      {/* Minimal Top Navigation */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 pt-5 pb-2 sm:px-10 sm:pt-7">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={() => {
                clearUnlockTimer();
                onBack();
              }}
              className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-[#6B5442] transition-colors duration-150 hover:text-[#2D2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89048]/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Last Page</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered Vintage Lock Card */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 pt-4 pb-12 sm:px-10 sm:pb-16">
        <motion.section
          aria-labelledby="dedication-lock-heading"
          initial={
            reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex w-full max-w-[500px] flex-col items-center rounded-[12px] border border-[#C6A774]/45 bg-[#FCF7EC]/78 px-7 py-12 text-center shadow-[0_24px_54px_-24px_rgba(88,63,38,0.22),inset_0_0_36px_rgba(244,228,196,0.4)] backdrop-blur-[2px] sm:max-w-[540px] sm:px-12 sm:py-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[8px] border border-[#C6A774]/26 sm:inset-3.5"
          />

          <CornerFiligree positionClass="top-3.5 left-3.5 sm:top-4.5 sm:left-4.5" />
          <CornerFiligree
            positionClass="top-3.5 right-3.5 sm:top-4.5 sm:right-4.5"
            flipX
          />
          <CornerFiligree
            positionClass="bottom-3.5 left-3.5 sm:bottom-4.5 sm:left-4.5"
            flipY
          />
          <CornerFiligree
            positionClass="bottom-3.5 right-3.5 sm:bottom-4.5 sm:right-4.5"
            flipX
            flipY
          />

          <div className="relative z-10 flex w-full flex-col items-center">
            <VintageLockEmblem isUnlocking={isUnlocking} reduced={reduced} />

            {/* Thin antique gold divider */}
            <div
              aria-hidden="true"
              className="mt-5 flex items-center justify-center gap-3"
            >
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C39D5F]/75 sm:w-16" />
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5 L9.4 6.6 L14.5 8 L9.4 9.4 L8 14.5 L6.6 9.4 L1.5 8 L6.6 6.6 Z"
                  fill="#C59F5F"
                  fillOpacity="0.82"
                />
              </svg>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C39D5F]/75 sm:w-16" />
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-5 w-full max-w-[340px]"
            >
              <label
                id="dedication-lock-heading"
                htmlFor={inputId}
                className="font-editorial block text-[clamp(1.7rem,4vw,2.25rem)] leading-[1.2] font-medium text-[#3A291F]"
                style={{ textWrap: 'balance' }}
              >
                Enter today&apos;s date.
              </label>

              <motion.div
                animate={
                  shakeTick > 0 && !reduced
                    ? { x: [0, -7, 7, -5, 5, -2, 2, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="mt-6"
              >
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  value={dateInput}
                  onChange={(e) => {
                    setDateInput(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  disabled={isUnlocking}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Enter date…"
                  aria-invalid={hasError}
                  className={`font-editorial w-full rounded-[8px] border bg-[#FFFDF8] px-4 py-3 text-center text-[1.2rem] text-[#3A291F] placeholder:italic placeholder:text-[#AE987F] shadow-[inset_0_1px_4px_rgba(88,63,38,0.06)] transition-all duration-200 focus:outline-none sm:py-3.5 sm:text-[1.28rem] ${
                    isUnlocking
                      ? 'border-[#B88946] bg-[#FAF2DF] text-[#4E3824]'
                      : hasError
                        ? 'border-[#C18976] focus:border-[#A86D59] focus:ring-2 focus:ring-[#C18976]/25'
                        : 'border-[#D5C09F] focus:border-[#B88946] focus:ring-2 focus:ring-[#C8A464]/25'
                  }`}
                />
              </motion.div>

              <div
                className="mt-3 flex min-h-[28px] items-center justify-center"
                aria-live="polite"
              >
                <AnimatePresence mode="wait">
                  {isUnlocking ? (
                    <motion.p
                      key="date-unlocked"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center gap-1.5 font-editorial text-[1.04rem] italic text-[#7B5A2C]"
                    >
                      <Check
                        className="h-4 w-4 stroke-[2.2]"
                        aria-hidden="true"
                      />
                      <span>Unlocked</span>
                    </motion.p>
                  ) : hasError ? (
                    <motion.p
                      key={`date-error-${shakeTick}`}
                      role="alert"
                      initial={{ opacity: 0, y: -3 }}
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

              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="inline-flex min-h-[44px] min-w-[176px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#E7D8C0]/45 bg-[#3E2B1E] px-7 py-2.5 text-[13.5px] font-medium tracking-[0.03em] text-[#FAF3EA] shadow-[0_12px_24px_-12px_rgba(88,63,38,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2F2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7EC] disabled:cursor-default disabled:opacity-65 disabled:hover:translate-y-0"
                >
                  <span>{isUnlocking ? 'Opening…' : 'Continue'}</span>
                  {!isUnlocking && (
                    <ArrowRight
                      className="h-3.5 w-3.5 stroke-[1.9]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}
