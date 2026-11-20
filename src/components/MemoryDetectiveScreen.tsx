import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import {
  MEMORY_DETECTIVE_COPY,
  MEMORY_DETECTIVE_CORRECT_ORDER,
  MEMORY_DETECTIVE_PHOTOS,
  shuffleDetectivePhotos,
  type MemoryDetectivePhoto,
} from '../config/memoryDetective';

interface MemoryDetectiveScreenProps {
  onLock: () => void;
  onComplete: () => void;
  onBack?: () => void;
  photos?: readonly MemoryDetectivePhoto[];
  correctOrder?: readonly string[];
}

type DetectiveStage = 'intro' | 'board' | 'solved';

interface Point {
  x: number;
  y: number;
}

const DUST_PARTICLES = [
  { top: '14%', left: '11%', size: 3, duration: 7.4, delay: 0.2 },
  { top: '22%', left: '84%', size: 2.5, duration: 8.6, delay: 1.1 },
  { top: '38%', left: '7%', size: 2.5, duration: 7.9, delay: 0.7 },
  { top: '46%', left: '91%', size: 3, duration: 8.2, delay: 1.8 },
  { top: '66%', left: '14%', size: 2.5, duration: 9.0, delay: 0.5 },
  { top: '74%', left: '86%', size: 3, duration: 7.6, delay: 1.4 },
  { top: '85%', left: '32%', size: 2, duration: 8.4, delay: 0.9 },
  { top: '18%', left: '54%', size: 2, duration: 8.8, delay: 2.1 },
] as const;

const SCATTER_PRESETS = [
  {
    wrapperClass: '-rotate-[2.4deg] md:-translate-y-2 md:-rotate-[3.1deg]',
    pinColor: '#C49A52',
  },
  {
    wrapperClass: 'translate-y-2 rotate-[2.1deg] md:translate-y-3 md:rotate-[2.5deg]',
    pinColor: '#B88946',
  },
  {
    wrapperClass: '-translate-y-1 -rotate-[1.6deg] md:-translate-y-1 md:-rotate-[2.4deg]',
    pinColor: '#C9A25B',
  },
  {
    wrapperClass: 'translate-y-1 rotate-[2.3deg] md:translate-y-2 md:rotate-[2.9deg]',
    pinColor: '#B88946',
  },
  {
    wrapperClass: '-translate-y-1.5 -rotate-[2.2deg] md:-translate-y-2.5 md:-rotate-[2.6deg]',
    pinColor: '#C49A52',
  },
  {
    wrapperClass: 'translate-y-1.5 rotate-[1.8deg] md:translate-y-1.5 md:rotate-[2.4deg]',
    pinColor: '#C9A25B',
  },
] as const;

function getDetectiveCardMetrics(
  boardWidth: number,
  aspectRatio: number
): { cardWidth: number; safeRatio: number } {
  const safeRatio = Math.min(Math.max(aspectRatio || 0.78, 0.48), 1.85);
  const isTwoColMobile = boardWidth > 0 && boardWidth < 600;

  if (isTwoColMobile) {
    const colW = Math.min(210, Math.max(126, Math.floor((boardWidth - 24) / 2)));
    const padX = 20;
    const availW = Math.max(106, colW - padX);
    const maxPhotoH = Math.round(availW * 1.42);
    const photoW = Math.min(availW, Math.round(maxPhotoH * safeRatio));
    return {
      cardWidth: Math.max(122, photoW + padX),
      safeRatio,
    };
  }

  const maxCardW = 242;
  const padX = 24;
  const availW = maxCardW - padX;
  const maxPhotoH = 266;
  const photoW = Math.min(availW, Math.round(maxPhotoH * safeRatio));

  return {
    cardWidth: Math.max(166, photoW + padX),
    safeRatio,
  };
}

function playGentleChime(stepIndex: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const notes = [440, 493.88, 554.37, 587.33, 659.25, 739.99];
    const freq = notes[Math.min(stepIndex, notes.length - 1)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.36);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.38);

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 500);
  } catch {
    // Audio playback is strictly optional
  }
}

