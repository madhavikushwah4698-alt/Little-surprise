import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import {
  NO_CLICKS_FOR_FINAL_WISH,
  YOUR_WHATSAPP_NUMBER,
  buildWhatsAppClickToChatUrl,
} from '../config/endingQuestion';

interface EndingQuestionScreenProps {
  onLock: () => void;
  onBack?: () => void;
}

interface EscapePositionState {
  originLeft: number;
  originTop: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
}

interface RectBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

type ReactionEffect =
  | 'heart-bloom'
  | 'button-tilt'
  | 'sparkle-arc'
  | 'petal-drift'
  | 'ribbon-trace'
  | 'warm-halo'
  | 'divider-shimmer'
  | 'ripple-rings'
  | 'starlight-trio'
  | 'champagne-drift';

interface NoReaction {
  id: string;
  message: string;
  effect: ReactionEffect;
  noButtonLabel?: string;
}

const CURATED_NO_REACTIONS: NoReaction[] = [
  {
    id: 'reaction-1',
    message: 'Honestly, that was the only correct answer.',
    effect: 'heart-bloom',
  },
  {
    id: 'reaction-2',
    message: "Even the Yes button doesn't want to let this moment go.",
    effect: 'button-tilt',
  },
  {
    id: 'reaction-3',
    message: "Good choice — let's linger here a little while longer.",
    effect: 'sparkle-arc',
  },
  {
    id: 'reaction-4',
    message: 'Every favorite story deserves a quiet encore.',
    effect: 'ribbon-trace',
  },
  {
    id: 'reaction-5',
    message: 'Spoiler: clicking No keeps all the warm memories right here.',
    effect: 'warm-halo',
  },
  {
    id: 'reaction-6',
    message:
      'You can chase the Yes button if you like, or stay right here with me.',
    effect: 'petal-drift',
  },
  {
    id: 'reaction-7',
    message: 'Time slows down nicely when we refuse to rush the ending.',
    effect: 'divider-shimmer',
  },
  {
    id: 'reaction-8',
    message: 'Notice how calm and cozy it is on this side of the question.',
    effect: 'ripple-rings',
  },
  {
    id: 'reaction-9',
    message: 'Official verdict: this little keepsake page stays open.',
    effect: 'starlight-trio',
  },
  {
    id: 'reaction-10',
    message: 'Still here, still smiling. Happy Birthday once more ♡',
    effect: 'champagne-drift',
    noButtonLabel: 'Still no ♡',
  },
  {
    id: 'reaction-11',
    message: "I admire your commitment to not ending things yet.",
    effect: 'heart-bloom',
  },
  {
    id: 'reaction-12',
    message: 'Every tap feels like turning back to a favorite chapter.',
    effect: 'ribbon-trace',
  },
  {
    id: 'reaction-13',
    message: 'The Yes button is officially taking the evening off.',
    effect: 'button-tilt',
  },
  {
    id: 'reaction-14',
    message: 'Honestly, I could keep this page open all night too.',
    effect: 'warm-halo',
  },
  {
    id: 'reaction-15',
    message: 'A few more quiet seconds never hurt anyone.',
    effect: 'petal-drift',
  },
  {
    id: 'reaction-16',
    message: 'Wait — are you just testing what else this button can do?',
    effect: 'sparkle-arc',
    noButtonLabel: 'Maybe no',
  },
  {
    id: 'reaction-17',
    message: 'Because if you are, I might have one last secret saved up.',
    effect: 'divider-shimmer',
  },
  {
    id: 'reaction-18',
    message: 'Almost there... just a couple more gentle taps.',
    effect: 'ripple-rings',
  },
  {
    id: 'reaction-19',
    message: 'Two more clicks, and I will let you in on one final thing.',
    effect: 'starlight-trio',
  },
  {
    id: 'reaction-20',
    message: 'Just one more click — I promise it is worth staying for ♡',
    effect: 'champagne-drift',
    noButtonLabel: 'One last no ♡',
  },
];

function buildReactionForClick(clickNumber: number): NoReaction | null {
  if (clickNumber <= 0 || clickNumber > CURATED_NO_REACTIONS.length) {
    return null;
  }
  return CURATED_NO_REACTIONS[clickNumber - 1];
}

