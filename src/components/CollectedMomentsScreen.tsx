import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { COLLECTED_MOMENTS_CONFIG } from '../config/collectedMoments';

interface CollectedMomentsScreenProps {
  onLock: () => void;
  onContinue: () => void;
  onBack?: () => void;
}

/**
 * Hand-crafted organically deckled paper silhouette matching handmade cotton paper edges.
 * Uses normalized 0..1 coordinates for crisp SVG rendering and clip-path alignment.
 */
const DECKLE_MAIN_PAPER_PATH = `
  M 0.036 0.022
  C 0.068 0.014, 0.105 0.024, 0.144 0.018
  C 0.186 0.011, 0.228 0.021, 0.272 0.016
  C 0.315 0.010, 0.358 0.022, 0.402 0.015
  C 0.448 0.009, 0.492 0.019, 0.538 0.014
  C 0.585 0.008, 0.628 0.020, 0.674 0.013
  C 0.720 0.007, 0.764 0.018, 0.808 0.014
  C 0.854 0.010, 0.896 0.021, 0.938 0.016
  C 0.962 0.013, 0.976 0.024, 0.978 0.044
  C 0.980 0.088, 0.968 0.128, 0.977 0.174
  C 0.985 0.218, 0.966 0.262, 0.975 0.308
  C 0.984 0.352, 0.967 0.398, 0.976 0.444
  C 0.985 0.490, 0.968 0.536, 0.978 0.582
  C 0.986 0.626, 0.965 0.672, 0.974 0.718
  C 0.982 0.764, 0.966 0.810, 0.975 0.856
  C 0.983 0.900, 0.969 0.938, 0.966 0.964
  C 0.963 0.978, 0.946 0.984, 0.922 0.982
  C 0.878 0.978, 0.834 0.988, 0.788 0.981
  C 0.742 0.975, 0.696 0.986, 0.650 0.979
  C 0.604 0.973, 0.558 0.985, 0.512 0.978
  C 0.466 0.972, 0.420 0.984, 0.374 0.977
  C 0.328 0.971, 0.282 0.983, 0.236 0.977
  C 0.190 0.971, 0.144 0.984, 0.098 0.978
  C 0.068 0.974, 0.044 0.980, 0.030 0.972
  C 0.018 0.965, 0.016 0.944, 0.020 0.916
  C 0.024 0.872, 0.014 0.828, 0.022 0.782
  C 0.029 0.736, 0.015 0.690, 0.023 0.644
  C 0.030 0.598, 0.016 0.552, 0.024 0.506
  C 0.031 0.460, 0.015 0.414, 0.023 0.368
  C 0.030 0.322, 0.016 0.276, 0.024 0.230
  C 0.031 0.184, 0.017 0.138, 0.025 0.092
  C 0.031 0.060, 0.024 0.032, 0.036 0.022
  Z
`;

const TORN_SCRAP_BOOK_PATH = `
  M 0.04 0.05
  C 0.22 0.02, 0.42 0.07, 0.62 0.03
  C 0.78 0.01, 0.90 0.05, 0.96 0.08
  C 0.98 0.26, 0.93 0.48, 0.97 0.70
  C 0.99 0.84, 0.93 0.94, 0.88 0.97
  C 0.68 0.95, 0.46 0.99, 0.26 0.95
  C 0.12 0.93, 0.04 0.96, 0.02 0.86
  C 0.01 0.64, 0.05 0.42, 0.02 0.20
  C 0.01 0.11, 0.02 0.07, 0.04 0.05
  Z
`;

const TORN_KRAFT_NOTE_PATH = `
  M 0.06 0.18
  C 0.11 0.12, 0.18 0.14, 0.24 0.09
  C 0.31 0.03, 0.39 0.08, 0.46 0.04
  C 0.54 0.00, 0.62 0.07, 0.70 0.04
  C 0.79 0.01, 0.88 0.06, 0.97 0.05
  C 0.99 0.22, 0.97 0.46, 0.98 0.70
  C 0.99 0.86, 0.98 0.96, 0.95 0.99
  C 0.74 0.98, 0.50 0.99, 0.28 0.98
  C 0.16 0.98, 0.07 0.97, 0.02 0.94
  C 0.04 0.78, 0.01 0.62, 0.05 0.46
  C 0.08 0.34, 0.02 0.24, 0.06 0.18
  Z
`;

/**
 * Top-left antique printed book page scrap peeking beneath the handmade sheet.
 */