function CaseFileMagnifierEmblem() {
  return (
    <svg
      aria-hidden="true"
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      className="mx-auto text-[#8C6A3E]"
    >
      {/* Subtle dotted clue thread behind lens */}
      <path
        d="M10 46 C18 38, 22 24, 34 22 C44 20, 49 14, 54 10"
        stroke="#C49A52"
        strokeOpacity="0.65"
        strokeWidth="1.25"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      <circle cx="10" cy="46" r="2.2" fill="#C49A52" fillOpacity="0.7" />
      <circle cx="54" cy="10" r="2.2" fill="#C49A52" fillOpacity="0.7" />

      {/* Fine vintage magnifying glass */}
      <circle
        cx="31"
        cy="30"
        r="12.5"
        fill="#FDF8EE"
        fillOpacity="0.88"
        stroke="#6B5038"
        strokeWidth="1.65"
      />
      <circle
        cx="31"
        cy="30"
        r="9.2"
        stroke="#C49A52"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      {/* Tiny 4-point gleam inside glass */}
      <path
        d="M27.5 24.5 C28.2 26.8, 29.2 27.8, 31.5 28.5 C29.2 29.2, 28.2 30.2, 27.5 32.5 C26.8 30.2, 25.8 29.2, 23.5 28.5 C25.8 27.8, 26.8 26.8, 27.5 24.5 Z"
        fill="#D6B16A"
        fillOpacity="0.72"
      />
      <path
        d="M40.2 39.2 L50.5 49.5"
        stroke="#6B5038"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M40.2 39.2 L50.5 49.5"
        stroke="#B88E4A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MemoryDetectiveScreen({
  onLock,
  onComplete,
  onBack,
  photos = MEMORY_DETECTIVE_PHOTOS,
  correctOrder = MEMORY_DETECTIVE_CORRECT_ORDER,
}: MemoryDetectiveScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);

  const [stage, setStage] = useState<DetectiveStage>('intro');
  const [boardPhotos, setBoardPhotos] = useState<MemoryDetectivePhoto[]>(() =>
    shuffleDetectivePhotos(photos, correctOrder)
  );
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [lastSuccessId, setLastSuccessId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCompletingBoard, setIsCompletingBoard] = useState(false);
  const [isFadingToLetter, setIsFadingToLetter] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [photoRatios, setPhotoRatios] = useState<Record<string, number>>({});
  const [boardWidth, setBoardWidth] = useState<number>(860);
  const [pinCoords, setPinCoords] = useState<Record<string, Point>>({});

  const boardRef = useRef<HTMLDivElement | null>(null);
  const pinRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const timersRef = useRef<number[]>([]);
  const wrongTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const recordPhotoRatio = useCallback(
    (photoId: string, naturalWidth: number, naturalHeight: number) => {
      if (naturalWidth <= 0 || naturalHeight <= 0) return;
      const ratio = naturalWidth / naturalHeight;
      setPhotoRatios((prev) => {
        const existing = prev[photoId];
        if (existing && Math.abs(existing - ratio) < 0.002) {
          return prev;
        }
        return { ...prev, [photoId]: ratio };
      });
    },
    []
  );

  const clearScheduledTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (wrongTimerRef.current !== null) {
      window.clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = null;
    }
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    if (successTimerRef.current !== null) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Preload all 6 memory images and capture their natural aspect ratios
    photos.forEach((p) => {
      const img = new Image();
      img.onload = () => {
        recordPhotoRatio(p.id, img.naturalWidth, img.naturalHeight);
      };
      img.src = p.src;
      if (img.complete && img.naturalWidth > 0) {
        recordPhotoRatio(p.id, img.naturalWidth, img.naturalHeight);
      }
    });
    return () => clearScheduledTimers();
  }, [clearScheduledTimers, photos, recordPhotoRatio]);

  const measurePins = useCallback(() => {
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const boardRect = boardEl.getBoundingClientRect();
    if (boardRect.width === 0 || boardRect.height === 0) return;

    setBoardWidth((prev) =>
      Math.abs(prev - boardRect.width) < 2 ? prev : boardRect.width
    );

    const nextCoords: Record<string, Point> = {};
    for (const photo of boardPhotos) {
      const pinEl = pinRefs.current[photo.id];
      if (!pinEl) continue;
      const pinRect = pinEl.getBoundingClientRect();
      nextCoords[photo.id] = {
        x: pinRect.left - boardRect.left + pinRect.width / 2,
        y: pinRect.top - boardRect.top + pinRect.height / 2,
      };
    }
    setPinCoords(nextCoords);
  }, [boardPhotos]);

  const loadedRatiosCount = Object.keys(photoRatios).length;

  useLayoutEffect(() => {
    if (stage !== 'board') return;

    const rafId = window.requestAnimationFrame(measurePins);
    const t1 = window.setTimeout(measurePins, 180);
    const t2 = window.setTimeout(measurePins, 520);

    let observer: ResizeObserver | null = null;
    if (boardRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measurePins();
      });
      observer.observe(boardRef.current);
    }

    window.addEventListener('resize', measurePins);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      observer?.disconnect();
      window.removeEventListener('resize', measurePins);
    };
  }, [stage, boardPhotos, connectedIds.length, loadedRatiosCount, boardWidth, measurePins]);

  // CASE SOLVED celebration pause -> automatic smooth transition to Personal Handwritten Letter
  useEffect(() => {
    if (stage !== 'solved') return;

    setIsFadingToLetter(false);
    const transitionDelay = reduced ? 1050 : 2100;
    const finishDelay = reduced ? 1350 : 2750;

    const fadeTimer = window.setTimeout(() => {
      setIsFadingToLetter(true);
    }, transitionDelay);

    const doneTimer = window.setTimeout(() => {
      onCompleteRef.current();
    }, finishDelay);

    timersRef.current.push(fadeTimer, doneTimer);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [stage, reduced]);

  const handleRestartPuzzle = useCallback(() => {
    clearScheduledTimers();
    setConnectedIds([]);
    setWrongId(null);
    setLastSuccessId(null);
    setFeedbackMessage(null);
    setIsCompletingBoard(false);
    setBoardPhotos(shuffleDetectivePhotos(photos, correctOrder));
  }, [clearScheduledTimers, correctOrder, photos]);

  const handleCardSelect = useCallback(
    (photoId: string) => {
      if (stage !== 'board' || isCompletingBoard) return;
      if (connectedIds.includes(photoId)) return;

      const expectedNextId = correctOrder[connectedIds.length];

      if (photoId === expectedNextId) {
        if (wrongTimerRef.current !== null) {
          window.clearTimeout(wrongTimerRef.current);
          wrongTimerRef.current = null;
        }
        if (feedbackTimerRef.current !== null) {
          window.clearTimeout(feedbackTimerRef.current);
          feedbackTimerRef.current = null;
        }

        const nextConnected = [...connectedIds, photoId];
        setWrongId(null);
        setFeedbackMessage(null);
        setConnectedIds(nextConnected);
        setLastSuccessId(photoId);
        playGentleChime(nextConnected.length - 1);

        if (successTimerRef.current !== null) {
          window.clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = window.setTimeout(() => {
          setLastSuccessId(null);
        }, 650);

        if (nextConnected.length === correctOrder.length) {
          setIsCompletingBoard(true);
          const settleDelay = reduced ? 500 : 1050;
          const solvedTimer = window.setTimeout(() => {
            setStage('solved');
          }, settleDelay);
          timersRef.current.push(solvedTimer);
        }
      } else {
        setWrongId(photoId);
        setFeedbackMessage(MEMORY_DETECTIVE_COPY.wrongFeedback);

        if (wrongTimerRef.current !== null) {
          window.clearTimeout(wrongTimerRef.current);
        }
        wrongTimerRef.current = window.setTimeout(() => {
          setWrongId(null);
        }, 560);

        if (feedbackTimerRef.current !== null) {
          window.clearTimeout(feedbackTimerRef.current);
        }
        feedbackTimerRef.current = window.setTimeout(() => {
          setFeedbackMessage(null);
        }, 2100);
      }
    },
    [stage, isCompletingBoard, connectedIds, correctOrder, reduced]
  );

  // Build consecutive pin-to-pin SVG line segments
  const connectionSegments: Array<{
    key: string;
    from: Point;
    to: Point;
    d: string;
  }> = [];

  for (let i = 0; i < connectedIds.length - 1; i += 1) {
    const fromId = connectedIds[i];
    const toId = connectedIds[i + 1];
    const from = pinCoords[fromId];
    const to = pinCoords[toId];
    if (from && to) {
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      const sag = Math.min(20, Math.max(6, distance * 0.075));
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2 + sag;
      connectionSegments.push({
        key: `${fromId}->${toId}`,
        from,
        to,
        d: `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${midX.toFixed(
          1
        )} ${midY.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`,
      });
    }
  }

  const nextStepNumber = Math.min(connectedIds.length + 1, correctOrder.length);

  return (
    <motion.div
      key="memory-detective-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden text-[#3A2A20]"
      style={{
        background:
          'radial-gradient(circle at 50% 34%, #FAF4E8 0%, #EFE5D3 58%, #E1D2BA 100%)',
      }}
    >
      {/* Subtle vintage paper grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.036]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='detectivePaperGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23detectivePaperGrain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sparing ambient warm dust particles */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        {DUST_PARTICLES.map((particle, idx) => (
          <motion.span
            key={`dust-${idx}`}
            initial={{ opacity: 0.2 }}
            animate={
              reduced
                ? { opacity: 0.35 }
                : {
                    opacity: [0.18, 0.55, 0.2],
                    y: [0, -16, 0],
                  }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            className="absolute rounded-full bg-[#C9A25B]"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
              boxShadow: '0 0 8px 1px rgba(201, 162, 91, 0.35)',
            }}
          />
        ))}
      </div>

      {/* Minimal Single-Row Header */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 pt-5 pb-2 sm:px-10 sm:pt-7">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={() => {
                clearScheduledTimers();
                onBack();
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#6B5442] transition-colors duration-150 hover:text-[#2D2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Memories</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 pt-3 pb-10 sm:px-8 sm:pb-12">
        <AnimatePresence mode="wait">
          {stage === 'intro' ? (
            /* 1. VINTAGE DETECTIVE INTRO SCREEN */
            <motion.section
              key="detective-intro"
              aria-labelledby="detective-intro-title"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-[540px]"
            >
              <div className="relative rounded-[12px] border border-[#D4C1A5] bg-[#FAF4E7] px-7 py-10 text-center shadow-[0_24px_52px_-20px_rgba(52,33,17,0.28),0_6px_16px_-8px_rgba(52,33,17,0.14)] sm:px-12 sm:py-12">
                {/* Subtle inner archival frame line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 rounded-[8px] border border-[#C9A86A]/28"
                />

                <div className="relative z-10">
                  <CaseFileMagnifierEmblem />

                  <p className="mt-4 text-[12.5px] font-medium tracking-[0.06em] text-[#7D634A]">
                    Case File · Six Shared Moments
                  </p>

                  <h1
                    id="detective-intro-title"
                    className="font-editorial mt-2 text-[clamp(2.25rem,5.4vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.01em] text-[#332419]"
                    style={{ textWrap: 'balance' }}
                  >
                    {MEMORY_DETECTIVE_COPY.title}
                  </h1>

                  <p className="mx-auto mt-4 max-w-[38ch] text-[15px] leading-[1.65] text-[#5F4B3B] sm:text-[15.5px]">
                    {MEMORY_DETECTIVE_COPY.subtitle}
                  </p>

                  <div className="mx-auto my-6 h-[1px] w-20 bg-gradient-to-r from-transparent via-[#C49A52]/65 to-transparent" />

                  <motion.button
                    type="button"
                    onClick={() => setStage('board')}
                    whileHover={reduced ? undefined : { y: -1 }}
                    whileTap={reduced ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#C49A52]/45 bg-[#4A3527] px-7 py-2.5 text-[14px] font-medium tracking-[0.03em] text-[#FAF3E8] shadow-[0_12px_24px_-12px_rgba(45,28,15,0.55)] transition-colors duration-150 hover:bg-[#3B291E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF4E7] whitespace-nowrap shrink-0"
                  >
                    <span>{MEMORY_DETECTIVE_COPY.beginButton}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </motion.section>
          ) : stage === 'board' ? (
            /* 2. THE PHOTO PUZZLE BOARD */
            <motion.section
              key="detective-board"
              aria-labelledby="detective-board-title"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex w-full max-w-[980px] flex-col items-center"
            >
              {/* Tidy Unobtrusive Board HUD */}
              <div className="flex w-full flex-wrap items-end justify-between gap-3 px-2 sm:px-4">
                <div>
                  <h1
                    id="detective-board-title"
                    className="font-editorial text-[clamp(1.75rem,3.8vw,2.35rem)] leading-[1.1] font-medium text-[#332419]"
                  >
                    {MEMORY_DETECTIVE_COPY.title}
                  </h1>
                  <p
                    aria-live="polite"
                    className="mt-1 text-[13.5px] font-medium text-[#6A5341] tabular-nums sm:text-[14px]"
                  >
                    <span>
                      {connectedIds.length} of {correctOrder.length} connected
                    </span>
                    <span aria-hidden="true" className="mx-2 text-[#B89B7A]">
                      ·
                    </span>
                    <span>
                      {connectedIds.length === correctOrder.length
                        ? 'Sequence complete'
                        : connectedIds.length === 0
                          ? 'Tap the first memory'
                          : `Tap memory ${nextStepNumber} of ${correctOrder.length}`}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRestartPuzzle}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg border border-[#C6B196] bg-[#FAF4E8]/90 px-3.5 py-2 text-[12.5px] font-medium text-[#4D3B2C] transition-colors duration-150 hover:border-[#9E7E57] hover:bg-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Restart</span>
                </button>
              </div>

              {/* Fixed-height validation feedback slot (no layout shift) */}
              <div
                aria-live="polite"
                className="mt-2 flex min-h-[28px] w-full items-center justify-center px-2"
              >
                <AnimatePresence mode="wait">
                  {feedbackMessage ? (
                    <motion.p
                      key={feedbackMessage}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#8C3B32]"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{feedbackMessage}</span>
                    </motion.p>
                  ) : (
                    <p
                      key="hint-idle"
                      className="text-[12.5px] text-[#7B6451]/85"
                    >
                      Connect the six moments in chronological order
                    </p>
                  )}
                </AnimatePresence>
              </div>

              {/* Scattered Polaroid Case Board + Responsive SVG Line Overlay */}
              <div
                ref={boardRef}
                className="relative mt-4 w-full px-1 pt-2 pb-4 sm:mt-5 sm:px-4"
              >
                {/* Dynamic Responsive Golden Thread SVG Overlay */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
                >
                  {connectionSegments.map((seg) => (
                    <g key={seg.key}>
                      {/* Soft warm champagne-gold outer glow */}
                      <motion.path
                        d={seg.d}
                        fill="none"
                        stroke="#E7C98B"
                        strokeOpacity="0.45"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: reduced ? 0.15 : 0.42,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                      {/* Fine crisp champagne-gold connecting line */}
                      <motion.path
                        d={seg.d}
                        fill="none"
                        stroke="#B88946"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: reduced ? 0.15 : 0.42,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </g>
                  ))}

                  {/* Brass eyelet nodes anchored on each connected card pin */}
                  {connectedIds.map((id) => {
                    const pt = pinCoords[id];
                    if (!pt) return null;
                    return (
                      <motion.circle
                        key={`node-${id}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#DFBE82"
                        stroke="#7D5A28"
                        strokeWidth="1.25"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    );
                  })}
                </svg>

                {/* Six Scattered Polaroid Cards */}
                <div className="relative z-10 grid grid-cols-2 items-center gap-x-4 gap-y-7 sm:gap-x-7 sm:gap-y-9 md:grid-cols-3 md:gap-x-10 md:gap-y-12">
                  {boardPhotos.map((photo, slotIdx) => {
                    const preset = SCATTER_PRESETS[slotIdx % SCATTER_PRESETS.length];
                    const stepIndex = connectedIds.indexOf(photo.id);
                    const isConnected = stepIndex !== -1;
                    const isWrong = wrongId === photo.id;
                    const isLastSuccess = lastSuccessId === photo.id;
                    const slotMarker = String(slotIdx + 1).padStart(2, '0');
                    const cardMetrics = getDetectiveCardMetrics(
                      boardWidth,
                      photoRatios[photo.id] ?? 0.78
                    );

                    return (
                      <div
                        key={photo.id}
                        className={`relative flex justify-center ${preset.wrapperClass}`}
                      >
                        <motion.button
                          type="button"
                          onClick={() => handleCardSelect(photo.id)}
                          animate={
                            isWrong && !reduced
                              ? { x: [0, -7, 7, -5, 4, 0] }
                              : isLastSuccess && !reduced
                                ? { scale: [1, 1.03, 1] }
                                : { x: 0, scale: 1 }
                          }
                          transition={{
                            duration: isWrong ? 0.42 : 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          whileHover={
                            isConnected || reduced ? undefined : { y: -3 }
                          }
                          whileTap={
                            isConnected || reduced ? undefined : { scale: 0.985 }
                          }
                          aria-pressed={isConnected}
                          aria-label={`${photo.label ? `${photo.label}: ` : ''}${photo.alt}. ${
                            isConnected
                              ? `Connected as moment ${stepIndex + 1} of ${correctOrder.length}.`
                              : `Card ${slotIdx + 1}. Tap to connect.`
                          }`}
                          style={{ width: cardMetrics.cardWidth }}
                          className={`group relative flex max-w-full touch-manipulation flex-col rounded-[5px] border bg-[#FDFBF7] p-2.5 pb-3 text-left transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946] focus-visible:ring-offset-4 focus-visible:ring-offset-[#EFE5D3] sm:p-3 sm:pb-3.5 ${
                            isWrong
                              ? 'border-[#9E473D] ring-2 ring-[#9E473D]/35 shadow-[0_18px_36px_-14px_rgba(120,40,32,0.32)]'
                              : isConnected
                                ? 'cursor-default border-[#C49A52] ring-1 ring-[#C49A52]/55 shadow-[0_18px_34px_-12px_rgba(145,104,42,0.34),0_6px_14px_-6px_rgba(52,33,17,0.18)]'
                                : 'cursor-pointer border-[#E2D4BE] shadow-[0_18px_34px_-16px_rgba(44,28,14,0.32),0_6px_14px_-8px_rgba(44,28,14,0.16)] hover:border-[#C9A86A] hover:shadow-[0_22px_40px_-14px_rgba(44,28,14,0.36)]'
                          }`}
                        >
                          {/* Brass Pin Anchor Target for SVG Golden Thread */}
                          <span
                            ref={(el) => {
                              pinRefs.current[photo.id] = el;
                            }}
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1.5 left-1/2 z-30 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border border-[#6E4F22]/75 shadow-[0_2px_4px_rgba(40,24,10,0.32)] sm:top-2"
                            style={{
                              background: isConnected
                                ? 'radial-gradient(circle at 35% 30%, #F5DFAC 0%, #C49A52 70%, #8E692C 100%)'
                                : `radial-gradient(circle at 35% 30%, #EFE2C6 0%, ${preset.pinColor} 75%, #8C6830 100%)`,
                            }}
                          >
                            <span className="h-1 w-1 rounded-full bg-[#FFF8E8]/85" />
                          </span>

                          {/* Polaroid Photo Window adapted to photo's natural aspect ratio */}
                          <div
                            style={{ aspectRatio: String(cardMetrics.safeRatio) }}
                            className="relative mt-2.5 flex w-full items-center justify-center overflow-hidden rounded-[2px] bg-[#F4ECE0] shadow-[inset_0_1px_3px_rgba(38,24,14,0.14)]"
                          >
                            {imgErrors[photo.id] ? (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#F3E9D8] to-[#E4D4BA] px-3 text-center text-[#6F5844]">
                                <ImageIcon className="h-5 w-5 opacity-70" aria-hidden="true" />
                                <span className="text-[11.5px] leading-snug">
                                  {photo.label || photo.alt}
                                </span>
                              </div>
                            ) : (
                              <img
                                src={photo.src}
                                alt={photo.alt}
                                referrerPolicy="no-referrer"
                                draggable={false}
                                onLoad={(e) =>
                                  recordPhotoRatio(
                                    photo.id,
                                    e.currentTarget.naturalWidth,
                                    e.currentTarget.naturalHeight
                                  )
                                }
                                onError={() =>
                                  setImgErrors((prev) => ({
                                    ...prev,
                                    [photo.id]: true,
                                  }))
                                }
                                className={`h-full w-full object-contain object-center transition-all duration-300 ease-out ${
                                  isConnected ? 'brightness-[1.02]' : ''
                                }`}
                              />
                            )}
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#24160C]/8 via-transparent to-white/5"
                            />
                          </div>

                          {/* Polaroid Lower Margin: Clue Caption + Visual Marker / Sequence Seal */}
                          <div className="mt-2.5 flex items-baseline justify-between gap-2 px-0.5 sm:mt-3">
                            <span className="font-handwritten text-[1.02rem] leading-[1.15] text-[#4A3829] sm:text-[1.16rem]">
                              {photo.label || `Moment ${slotMarker}`}
                            </span>

                            {isConnected ? (
                              <span
                                className="font-editorial inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#8A6225] tabular-nums"
                                aria-hidden="true"
                              >
                                <Check className="h-3.5 w-3.5 stroke-[2.25]" />
                                <span>{stepIndex + 1}</span>
                              </span>
                            ) : (
                              <span
                                className="font-editorial shrink-0 text-[12px] font-medium tracking-[0.06em] text-[#8B735C] tabular-nums"
                                aria-hidden="true"
                              >
                                {slotMarker}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          ) : (
            /* 3. COMPLETION SCREEN: CASE SOLVED */
            <motion.section
              key="detective-solved"
              aria-labelledby="detective-solved-title"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex w-full max-w-[540px] flex-col items-center py-8 text-center"
            >
              <motion.div
                initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C49A52]/75 to-transparent"
              />

              <motion.h1
                id="detective-solved-title"
                initial={reduced ? { opacity: 1 } : { opacity: 0, letterSpacing: '0.18em' }}
                animate={{ opacity: 1, letterSpacing: '0.14em' }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial text-[clamp(2.25rem,5.6vw,3.35rem)] leading-[1.08] font-semibold tracking-[0.14em] text-[#35251A]"
              >
                {MEMORY_DETECTIVE_COPY.solvedTitle}
              </motion.h1>

              <motion.p
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial mt-4 text-[clamp(1.25rem,3.2vw,1.6rem)] italic leading-[1.45] text-[#644E3D]"
              >
                {MEMORY_DETECTIVE_COPY.solvedSubtitle}
              </motion.p>

              <motion.div
                initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.65, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C49A52]/75 to-transparent"
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Smooth Transition Veil into Existing Personal Handwritten Letter */}
      {stage === 'solved' && isFadingToLetter && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.25 : 0.65, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-50 bg-[#5C4436]"
        />
      )}
    </motion.div>
  );
}
