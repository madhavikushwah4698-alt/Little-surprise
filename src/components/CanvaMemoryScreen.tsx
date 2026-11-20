import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const CANVA_MEMORY_CONFIG = {
  /** Public Canva view URL (canva.link shortlink or full canva.com/design/.../view URL) */
  publicViewUrl: 'https://canva.link/7y0b92wi86bpxxe',
  /** Resolved iframe-compatible Canva embed URL (?embed drops X-Frame-Options) */
  embedUrl:
    'https://www.canva.com/design/DAHbGYQ7baY/ysuiAUYeFyu_OQOLy55bUQ/view?embed',
  /** Optional high-resolution exported image fallback if you ever replace the embed */
  fallbackImageUrl: '',
  /** Exact Canva artwork dimensions (1024 x 821) to preserve full proportions without cropping */
  designWidth: 1024,
  designHeight: 821,
  /** Screen remains visible for exactly 15 seconds before gently fading out */
  displayDurationMs: 15_000,
} as const;

function resolveCanvaEmbedUrl(): string {
  const rawPublic = CANVA_MEMORY_CONFIG.publicViewUrl.trim();
  const configuredEmbed = CANVA_MEMORY_CONFIG.embedUrl.trim();

  if (
    rawPublic &&
    rawPublic !== 'https://canva.link/7y0b92wi86bpxxe' &&
    rawPublic.includes('canva.com/design/')
  ) {
    try {
      const parsed = new URL(rawPublic);
      if (!parsed.searchParams.has('embed')) {
        parsed.searchParams.set('embed', '');
      }
      return parsed.toString().replace('embed=', 'embed');
    } catch {
      return configuredEmbed || rawPublic;
    }
  }

  return configuredEmbed || rawPublic;
}

interface CanvaMemoryScreenProps {
  onComplete: () => void;
}

export function CanvaMemoryScreen({ onComplete }: CanvaMemoryScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    hasCompletedRef.current = false;
    const timerId = window.setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current();
      }
    }, CANVA_MEMORY_CONFIG.displayDurationMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const embedSrc = resolveCanvaEmbedUrl();
  const fallbackImg = CANVA_MEMORY_CONFIG.fallbackImageUrl.trim();
  const ratioExpression = `${CANVA_MEMORY_CONFIG.designWidth} / ${CANVA_MEMORY_CONFIG.designHeight}`;

  return (
    <motion.main
      key="canva-memory-screen"
      aria-label="Birthday memory showcase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: prefersReducedMotion ? 0.2 : 0.75,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      transition={{
        duration: prefersReducedMotion ? 0.2 : 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#F8F5EF] px-4 py-6 text-[#403128] sm:px-8 sm:py-10"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 45%, rgba(243, 237, 228, 0.78) 0%, rgba(248, 245, 239, 0.98) 74%)',
      }}
    >
      {/* Subtle organic paper grain matching existing screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='memoryPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23memoryPaper)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 mx-auto overflow-hidden rounded-2xl border border-[#E5D9C9]/90 bg-[#F3EDE4] shadow-[0_24px_60px_-24px_rgba(64,49,40,0.12)]"
        style={{
          width: `min(92vw, 940px, calc(82dvh * ${CANVA_MEMORY_CONFIG.designWidth} / ${CANVA_MEMORY_CONFIG.designHeight}))`,
          aspectRatio: ratioExpression,
        }}
      >
        {!iframeFailed ? (
          <>
            {!iframeLoaded && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#F3EDE4]"
              >
                <span className="font-editorial text-[1.05rem] italic tracking-[0.02em] text-[#A18C77]">
                  Opening your memory...
                </span>
              </div>
            )}

            <iframe
              src={embedSrc}
              title="Diwali moments — Birthday Memory"
              loading="eager"
              allow="fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeFailed(true)}
              className="relative z-10 block h-full w-full border-0 bg-transparent"
            />
          </>
        ) : fallbackImg ? (
          <img
            src={fallbackImg}
            alt="Birthday memory design"
            className="block h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#F3EDE4] px-6 text-center">
            <p className="font-editorial text-[1.3rem] text-[#403128]">
              Memory preview could not load inline.
            </p>
            <a
              href={CANVA_MEMORY_CONFIG.publicViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-medium text-[#7A685B] underline underline-offset-4 transition-colors hover:text-[#403128]"
            >
              Open memory in Canva
            </a>
          </div>
        )}
      </motion.div>
    </motion.main>
  );
}