function AntiqueBookPageScrap() {
  const id = useId().replace(/:/g, '');
  const clipName = `antiqueBookScrap-${id}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-4 -left-4 z-10 h-[175px] w-[155px] -rotate-[26deg] select-none sm:-top-6 sm:-left-9 sm:h-[215px] sm:w-[190px]"
      style={{
        filter: 'drop-shadow(0 8px 14px rgba(84, 58, 32, 0.18))',
      }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipName} clipPathUnits="objectBoundingBox">
            <path d={TORN_SCRAP_BOOK_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative h-full w-full overflow-hidden p-4 sm:p-5"
        style={{
          clipPath: `url(#${clipName})`,
          background:
            'linear-gradient(155deg, #D5BC96 0%, #C6A97E 58%, #B49368 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bScrap${id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23bScrap${id})'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="font-editorial relative z-10 space-y-1.5 text-[10.5px] leading-[1.35] tracking-[0.02em] text-[#493420]/75 sm:text-[12px]">
          <p>is the path we keep</p>
          <p>in quiet pages back,</p>
          <p>so far along the years</p>
          <p>heard of the warm</p>
          <p>morning hours when</p>
          <p>every quiet thought</p>
          <p>returned softly home.</p>
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 18px rgba(72, 46, 22, 0.28)',
          }}
        />
      </div>
    </div>
  );
}

/**
 * Bottom-left torn graph/grid notebook scrap peeking beneath the main sheet.
 */
