import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PERSONAL_MESSAGE_CONFIG } from '../config/personalMessage';

interface PersonalMessageScreenProps {
  onLock: () => void;
  onBack?: () => void;
  onContinue?: () => void;
}

export function PersonalMessageScreen({
  onLock,
  onBack,
  onContinue,
}: PersonalMessageScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);

  const [lines, setLines] = useState<string[]>([
    ...PERSONAL_MESSAGE_CONFIG.lines,
  ]);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(() =>
    PERSONAL_MESSAGE_CONFIG.lines.join('\n')
  );
  const [awaitingNextScreenNote, setAwaitingNextScreenNote] = useState(false);

  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Line-by-line fade-up choreography (~1.75s cadence) + pause before Continue
  useEffect(() => {
    if (isEditing) return;

    clearTimers();

    if (lines.length === 0) {
      setVisibleCount(0);
      setShowContinue(true);
      return;
    }

    if (reduced) {
      setVisibleCount(lines.length);
      setShowContinue(true);
      return;
    }

    setVisibleCount(0);
    setShowContinue(false);

    const initialStartDelay = 650;
    const interval = PERSONAL_MESSAGE_CONFIG.lineIntervalMs;

    lines.forEach((_, idx) => {
      const id = window.setTimeout(() => {
        setVisibleCount(idx + 1);
      }, initialStartDelay + idx * interval);
      timersRef.current.push(id);
    });

    const finalPauseTimer = window.setTimeout(
      () => {
        setShowContinue(true);
      },
      initialStartDelay +
        (lines.length - 1) * interval +
        PERSONAL_MESSAGE_CONFIG.finalPauseMs
    );
    timersRef.current.push(finalPauseTimer);

    return () => {
      clearTimers();
    };
  }, [clearTimers, isEditing, lines, reduced]);

  const handleSaveLines = useCallback(() => {
    const parsed = draftText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    setLines(parsed.length > 0 ? parsed : [...PERSONAL_MESSAGE_CONFIG.lines]);
    setIsEditing(false);
    setAwaitingNextScreenNote(false);
  }, [draftText]);

  const handleContinueClick = useCallback(() => {
    if (onContinue) {
      onContinue();
    } else {
      setAwaitingNextScreenNote(true);
    }
  }, [onContinue]);

  return (
    <motion.div
      key="personal-message-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#F8F5EF] text-[#403128]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 38%, rgba(243, 237, 228, 0.8) 0%, rgba(248, 245, 239, 0.98) 74%)',
      }}
    >
      {/* Subtle organic paper grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='personalMessagePaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23personalMessagePaper)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Minimal Header */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-6 pt-5 pb-2 sm:px-10 sm:pt-7">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                clearTimers();
                onBack();
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#7A685B] transition-colors duration-150 hover:text-[#403128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77]/40 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Memories</span>
            </button>
          )}
        </div>
      </header>

      {/* Spacious Cinematic Editorial Stage */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
        <section
          aria-labelledby="personal-message-heading"
          className="mx-auto flex w-full max-w-[660px] flex-col items-center text-center"
        >
          {/* Small heading */}
          <motion.h1
            id="personal-message-heading"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-[clamp(1.35rem,2.8vw,1.75rem)] italic font-normal tracking-[0.01em] text-[#8E7561]"
            style={{ textWrap: 'balance' }}
          >
            {PERSONAL_MESSAGE_CONFIG.heading}
          </motion.h1>

          {/* Muted champagne-gold hairline accent */}
          <motion.div
            aria-hidden="true"
            initial={reduced ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.3 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: reduced ? 0 : 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 h-px w-16 origin-center bg-gradient-to-r from-transparent via-[#C2A376] to-transparent"
          />

          {/* Line-by-Line Personal Message */}
          {isEditing ? (
            <div className="mt-9 w-full max-w-[560px] rounded-2xl border border-[#E5D9C9] bg-[#FDFBF7] p-6 text-left shadow-[0_20px_50px_-24px_rgba(64,49,40,0.12)] sm:p-8">
              <label
                htmlFor="personal-message-editor"
                className="mb-2 block text-[12.5px] font-medium text-[#7A685B]"
              >
                Edit message lines (one line per sentence or thought):
              </label>
              <textarea
                id="personal-message-editor"
                rows={7}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="font-editorial w-full rounded-xl border border-[#DFD2C0] bg-[#FAF7F2] p-4 text-[1.25rem] leading-[1.7] text-[#403128] focus:border-[#A18C77] focus:bg-white focus:outline-none"
              />
              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDraftText(lines.join('\n'));
                    setIsEditing(false);
                  }}
                  className="min-h-[40px] cursor-pointer rounded-lg px-4 py-2 text-[13px] font-medium text-[#7A685B] transition-colors hover:text-[#403128]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLines}
                  className="min-h-[40px] cursor-pointer rounded-lg border border-[#D8CBB8] bg-[#F3EDE4] px-5 py-2 text-[13px] font-medium text-[#403128] transition-colors hover:bg-[#EAE1D4]"
                >
                  Save &amp; Replay
                </button>
              </div>
            </div>
          ) : (
            <div
              className="mt-10 flex w-full flex-col items-center space-y-6 sm:mt-12 sm:space-y-7"
              aria-live="polite"
            >
              {lines.map((line, index) => {
                const isVisible = index < visibleCount;
                return (
                  <motion.p
                    key={`${index}-${line.slice(0, 16)}`}
                    initial={false}
                    animate={
                      isVisible
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: reduced ? 0 : 14 }
                    }
                    transition={{
                      duration: reduced ? 0.2 : 0.95,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`font-editorial max-w-[34ch] text-[clamp(1.42rem,3.3vw,2.05rem)] leading-[1.52] font-normal tracking-[-0.01em] text-[#403128] ${
                      isVisible ? 'pointer-events-auto' : 'pointer-events-none select-none'
                    }`}
                  >
                    {line}
                  </motion.p>
                );
              })}
            </div>
          )}

          {/* Subtle Continue Button & Discreet Edit Option (revealed after final pause) */}
          <AnimatePresence>
            {showContinue && !isEditing && (
              <motion.div
                key="personal-message-actions"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 flex flex-col items-center gap-4 sm:mt-14"
              >
                <div
                  aria-hidden="true"
                  className="mb-2 h-px w-10 bg-[#DFD2C0]"
                />

                <motion.button
                  type="button"
                  onClick={handleContinueClick}
                  whileHover={reduced ? undefined : { y: -1.5 }}
                  whileTap={reduced ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex min-h-[46px] min-w-[172px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#403128] px-7 py-3 text-[14.5px] font-medium tracking-[0.025em] text-[#FFFFFF] shadow-[0_10px_24px_-12px_rgba(64,49,40,0.42)] transition-colors duration-200 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] whitespace-nowrap shrink-0"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
                </motion.button>

                {awaitingNextScreenNote && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-editorial text-[1.1rem] italic text-[#8E7561]"
                  >
                    The next birthday surprise will open here ♡
                  </motion.p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setDraftText(lines.join('\n'));
                    setIsEditing(true);
                  }}
                  className="min-h-[36px] cursor-pointer text-[12px] font-medium text-[#9A8472] underline decoration-[#DFD2C0] underline-offset-4 transition-colors hover:text-[#403128]"
                >
                  Edit message lines
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </motion.div>
  );
}
