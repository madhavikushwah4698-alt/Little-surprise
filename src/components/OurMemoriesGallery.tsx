import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  OUR_MEMORIES_PHOTOS,
  type MemoryGalleryPhoto,
} from '../config/memoryGallery';

interface OurMemoriesGalleryProps {
  onLock: () => void;
  onComplete?: () => void;
  photos?: readonly MemoryGalleryPhoto[];
}

const AUTO_ROTATE_MS = 5_000;
const LEAVING_ANIMATION_MS = 650;

const GOLDEN_BOKEH_ORBS = [
  { top: '12%', left: '10%', size: 170, opacity: 0.14, duration: 15, delay: 0 },
  { top: '20%', right: '8%', size: 210, opacity: 0.12, duration: 18, delay: 1.5 },
  { bottom: '18%', left: '14%', size: 220, opacity: 0.11, duration: 19, delay: 0.8 },
  { bottom: '12%', right: '12%', size: 185, opacity: 0.14, duration: 16, delay: 2.2 },
  { top: '48%', left: '4%', size: 130, opacity: 0.1, duration: 14, delay: 1.1 },
  { top: '44%', right: '5%', size: 145, opacity: 0.1, duration: 17, delay: 2.7 },
] as const;

const GOLDEN_SPARK_PARTICLES = [
  { top: '16%', left: '22%', size: 3, duration: 6.5, delay: 0.2 },
  { top: '24%', left: '78%', size: 2.5, duration: 7.4, delay: 1.1 },
  { top: '34%', left: '12%', size: 3.5, duration: 8.1, delay: 0.6 },
  { top: '38%', left: '88%', size: 3, duration: 6.8, delay: 1.8 },
  { top: '52%', left: '16%', size: 2.5, duration: 7.6, delay: 2.3 },
  { top: '58%', left: '84%', size: 3.5, duration: 7.1, delay: 0.4 },
  { top: '68%', left: '24%', size: 3, duration: 8.4, delay: 1.5 },
  { top: '72%', left: '76%', size: 2.5, duration: 6.9, delay: 2.0 },
  { top: '82%', left: '34%', size: 3, duration: 7.8, delay: 0.9 },
  { top: '80%', left: '66%', size: 3.5, duration: 7.3, delay: 2.6 },
  { top: '28%', left: '36%', size: 2, duration: 6.2, delay: 1.3 },
  { top: '26%', left: '64%', size: 2, duration: 6.7, delay: 2.9 },
  { top: '88%', left: '50%', size: 2.5, duration: 7.5, delay: 0.7 },
  { top: '14%', left: '48%', size: 2, duration: 8.0, delay: 1.9 },
] as const;

