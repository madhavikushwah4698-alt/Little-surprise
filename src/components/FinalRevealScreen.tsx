import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FINAL_REVEAL_CONFIG } from '../config/finalReveal';

interface FinalRevealScreenProps {
  onLock: () => void;
  onBack?: () => void;
  onContinue?: () => void;
}

const ANTIQUE_GOLD_SPECKS = [
  { top: '20%', left: '18%', size: 2.5, delay: 0.2, duration: 7.4 },
  { top: '24%', right: '19%', size: 2, delay: 0.9, duration: 8.2 },
  { top: '46%', left: '11%', size: 2, delay: 1.4, duration: 7.9 },
  { top: '50%', right: '11%', size: 2.5, delay: 0.6, duration: 8.6 },
  { bottom: '24%', left: '20%', size: 2, delay: 1.1, duration: 7.7 },
  { bottom: '22%', right: '18%', size: 2.5, delay: 0.4, duration: 8.3 },
] as const;

const TINY_GOLD_STARS = [
  { top: '14%', left: '14%', size: 11, delay: 0.3 },
  { top: '18%', right: '14%', size: 10, delay: 0.9 },
  { bottom: '17%', left: '15%', size: 9, delay: 1.4 },
  { bottom: '15%', right: '14%', size: 11, delay: 0.7 },
] as const;

function BotanicalCornerTopRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 220"
      fill="none"
      className="pointer-events-none h-28 w-28 text-[#8E7358] opacity-[0.26] sm:h-44 sm:w-44"
    >
      <path
        d="M210 12 C174 32, 148 62, 126 96 C110 122, 94 146, 74 170"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M170 42 C152 36, 136 38, 122 46"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M146 68 C158 82, 164 98, 160 116"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M118 108 C100 104, 84 108, 70 120"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M122 46 C112 40, 104 45, 109 53 C115 56, 120 52, 122 46 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M160 116 C166 126, 160 135, 151 129 C148 123, 154 117, 160 116 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M70 120 C60 118, 54 126, 62 131 C68 132, 72 126, 70 120 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M74 170 C64 174, 60 184, 70 185 C77 182, 78 175, 74 170 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle cx="146" cy="39" r="1.5" fill="#C49D58" fillOpacity="0.68" />
      <circle cx="98" cy="95" r="1.4" fill="#C49D58" fillOpacity="0.62" />
    </svg>
  );
}

function BotanicalCornerBottomLeft() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 220"
      fill="none"
      className="pointer-events-none h-28 w-28 text-[#8E7358] opacity-[0.26] sm:h-44 sm:w-44"
    >
      <path
        d="M12 208 C46 186, 74 156, 96 120 C112 94, 128 70, 150 48"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M50 178 C68 184, 84 182, 98 174"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M76 150 C64 136, 60 120, 64 102"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M104 108 C122 112, 138 106, 152 94"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M98 174 C108 180, 116 174, 110 166 C104 164, 99 168, 98 174 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M64 102 C58 92, 64 84, 73 90 C76 96, 70 101, 64 102 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M152 94 C162 96, 168 88, 160 83 C154 82, 150 88, 152 94 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M150 48 C160 44, 164 34, 154 33 C147 36, 146 43, 150 48 Z"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle cx="78" cy="182" r="1.5" fill="#C49D58" fillOpacity="0.68" />
      <circle cx="124" cy="124" r="1.4" fill="#C49D58" fillOpacity="0.62" />
    </svg>
  );
}

/**
 * Delicate antique-gold corner bracket ornament for the vintage bookplate frame.
 */
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
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={`pointer-events-none absolute ${positionClass} ${
        flipX ? '-scale-x-100' : ''
      } ${flipY ? '-scale-y-100' : ''}`}
    >
      <path
        d="M2 24 V6 C2 3.8, 3.8 2, 6 2 H24"
        stroke="#B9914C"
        strokeOpacity="0.65"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M6 16 V7.5 C6 6.6, 6.6 6, 7.5 6 H16"
        stroke="#C7A362"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path
        d="M8.5 8.5 L10 7 L11.5 8.5 L10 10 Z"
        fill="#C49D58"
        fillOpacity="0.72"
      />
    </svg>
  );
}

/**
 * Thin vintage ornamental divider with antique-gold fleuron crest and tapered hairlines.
 */
