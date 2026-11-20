import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SurpriseData } from '../types';
import { STORY_CHAPTER_CONFIG } from '../config/storyChapters';

interface BirthdayExperienceProps {
  data: SurpriseData;
  onLock: () => void;
  initialChapter?: ChapterNumber;
  onContinueToChallenge?: () => void;
}

type ChapterNumber = 1 | 2 | 3 | 4 | 5;

const TOTAL_CHAPTERS = 5;

function PaperGrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='chapterPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23chapterPaper)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

type LetterScene = 'entrance' | 'opening' | 'revealed' | 'closing';

function HandDrawnOpenBook({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={
        reducedMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
            }
      }
      transition={{
        duration: reducedMotion ? 0.35 : 0.85,
        delay: reducedMotion ? 0.1 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative mx-auto w-full max-w-[290px] sm:max-w-[340px] md:max-w-[370px]"
    >
      <motion.div
        animate={reducedMotion ? {} : { y: [0, -4, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 360 280"
          fill="none"
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Delicate hand-drawn open book illustration in muted taupe line art with botanical leaf detail"
        >
          {/* Subtle paper-like shadow beneath the open book */}
          <ellipse
            cx="180"
            cy="228"
            rx="126"
            ry="12"
            fill="#EAE0D2"
            opacity="0.58"
          />

          {/* Delicate bookmark ribbon emerging softly from center spine */}
          <motion.path
            animate={
              reducedMotion
                ? {}
                : {
                    rotate: [-1.1, 1.3, -1.1],
                  }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '180px 195px' }}
            d="M177 192 L175 245 L181.5 239 L188 246 L184 192"
            fill="#EFE3D8"
            stroke="#9E8270"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hardcover backing edges */}
          <path
            d="M34 88 L30 202 C78 197, 132 199, 174 209 C178 210, 182 210, 186 209 C228 199, 282 197, 330 202 L326 88"
            fill="#F1E8DA"
            stroke="#8D7764"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layered outer page thickness */}
          <path
            d="M40 82 L38 193 C84 188, 136 190, 177 202 L183 202 C224 190, 276 188, 322 193 L320 82"
            fill="#F6F0E6"
            stroke="#9B8572"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Open Page */}
          <path
            d="M180 76 C146 58, 92 58, 46 72 L44 184 C90 172, 144 174, 180 194 Z"
            fill="#FCF9F3"
            stroke="#7E6956"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Open Page */}
          <path
            d="M180 76 C214 58, 268 58, 314 72 L316 184 C270 172, 216 174, 180 194 Z"
            fill="#FAF6EE"
            stroke="#7E6956"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle page curl edge accents */}
          <path
            d="M52 79 C94 67, 144 68, 175 83"
            stroke="#C8B8A4"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
          <path
            d="M308 79 C266 67, 216 68, 185 83"
            stroke="#C8B8A4"
            strokeWidth="0.95"
            strokeLinecap="round"
          />

          {/* Center spine stitch & shadow groove */}
          <path
            d="M180 76 L180 194"
            stroke="#7E6956"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M174 84 C174 115, 174 152, 174 186"
            stroke="#DFD2C0"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M186 84 C186 115, 186 152, 186 186"
            stroke="#DFD2C0"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Left Page: Delicate handwritten verse/journal lines */}
          <g
            stroke="#A18C77"
            strokeWidth="1.05"
            strokeLinecap="round"
            opacity="0.82"
          >
            <path d="M68 95 C92 92, 120 92, 146 96" />
            <path d="M68 110 C96 107, 128 108, 152 112" />
            <path d="M68 124 C90 121, 114 122, 134 125" />
            <path d="M68 142 C94 139, 124 140, 150 144" />
            <path d="M68 156 C88 154, 108 154, 126 157" />
          </g>

          {/* Right Page: Tiny botanical detail */}
          <g strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M248 152 C246 132, 249 114, 256 96"
              stroke="#8D7764"
              strokeWidth="1.15"
            />
            <path
              d="M249 135 C239 131, 234 124, 236 118 C243 119, 248 126, 249 135 Z"
              fill="#F1E7DC"
              stroke="#9A836E"
              strokeWidth="1.05"
            />
            <path
              d="M251 121 C261 116, 267 118, 267 125 C260 128, 254 126, 251 121 Z"
              fill="#F1E7DC"
              stroke="#9A836E"
              strokeWidth="1.05"
            />
            <path
              d="M254 106 C247 101, 245 94, 249 90 C255 92, 257 99, 254 106 Z"
              fill="#EFE1D6"
              stroke="#9A836E"
              strokeWidth="1.05"
            />
            <path
              d="M214 162 C236 159, 262 159, 286 163"
              stroke="#BBA792"
              strokeWidth="0.95"
              opacity="0.75"
            />
          </g>

          {/* Subtle antique-taupe corner accents */}
          <path
            d="M296 39 C296.6 43.2, 298.8 45.4, 303 46 C298.8 46.6, 296.6 48.8, 296 53 C295.4 48.8, 293.2 46.6, 289 46 C293.2 45.4, 295.4 43.2, 296 39 Z"
            stroke="#C2A376"
            strokeWidth="1.05"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
          <path
            d="M66 47 L66 53 M63 50 L69 50"
            stroke="#B59876"
            strokeWidth="1.05"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function StationeryLetterIntro({ reducedMotion }: { reducedMotion: boolean }) {
  const [scene, setScene] = useState<LetterScene>(
    reducedMotion ? 'revealed' : 'entrance'
  );
  const reducedOnMountRef = useRef(reducedMotion);

  useEffect(() => {
    const timers: number[] = [];
    const isReduced = reducedOnMountRef.current;

    if (isReduced) {
      setScene('revealed');
      timers.push(
        window.setTimeout(() => {
          setScene('closing');
        }, 7250)
      );
      return () => {
        timers.forEach((id) => window.clearTimeout(id));
      };
    }

    // Scene 02: Dissolve seal, open flap & raise paper (~1.45s - 2.95s)
    timers.push(
      window.setTimeout(() => {
        setScene('opening');
      }, 1450)
    );

    // Scene 03: Unfolded paper expands directly into full editorial layout (~2.95s - 7.2s)
    timers.push(
      window.setTimeout(() => {
        setScene('revealed');
      }, 2950)
    );

    // Scene 04: Gently fade out before 8s transition to Poems Introduction (~7.2s - 8.0s)
    timers.push(
      window.setTimeout(() => {
        setScene('closing');
      }, 7200)
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const showEnvelopeStage = scene === 'entrance' || scene === 'opening';
  const isFlapOpen = scene === 'opening';

  return (
    <motion.section
      key="story-page-1"
      aria-labelledby="page-1-heading"
      animate={{ opacity: scene === 'closing' ? 0 : 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{
        duration: scene === 'closing' ? (reducedMotion ? 0.35 : 0.72) : 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative mx-auto flex w-full max-w-[1040px] items-center justify-center px-2 py-4 sm:px-6 sm:py-8"
    >
      {/* Subtle low-contrast natural daylight & shadow drift across ivory background */}
      {!reducedMotion && showEnvelopeStage && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, x: -24, y: -12 }}
          animate={{ opacity: [0, 0.85, 0.65], x: [-24, 18, 32], y: [-12, 6, 12] }}
          transition={{ duration: 4.5, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              'linear-gradient(125deg, rgba(255, 253, 248, 0) 18%, rgba(255, 252, 244, 0.55) 44%, rgba(232, 221, 206, 0.16) 66%, rgba(248, 245, 239, 0) 88%)',
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {showEnvelopeStage ? (
          /* SCENES 01 & 02 — CREAM STATIONERY ENVELOPE ENTRANCE & 3D OPENING */
          <motion.div
            key="stationery-envelope-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.04,
              y: -12,
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{
              duration: 1.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex w-full max-w-[430px] items-center justify-center pt-10"
            style={{ perspective: '1200px' }}
          >
            {/* Four tiny hand-drawn sparkles around the envelope appearing sequentially */}
            {[
              {
                className: '-left-4 top-2 sm:-left-9 sm:top-1',
                delay: 0.25,
                size: 12,
                color: '#B6A18B',
              },
              {
                className: '-right-3 top-6 sm:-right-8 sm:top-5',
                delay: 0.48,
                size: 10,
                color: '#C5B29D',
              },
              {
                className: '-left-2 bottom-4 sm:-left-7 sm:bottom-5',
                delay: 0.7,
                size: 10,
                color: '#C5B29D',
              },
              {
                className: '-right-4 -bottom-1 sm:-right-9 sm:bottom-1',
                delay: 0.92,
                size: 12,
                color: '#A18C77',
              },
            ].map((sparkle, idx) => (
              <motion.svg
                key={idx}
                aria-hidden="true"
                width={sparkle.size}
                height={sparkle.size}
                viewBox="0 0 16 16"
                fill="none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isFlapOpen
                    ? { opacity: 0, scale: 0.9 }
                    : {
                        opacity: [0, 0.78, 0.42, 0.76],
                        scale: [0.82, 1.04, 0.96, 1.02],
                      }
                }
                transition={
                  isFlapOpen
                    ? { duration: 0.35, ease: 'easeOut' }
                    : {
                        duration: 2.2,
                        delay: sparkle.delay,
                        ease: 'easeInOut',
                      }
                }
                className={`pointer-events-none absolute z-10 ${sparkle.className}`}
              >
                <path
                  d="M8 1.5 C8.5 5.4, 10.6 7.5, 14.5 8 C10.6 8.5, 8.5 10.6, 8 14.5 C7.5 10.6, 5.4 8.5, 1.5 8 C5.4 7.5, 7.5 5.4, 8 1.5 Z"
                  stroke={sparkle.color}
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ))}

            {/* Gradually revealed natural soft warm-beige paper shadow under envelope */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scaleX: 0.86 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{
                duration: 1.25,
                delay: 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-x-6 -bottom-3 h-7 rounded-full blur-xl"
              style={{ backgroundColor: 'rgba(161, 140, 119, 0.25)' }}
            />

            {/* Minimal Rectangular Cream Stationery Envelope */}
            <motion.div
              initial={{
                boxShadow: '0 8px 20px -16px rgba(116, 94, 72, 0.08)',
              }}
              animate={{
                boxShadow: '0 22px 50px -22px rgba(116, 94, 72, 0.28)',
              }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/10.5] w-full rounded-[10px] border border-[#E2D6C5] bg-[#F3ECE1]"
            >
              {/* Recessed interior lining */}
              <div
                aria-hidden="true"
                className="absolute inset-x-[2px] top-[2px] bottom-1/2 rounded-t-[8px] bg-[#EAE0D0]"
              />

              {/* Soft Cream Paper Sheet Sliding Upward & Expanding */}
              <motion.div
                aria-hidden="true"
                initial={{ y: 22, opacity: 0.9, scale: 0.96 }}
                animate={
                  isFlapOpen
                    ? { y: -92, opacity: 1, scale: 1.04 }
                    : { y: 20, opacity: 0.96, scale: 0.96 }
                }
                transition={{
                  duration: 0.92,
                  delay: isFlapOpen ? 0.42 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-x-4 top-3 bottom-3 z-20 rounded-[6px] border border-[#E5D9C9] bg-[#FDFBF7] px-6 py-5 shadow-[0_14px_30px_-14px_rgba(116,94,72,0.22)] sm:inset-x-5"
              >
                <div className="flex items-center justify-between border-b border-[#EAE0D2] pb-2">
                  <span className="h-1.5 w-20 rounded-xs bg-[#E6DACB]" />
                  <span className="h-1.5 w-8 rounded-xs bg-[#EDE3D6]" />
                </div>
                <div className="mt-4 h-2.5 w-3/5 rounded-xs bg-[#EAE0D2]" />
                <div className="mt-2.5 h-1.5 w-4/5 rounded-xs bg-[#F3ECE1]" />
                <div className="mt-1.5 h-1.5 w-2/3 rounded-xs bg-[#F3ECE1]" />
              </motion.div>

              {/* Envelope Lower Pocket */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[9px]"
              >
                <svg
                  viewBox="0 0 400 262"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <polygon
                    points="0,0 200,148 0,262"
                    fill="#F6F0E6"
                    stroke="#E3D7C7"
                    strokeWidth="1"
                  />
                  <polygon
                    points="400,0 200,148 400,262"
                    fill="#F4EDE2"
                    stroke="#E3D7C7"
                    strokeWidth="1"
                  />
                  <polygon
                    points="0,262 200,126 400,262"
                    fill="#FAF6EE"
                    stroke="#DFD2C0"
                    strokeWidth="1.1"
                  />
                </svg>
              </div>

              {/* Top Flap with Smooth 3D Rotation */}
              <motion.div
                aria-hidden="true"
                initial={{ rotateX: 0, zIndex: 40 }}
                animate={
                  isFlapOpen
                    ? {
                        rotateX: -178,
                        zIndex: 10,
                      }
                    : {
                        rotateX: 0,
                        zIndex: 40,
                      }
                }
                transition={{
                  rotateX: {
                    duration: 0.85,
                    delay: isFlapOpen ? 0.14 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  zIndex: { delay: isFlapOpen ? 0.48 : 0, duration: 0.01 },
                }}
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
                className="pointer-events-none absolute inset-x-0 top-0 h-[58%]"
              >
                <svg
                  viewBox="0 0 400 152"
                  preserveAspectRatio="none"
                  className="h-full w-full drop-shadow-[0_6px_10px_rgba(116,94,72,0.08)]"
                >
                  <path
                    d="M1 1 L399 1 L208 143 C203 147, 197 147, 192 143 Z"
                    fill="#FBF8F2"
                    stroke="#DFD2C0"
                    strokeWidth="1.15"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              {/* Small Embossed Heart Stationery Seal (appears gently, dissolves before flap rotates open) */}
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isFlapOpen
                    ? { opacity: 0, scale: 0.88 }
                    : { opacity: 1, scale: 1 }
                }
                transition={
                  isFlapOpen
                    ? { duration: 0.22, ease: 'easeOut' }
                    : { duration: 0.45, delay: 0.42, ease: [0.16, 1, 0.3, 1] }
                }
                className="pointer-events-none absolute top-[53%] left-1/2 z-[45] flex h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D8C8B4] bg-[#F2E9DB] shadow-[0_3px_8px_-2px_rgba(116,94,72,0.22),inset_0_1px_1px_rgba(255,255,255,0.7)]"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 13.4 C8 13.4, 2.4 9.7, 2.4 6 C2.4 4.1, 3.8 2.8, 5.5 2.8 C6.7 2.8, 7.5 3.5, 8 4.4 C8.5 3.5, 9.3 2.8, 10.5 2.8 C12.2 2.8, 13.6 4.1, 13.6 6 C13.6 9.7, 8 13.4, 8 13.4 Z"
                    fill="#E5D7C4"
                    stroke="#9F8974"
                    strokeWidth="1.05"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* FINAL REVEAL — COMPLETE EDITORIAL REFERENCE COMPOSITION */
          <motion.div
            key="editorial-revealed-spread"
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 12 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.4 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex w-full flex-col justify-between"
          >
            {/* TOP: Left label, Right issue number, thin horizontal divider */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0.25 : 0.55,
                delay: reducedMotion ? 0.05 : 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center justify-between gap-4 border-b border-[#DED2C1] pb-4"
            >
              <p className="text-[11px] font-medium tracking-[0.26em] text-[#8E7866] uppercase sm:text-[11.5px]">
                A PERSONAL COLLECTION
              </p>
              <p className="text-[11px] font-medium tracking-[0.22em] text-[#A18C77] tabular-nums uppercase sm:text-[11.5px]">
                NO. 01
              </p>
            </motion.div>

            {/* MAIN CONTENT: Left typography, Right delicate open-book illustration */}
            <div className="my-10 grid grid-cols-1 items-center gap-10 md:my-14 md:grid-cols-12 md:gap-12">
              <div className="flex flex-col items-start text-left md:col-span-7 md:pr-4">
                <motion.h1
                  id="page-1-heading"
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.3 : 0.75,
                    delay: reducedMotion ? 0.08 : 0.24,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-editorial text-[clamp(2.55rem,5.4vw,4.35rem)] leading-[1.06] font-medium tracking-[-0.02em] text-[#403128]"
                  style={{ textWrap: 'balance' }}
                >
                  A few things worth remembering
                </motion.h1>

                <motion.p
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: reducedMotion ? 0.25 : 0.65,
                    delay: reducedMotion ? 0.14 : 0.52,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-6 max-w-[42ch] text-[15.5px] leading-[1.78] text-[#6A594E] sm:text-[16.5px]"
                >
                  Little moments, words and memories that deserve a place of
                  their own.
                </motion.p>

                <motion.div
                  aria-hidden="true"
                  initial={reducedMotion ? false : { opacity: 0, scaleX: 0.7 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    duration: reducedMotion ? 0.25 : 0.55,
                    delay: reducedMotion ? 0.18 : 0.76,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="my-7 h-px w-20 origin-left bg-[#D7C9B7]"
                />

                <motion.p
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: reducedMotion ? 0.25 : 0.65,
                    delay: reducedMotion ? 0.22 : 0.92,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-editorial text-[1.28rem] italic text-[#8A7362] sm:text-[1.4rem]"
                >
                  A collection of little memories ♡
                </motion.p>
              </div>

              <div className="flex items-center justify-center md:col-span-5 md:justify-end">
                <HandDrawnOpenBook reducedMotion={reducedMotion} />
              </div>
            </div>

            {/* BOTTOM: Thin horizontal divider & small editorial text */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0.25 : 0.6,
                delay: reducedMotion ? 0.1 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center justify-between gap-4 border-t border-[#DED2C1] pt-4"
            >
              <p className="text-[11px] font-medium tracking-[0.24em] text-[#9A8572] uppercase">
                A STORY IN LITTLE MOMENTS.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function WordsWorthKeepingBackdrop({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {/* Left warm-golden light trail drifting softly toward center */}
      <motion.div
        initial={
          reducedMotion
            ? { opacity: 0.42, x: '-6%', y: '-2%' }
            : { opacity: 0, x: '-26%', y: '-6%', scale: 0.92 }
        }
        animate={
          reducedMotion
            ? { opacity: 0.42, x: '-6%', y: '-2%' }
            : {
                opacity: [0, 0.56, 0.44, 0.54],
                x: ['-26%', '-4%', '-1%', '-4%'],
                y: ['-6%', '-1%', '1%', '-1%'],
                scale: [0.92, 1.02, 0.99, 1.02],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0.2 }
            : {
                duration: 11,
                times: [0, 0.34, 0.68, 1],
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }
        }
        className="absolute top-[36%] left-[-8%] h-[220px] w-[62vw] max-w-[680px] -translate-y-1/2 rotate-[-8deg] rounded-full blur-[48px] sm:h-[260px]"
        style={{
          background:
            'linear-gradient(90deg, rgba(223, 194, 142, 0) 0%, rgba(214, 179, 122, 0.26) 48%, rgba(235, 212, 172, 0.34) 84%, rgba(235, 212, 172, 0) 100%)',
        }}
      />

      {/* Right warm-golden light trail drifting softly toward center */}
      <motion.div
        initial={
          reducedMotion
            ? { opacity: 0.42, x: '6%', y: '2%' }
            : { opacity: 0, x: '26%', y: '6%', scale: 0.92 }
        }
        animate={
          reducedMotion
            ? { opacity: 0.42, x: '6%', y: '2%' }
            : {
                opacity: [0, 0.56, 0.44, 0.54],
                x: ['26%', '4%', '1%', '4%'],
                y: ['6%', '1%', '-1%', '1%'],
                scale: [0.92, 1.02, 0.99, 1.02],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0.2 }
            : {
                duration: 11,
                delay: 0.15,
                times: [0, 0.34, 0.68, 1],
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }
        }
        className="absolute top-[60%] right-[-8%] h-[220px] w-[62vw] max-w-[680px] -translate-y-1/2 rotate-[-8deg] rounded-full blur-[48px] sm:h-[260px]"
        style={{
          background:
            'linear-gradient(270deg, rgba(223, 194, 142, 0) 0%, rgba(214, 179, 122, 0.26) 48%, rgba(235, 212, 172, 0.34) 84%, rgba(235, 212, 172, 0) 100%)',
        }}
      />

      {/* Delicate champagne-gold hairline light paths meeting softly near center */}
      <svg
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="h-full w-full opacity-75"
      >
        <defs>
          <linearGradient id="leftGoldenTrail" x1="0%" y1="45%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#D6B57E" stopOpacity="0" />
            <stop offset="45%" stopColor="#C8A26A" stopOpacity="0.34" />
            <stop offset="88%" stopColor="#DEC08F" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#E6CE9F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rightGoldenTrail" x1="100%" y1="55%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#D6B57E" stopOpacity="0" />
            <stop offset="45%" stopColor="#C8A26A" stopOpacity="0.34" />
            <stop offset="88%" stopColor="#DEC08F" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#E6CE9F" stopOpacity="0" />
          </linearGradient>
          <filter id="trailSoftGlow" x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* Left incoming light trail */}
        <motion.path
          d="M -40 315 C 180 295, 390 385, 615 356"
          stroke="url(#leftGoldenTrail)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#trailSoftGlow)"
          initial={reducedMotion ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          animate={
            reducedMotion
              ? { pathLength: 1, opacity: 0.7 }
              : { pathLength: 1, opacity: [0, 0.85, 0.65] }
          }
          transition={{
            pathLength: { duration: 2.8, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 3.2, ease: 'easeInOut' },
          }}
        />
        <motion.path
          d="M -20 326 C 210 310, 400 392, 610 358"
          stroke="url(#leftGoldenTrail)"
          strokeWidth="0.9"
          strokeLinecap="round"
          initial={reducedMotion ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
          animate={
            reducedMotion
              ? { pathLength: 1, opacity: 0.6 }
              : { pathLength: 1, opacity: [0, 0.72, 0.52] }
          }
          transition={{
            pathLength: { duration: 3.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 3.4, delay: 0.2, ease: 'easeInOut' },
          }}
        />

        {/* Right incoming light trail */}
        <motion.path
          d="M 1240 405 C 1020 425, 810 335, 585 364"
          stroke="url(#rightGoldenTrail)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#trailSoftGlow)"
          initial={reducedMotion ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          animate={
            reducedMotion
              ? { pathLength: 1, opacity: 0.7 }
              : { pathLength: 1, opacity: [0, 0.85, 0.65] }
          }
          transition={{
            pathLength: { duration: 2.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 3.2, delay: 0.12, ease: 'easeInOut' },
          }}
        />
        <motion.path
          d="M 1220 394 C 990 410, 800 328, 590 362"
          stroke="url(#rightGoldenTrail)"
          strokeWidth="0.9"
          strokeLinecap="round"
          initial={reducedMotion ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
          animate={
            reducedMotion
              ? { pathLength: 1, opacity: 0.6 }
              : { pathLength: 1, opacity: [0, 0.72, 0.52] }
          }
          transition={{
            pathLength: { duration: 3.1, delay: 0.32, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 3.4, delay: 0.32, ease: 'easeInOut' },
          }}
        />
      </svg>

      {/* Soft warm-golden center convergence bloom behind the editorial card */}
      <motion.div
        initial={
          reducedMotion
            ? { opacity: 0.55, scale: 1 }
            : { opacity: 0, scale: 0.82 }
        }
        animate={
          reducedMotion
            ? { opacity: 0.55, scale: 1 }
            : {
                opacity: [0, 0.68, 0.48, 0.68],
                scale: [0.82, 1.04, 0.98, 1.04],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0.2 }
            : {
                duration: 8.5,
                delay: 1.15,
                times: [0, 0.32, 0.66, 1],
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }
        }
        className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[64px] sm:h-[460px] sm:w-[480px]"
        style={{
          background:
            'radial-gradient(circle, rgba(226, 198, 148, 0.36) 0%, rgba(235, 215, 180, 0.16) 46%, rgba(248, 245, 239, 0) 75%)',
        }}
      />
    </motion.div>
  );
}

function ContinueButton({
  label = 'Continue',
  onClick,
  reducedMotion,
  cinematicHover = false,
}: {
  label?: string;
  onClick: () => void;
  reducedMotion: boolean;
  cinematicHover?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: cinematicHover ? -2.5 : -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      transition={{
        duration: cinematicHover ? 0.28 : 0.16,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={
        cinematicHover
          ? 'inline-flex min-h-[46px] min-w-[172px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#403128] px-7 py-3 text-[14.5px] font-medium tracking-[0.025em] text-[#FFFFFF] shadow-[0_12px_28px_-12px_rgba(64,49,40,0.42)] transition-all duration-300 ease-out hover:bg-[#31251E] hover:shadow-[0_18px_34px_-12px_rgba(64,49,40,0.52)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] whitespace-nowrap shrink-0'
          : 'inline-flex min-h-[46px] min-w-[172px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#403128] px-7 py-3 text-[14.5px] font-medium tracking-[0.025em] text-[#FFFFFF] shadow-[0_10px_24px_-12px_rgba(64,49,40,0.45)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] whitespace-nowrap shrink-0'
      }
    >
      <span>{label}</span>
      {!label.includes('♡') && (
        <ArrowRight className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
      )}
    </motion.button>
  );
}

export function BirthdayExperience({
  data: _data,
  onLock,
  initialChapter = 1,
  onContinueToChallenge,
}: BirthdayExperienceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [chapter, setChapter] = useState<ChapterNumber>(initialChapter);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [chapter]);

  // Page 1 automatic fade into Page 2 after configurable 8 seconds
  const introCompletedRef = useRef(false);
  useEffect(() => {
    if (chapter !== 1) return;
    introCompletedRef.current = false;

    const timerId = window.setTimeout(() => {
      if (!introCompletedRef.current) {
        introCompletedRef.current = true;
        setChapter(2);
      }
    }, STORY_CHAPTER_CONFIG.introDurationMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [chapter]);

  const goNext = useCallback(() => {
    setChapter((prev) =>
      prev < TOTAL_CHAPTERS ? ((prev + 1) as ChapterNumber) : prev
    );
  }, []);

  const goBack = useCallback(() => {
    setChapter((prev) => (prev > 2 ? ((prev - 1) as ChapterNumber) : prev));
  }, []);

  const reduced = Boolean(prefersReducedMotion);

  const chapterTransition = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: {
      duration: reduced ? 0.2 : 0.65,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  };

  return (
    <motion.div
      key="birthday-story-experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#F8F5EF] text-[#403128]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 42%, rgba(243, 237, 228, 0.78) 0%, rgba(248, 245, 239, 0.98) 74%)',
      }}
    >
      <PaperGrainOverlay />

      <AnimatePresence>
        {chapter === 2 && (
          <WordsWorthKeepingBackdrop
            key="words-worth-keeping-backdrop"
            reducedMotion={reduced}
          />
        )}
      </AnimatePresence>

      {/* Minimal Header on Pages 2–5 */}
      {chapter > 1 && (
        <header className="relative z-20 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-6 pt-5 pb-2 sm:px-10 sm:pt-7">
          <div className="flex items-center gap-4">
            {chapter > 2 && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#7A685B] transition-colors duration-150 hover:text-[#403128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77]/40 whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Previous</span>
              </button>
            )}
            <span className="text-[12.5px] font-medium tracking-[0.14em] text-[#A18C77] tabular-nums uppercase whitespace-nowrap">
              {String(chapter).padStart(2, '0')} /{' '}
              {String(TOTAL_CHAPTERS).padStart(2, '0')}
            </span>
          </div>
        </header>
      )}

      {/* Full-Viewport Page Stage */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-6 sm:px-10 sm:py-8">
        <AnimatePresence mode="wait">
          {/* PAGE 1 — THE LETTER THAT OPENS A STORY (8s auto-fade into Page 2) */}
          {chapter === 1 && (
            <StationeryLetterIntro key="story-page-1" reducedMotion={reduced} />
          )}

          {/* PAGE 2 — POEMS INTRODUCTION */}
          {chapter === 2 && (
            <motion.section
              key="story-page-2"
              aria-labelledby="page-2-heading"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.988 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{
                duration: reduced ? 0.2 : 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative mx-auto flex w-full max-w-[600px] flex-col items-center overflow-hidden rounded-3xl border border-[#DFD1BC] bg-[#FDFBF7]/94 px-8 py-12 text-center shadow-[0_28px_72px_-24px_rgba(64,49,40,0.16),0_10px_26px_-14px_rgba(161,140,119,0.16)] sm:px-14 sm:py-16"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 24%, rgba(255, 253, 249, 0.94) 0%, rgba(247, 240, 230, 0.62) 100%)',
              }}
            >
              {/* Subtle paper grain & refined inner hairline border for card depth */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='introCardPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23introCardPaper)'/%3E%3C/svg%3E")`,
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-[#EDE3D4]/90"
              />

              <motion.p
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0.2 : 0.7,
                  delay: reduced ? 0 : 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 text-[11.5px] font-medium tracking-[0.26em] text-[#A18C77] uppercase"
              >
                CHAPTER 01
              </motion.p>

              {/* Decorative line drawing gradually into view */}
              <div
                aria-hidden="true"
                className="relative z-10 mt-5 h-px w-14 overflow-hidden"
              >
                <motion.div
                  initial={reduced ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.25 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    duration: reduced ? 0.2 : 0.95,
                    delay: reduced ? 0 : 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full w-full origin-left bg-gradient-to-r from-[#DFD2C0] via-[#C3A474] to-[#DFD2C0]"
                />
              </div>

              <motion.h1
                id="page-2-heading"
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0.25 : 0.95,
                  delay: reduced ? 0 : 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-editorial relative z-10 mt-7 text-[clamp(2.35rem,5vw,3.55rem)] leading-[1.1] font-medium tracking-[-0.015em] text-[#403128]"
                style={{ textWrap: 'balance' }}
              >
                Words worth keeping
              </motion.h1>

              <motion.p
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0.25 : 0.85,
                  delay: reduced ? 0 : 0.82,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 mt-5 max-w-[38ch] text-[15.5px] leading-[1.75] text-[#6E5D52] sm:text-[16px]"
              >
                Some words are too special to be forgotten.
              </motion.p>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0.25 : 0.8,
                  delay: reduced ? 0 : 1.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 mt-10"
              >
                <ContinueButton
                  label="Continue ♡"
                  onClick={goNext}
                  reducedMotion={reduced}
                  cinematicHover
                />
              </motion.div>
            </motion.section>
          )}

          {/* PAGE 3 — MY POEM (Editorial Hindi Poetry Composition, Editable) */}
          {chapter === 3 && (
            <motion.section
              key="story-page-3"
              aria-labelledby="page-3-heading"
              {...chapterTransition}
              className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center"
            >
              <p className="text-[11.5px] font-medium tracking-[0.22em] text-[#A18C77] uppercase">
                Words worth keeping · I
              </p>

              <h1
                id="page-3-heading"
                className="font-editorial mt-2.5 text-[clamp(2rem,4.2vw,3rem)] leading-[1.14] font-medium tracking-[-0.015em] text-[#403128]"
                style={{ textWrap: 'balance' }}
              >
                A poem from me
              </h1>

              <article
                className="relative mt-6 w-full max-w-[600px] overflow-hidden rounded-2xl border border-[#E5D9C9] bg-[#FDFBF7] px-7 py-9 text-center shadow-[0_22px_54px_-24px_rgba(116,94,72,0.16)] sm:px-14 sm:py-12"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 35%, rgba(255, 253, 249, 0.9) 0%, rgba(247, 241, 232, 0.55) 100%)',
                }}
              >
                {/* Subtle paper texture & fine inner editorial frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='poemSheetPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23poemSheetPaper)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 rounded-xl border border-[#EFE6D9]"
                />

                <div className="relative z-10">
                  {STORY_CHAPTER_CONFIG.handwrittenPoemImageUrl ? (
                    <img
                      src={STORY_CHAPTER_CONFIG.handwrittenPoemImageUrl}
                      alt={STORY_CHAPTER_CONFIG.handwrittenPoemAlt}
                      referrerPolicy="no-referrer"
                      className="mx-auto max-h-[52dvh] w-auto max-w-full rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <h2 className="font-hindi text-[clamp(1.4rem,3vw,1.85rem)] leading-[1.45] font-medium text-[#5C4B40]">
                        {STORY_CHAPTER_CONFIG.myPoemHeading}
                      </h2>

                      <div
                        aria-hidden="true"
                        className="my-5 h-px w-14 bg-[#E2D6C5]"
                      />

                      <p className="font-hindi max-w-[46ch] whitespace-pre-line text-[clamp(1.08rem,2.3vw,1.3rem)] leading-[2.05] text-[#6E5D52]">
                        {STORY_CHAPTER_CONFIG.myPoemText}
                      </p>
                    </div>
                  )}
                </div>
              </article>

              <div className="mt-7">
                <ContinueButton onClick={goNext} reducedMotion={reduced} />
              </div>
            </motion.section>
          )}

          {/* PAGE 4 — RECEIVED POEM (Editorial Hindi Poetry Composition, Editable) */}
          {chapter === 4 && (
            <motion.section
              key="story-page-4"
              aria-labelledby="page-4-heading"
              {...chapterTransition}
              className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center"
            >
              <p className="text-[11.5px] font-medium tracking-[0.22em] text-[#A18C77] uppercase">
                Words worth keeping · II
              </p>

              <h1
                id="page-4-heading"
                className="font-editorial mt-2.5 text-[clamp(2rem,4.2vw,3rem)] leading-[1.14] font-medium tracking-[-0.015em] text-[#403128]"
                style={{ textWrap: 'balance' }}
              >
                A poem from you
              </h1>

              <article
                className="relative mt-6 w-full max-w-[600px] overflow-hidden rounded-2xl border border-[#E5D9C9] bg-[#FDFBF7] px-7 py-9 text-center shadow-[0_22px_54px_-24px_rgba(116,94,72,0.16)] sm:px-14 sm:py-12"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 35%, rgba(255, 253, 249, 0.9) 0%, rgba(247, 241, 232, 0.55) 100%)',
                }}
              >
                {/* Subtle paper texture & fine inner editorial frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='receivedPoemSheetPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23receivedPoemSheetPaper)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 rounded-xl border border-[#EFE6D9]"
                />

                <div className="relative z-10">
                  <div className="flex flex-col items-center">
                    <h2 className="font-hindi text-[clamp(1.4rem,3vw,1.85rem)] leading-[1.45] font-medium text-[#5C4B40]">
                      {STORY_CHAPTER_CONFIG.receivedPoemHeading}
                    </h2>

                    <div
                      aria-hidden="true"
                      className="my-5 h-px w-14 bg-[#E2D6C5]"
                    />

                    <p className="font-hindi max-w-[46ch] whitespace-pre-line text-[clamp(1.08rem,2.3vw,1.3rem)] leading-[2.05] text-[#6E5D52]">
                      {STORY_CHAPTER_CONFIG.receivedPoemText}
                    </p>

                    <div
                      aria-hidden="true"
                      className="mt-7 mb-5 h-px w-10 bg-[#EAE0D2]"
                    />

                    <p className="font-editorial text-[1.12rem] italic text-[#9A8472] sm:text-[1.2rem]">
                      {STORY_CHAPTER_CONFIG.receivedPoemClosingLine}
                    </p>
                  </div>
                </div>
              </article>

              <div className="mt-7">
                <ContinueButton onClick={goNext} reducedMotion={reduced} />
              </div>
            </motion.section>
          )}

          {/* PAGE 5 — ADDITIONAL POEM (Editorial Hindi Poetry Composition — Final Page) */}
          {chapter === 5 &&
            (() => {
              const extraPoem = STORY_CHAPTER_CONFIG.receivedExtraPoems[0];
              if (!extraPoem) return null;

              return (
                <motion.section
                  key="story-page-5"
                  aria-labelledby="page-5-heading"
                  {...chapterTransition}
                  className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center"
                >
                  <p className="text-[11.5px] font-medium tracking-[0.22em] text-[#A18C77] uppercase">
                    Words worth keeping · III
                  </p>

                  <h1
                    id="page-5-heading"
                    className="font-editorial mt-2.5 text-[clamp(2rem,4.2vw,3rem)] leading-[1.14] font-medium tracking-[-0.015em] text-[#403128]"
                    style={{ textWrap: 'balance' }}
                  >
                    A poem from you
                  </h1>

                  <article
                    className="relative mt-6 w-full max-w-[600px] overflow-hidden rounded-2xl border border-[#E5D9C9] bg-[#FDFBF7] px-7 py-9 text-center shadow-[0_22px_54px_-24px_rgba(116,94,72,0.16)] sm:px-14 sm:py-12"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 50% 35%, rgba(255, 253, 249, 0.9) 0%, rgba(247, 241, 232, 0.55) 100%)',
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='extraPoemSheetPaper-${extraPoem.id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23extraPoemSheetPaper-${extraPoem.id})'/%3E%3C/svg%3E")`,
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-xl border border-[#EFE6D9]"
                    />

                    <div className="relative z-10">
                      <div className="flex flex-col items-center">
                        <h2 className="font-hindi text-[clamp(1.4rem,3vw,1.85rem)] leading-[1.45] font-medium text-[#5C4B40]">
                          {extraPoem.heading}
                        </h2>

                        <div
                          aria-hidden="true"
                          className="my-5 h-px w-14 bg-[#E2D6C5]"
                        />

                        <p className="font-hindi max-w-[46ch] whitespace-pre-line text-[clamp(1.08rem,2.3vw,1.3rem)] leading-[2.05] text-[#6E5D52]">
                          {extraPoem.text}
                        </p>

                        <div
                          aria-hidden="true"
                          className="mt-7 mb-5 h-px w-10 bg-[#EAE0D2]"
                        />

                        <p className="font-editorial text-[1.12rem] italic text-[#9A8472] sm:text-[1.2rem]">
                          {extraPoem.closingLine}
                        </p>
                      </div>
                    </div>
                  </article>

                  {onContinueToChallenge && (
                    <div className="mt-7">
                      <ContinueButton
                        onClick={onContinueToChallenge}
                        reducedMotion={reduced}
                      />
                    </div>
                  )}
                </motion.section>
              );
            })()}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