function rectsOverlap(a: RectBox, b: RectBox, pad = 0): boolean {
  return !(
    a.right + pad <= b.left ||
    a.left - pad >= b.right ||
    a.bottom + pad <= b.top ||
    a.top - pad >= b.bottom
  );
}

function distanceToRect(px: number, py: number, rect: RectBox): number {
  const dx = Math.max(rect.left - px, 0, px - rect.right);
  const dy = Math.max(rect.top - py, 0, py - rect.bottom);
  return Math.hypot(dx, dy);
}

const FLOATING_PETALS = [
  { x: -72, y: -38, delay: 0, size: 5 },
  { x: -28, y: -56, delay: 0.08, size: 4 },
  { x: 24, y: -52, delay: 0.14, size: 5.5 },
  { x: 68, y: -34, delay: 0.05, size: 4 },
  { x: 0, y: -68, delay: 0.12, size: 4.5 },
] as const;

function BotanicalEndingEmblem({
  activeReaction,
  clickCount,
  reducedMotion,
}: {
  activeReaction: NoReaction | null;
  clickCount: number;
  reducedMotion: boolean;
}) {
  const effect = activeReaction?.effect;

  return (
    <div className="relative flex h-24 w-48 items-center justify-center">
      {/* Warm ambient halo expansion */}
      <AnimatePresence mode="wait">
        {effect === 'warm-halo' && (
          <motion.div
            key={`halo-${clickCount}`}
            aria-hidden="true"
            initial={reducedMotion ? { opacity: 0.25 } : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.55, 0.18], scale: [0.6, 1.35, 1.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.2 : 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-28 w-28 rounded-full bg-radial from-[#E5C588]/45 via-[#DFBE82]/15 to-transparent blur-md"
          />
        )}
      </AnimatePresence>

      {/* Ripple rings */}
      <AnimatePresence>
        {effect === 'ripple-rings' && !reducedMotion && (
          <motion.div
            key={`ripple-${clickCount}`}
            aria-hidden="true"
            initial={{ opacity: 0.65, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-16 w-16 rounded-full border border-[#C6A05A]/55"
          />
        )}
      </AnimatePresence>

      {/* Sparkle arc / Starlight trio */}
      <AnimatePresence>
        {(effect === 'sparkle-arc' ||
          effect === 'starlight-trio' ||
          effect === 'champagne-drift') && (
          <motion.div
            key={`stars-${clickCount}`}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute inset-0"
          >
            {[
              { left: '18%', top: '34%', size: 11, delay: 0 },
              { left: '50%', top: '8%', size: 13, delay: 0.1 },
              { left: '80%', top: '32%', size: 10, delay: 0.18 },
            ].map((star, idx) => (
              <motion.svg
                key={idx}
                width={star.size}
                height={star.size}
                viewBox="0 0 24 24"
                fill="none"
                style={{ left: star.left, top: star.top }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                initial={reducedMotion ? { opacity: 0.7 } : { opacity: 0, scale: 0.3, rotate: -18 }}
                animate={
                  reducedMotion
                    ? { opacity: 0.7 }
                    : { opacity: [0, 0.95, 0.65], scale: [0.3, 1.15, 1], rotate: 0 }
                }
                transition={{ duration: 0.7, delay: star.delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <path
                  d="M12 2.4 C12.7 8.4, 15.6 11.3, 21.6 12 C15.6 12.7, 12.7 15.6, 12 21.6 C11.3 15.6, 8.4 12.7, 2.4 12 C8.4 11.3, 11.3 8.4, 12 2.4 Z"
                  fill="#DFBE82"
                  stroke="#B88E4A"
                  strokeWidth="0.9"
                />
              </motion.svg>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating petals / champagne dust */}
      <AnimatePresence>
        {(effect === 'petal-drift' || effect === 'champagne-drift') &&
          !reducedMotion && (
            <motion.div
              key={`petals-${clickCount}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              {FLOATING_PETALS.map((petal, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, x: petal.x * 0.45, y: 12, scale: 0.6 }}
                  animate={{
                    opacity: [0, 0.85, 0],
                    x: petal.x,
                    y: petal.y,
                    scale: [0.6, 1.1, 0.85],
                  }}
                  transition={{
                    duration: 1.25,
                    delay: petal.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ width: petal.size, height: petal.size }}
                  className="absolute rounded-full bg-[#D3AE6A]"
                />
              ))}
            </motion.div>
          )}
      </AnimatePresence>

      {/* Center hand-drawn botanical / heart / ribbon emblem */}
      <motion.div
        key={`emblem-motion-${clickCount}`}
        animate={
          reducedMotion
            ? {}
            : effect === 'heart-bloom'
              ? { scale: [1, 1.14, 1] }
              : effect === 'button-tilt'
                ? { rotate: [0, -6, 5, -2, 0] }
                : { y: [0, -3, 0] }
        }
        transition={
          effect === 'heart-bloom' || effect === 'button-tilt'
            ? { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
            : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
        }
        className="relative z-10"
      >
        <svg
          width="112"
          height="72"
          viewBox="0 0 112 72"
          fill="none"
          aria-hidden="true"
        >
          {/* Delicate left & right botanical olive sprigs */}
          <path
            d="M44 46 C31 44, 21 38, 12 29"
            stroke="#8E7964"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
          <path
            d="M27 39 C22 33, 25 27, 31 30 C33 34, 30 38, 27 39 Z"
            fill="#EFE8DD"
            stroke="#8E7964"
            strokeWidth="1"
          />
          <path
            d="M17 33 C12 28, 14 21, 20 24 C22 27, 20 31, 17 33 Z"
            fill="#E5D9C9"
            stroke="#8E7964"
            strokeWidth="1"
          />

          <path
            d="M68 46 C81 44, 91 38, 100 29"
            stroke="#8E7964"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
          <path
            d="M85 39 C90 33, 87 27, 81 30 C79 34, 82 38, 85 39 Z"
            fill="#EFE8DD"
            stroke="#8E7964"
            strokeWidth="1"
          />
          <path
            d="M95 33 C100 28, 98 21, 92 24 C90 27, 92 31, 95 33 Z"
            fill="#E5D9C9"
            stroke="#8E7964"
            strokeWidth="1"
          />

          {/* Ribbon trace animation */}
          {effect === 'ribbon-trace' && (
            <motion.path
              key={`ribbon-${clickCount}`}
              d="M28 54 C42 62, 70 62, 84 54"
              stroke="#C49A52"
              strokeWidth="1.25"
              strokeLinecap="round"
              initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          )}

          {/* Tiny center hand-drawn heart */}
          <motion.path
            d="M56 49 C56 49, 46.5 42.8, 46.5 36.8 C46.5 33.6, 49 31.4, 51.8 31.4 C53.8 31.4, 55.2 32.6, 56 34.2 C56.8 32.6, 58.2 31.4, 60.2 31.4 C63 31.4, 65.5 33.6, 65.5 36.8 C65.5 42.8, 56 49, 56 49 Z"
            fill={clickCount > 0 ? '#C78E7B' : '#EFE3D4'}
            stroke="#8A6356"
            strokeWidth="1.2"
            strokeLinejoin="round"
            animate={
              effect === 'heart-bloom' && !reducedMotion
                ? { scale: [1, 1.24, 1.05] }
                : { scale: 1 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '56px 40px' }}
          />

          {/* Tiny champagne accent dots */}
          <circle cx="56" cy="21" r="1.6" fill="#C9A25B" fillOpacity="0.85" />
          <circle cx="41" cy="26" r="1.2" fill="#C9A25B" fillOpacity="0.6" />
          <circle cx="71" cy="26" r="1.2" fill="#C9A25B" fillOpacity="0.6" />
        </svg>
      </motion.div>
    </div>
  );
}

export function EndingQuestionScreen({
  onLock,
  onBack,
}: EndingQuestionScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);

  const [noClickCount, setNoClickCount] = useState(0);
  const [noAnimPulse, setNoAnimPulse] = useState(false);
  const [escapeState, setEscapeState] = useState<EscapePositionState | null>(null);
  const [yesEscapeCount, setYesEscapeCount] = useState(0);

  const [wishText, setWishText] = useState('');
  const [wishError, setWishError] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const wishTextareaRef = useRef<HTMLTextAreaElement>(null);
  const lastEscapeTimeRef = useRef(0);
  const lastTouchTimeRef = useRef(0);
  const noAnimTimerRef = useRef<number | null>(null);

  const hasUnlockedFinalWish = noClickCount >= NO_CLICKS_FOR_FINAL_WISH;

  useEffect(() => {
    return () => {
      if (noAnimTimerRef.current !== null) {
        window.clearTimeout(noAnimTimerRef.current);
      }
    };
  }, []);

  const activeReaction =
    noClickCount > 0 && !hasUnlockedFinalWish
      ? buildReactionForClick(noClickCount)
      : null;

  // Keep escaping Yes button clamped strictly within visible screen boundaries on resize
  useEffect(() => {
    if (!escapeState || hasUnlockedFinalWish) return;
    const handleResize = () => {
      const margin = window.innerWidth < 640 ? 16 : 24;
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 72;
      const minX = margin;
      const maxX = Math.max(margin, window.innerWidth - escapeState.width - margin);
      const minY = Math.max(margin, headerBottom + 12);
      const maxY = Math.max(minY, window.innerHeight - escapeState.height - margin);

      const currentX = escapeState.originLeft + escapeState.dx;
      const currentY = escapeState.originTop + escapeState.dy;
      const clampedX = Math.min(Math.max(currentX, minX), maxX);
      const clampedY = Math.min(Math.max(currentY, minY), maxY);

      setEscapeState((prev) =>
        prev
          ? {
              ...prev,
              dx: clampedX - prev.originLeft,
              dy: clampedY - prev.originTop,
            }
          : null
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [escapeState, hasUnlockedFinalWish]);

  const findSafeEscapeTarget = useCallback(
    (
      btnWidth: number,
      btnHeight: number,
      currentLeft: number,
      currentTop: number,
      pointerX?: number,
      pointerY?: number
    ) => {
      const margin = window.innerWidth < 640 ? 16 : 24;
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 72;

      const minX = margin;
      const maxX = Math.max(margin, window.innerWidth - btnWidth - margin);
      const minY = Math.max(margin, headerBottom + 12);
      const maxY = Math.max(minY, window.innerHeight - btnHeight - margin);

      const noRect = noBtnRef.current?.getBoundingClientRect() ?? null;
      const contentRect = contentAreaRef.current?.getBoundingClientRect() ?? null;

      const px = pointerX ?? currentLeft + btnWidth / 2;
      const py = pointerY ?? currentTop + btnHeight / 2;

      // Primary pass: avoid No button, center text content, and stay far from pointer
      for (let i = 0; i < 80; i++) {
        const candX = minX + Math.random() * Math.max(0, maxX - minX);
        const candY = minY + Math.random() * Math.max(0, maxY - minY);
        const candRect: RectBox = {
          left: candX,
          top: candY,
          right: candX + btnWidth,
          bottom: candY + btnHeight,
        };

        if (noRect && rectsOverlap(candRect, noRect, 22)) continue;
        if (contentRect && rectsOverlap(candRect, contentRect, 18)) continue;
        if (Math.hypot(candX - currentLeft, candY - currentTop) < 95) continue;
        if (distanceToRect(px, py, candRect) < 105) continue;

        return { x: candX, y: candY };
      }

      // Secondary pass for tighter mobile screens: strictly avoid overlapping No button and maximize distance from pointer
      let best = { x: minX, y: minY, score: -1 };
      for (let i = 0; i < 50; i++) {
        const candX = minX + Math.random() * Math.max(0, maxX - minX);
        const candY = minY + Math.random() * Math.max(0, maxY - minY);
        const candRect: RectBox = {
          left: candX,
          top: candY,
          right: candX + btnWidth,
          bottom: candY + btnHeight,
        };

        if (noRect && rectsOverlap(candRect, noRect, 16)) continue;

        const pointerDist = distanceToRect(px, py, candRect);
        const moveDist = Math.hypot(candX - currentLeft, candY - currentTop);
        const contentPenalty =
          contentRect && rectsOverlap(candRect, contentRect, 8) ? -140 : 0;
        const score = pointerDist + moveDist * 0.35 + contentPenalty;

        if (score > best.score) {
          best = { x: candX, y: candY, score };
        }
      }

      return { x: best.x, y: best.y };
    },
    []
  );

  const triggerYesEscape = useCallback(
    (pointerX?: number, pointerY?: number, bypassCooldown = false) => {
      if (hasUnlockedFinalWish) return;
      const now = Date.now();
      const minGap = bypassCooldown ? 75 : 130;
      if (now - lastEscapeTimeRef.current < minGap) {
        return;
      }
      lastEscapeTimeRef.current = now;

      const yesEl = yesBtnRef.current;
      if (!yesEl) return;

      const rect = yesEl.getBoundingClientRect();
      const target = findSafeEscapeTarget(
        rect.width,
        rect.height,
        rect.left,
        rect.top,
        pointerX,
        pointerY
      );

      setYesEscapeCount((prev) => prev + 1);
      setEscapeState((prev) => {
        if (!prev) {
          return {
            originLeft: rect.left,
            originTop: rect.top,
            width: rect.width,
            height: rect.height,
            dx: target.x - rect.left,
            dy: target.y - rect.top,
          };
        }
        return {
          ...prev,
          dx: target.x - prev.originLeft,
          dy: target.y - prev.originTop,
        };
      });
    },
    [findSafeEscapeTarget, hasUnlockedFinalWish]
  );

  const handleMainMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (hasUnlockedFinalWish) return;
      if (Date.now() - lastTouchTimeRef.current < 600) return;

      const yesEl = yesBtnRef.current;
      if (!yesEl) return;

      const rect = yesEl.getBoundingClientRect();
      const dist = distanceToRect(event.clientX, event.clientY, rect);
      if (dist < 64) {
        triggerYesEscape(event.clientX, event.clientY);
      }
    },
    [hasUnlockedFinalWish, triggerYesEscape]
  );

  const handleNoClick = () => {
    if (hasUnlockedFinalWish) return;
    const nextCount = noClickCount + 1;
    setNoClickCount(nextCount);

    if (nextCount >= NO_CLICKS_FOR_FINAL_WISH) {
      setEscapeState(null);
      setNoAnimPulse(false);
      if (noAnimTimerRef.current !== null) {
        window.clearTimeout(noAnimTimerRef.current);
      }
      return;
    }

    setNoAnimPulse(true);
    if (noAnimTimerRef.current !== null) {
      window.clearTimeout(noAnimTimerRef.current);
    }
    noAnimTimerRef.current = window.setTimeout(() => {
      setNoAnimPulse(false);
    }, 360);
  };

  const handleSendToWhatsApp = () => {
    const trimmedMessage = wishText.trim();
    if (!trimmedMessage) {
      setWishError('Please write a few words before opening WhatsApp.');
      wishTextareaRef.current?.focus();
      return;
    }

    setWishError(null);
    const url = buildWhatsAppClickToChatUrl(YOUR_WHATSAPP_NUMBER, trimmedMessage);

    // Open WhatsApp via a clean external link click (works on desktop & mobile without window.open)
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      key="ending-question-screen"
      onMouseMove={handleMainMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-hidden text-[#3A291F]"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #FDFBF7 0%, #F8F3E8 52%, #F2E9D9 100%)',
      }}
    >
      {/* Delicate handmade-paper fiber texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='endingPaperGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23endingPaperGrain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft warm champagne edge wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(255, 252, 245, 0) 54%, rgba(212, 189, 154, 0.13) 100%)',
        }}
      />

      {/* Minimal Top Navigation */}
      <header
        ref={headerRef}
        className="relative z-30 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 pt-5 pb-2 sm:px-10 sm:pt-7"
      >
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#725B49] transition-colors duration-150 hover:text-[#3A291F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89048]/60 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Dedication</span>
            </button>
          )}
        </div>
      </header>

      {/* Centered Minimal Editorial Stage */}
      <main className="relative z-20 flex flex-1 items-center justify-center px-6 pt-4 pb-16 sm:px-10">
        <AnimatePresence mode="wait">
          {!hasUnlockedFinalWish ? (
            <motion.section
              key="do-you-want-to-end-stage"
              aria-labelledby="ending-question-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: -10, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
              }
              transition={{ duration: reduced ? 0.25 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex w-full max-w-[580px] flex-col items-center text-center"
            >
              <div
                ref={contentAreaRef}
                className="flex w-full flex-col items-center"
              >
                {/* Delicate Botanical & Heart Motif */}
                <BotanicalEndingEmblem
                  activeReaction={activeReaction}
                  clickCount={noClickCount}
                  reducedMotion={reduced}
                />

                {/* Main Editorial Heading */}
                <h1
                  id="ending-question-heading"
                  className="font-editorial mt-3 text-[clamp(2.2rem,5vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.015em] text-[#3A291F]"
                  style={{ textWrap: 'balance' }}
                >
                  Do you want to end?
                </h1>

                {/* Subtle champagne hairline divider */}
                <motion.div
                  aria-hidden="true"
                  animate={
                    activeReaction?.effect === 'divider-shimmer' && !reduced
                      ? { scaleX: [1, 1.45, 1], opacity: [0.75, 1, 0.75] }
                      : { scaleX: 1, opacity: 0.75 }
                  }
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="my-6 h-[1px] w-16 origin-center bg-gradient-to-r from-transparent via-[#C49E5B]/80 to-transparent"
                />

                {/* Playful Reaction / Gentle Whisper Area */}
                <div
                  className="flex min-h-[64px] w-full max-w-[44ch] items-center justify-center"
                  aria-live="polite"
                >
                  <AnimatePresence mode="wait">
                    {activeReaction ? (
                      <motion.p
                        key={activeReaction.id}
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="font-editorial text-[clamp(1.18rem,2.7vw,1.42rem)] italic leading-[1.45] text-[#6E5643]"
                        style={{ textWrap: 'balance' }}
                      >
                        {activeReaction.message}
                      </motion.p>
                    ) : yesEscapeCount >= 3 ? (
                      <motion.p
                        key="yes-chasing-whisper"
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="font-editorial text-[clamp(1.1rem,2.4vw,1.28rem)] italic leading-[1.45] text-[#8E755F]"
                      >
                        That button is a little shy today.
                      </motion.p>
                    ) : (
                      <span className="sr-only">Choose an option below.</span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Interactive Yes & No Buttons */}
              <div className="mt-6 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-5">
                {/* Keep layout slot steady when Yes button escapes */}
                {escapeState && (
                  <div
                    aria-hidden="true"
                    style={{ width: escapeState.width, height: escapeState.height }}
                    className="shrink-0"
                  />
                )}

                {/* YES BUTTON — Smoothly escapes cursor & mobile taps */}
                <motion.button
                  ref={yesBtnRef}
                  type="button"
                  onClick={(e: ReactMouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerYesEscape(e.clientX, e.clientY, true);
                  }}
                  onMouseEnter={(e: ReactMouseEvent<HTMLButtonElement>) => {
                    if (Date.now() - lastTouchTimeRef.current < 600) return;
                    triggerYesEscape(e.clientX, e.clientY);
                  }}
                  onTouchStart={(e: ReactTouchEvent<HTMLButtonElement>) => {
                    lastTouchTimeRef.current = Date.now();
                    e.preventDefault();
                    const touch = e.touches[0];
                    triggerYesEscape(touch?.clientX, touch?.clientY, true);
                  }}
                  onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) => {
                    if (e.pointerType === 'touch') {
                      lastTouchTimeRef.current = Date.now();
                    }
                    e.preventDefault();
                    triggerYesEscape(e.clientX, e.clientY, true);
                  }}
                  style={
                    escapeState
                      ? {
                          position: 'fixed',
                          left: escapeState.originLeft,
                          top: escapeState.originTop,
                          width: escapeState.width,
                          zIndex: 40,
                        }
                      : undefined
                  }
                  animate={
                    escapeState
                      ? { x: escapeState.dx, y: escapeState.dy }
                      : { x: 0, y: 0 }
                  }
                  transition={
                    escapeState
                      ? reduced
                        ? { duration: 0.16, ease: 'easeOut' }
                        : { type: 'spring', stiffness: 230, damping: 22, mass: 0.9 }
                      : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="min-h-[46px] min-w-[148px] cursor-pointer rounded-xl border border-[#D4C2A8] bg-[#FDFBF7]/95 px-8 py-3 text-[14.5px] font-medium tracking-[0.02em] text-[#3A291F] shadow-[0_10px_24px_-12px_rgba(58,41,31,0.25)] transition-colors duration-150 hover:border-[#B69973] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89048]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F3E8] whitespace-nowrap shrink-0"
                >
                  Yes
                </motion.button>

                {/* NO BUTTON — Triggers varied cute reactions on every click */}
                <motion.button
                  ref={noBtnRef}
                  type="button"
                  onClick={handleNoClick}
                  animate={
                    reduced || !noAnimPulse
                      ? { rotate: 0, scale: 1 }
                      : activeReaction?.effect === 'button-tilt'
                        ? { rotate: [-4, 4, -2, 0], scale: 1.04 }
                        : { rotate: 0, scale: 1.03 }
                  }
                  whileHover={reduced ? undefined : { y: -1 }}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative min-h-[46px] min-w-[148px] cursor-pointer rounded-xl bg-[#403128] px-8 py-3 text-[14.5px] font-medium tracking-[0.02em] text-[#FAF7F2] shadow-[0_12px_26px_-12px_rgba(64,49,40,0.48)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F3E8] whitespace-nowrap shrink-0"
                >
                  {activeReaction?.noButtonLabel ?? 'No'}
                </motion.button>
              </div>
            </motion.section>
          ) : (
            /* SPECIAL FINAL SCREEN — Revealed after exactly 21 NO clicks */
            <motion.section
              key="final-wish-note-stage"
              aria-labelledby="one-last-thing-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.25 : 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto flex w-full max-w-[540px] flex-col items-center text-center"
            >
              {/* Quiet botanical flourish */}
              <BotanicalEndingEmblem
                activeReaction={null}
                clickCount={NO_CLICKS_FOR_FINAL_WISH}
                reducedMotion={reduced}
              />

              <h1
                id="one-last-thing-heading"
                className="font-editorial mt-2 text-[clamp(2.15rem,4.8vw,3.15rem)] font-medium leading-[1.14] tracking-[-0.015em] text-[#3A291F]"
                style={{ textWrap: 'balance' }}
              >
                Okay, one last thing...
              </h1>

              <p
                className="font-editorial mt-3.5 max-w-[38ch] text-[clamp(1.16rem,2.6vw,1.38rem)] italic leading-[1.5] text-[#6E5643]"
                style={{ textWrap: 'balance' }}
              >
                Since you stayed this long, there&apos;s something I&apos;d like
                you to write.
              </p>

              <div
                aria-hidden="true"
                className="my-6 h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C49E5B]/80 to-transparent"
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendToWhatsApp();
                }}
                noValidate
                className="flex w-full flex-col items-center"
              >
                <label htmlFor="final-personal-wish-input" className="sr-only">
                  Write your wish
                </label>

                <textarea
                  ref={wishTextareaRef}
                  id="final-personal-wish-input"
                  rows={5}
                  value={wishText}
                  onChange={(e) => {
                    setWishText(e.target.value);
                    if (wishError && e.target.value.trim().length > 0) {
                      setWishError(null);
                    }
                  }}
                  placeholder="Write your wish here..."
                  aria-invalid={Boolean(wishError)}
                  aria-describedby={
                    wishError ? 'final-wish-validation-error' : undefined
                  }
                  className="font-editorial w-full resize-y rounded-xl border border-[#D8C7AE] bg-[#FCF9F2]/95 px-5 py-4 text-[1.22rem] leading-[1.65] text-[#3A291F] placeholder:italic placeholder:text-[#A38E79] shadow-[0_14px_34px_-22px_rgba(64,49,40,0.28)] transition-colors duration-150 focus:border-[#B89048] focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#B89048]/25"
                />

                {/* Inline validation error */}
                <div className="mt-3 min-h-[24px] w-full text-center" aria-live="polite">
                  {wishError ? (
                    <p
                      id="final-wish-validation-error"
                      className="text-[13px] font-medium text-[#8C4A3B]"
                    >
                      {wishError}
                    </p>
                  ) : null}
                </div>

                <motion.button
                  type="submit"
                  whileHover={reduced ? undefined : { y: -1 }}
                  whileTap={reduced ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 inline-flex min-h-[46px] min-w-[200px] cursor-pointer items-center justify-center rounded-xl bg-[#403128] px-8 py-3 text-[14.5px] font-medium tracking-[0.02em] text-[#FAF7F2] shadow-[0_12px_26px_-12px_rgba(64,49,40,0.48)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F3E8] whitespace-nowrap shrink-0"
                >
                  Send it to me ♡
                </motion.button>
              </form>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