function TornGridPaperScrap() {
  const id = useId().replace(/:/g, '');
  const clipName = `gridScrap-${id}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-5 -left-3 z-10 h-[155px] w-[145px] -rotate-[14deg] select-none sm:-bottom-7 sm:-left-8 sm:h-[195px] sm:w-[175px]"
      style={{
        filter: 'drop-shadow(0 10px 16px rgba(84, 58, 32, 0.18))',
      }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipName} clipPathUnits="objectBoundingBox">
            <path d={TORN_SCRAP_BOOK_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          clipPath: `url(#${clipName})`,
          background:
            'linear-gradient(145deg, #DFCFBA 0%, #D2BE9F 62%, #C1AA87 100%)',
        }}
      >
        {/* Subtle vintage ruled square grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(132, 102, 72, 0.36) 1px, transparent 1px), linear-gradient(to bottom, rgba(132, 102, 72, 0.36) 1px, transparent 1px)',
            backgroundSize: '15px 15px',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 18px rgba(84, 56, 28, 0.24)',
          }}
        />
      </div>
    </div>
  );
}

/**
 * Top-right antique dark-bronze metal paperclip clipped onto the torn upper edge.
 */
function AntiqueMetalPaperclip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-4 right-7 z-40 rotate-[14deg] select-none sm:-top-5 sm:right-12"
      style={{
        filter: 'drop-shadow(2px 4px 5px rgba(36, 20, 8, 0.36))',
      }}
    >
      <svg
        width="44"
        height="88"
        viewBox="0 0 44 88"
        fill="none"
        className="h-[68px] w-[34px] sm:h-[86px] sm:w-[43px]"
      >
        <defs>
          <linearGradient id="bronzeWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D543B" />
            <stop offset="38%" stopColor="#3E2D1D" />
            <stop offset="72%" stopColor="#7C6348" />
            <stop offset="100%" stopColor="#2F2114" />
          </linearGradient>
        </defs>
        {/* Outer loop clipped over top edge of the sheet */}
        <path
          d="M 10 26 L 10 64 C 10 74.5, 32 74.5, 32 64 L 32 16 C 32 7.5, 16 7.5, 16 16 L 16 56 C 16 62, 26 62, 26 56 L 26 24"
          stroke="url(#bronzeWireGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crisp metallic rim highlight */}
        <path
          d="M 9.4 27 L 9.4 63.5 C 9.4 73.2, 31.4 73.2, 31.4 63.5 L 31.4 16.5 C 31.4 8.5, 16.6 8.5, 16.6 16.5 L 16.6 55.5"
          stroke="#B59B78"
          strokeOpacity="0.45"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Dried baby's breath / chamomile botanical sprigs pinned on the left edge with masking tape.
 */
function DriedBabysBreathWithTape() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[18%] -left-7 z-30 w-[132px] select-none sm:top-[19%] sm:-left-12 sm:w-[172px]"
    >
      {/* Dried botanical floral cluster SVG */}
      <svg
        viewBox="0 0 180 340"
        fill="none"
        className="h-auto w-full"
        style={{
          filter: 'drop-shadow(3px 5px 5px rgba(58, 38, 18, 0.28))',
        }}
      >
        {/* Main dried crossed stems extending down below tape */}
        <path
          d="M 88 326 C 86 276, 80 226, 76 178 C 72 136, 62 96, 48 58"
          stroke="#6E5739"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M 74 306 C 78 262, 82 214, 92 164 C 98 134, 110 98, 124 72"
          stroke="#7B6343"
          strokeWidth="1.9"
          strokeLinecap="round"
        />

        {/* Branching sub-twigs */}
        <path
          d="M 78 184 C 60 156, 44 134, 28 112"
          stroke="#755D3F"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 70 142 C 88 122, 108 106, 130 92"
          stroke="#755D3F"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M 62 104 C 46 86, 36 74, 24 60"
          stroke="#7D6547"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M 90 156 C 110 146, 128 134, 146 122"
          stroke="#7D6547"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M 60 100 C 66 72, 74 48, 80 28"
          stroke="#786041"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M 108 106 C 110 80, 106 58, 104 38"
          stroke="#786041"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Delicate dried florets (ivory/cream petals + golden-tan centers) */}
        {[
          { cx: 80, cy: 26, r: 9.5 },
          { cx: 52, cy: 48, r: 10.5 },
          { cx: 104, cy: 36, r: 9.5 },
          { cx: 126, cy: 66, r: 10 },
          { cx: 24, cy: 58, r: 9 },
          { cx: 44, cy: 86, r: 11.5 },
          { cx: 88, cy: 68, r: 11 },
          { cx: 146, cy: 116, r: 10 },
          { cx: 128, cy: 90, r: 10.5 },
          { cx: 28, cy: 110, r: 11 },
          { cx: 64, cy: 118, r: 10 },
          { cx: 104, cy: 118, r: 11.5 },
          { cx: 124, cy: 142, r: 9.5 },
          { cx: 46, cy: 146, r: 10 },
          { cx: 18, cy: 138, r: 8.5 },
          { cx: 82, cy: 150, r: 9 },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.cx}, ${f.cy}) rotate(${(i * 37) % 180})`}>
            {/* Soft blossom petals */}
            <circle cx={0} cy={-f.r * 0.44} r={f.r * 0.48} fill="#F3E8CE" stroke="#B79B6C" strokeWidth="0.65" />
            <circle cx={f.r * 0.42} cy={-f.r * 0.14} r={f.r * 0.48} fill="#EFE1C0" stroke="#B79B6C" strokeWidth="0.65" />
            <circle cx={f.r * 0.26} cy={f.r * 0.38} r={f.r * 0.48} fill="#EBD8B2" stroke="#B79B6C" strokeWidth="0.65" />
            <circle cx={-f.r * 0.28} cy={f.r * 0.36} r={f.r * 0.48} fill="#F5ECD7" stroke="#B79B6C" strokeWidth="0.65" />
            <circle cx={-f.r * 0.42} cy={-f.r * 0.14} r={f.r * 0.48} fill="#EDE0C2" stroke="#B79B6C" strokeWidth="0.65" />
            {/* Warm dried center */}
            <circle cx={0} cy={0} r={f.r * 0.34} fill="#C6A266" stroke="#8C6B3B" strokeWidth="0.7" />
            <circle cx={-0.8} cy={-0.8} r={f.r * 0.13} fill="#E8CF99" />
          </g>
        ))}
      </svg>

      {/* Semi-translucent cream masking tape pinning the lower stems */}
      <div
        className="absolute bottom-[17%] left-[20%] h-7 w-[92px] rotate-[10deg] sm:h-8 sm:w-[114px]"
        style={{
          background:
            'linear-gradient(90deg, rgba(235,222,196,0.72) 0%, rgba(244,234,212,0.82) 50%, rgba(232,218,190,0.72) 100%)',
          clipPath:
            'polygon(2% 6%, 98% 0%, 100% 22%, 97% 44%, 100% 70%, 96% 96%, 4% 100%, 0% 76%, 3% 48%, 0% 24%)',
          boxShadow: '0 2px 5px rgba(56, 36, 18, 0.18)',
          borderTop: '1px solid rgba(255, 252, 244, 0.45)',
          borderBottom: '1px solid rgba(164, 138, 102, 0.28)',
        }}
      />
    </div>
  );
}

/**
 * Bottom-right overlapping torn kraft note with handwritten cursive motto.
 */
function TornKraftCornerNote() {
  const id = useId().replace(/:/g, '');
  const clipName = `kraftCorner-${id}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-2 -bottom-4 z-30 h-[132px] w-[168px] -rotate-[1.5deg] select-none sm:-right-4 sm:-bottom-5 sm:h-[156px] sm:w-[205px]"
      style={{
        filter:
          'drop-shadow(-4px -4px 10px rgba(42, 24, 10, 0.24)) drop-shadow(0 8px 14px rgba(32, 18, 8, 0.3))',
      }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipName} clipPathUnits="objectBoundingBox">
            <path d={TORN_KRAFT_NOTE_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative flex h-full w-full flex-col justify-center overflow-hidden pr-5 pl-9 pt-4 sm:pr-7 sm:pl-12 sm:pt-5"
        style={{
          clipPath: `url(#${clipName})`,
          background:
            'linear-gradient(150deg, #CFAF82 0%, #C19D6D 55%, #B18A59 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.075]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='kNote${id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23kNote${id})'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 2px 12px rgba(96, 62, 28, 0.26)',
          }}
        />

        <div className="font-handwritten relative z-10 flex flex-col text-[1.28rem] leading-[1.12] text-[#352315] sm:text-[1.5rem]">
          <span className="self-center pr-2">
            {COLLECTED_MOMENTS_CONFIG.cornerNoteLines[0]}
          </span>
          <span className="self-end pr-2">
            {COLLECTED_MOMENTS_CONFIG.cornerNoteLines[1]}
          </span>
          <span className="self-start pl-1">
            {COLLECTED_MOMENTS_CONFIG.cornerNoteLines[2]}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CollectedMomentsScreen({
  onLock,
  onContinue,
  onBack,
}: CollectedMomentsScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const clipId = useId().replace(/:/g, '');
  const mainClipId = `collectedMainPaper-${clipId}`;

  return (
    <motion.div
      key="collected-moments-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden text-[#3E2B1E]"
      style={{
        background:
          'radial-gradient(circle at 50% 40%, #F7F0E4 0%, #E8D9C2 54%, #DCC7A8 100%)',
      }}
    >
      {/* Gentle warm ivory lighting (#FBF6EC) & delicate soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(251, 246, 236, 0.72) 0%, rgba(247, 240, 228, 0.2) 45%, rgba(220, 199, 168, 0.44) 100%)',
          boxShadow: 'inset 0 0 115px rgba(176, 144, 102, 0.34)',
        }}
      />

      {/* Very subtle natural paper texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.036] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='kraftDesk-${clipId}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23kraftDesk-${clipId})'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Minimal Header */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 pt-5 pb-2 sm:px-10 sm:pt-6">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-[#6B5442] transition-colors duration-150 hover:text-[#2D2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Letter</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered Scrapbook Collage Stage */}
      <main className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 pt-5 pb-12 sm:px-12 sm:pt-6 sm:pb-16">
        <motion.section
          aria-labelledby="collected-moments-heading"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[515px] sm:max-w-[580px]"
        >
          {/* SVG clipPath for organic deckled paper sheet */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id={mainClipId} clipPathUnits="objectBoundingBox">
                <path d={DECKLE_MAIN_PAPER_PATH} />
              </clipPath>
            </defs>
          </svg>

          {/* Back Layer Scraps (Top-Left Vintage Printed Page & Bottom-Left Graph Paper) */}
          <AntiqueBookPageScrap />
          <TornGridPaperScrap />

          {/* Top-Right Bronze Paperclip */}
          <AntiqueMetalPaperclip />

          {/* Main Deckle-Edge Beige Cotton Paper Sheet */}
          <div
            className="relative z-20"
            style={{
              filter:
                'drop-shadow(0 18px 32px rgba(88, 63, 38, 0.2)) drop-shadow(0 5px 12px rgba(88, 63, 38, 0.11))',
            }}
          >
            <article
              className="relative flex min-h-[600px] w-full flex-col justify-start overflow-hidden pt-12 pr-6 pb-28 pl-[5.25rem] sm:min-h-[700px] sm:pt-16 sm:pr-10 sm:pb-32 sm:pl-[7.5rem]"
              style={{
                clipPath: `url(#${mainClipId})`,
              }}
            >
              {/* Warm ecru cotton paper base & subtle deckled edge border */}
              <svg
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <defs>
                  <radialGradient id={`paperFill-${clipId}`} cx="0.48" cy="0.42" r="0.72">
                    <stop offset="0%" stopColor="#F2EAD9" />
                    <stop offset="64%" stopColor="#EAE0CC" />
                    <stop offset="100%" stopColor="#DECFAF" />
                  </radialGradient>
                </defs>
                <path
                  d={DECKLE_MAIN_PAPER_PATH}
                  fill={`url(#paperFill-${clipId})`}
                  stroke="#D3C2A3"
                  strokeWidth="2.4"
                  strokeOpacity="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Paper grain overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.075]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cottonGrain-${clipId}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cottonGrain-${clipId})'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Subtle organic cotton flecks & fibers */}
              <svg
                aria-hidden="true"
                viewBox="0 0 540 720"
                preserveAspectRatio="none"
                fill="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <circle cx="88" cy="76" r="1.2" fill="#7D6243" fillOpacity="0.32" />
                <circle cx="436" cy="140" r="1.1" fill="#7D6243" fillOpacity="0.28" />
                <circle cx="388" cy="64" r="0.9" fill="#7D6243" fillOpacity="0.26" />
                <circle cx="478" cy="310" r="1.25" fill="#7D6243" fillOpacity="0.3" />
                <circle cx="96" cy="492" r="1.15" fill="#7D6243" fillOpacity="0.28" />
                <circle cx="445" cy="520" r="1.1" fill="#7D6243" fillOpacity="0.26" />
                <circle cx="290" cy="640" r="1.2" fill="#7D6243" fillOpacity="0.3" />
                <circle cx="195" cy="162" r="0.95" fill="#7D6243" fillOpacity="0.24" />
                <circle cx="344" cy="285" r="1" fill="#7D6243" fillOpacity="0.25" />
                <circle cx="230" cy="438" r="1.05" fill="#7D6243" fillOpacity="0.24" />
                <path d="M442 214 Q448 220 444 226" stroke="#856A4B" strokeOpacity="0.26" strokeWidth="0.85" strokeLinecap="round" />
                <path d="M126 378 Q133 383 137 377" stroke="#856A4B" strokeOpacity="0.24" strokeWidth="0.8" strokeLinecap="round" />
                <path d="M398 468 Q404 474 409 469" stroke="#856A4B" strokeOpacity="0.25" strokeWidth="0.85" strokeLinecap="round" />
                <path d="M180 612 Q187 608 192 613" stroke="#856A4B" strokeOpacity="0.24" strokeWidth="0.8" strokeLinecap="round" />
              </svg>

              {/* Soft inner warm vignette */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  boxShadow:
                    'inset 0 0 34px rgba(146, 114, 76, 0.2), inset 0 0 8px rgba(114, 84, 52, 0.14)',
                }}
              />

              {/* Main Text Content */}
              <div className="relative z-10 max-w-none text-left">
                <h1
                  id="collected-moments-heading"
                  className="font-editorial text-[clamp(2.05rem,4.8vw,2.75rem)] leading-[1.14] font-medium tracking-[-0.01em] text-[#4A3423]"
                >
                  {COLLECTED_MOMENTS_CONFIG.heading}
                </h1>

                <div
                  aria-hidden="true"
                  className="mt-3 h-[1.5px] w-16 bg-[#7B6249]/75"
                />

                <div className="mt-9 space-y-6 sm:mt-11 sm:space-y-8">
                  {COLLECTED_MOMENTS_CONFIG.paragraphs.map((paragraph, idx) => (
                    <motion.p
                      key={idx}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduced ? 0.15 : 0.65,
                        delay: reduced ? 0 : 0.14 + idx * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="font-editorial whitespace-pre-line text-[clamp(1.16rem,2.6vw,1.44rem)] leading-[1.64] text-[#3B2A1E]"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduced ? 0.15 : 0.65,
                    delay: reduced ? 0 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-editorial mt-8 text-[clamp(1.18rem,2.6vw,1.46rem)] font-semibold text-[#4A3423] sm:mt-10"
                >
                  {COLLECTED_MOMENTS_CONFIG.closingLine}
                </motion.p>
              </div>
            </article>
          </div>

          {/* Left-Edge Dried Baby's Breath Sprig & Translucent Masking Tape */}
          <DriedBabysBreathWithTape />

          {/* Bottom-Right Torn Kraft Note with Handwritten Quote */}
          <TornKraftCornerNote />
        </motion.section>

        {/* Continue Button to Open the Keepsake Memory Book */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0.2 : 0.65,
            delay: reduced ? 0 : 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-9 sm:mt-11"
        >
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#E7D8C0]/45 bg-[#3E2B1E] px-7 py-2.5 text-[13.5px] font-medium tracking-[0.03em] text-[#FAF3EA] shadow-[0_12px_24px_-12px_rgba(88,63,38,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2F2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8D9C2]"
          >
            <span>Continue</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[1.9]" aria-hidden="true" />
          </button>
        </motion.div>
      </main>
    </motion.div>
  );
}