function VintageOrnamentalDivider({
  variant = 'crown',
}: {
  variant?: 'crown' | 'flourish' | 'finial';
}) {
  if (variant === 'flourish') {
    return (
      <div
        aria-hidden="true"
        className="flex w-full max-w-[260px] items-center justify-center gap-3 sm:max-w-[300px]"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#B8914E]/60 to-[#B8914E]/75" />
        <svg
          width="52"
          height="16"
          viewBox="0 0 52 16"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M4 8 C10 8, 13 3.5, 18 5.5 C21 6.7, 22 8, 26 8 C30 8, 31 6.7, 34 5.5 C39 3.5, 42 8, 48 8"
            stroke="#B48C48"
            strokeOpacity="0.78"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M26 3.2 L27.6 6.4 L30.8 8 L27.6 9.6 L26 12.8 L24.4 9.6 L21.2 8 L24.4 6.4 Z"
            fill="#C7A15C"
            fillOpacity="0.88"
          />
          <circle cx="13" cy="8" r="1.1" fill="#C49D58" fillOpacity="0.72" />
          <circle cx="39" cy="8" r="1.1" fill="#C49D58" fillOpacity="0.72" />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#B8914E]/60 to-[#B8914E]/75" />
      </div>
    );
  }

  if (variant === 'finial') {
    return (
      <div
        aria-hidden="true"
        className="flex w-full max-w-[200px] items-center justify-center gap-2.5 sm:max-w-[230px]"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#B8914E]/60" />
        <svg
          width="30"
          height="12"
          viewBox="0 0 30 12"
          fill="none"
          className="shrink-0"
        >
          <circle cx="5" cy="6" r="1" fill="#C49D58" fillOpacity="0.65" />
          <path
            d="M15 2 L16.8 6 L15 10 L13.2 6 Z"
            fill="#C6A05A"
            fillOpacity="0.82"
          />
          <circle cx="25" cy="6" r="1" fill="#C49D58" fillOpacity="0.65" />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#B8914E]/60" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex w-full max-w-[220px] items-center justify-center gap-3 sm:max-w-[260px]"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#B8914E]/50 to-[#B8914E]/70" />
      <svg
        width="36"
        height="18"
        viewBox="0 0 36 18"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M3 10.5 C7.5 10.5, 10.5 6, 13.5 7.5 C15 8.2, 15.8 9.2, 18 9.2 C20.2 9.2, 21 8.2, 22.5 7.5 C25.5 6, 28.5 10.5, 33 10.5"
          stroke="#B48C48"
          strokeOpacity="0.72"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M18 2.2 L19.3 7.2 L24.2 8.5 L19.3 9.8 L18 14.8 L16.7 9.8 L11.8 8.5 L16.7 7.2 Z"
          fill="#C7A15C"
          fillOpacity="0.86"
        />
        <circle cx="8" cy="10.2" r="1" fill="#C49D58" fillOpacity="0.65" />
        <circle cx="28" cy="10.2" r="1" fill="#C49D58" fillOpacity="0.65" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#B8914E]/50 to-[#B8914E]/70" />
    </div>
  );
}

export function FinalRevealScreen({
  onLock,
  onBack,
  onContinue,
}: FinalRevealScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const [showContinue, setShowContinue] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setShowContinue(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowContinue(true);
    }, 1_400);

    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <motion.div
      key="final-reveal-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.25 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-hidden text-[#3A291F]"
      style={{
        background:
          'radial-gradient(circle at 50% 44%, #FBF6EC 0%, #F4E9D6 48%, #E8D9C2 84%, #DEC9AA 100%)',
      }}
    >
      {/* Subtle handmade paper texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='dedicationPaperGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23dedicationPaperGrain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft warm lighting & delicate antique edge vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255, 250, 236, 0.65) 0%, rgba(244, 224, 186, 0.18) 44%, rgba(210, 182, 142, 0.34) 100%)',
          boxShadow: 'inset 0 0 110px rgba(172, 138, 96, 0.28)',
        }}
      />

      {/* Gentle central champagne-gold ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-hidden"
      >
        <motion.div
          initial={reduced ? { opacity: 0.45 } : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-[340px] w-[340px] rounded-full blur-3xl sm:h-[520px] sm:w-[520px]"
          style={{
            background:
              'radial-gradient(circle, rgba(248, 228, 184, 0.48) 0%, rgba(226, 192, 132, 0.16) 50%, rgba(226, 192, 132, 0) 76%)',
          }}
        />
      </div>

      {/* Subtle botanical line illustrations near outer corners */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 z-10 overflow-hidden"
      >
        <BotanicalCornerTopRight />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 z-10 overflow-hidden"
      >
        <BotanicalCornerBottomLeft />
      </div>

      {/* Tiny antique gold stars & floating dust specks */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      >
        {TINY_GOLD_STARS.map((star, idx) => (
          <motion.div
            key={`gold-star-${idx}`}
            style={{
              top: 'top' in star ? star.top : undefined,
              left: 'left' in star ? star.left : undefined,
              right: 'right' in star ? star.right : undefined,
              bottom: 'bottom' in star ? star.bottom : undefined,
            }}
            initial={reduced ? { opacity: 0.38 } : { opacity: 0.22, scale: 0.94 }}
            animate={
              reduced
                ? { opacity: 0.38 }
                : { opacity: [0.22, 0.52, 0.24], scale: [0.94, 1.05, 0.95] }
            }
            transition={{
              duration: 5.2 + idx * 0.8,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute"
          >
            <svg width={star.size} height={star.size} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.4 C12.7 8.4, 15.6 11.3, 21.6 12 C15.6 12.7, 12.7 15.6, 12 21.6 C11.3 15.6, 8.4 12.7, 2.4 12 C8.4 11.3, 11.3 8.4, 12 2.4 Z"
                fill="#DFBE82"
                fillOpacity="0.76"
                stroke="#B88E4A"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        ))}

        {ANTIQUE_GOLD_SPECKS.map((speck, idx) => (
          <motion.span
            key={`gold-speck-${idx}`}
            initial={reduced ? { opacity: 0.28 } : { opacity: 0.16, y: 0 }}
            animate={
              reduced
                ? { opacity: 0.28 }
                : {
                    opacity: [0.16, 0.44, 0.18],
                    y: [0, -14, 0],
                    scale: [0.9, 1.15, 0.9],
                  }
            }
            transition={{
              duration: speck.duration,
              delay: speck.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-[#C49D58]"
            style={{
              top: 'top' in speck ? speck.top : undefined,
              bottom: 'bottom' in speck ? speck.bottom : undefined,
              left: 'left' in speck ? speck.left : undefined,
              right: 'right' in speck ? speck.right : undefined,
              width: speck.size,
              height: speck.size,
              boxShadow: '0 0 6px 1px rgba(196, 157, 88, 0.28)',
            }}
          />
        ))}
      </div>

      {/* Minimal Top Navigation */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 pt-5 pb-2 sm:px-10 sm:pt-7">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#6B5442] transition-colors duration-150 hover:text-[#2D2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89048]/60 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Last Page</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered Vintage Dedication Stage */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 pt-4 pb-12 sm:px-10 sm:pb-16">
        <motion.section
          aria-labelledby="dedication-heading"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0.25 : 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex w-full max-w-[540px] flex-col items-center rounded-[12px] border border-[#C6A774]/40 bg-[#FCF7EC]/62 px-8 py-14 text-center shadow-[0_24px_54px_-24px_rgba(88,63,38,0.22),inset_0_0_36px_rgba(244,228,196,0.4)] backdrop-blur-[2px] sm:max-w-[600px] sm:px-14 sm:py-18"
        >
          {/* Delicate inset hairline border */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-[8px] border border-[#C6A774]/24 sm:inset-3.5"
          />

          {/* Antique-gold corner filigree accents */}
          <CornerFiligree positionClass="top-3.5 left-3.5 sm:top-4.5 sm:left-4.5" />
          <CornerFiligree positionClass="top-3.5 right-3.5 sm:top-4.5 sm:right-4.5" flipX />
          <CornerFiligree positionClass="bottom-3.5 left-3.5 sm:bottom-4.5 sm:left-4.5" flipY />
          <CornerFiligree positionClass="bottom-3.5 right-3.5 sm:bottom-4.5 sm:right-4.5" flipX flipY />

          {/* Top thin vintage ornamental divider */}
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              duration: reduced ? 0.2 : 0.9,
              delay: reduced ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex w-full justify-center"
          >
            <VintageOrnamentalDivider variant="crown" />
          </motion.div>

          {/* Primary Dedication Line — Main Visual Focus */}
          <motion.h1
            id="dedication-heading"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.25 : 1.0,
              delay: reduced ? 0 : 0.38,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-editorial mt-7 text-[clamp(2.45rem,6.5vw,4.1rem)] leading-[1.12] font-medium tracking-[-0.015em] text-[#3A291F] sm:mt-8"
            style={{ textWrap: 'balance' }}
          >
            {FINAL_REVEAL_CONFIG.dedicationLine}
          </motion.h1>

          {/* Center thin vintage ornamental divider */}
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              duration: reduced ? 0.2 : 0.9,
              delay: reduced ? 0 : 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="my-6 flex w-full justify-center sm:my-7"
          >
            <VintageOrnamentalDivider variant="flourish" />
          </motion.div>

          {/* Attribution Line — Delicate Handwritten Script */}
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.25 : 0.95,
              delay: reduced ? 0 : 0.88,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-handwritten text-[clamp(1.75rem,4.2vw,2.45rem)] leading-[1.2] tracking-[0.02em] text-[#6B533E]"
          >
            {FINAL_REVEAL_CONFIG.authorLine}
          </motion.p>

          {/* Bottom thin vintage ornamental finial */}
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              duration: reduced ? 0.2 : 0.9,
              delay: reduced ? 0 : 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-7 flex w-full justify-center sm:mt-8"
          >
            <VintageOrnamentalDivider variant="finial" />
          </motion.div>
        </motion.section>

        {/* Discreet Continue Action */}
        {onContinue && (
          <motion.div
            initial={false}
            animate={
              showContinue
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: reduced ? 0 : 8 }
            }
            transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
            className={`mt-8 sm:mt-10 ${
              showContinue ? 'pointer-events-auto' : 'pointer-events-none select-none'
            }`}
          >
            <button
              type="button"
              tabIndex={showContinue ? 0 : -1}
              onClick={onContinue}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#C6A774]/65 bg-[#FAF4E8]/90 px-6 py-2.5 text-[13.5px] font-medium tracking-[0.02em] text-[#3A291F] shadow-[0_10px_22px_-14px_rgba(68,46,28,0.28)] transition-colors duration-150 hover:border-[#A88962] hover:bg-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89048]/60 whitespace-nowrap shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#8A6734]" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