interface StackTransform {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

function getStackLayerTransform(offset: number, isLeaving: boolean): StackTransform {
  if (isLeaving) {
    return {
      x: 42,
      y: 14,
      rotate: 7.5,
      scale: 0.87,
      opacity: 0.28,
      zIndex: 8,
    };
  }

  switch (offset) {
    case 0:
      return { x: 0, y: 0, rotate: -0.6, scale: 1, opacity: 1, zIndex: 40 };
    case 1:
      return { x: -18, y: 10, rotate: -6.2, scale: 0.94, opacity: 0.94, zIndex: 30 };
    case 2:
      return { x: 20, y: 15, rotate: 6.4, scale: 0.89, opacity: 0.86, zIndex: 20 };
    case 3:
      return { x: -10, y: 21, rotate: -3.1, scale: 0.84, opacity: 0.72, zIndex: 10 };
    default:
      return { x: 4, y: 24, rotate: 2.2, scale: 0.81, opacity: 0, zIndex: 2 };
  }
}

interface MemoryFrameMetrics {
  cardWidth: number;
  cardHeight: number;
  orientation: 'portrait' | 'landscape' | 'square';
  objectFitClass: string;
}

function getMemoryFrameMetrics(
  viewportWidth: number,
  viewportHeight: number,
  naturalRatio?: number
): MemoryFrameMetrics {
  const isSmallScreen = viewportWidth > 0 && viewportWidth < 640;
  const padX = isSmallScreen ? 26 : 30;
  const padY = isSmallScreen ? 54 : 60;

  const maxPhotoW = isSmallScreen
    ? Math.min(320, Math.max(210, viewportWidth - 64))
    : Math.min(440, Math.max(280, viewportWidth - 140));
  const maxPhotoH = Math.max(
    250,
    Math.min(
      isSmallScreen ? 355 : 425,
      (viewportHeight > 0 ? viewportHeight : 820) - (isSmallScreen ? 290 : 300)
    )
  );

  const rawRatio = naturalRatio && naturalRatio > 0 ? naturalRatio : 0.757;
  const minClamp = 0.45;
  const maxClamp = 1.9;
  const isExtremeRatio = rawRatio < minClamp || rawRatio > maxClamp;
  const safeRatio = Math.min(Math.max(rawRatio, minClamp), maxClamp);

  let photoW = maxPhotoH * safeRatio;
  let photoH = maxPhotoH;
  if (photoW > maxPhotoW) {
    photoW = maxPhotoW;
    photoH = maxPhotoW / safeRatio;
  }

  const orientation: MemoryFrameMetrics['orientation'] =
    rawRatio > 1.05 ? 'landscape' : rawRatio < 0.95 ? 'portrait' : 'square';

  return {
    cardWidth: Math.round(photoW + padX),
    cardHeight: Math.round(photoH + padY),
    orientation,
    objectFitClass: isExtremeRatio
      ? 'object-contain object-center'
      : 'object-cover object-center',
  };
}

export function OurMemoriesGallery({
  onLock,
  onComplete,
  photos = OUR_MEMORIES_PHOTOS,
}: OurMemoriesGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);

  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isTransitioningToIvory, setIsTransitioningToIvory] = useState(false);
  const [photoRatios, setPhotoRatios] = useState<Record<string, number>>({});
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  }>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 820,
  }));

  const autoTimerRef = useRef<number | null>(null);
  const leavingTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const isPressedRef = useRef(false);
  const isFocusedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const recordPhotoRatio = useCallback(
    (id: string, naturalWidth: number, naturalHeight: number) => {
      if (!naturalWidth || !naturalHeight) return;
      const ratio = naturalWidth / naturalHeight;
      setPhotoRatios((prev) => {
        if (prev[id] && Math.abs(prev[id] - ratio) < 0.002) {
          return prev;
        }
        return { ...prev, [id]: ratio };
      });
    },
    []
  );

  const totalPhotos = photos.length;

  // Preload photos and capture natural aspect ratios for natural per-frame fitting
  useEffect(() => {
    photos.forEach((photo) => {
      const img = new Image();
      img.onload = () => {
        recordPhotoRatio(photo.id, img.naturalWidth, img.naturalHeight);
      };
      img.src = photo.src;
      if (img.complete && img.naturalWidth > 0) {
        recordPhotoRatio(photo.id, img.naturalWidth, img.naturalHeight);
      }
    });
  }, [photos, recordPhotoRatio]);

  useEffect(() => {
    return () => {
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
      }
      if (leavingTimerRef.current !== null) {
        window.clearTimeout(leavingTimerRef.current);
      }
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
      if (completionTimerRef.current !== null) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, []);

  const syncInteractionPause = useCallback(() => {
    const active =
      isHoveredRef.current || isPressedRef.current || isFocusedRef.current;
    setIsInteracting(active);
  }, []);

  const triggerFinishTransition = useCallback(() => {
    if (hasCompletedRef.current || !onCompleteRef.current) return;
    hasCompletedRef.current = true;

    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    setIsTransitioningToIvory(true);
    const fadeDuration = reduced ? 320 : 950;
    completionTimerRef.current = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, fadeDuration);
  }, [reduced]);

  const advanceToNextPhoto = useCallback(() => {
    if (totalPhotos <= 0 || hasCompletedRef.current) return;

    const current = activeIndexRef.current;
    if (current >= totalPhotos - 1 && onCompleteRef.current) {
      triggerFinishTransition();
      return;
    }

    if (totalPhotos <= 1) return;
    const next = (current + 1) % totalPhotos;
    activeIndexRef.current = next;
    setLeavingIndex(current);
    setActiveIndex(next);

    if (leavingTimerRef.current !== null) {
      window.clearTimeout(leavingTimerRef.current);
    }
    leavingTimerRef.current = window.setTimeout(() => {
      setLeavingIndex(null);
    }, LEAVING_ANIMATION_MS);
  }, [totalPhotos, triggerFinishTransition]);

  // Automatic 5-second rotation, paused cleanly during user interaction
  useEffect(() => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    if (
      totalPhotos <= 0 ||
      isInteracting ||
      isTransitioningToIvory ||
      hasCompletedRef.current
    ) {
      return;
    }

    autoTimerRef.current = window.setTimeout(() => {
      advanceToNextPhoto();
    }, AUTO_ROTATE_MS);

    return () => {
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [activeIndex, advanceToNextPhoto, isInteracting, isTransitioningToIvory, totalPhotos]);

  const handleManualTap = useCallback(() => {
    if (hasCompletedRef.current || isTransitioningToIvory) return;

    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    // Pause briefly on tap interaction, advance photo, then resume cycle cleanly
    isPressedRef.current = true;
    setIsInteracting(true);
    advanceToNextPhoto();

    if (!hasCompletedRef.current) {
      resumeTimerRef.current = window.setTimeout(() => {
        isPressedRef.current = false;
        syncInteractionPause();
      }, 900);
    }
  }, [advanceToNextPhoto, isTransitioningToIvory, syncInteractionPause]);

  return (
    <motion.div
      key="our-memories-gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-hidden text-[#54402E]"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #F1E7D6 0%, #EDE0CB 52%, #E8D9C2 100%)',
      }}
    >
      {/* Subtle Warm Parchment Undertones (#DCC7A8) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(241, 231, 214, 0.28) 0%, rgba(220, 199, 168, 0.22) 64%, rgba(220, 199, 168, 0.42) 100%)',
        }}
      />

      {/* Soft Floating Golden Bokeh Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {GOLDEN_BOKEH_ORBS.map((orb, idx) => (
          <motion.div
            key={`bokeh-${idx}`}
            initial={{ opacity: orb.opacity * 0.7, scale: 0.95 }}
            animate={
              reduced
                ? { opacity: orb.opacity }
                : {
                    opacity: [orb.opacity * 0.65, orb.opacity * 1.15, orb.opacity * 0.65],
                    y: [0, -18, 0],
                    x: [0, idx % 2 === 0 ? 12 : -12, 0],
                    scale: [0.95, 1.06, 0.95],
                  }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    duration: orb.duration,
                    delay: orb.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            className="absolute rounded-full blur-3xl"
            style={{
              top: 'top' in orb ? orb.top : undefined,
              bottom: 'bottom' in orb ? orb.bottom : undefined,
              left: 'left' in orb ? orb.left : undefined,
              right: 'right' in orb ? orb.right : undefined,
              width: orb.size,
              height: orb.size,
              background:
                'radial-gradient(circle, rgba(255, 251, 243, 0.72) 0%, rgba(220, 199, 168, 0.22) 55%, rgba(220, 199, 168, 0) 75%)',
            }}
          />
        ))}

        {/* Soft Glowing Golden Particles */}
        {GOLDEN_SPARK_PARTICLES.map((particle, idx) => (
          <motion.span
            key={`particle-${idx}`}
            initial={{ opacity: 0.2 }}
            animate={
              reduced
                ? { opacity: 0.45 }
                : {
                    opacity: [0.15, 0.82, 0.22],
                    y: [0, -24, 0],
                    scale: [0.85, 1.25, 0.85],
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
            className="absolute rounded-full bg-[#C9AA71]"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
              boxShadow: '0 0 9px 2px rgba(201, 170, 113, 0.42)',
            }}
          />
        ))}
      </div>

      {/* Main Centered Photo-Stack Stage */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-2 pb-9 sm:px-8 sm:pb-12">
        {/* Top Headings */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="font-editorial text-[1.15rem] italic tracking-[0.04em] text-[#6B533E] sm:text-[1.28rem]">
            kept every one ♡
          </p>
          <h1
            className="font-editorial mt-1 text-[clamp(2.35rem,6vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.015em] text-[#4E3B2B] drop-shadow-[0_2px_12px_rgba(255,248,236,0.35)]"
            style={{ textWrap: 'balance' }}
          >
            Our Memories
          </h1>
        </motion.div>

        {/* Layered White Polaroid Stack */}
        {(() => {
          const isSmallScreen = viewportSize.width > 0 && viewportSize.width < 640;
          const stagePadY = isSmallScreen ? 54 : 60;
          const maxPhotoH = Math.max(
            250,
            Math.min(
              isSmallScreen ? 355 : 425,
              (viewportSize.height > 0 ? viewportSize.height : 820) -
                (isSmallScreen ? 290 : 300)
            )
          );
          const stageHeight = Math.round(maxPhotoH + stagePadY);

          return (
            <div
              className="relative mt-6 flex w-full max-w-[460px] items-center justify-center select-none sm:mt-8 sm:max-w-[520px]"
              style={{ height: stageHeight }}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') {
                  isHoveredRef.current = true;
                  syncInteractionPause();
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') {
                  isHoveredRef.current = false;
                  syncInteractionPause();
                }
              }}
            >
              {/* Ambient golden rim behind the Polaroid stack */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 252, 245, 0.48) 0%, rgba(255, 252, 245, 0) 70%)',
                }}
              />

              {photos.map((photo, index) => {
                const offset = (index - activeIndex + totalPhotos) % totalPhotos;
                const isFront = offset === 0;
                const isLeaving = leavingIndex === index;
                const layer = getStackLayerTransform(offset, isLeaving);
                const metrics = getMemoryFrameMetrics(
                  viewportSize.width,
                  viewportSize.height,
                  photoRatios[photo.id]
                );

                return (
                  <motion.div
                    key={photo.id}
                    data-orientation={metrics.orientation}
                    initial={false}
                    animate={{
                      x: layer.x,
                      y: layer.y,
                      rotate: layer.rotate,
                      scale: layer.scale,
                      opacity: layer.opacity,
                    }}
                    transition={{
                      duration: reduced ? 0.2 : isLeaving ? 0.58 : 0.72,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      width: metrics.cardWidth,
                      height: metrics.cardHeight,
                      zIndex: layer.zIndex,
                      transformOrigin: 'center center',
                    }}
                    className={`absolute inset-0 m-auto ${
                      isFront ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                  >
                    {isFront ? (
                      <button
                        type="button"
                        onClick={handleManualTap}
                        onPointerDown={() => {
                          isPressedRef.current = true;
                          syncInteractionPause();
                        }}
                        onPointerCancel={() => {
                          isPressedRef.current = false;
                          syncInteractionPause();
                        }}
                        onFocus={(event) => {
                          if (event.currentTarget.matches(':focus-visible')) {
                            isFocusedRef.current = true;
                            syncInteractionPause();
                          }
                        }}
                        onBlur={() => {
                          isFocusedRef.current = false;
                          syncInteractionPause();
                        }}
                        aria-label={`${photo.alt}. Photo ${activeIndex + 1} of ${totalPhotos}. Tap to view the next memory.`}
                        className="group relative flex h-full w-full touch-manipulation cursor-pointer flex-col rounded-[6px] border border-[#EDE5D9] bg-[#FDFBF7] p-3 pb-10 text-left shadow-[0_22px_48px_-16px_rgba(110,84,54,0.34),0_10px_22px_-10px_rgba(110,84,54,0.22)] transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E7150] focus-visible:ring-offset-4 focus-visible:ring-offset-[#E8D9C2] active:scale-[0.985] sm:p-3.5 sm:pb-11"
                      >
                        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[2px] bg-[#F5EFE6] shadow-[inset_0_1px_3px_rgba(92,70,46,0.12)]">
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            draggable={false}
                            onLoad={(event) =>
                              recordPhotoRatio(
                                photo.id,
                                event.currentTarget.naturalWidth,
                                event.currentTarget.naturalHeight
                              )
                            }
                            className={`h-full w-full ${metrics.objectFitClass}`}
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#8C7052]/8 via-transparent to-white/5"
                          />
                        </div>
                      </button>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full w-full flex-col rounded-[6px] border border-[#E7DDD0] bg-[#FAF6EE] p-3 pb-10 shadow-[0_18px_38px_-16px_rgba(110,84,54,0.28),0_8px_18px_-8px_rgba(110,84,54,0.18)] sm:p-3.5 sm:pb-11"
                      >
                        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[2px] bg-[#F0E9DE] shadow-[inset_0_1px_3px_rgba(32,16,24,0.12)]">
                          <img
                            src={photo.src}
                            alt=""
                            draggable={false}
                            onLoad={(event) =>
                              recordPhotoRatio(
                                photo.id,
                                event.currentTarget.naturalWidth,
                                event.currentTarget.naturalHeight
                              )
                            }
                            className={`h-full w-full ${metrics.objectFitClass} brightness-[0.94] contrast-[0.98]`}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          );
        })()}

        {/* Indicator below the Polaroid stack */}
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: reduced ? 0 : 0.35 }}
          aria-live="polite"
          className="mt-9 text-center text-[13px] font-medium tracking-[0.04em] text-[#5B4533]/90 tabular-nums sm:mt-11 sm:text-[13.5px]"
        >
          Tap the photo to see the next one · {activeIndex + 1} of{' '}
          {totalPhotos}
        </motion.p>
      </main>

      {/* Subtle antique beige to warm-ivory dissolve veil after the final memory */}
      {isTransitioningToIvory && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduced ? 0.3 : 0.95,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none fixed inset-0 z-50 bg-[#F8F5EF]"
        />
      )}
    </motion.div>
  );
}
