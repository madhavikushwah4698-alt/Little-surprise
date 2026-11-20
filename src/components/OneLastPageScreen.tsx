import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Lock,
  Pencil,
  Play,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  BOOK_SECTION_LOCKS,
  ONE_LAST_PAGE_BOOK_CONFIG,
  type BookSectionLockConfig,
  type BookSectionLockId,
  type OneLastPagePhotoSlot,
} from '../config/oneLastPage';

interface OneLastPageScreenProps {
  onLock: () => void;
  onBack?: () => void;
  onContinue?: () => void;
}

type BookStage = 'closedCover' | 'openingCover' | 'openBook' | 'closingBook';
type PageNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34;

interface ActiveTurn {
  key: number;
  direction: 'next' | 'prev';
}

type FrameVariant =
  | 'polaroid-taped'
  | 'museum-mat'
  | 'kraft-pinned'
  | 'arched-cameo'
  | 'gold-folio'
  | 'midnight-frame'
  | 'ticket-cinema';

function BotanicalSprigCorner({
  className = '',
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 130"
      fill="none"
      className={`pointer-events-none select-none opacity-75 ${
        flip ? '-scale-x-100 -scale-y-100' : ''
      } ${className}`}
    >
      <path
        d="M120 16 C100 32, 82 52, 62 76 C50 90, 38 104, 24 118"
        stroke="#705946"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M86 48 C102 48, 114 53, 125 60"
        stroke="#7B634F"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M66 72 C52 64, 38 64, 25 68"
        stroke="#7B634F"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M98 33 C90 22, 96 13, 105 18 C108 24, 104 30, 98 33 Z"
        fill="#B6BC9C"
        stroke="#5E5442"
        strokeWidth="0.85"
      />
      <path
        d="M78 55 C69 47, 69 36, 78 40 C84 44, 83 51, 78 55 Z"
        fill="#A4AC8B"
        stroke="#5E5442"
        strokeWidth="0.85"
      />
      <path
        d="M107 50 C116 43, 125 47, 120 55 C115 58, 109 55, 107 50 Z"
        fill="#C8C4A6"
        stroke="#5E5442"
        strokeWidth="0.85"
      />
      <circle
        cx="25"
        cy="68"
        r="2.9"
        fill="#DFBE7D"
        stroke="#7D6033"
        strokeWidth="0.85"
      />
      <circle cx="125" cy="60" r="2" fill="#C9A25B" />
    </svg>
  );
}

function MinimalBotanicalFolioIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 260"
      fill="none"
      className="pointer-events-none mx-auto h-52 w-44 opacity-80 sm:h-64 sm:w-56"
    >
      <path
        d="M110 232 C108 188, 112 142, 106 96 C102 68, 96 46, 88 26"
        stroke="#6B5542"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M108 164 C86 150, 68 144, 48 144"
        stroke="#77614E"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M109 132 C132 118, 152 114, 172 118"
        stroke="#77614E"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M104 88 C84 74, 68 68, 52 72"
        stroke="#77614E"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M99 58 C116 46, 134 42, 150 44"
        stroke="#77614E"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M48 144 C42 132, 52 124, 62 131 C64 138, 57 144, 48 144 Z"
        fill="#B8BE9E"
        stroke="#5E5442"
        strokeWidth="0.9"
      />
      <path
        d="M172 118 C178 106, 168 98, 158 106 C156 113, 163 118, 172 118 Z"
        fill="#A8B08F"
        stroke="#5E5442"
        strokeWidth="0.9"
      />
      <path
        d="M52 72 C48 60, 58 54, 66 62 C67 68, 60 72, 52 72 Z"
        fill="#C6C3A4"
        stroke="#5E5442"
        strokeWidth="0.9"
      />
      <path
        d="M150 44 C154 32, 144 26, 136 34 C135 40, 142 44, 150 44 Z"
        fill="#B6BC9C"
        stroke="#5E5442"
        strokeWidth="0.9"
      />
      <circle
        cx="87"
        cy="24"
        r="3.4"
        fill="#DFBE7D"
        stroke="#7D6033"
        strokeWidth="0.9"
      />
      <circle cx="134" cy="182" r="1.8" fill="#C9A25B" fillOpacity="0.7" />
      <circle cx="72" cy="196" r="1.5" fill="#C9A25B" fillOpacity="0.55" />
    </svg>
  );
}

/**
 * Translucent washi-tape strip for scrapbook corners and tops.
 */
function WashiTapeCorner({
  variant = 'champagne',
  className = '',
}: {
  variant?: 'champagne' | 'sage' | 'striped';
  className?: string;
}) {
  const bgStyle =
    variant === 'sage'
      ? 'border-[#B6BEA2]/60 bg-[#D2D6BF]/75'
      : variant === 'striped'
        ? 'border-[#CBB48E]/60 bg-[#EBDCB9]/80'
        : 'border-[#D0BA94]/60 bg-[#EAD6B3]/80';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-3 w-11 rounded-[1px] border shadow-[0_1px_2px_rgba(48,30,15,0.12)] ${bgStyle} ${className}`}
      style={
        variant === 'striped'
          ? {
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(168,132,76,0.14) 0px, rgba(168,132,76,0.14) 3px, transparent 3px, transparent 7px)',
            }
          : undefined
      }
    />
  );
}

/**
 * In-book playable video player preserving the vintage cream & gold scrapbook styling.
 * Shows an authentic frame poster + centered Play button until started, then hands over
 * to full native HTML5 playback controls without flipping pages on interaction.
 */
function ScrapbookVideoPlayer({
  slot,
  imgMaxHeightClass,
  onError,
}: {
  slot: OneLastPagePhotoSlot;
  imgMaxHeightClass: string;
  onError: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Fallback: if unmuted autoplay/play is blocked, retry muted
        el.muted = true;
        void el.play().catch(() => {});
      });
    }
  };

  return (
    <div
      data-no-page-turn="true"
      onClick={(e) => e.stopPropagation()}
      className="relative flex items-center justify-center bg-[#2A1D15]"
    >
      <video
        ref={videoRef}
        src={slot.src}
        poster={slot.posterSrc}
        controls
        muted={Boolean(slot.videoMuted)}
        loop={Boolean(slot.videoLoop)}
        playsInline
        preload="metadata"
        aria-label={slot.alt}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={onError}
        className={`mx-auto block h-auto w-auto max-w-full object-contain ${imgMaxHeightClass}`}
      />

      {!isPlaying && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#24160E]/45 via-transparent to-[#24160E]/15"
          />
          <button
            type="button"
            data-no-page-turn="true"
            onClick={handlePlayClick}
            aria-label={`Play video: ${slot.caption}`}
            className="group absolute top-1/2 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E5C68C]/85 bg-[#FAF3E3]/92 text-[#3D2A1D] shadow-[0_10px_22px_rgba(20,12,6,0.42)] transition-transform duration-200 hover:scale-105 hover:bg-[#FFF9ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C185] sm:h-12 sm:w-12"
          >
            <Play
              className="ml-0.5 h-4 w-4 fill-[#5A3F2B] text-[#5A3F2B] transition-transform duration-200 group-hover:scale-105 sm:h-5 sm:w-5"
              aria-hidden="true"
            />
          </button>
          {slot.durationLabel && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 right-2 z-10 rounded-[3px] border border-[#E5C68C]/60 bg-[#2C1D14]/75 px-1.5 py-0.5 text-[10px] font-medium tracking-[0.04em] text-[#FBF2E1] tabular-nums"
            >
              {slot.durationLabel}
            </span>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Natural-aspect-ratio vintage scrapbook photo frame.
 * Never forces an artificial aspect box or crops image edges.
 */
function ScrapbookPhotoFrame({
  slot,
  variant = 'polaroid-taped',
  tiltClass = '',
  washiPosition = 'top-center',
  washiVariant = 'champagne',
  imgMaxHeightClass = 'max-h-[205px] sm:max-h-[240px] lg:max-h-[275px]',
  compactCaption = false,
  imgError,
  onImageError,
  onZoom,
}: {
  slot: OneLastPagePhotoSlot;
  variant?: FrameVariant;
  tiltClass?: string;
  washiPosition?: 'top-center' | 'top-left-corner' | 'top-right-corner' | 'none';
  washiVariant?: 'champagne' | 'sage' | 'striped';
  imgMaxHeightClass?: string;
  compactCaption?: boolean;
  imgError: boolean;
  onImageError: () => void;
  onZoom?: (slot: OneLastPagePhotoSlot) => void;
}) {
  const frameStyles: Record<FrameVariant, string> = {
    'polaroid-taped':
      'rounded-[3px] border border-[#E2D4BA] bg-[#FDF9F0] p-2 pb-3.5 sm:p-2.5 sm:pb-4 shadow-[0_12px_22px_-14px_rgba(40,24,12,0.36)]',
    'museum-mat':
      'rounded-[2px] border border-[#CEB792] bg-[#FAF4E7] p-2.5 pb-3.5 sm:p-3 sm:pb-4 shadow-[0_12px_24px_-15px_rgba(40,24,12,0.34)] ring-1 ring-inset ring-[#DFC9A3]/70',
    'kraft-pinned':
      'rounded-[4px] border border-[#C6AB84] bg-[#F1E4CC] p-2.5 pb-3.5 sm:p-3 sm:pb-4 shadow-[0_12px_22px_-14px_rgba(42,26,12,0.38)]',
    'arched-cameo':
      'rounded-t-[28px] rounded-b-[4px] border border-[#D4BE9B] bg-[#FCF7EC] px-2.5 pt-4 pb-3.5 sm:px-3 sm:pt-5 sm:pb-4 shadow-[0_14px_24px_-15px_rgba(42,26,12,0.34)]',
    'gold-folio':
      'rounded-[4px] border border-[#C49D5A]/75 bg-[#FDF8EC] p-2.5 pb-4 sm:p-3 sm:pb-4.5 shadow-[0_16px_30px_-16px_rgba(46,28,10,0.42)] ring-1 ring-inset ring-[#DFBE82]/65',
    'midnight-frame':
      'rounded-[4px] border border-[#5B4434]/65 bg-[#F5ECDB] p-2.5 pb-3.5 sm:p-3 sm:pb-4 shadow-[0_14px_26px_-14px_rgba(24,15,9,0.45)]',
    'ticket-cinema':
      'rounded-[5px] border border-dashed border-[#B79A74] bg-[#FAF3E4] p-2.5 pb-3.5 sm:p-3 sm:pb-4 shadow-[0_12px_22px_-14px_rgba(40,24,12,0.34)]',
  };

  return (
    <figure
      className={`relative mx-auto w-fit max-w-full cursor-default transition-transform duration-300 ${frameStyles[variant]} ${tiltClass}`}
    >
      {/* Optional decorative washi tape */}
      {washiPosition === 'top-center' && (
        <WashiTapeCorner
          variant={washiVariant}
          className="-top-2 left-1/2 -translate-x-1/2 -rotate-[2deg]"
        />
      )}
      {washiPosition === 'top-left-corner' && (
        <WashiTapeCorner
          variant={washiVariant}
          className="-top-1.5 -left-2.5 -rotate-[26deg]"
        />
      )}
      {washiPosition === 'top-right-corner' && (
        <WashiTapeCorner
          variant={washiVariant}
          className="-top-1.5 -right-2.5 rotate-[24deg]"
        />
      )}

      {/* Brass pin dot for kraft-pinned */}
      {variant === 'kraft-pinned' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-1.5 left-1/2 z-20 h-3 w-3 -translate-x-1/2 rounded-full border border-[#8E6B38] bg-gradient-to-br from-[#EFE0B8] to-[#B68B4C] shadow-xs"
        />
      )}

      {/* Tiny botanical gold dot accent under arch */}
      {variant === 'arched-cameo' && (
        <span
          aria-hidden="true"
          className="pointer-events-none mx-auto mb-1.5 block h-1.5 w-1.5 rounded-full bg-[#C89F59]/80"
        />
      )}

      {/* Inner natural-proportion media mat (zero forced crop) */}
      <div className="relative overflow-hidden rounded-[2px] border border-[#E6D7BE]/80 bg-[#F2E6D1]">
        {slot.src && !imgError ? (
          slot.mediaType === 'video' ? (
            <ScrapbookVideoPlayer
              slot={slot}
              imgMaxHeightClass={imgMaxHeightClass}
              onError={onImageError}
            />
          ) : onZoom ? (
            <button
              type="button"
              data-no-page-turn="true"
              onClick={(e) => {
                e.stopPropagation();
                onZoom(slot);
              }}
              aria-label={`Read full size: ${slot.caption}`}
              className="group/zoom relative block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99252]"
            >
              <img
                src={slot.src}
                alt={slot.alt}
                referrerPolicy="no-referrer"
                draggable={false}
                onError={onImageError}
                className={`mx-auto block h-auto w-auto max-w-full object-contain transition-transform duration-200 group-hover/zoom:scale-[1.015] ${imgMaxHeightClass}`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-1.5 bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#D8C19B]/80 bg-[#FAF3E3]/90 text-[#4B3729] opacity-85 shadow-xs transition-opacity duration-200 group-hover/zoom:opacity-100"
              >
                <ZoomIn className="h-3 w-3" />
              </span>
            </button>
          ) : (
            <img
              src={slot.src}
              alt={slot.alt}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={onImageError}
              className={`mx-auto block h-auto w-auto max-w-full object-contain ${imgMaxHeightClass}`}
            />
          )
        ) : (
          <div className="flex h-36 w-28 flex-col items-center justify-center gap-1 border border-dashed border-[#C7B08F]/75 bg-[#F6ECDA]/80 px-2 text-center text-[#8B7259]">
            <ImageIcon className="h-4 w-4 opacity-70" aria-hidden="true" />
            <span className="font-editorial text-[11px] italic">
              {slot.placeholderLabel}
            </span>
          </div>
        )}
      </div>

      <figcaption
        className={`font-handwritten mt-1.5 px-1 text-center leading-tight text-[#523E2F] ${
          compactCaption
            ? 'text-[0.86rem] sm:text-[0.98rem]'
            : 'text-[0.96rem] sm:text-[1.1rem]'
        }`}
      >
        {slot.caption}
      </figcaption>
    </figure>
  );
}

/**
 * Illustrated closed mocha-brown hardcover book titled "One Last Page".
 */
function IllustratedBookCover({
  interactive = false,
  onOpen,
}: {
  interactive?: boolean;
  onOpen?: () => void;
}) {
  const { cover } = ONE_LAST_PAGE_BOOK_CONFIG;

  const content = (
    <div className="relative aspect-[2/3] w-full select-none">
      {/* Visible stacked ivory page edges along the right and bottom */}
      <div
        aria-hidden="true"
        className="absolute top-2.5 right-0 bottom-2 left-3 rounded-r-[8px] border border-[#C4B094] bg-[#ECE0CA]"
      />
      <div
        aria-hidden="true"
        className="absolute top-3.5 right-1 bottom-1 left-3.5 rounded-r-[7px] border border-[#D4C3A7] bg-[#F7EEDC]"
      />

      {/* Satin ribbon bookmark */}
      <div
        aria-hidden="true"
        className="absolute right-10 -bottom-4 h-7 w-3 rounded-b-[2px] bg-gradient-to-b from-[#9E7847] to-[#77552B] shadow-sm"
      />

      {/* Mocha-brown cloth/leather front cover */}
      <div
        className="relative mr-2 mb-2 flex h-[calc(100%-8px)] w-[calc(100%-8px)] flex-col items-center justify-center overflow-hidden rounded-l-[5px] rounded-r-[11px] border border-[#3A251A] px-6 py-8 text-center shadow-[0_28px_56px_-18px_rgba(16,9,5,0.72),inset_0_1px_1px_rgba(255,235,205,0.16)]"
        style={{
          background:
            'linear-gradient(145deg, #6E503E 0%, #563D2E 52%, #3D291E 100%)',
        }}
      >
        {/* Bound spine crease & blind-tooled vertical groove */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-[#2B1A11]/60 via-[#4A3224]/25 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-4 left-6 w-[1px] bg-[#DFC086]/30"
        />

        {/* Delicate handmade bookcloth texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='coverCloth'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23coverCloth)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Champagne-gold inner embossed frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 left-9 rounded-[4px] border border-[#DFC086]/45"
        />

        {/* Cover gold-foil botanical & title */}
        <div className="relative z-10 pl-3">
          <svg
            aria-hidden="true"
            width="58"
            height="58"
            viewBox="0 0 72 72"
            fill="none"
            className="mx-auto opacity-85"
          >
            <path
              d="M36 56 C36 42, 36 28, 36 14"
              stroke="#DFC086"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
            <path
              d="M36 42 C28 38, 22 31, 22 24 C29 25, 34 33, 36 42 Z"
              stroke="#DFC086"
              strokeWidth="1.05"
              fill="#DFC086"
              fillOpacity="0.14"
            />
            <path
              d="M36 35 C44 31, 50 24, 50 17 C43 18, 38 26, 36 35 Z"
              stroke="#DFC086"
              strokeWidth="1.05"
              fill="#DFC086"
              fillOpacity="0.14"
            />
            <circle cx="36" cy="12" r="2.1" fill="#E8CA8E" />
            <circle cx="24" cy="48" r="1.1" fill="#E8CA8E" fillOpacity="0.7" />
            <circle cx="48" cy="46" r="1.1" fill="#E8CA8E" fillOpacity="0.7" />
          </svg>

          <div className="mx-auto my-4 h-[1px] w-16 bg-gradient-to-r from-transparent via-[#DFC086]/60 to-transparent" />

          <h1
            className="font-editorial text-[1.6rem] font-medium tracking-[0.02em] text-[#F4E6CE] sm:text-[1.85rem]"
            style={{ textWrap: 'balance' }}
          >
            {cover.title}
          </h1>

          <p className="font-editorial mt-2 max-w-[20ch] text-[0.95rem] italic leading-snug text-[#DFCBAF]/80">
            {cover.subtitle}
          </p>

          <div className="mx-auto mt-4 h-[1px] w-12 bg-gradient-to-r from-transparent via-[#DFC086]/40 to-transparent" />

          {interactive && (
            <span className="mt-6 inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[0.1em] uppercase text-[#E7CD9D]/90 transition-transform duration-300 group-hover:translate-x-0.5">
              <span>Click to open</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (interactive && onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open One Last Page memory book"
        className="group relative block w-full cursor-pointer text-left transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C185]/70"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-radial from-[#E5C185]/18 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        />
        {content}
      </button>
    );
  }

  return content;
}

/**
 * Vintage antique-brass padlock illustration with animated shackle & soft
 * golden keyhole glow when unlocking a protected book chapter.
 */
function VintageBookLockIllustration({
  isUnlocking,
  reduced,
}: {
  isUnlocking: boolean;
  reduced: boolean;
}) {
  const uid = useId().replace(/:/g, '');

  return (
    <div className="relative flex items-center justify-center">
      {/* Soft warm golden halo */}
      <motion.div
        aria-hidden="true"
        animate={
          isUnlocking
            ? { opacity: 0.9, scale: reduced ? 1 : 1.18 }
            : { opacity: 0.42, scale: 1 }
        }
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute h-24 w-24 rounded-full blur-xl"
        style={{
          background:
            'radial-gradient(circle, rgba(218, 179, 108, 0.55) 0%, rgba(251, 246, 236, 0) 72%)',
        }}
      />

      {!reduced && isUnlocking && (
        <motion.span
          aria-hidden="true"
          initial={{ scale: 0.72, opacity: 0.8 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute h-20 w-20 rounded-full border border-[#C69D55]"
        />
      )}

      <svg
        aria-hidden="true"
        viewBox="0 0 96 108"
        fill="none"
        className="relative z-10 h-20 w-[72px] drop-shadow-[0_8px_14px_rgba(72,48,24,0.22)] sm:h-24 sm:w-[86px]"
      >
        <defs>
          <linearGradient
            id={`brassShackle-${uid}`}
            x1="28"
            y1="10"
            x2="68"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F2DCB0" />
            <stop offset="48%" stopColor="#C9A057" />
            <stop offset="100%" stopColor="#8E672B" />
          </linearGradient>
          <linearGradient
            id={`brassBody-${uid}`}
            x1="18"
            y1="42"
            x2="78"
            y2="98"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F6E6C4" />
            <stop offset="38%" stopColor="#DEC088" />
            <stop offset="82%" stopColor="#BF9650" />
            <stop offset="100%" stopColor="#997133" />
          </linearGradient>
          <radialGradient
            id={`keyholeGlow-${uid}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFF8DE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E4BD70" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Animated Shackle lifting & pivoting gently open on unlock */}
        <motion.g
          animate={
            isUnlocking
              ? reduced
                ? { y: -4 }
                : { y: -7, rotate: -18 }
              : { y: 0, rotate: 0 }
          }
          transition={{ type: 'spring', stiffness: 210, damping: 16 }}
          style={{ transformOrigin: '64px 44px' }}
        >
          <path
            d="M31 48 V32 C31 20.5, 39 13, 48 13 C57 13, 65 20.5, 65 32 V48"
            stroke={`url(#brassShackle-${uid})`}
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
            strokeOpacity="0.7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Heirloom Padlock Body */}
        <rect
          x="20"
          y="44"
          width="56"
          height="50"
          rx="11"
          fill={`url(#brassBody-${uid})`}
          stroke="#6A4A28"
          strokeWidth="1.5"
        />
        {/* Inner engraved brass frame */}
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
        {/* Highlight top bevel */}
        <path
          d="M28 46.8 H68"
          stroke="#FFF7DF"
          strokeOpacity="0.72"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Tiny antique corner rivets */}
        <circle cx="29" cy="53" r="1.35" fill="#7D5A33" />
        <circle cx="67" cy="53" r="1.35" fill="#7D5A33" />
        <circle cx="29" cy="85" r="1.35" fill="#7D5A33" />
        <circle cx="67" cy="85" r="1.35" fill="#7D5A33" />

        {/* Soft keyhole glow when unlocking */}
        {isUnlocking && (
          <circle
            cx="48"
            cy="68"
            r="14"
            fill={`url(#keyholeGlow-${uid})`}
          />
        )}

        {/* Keyhole Escutcheon Plate */}
        <circle
          cx="48"
          cy="68.5"
          r="10.5"
          fill="#FAF0D8"
          fillOpacity="0.48"
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

const TOTAL_PAGES: PageNumber = 34;

export function OneLastPageScreen({
  onLock,
  onBack,
  onContinue,
}: OneLastPageScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const lockInputId = useId();

  const [bookStage, setBookStage] = useState<BookStage>('closedCover');
  const [activePage, setActivePage] = useState<PageNumber>(1);
  const [activeTurn, setActiveTurn] = useState<ActiveTurn | null>(null);
  const [unlockedSections, setUnlockedSections] = useState<
    Record<BookSectionLockId, boolean>
  >({
    summer: false,
    urjotsav: false,
    chats: false,
  });
  const [pendingLockPage, setPendingLockPage] = useState<2 | 18 | 25 | null>(
    null
  );
  const [lockInput, setLockInput] = useState('');
  const [lockError, setLockError] = useState(false);
  const [lockShakeTick, setLockShakeTick] = useState(0);
  const [isUnlockingLock, setIsUnlockingLock] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const [zoomedGallery, setZoomedGallery] = useState<{
    items: readonly OneLastPagePhotoSlot[];
    index: number;
  } | null>(null);

  // Editable reflection text on Page 32 (Before We Turn The Page)
  const [reflectionText, setReflectionText] = useState<string>(
    ONE_LAST_PAGE_BOOK_CONFIG.pageReflection.reflectionText
  );
  const [editingReflection, setEditingReflection] = useState(false);
  const [reflectionDraft, setReflectionDraft] = useState<string>(
    ONE_LAST_PAGE_BOOK_CONFIG.pageReflection.reflectionText
  );

  const timersRef = useRef<number[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastSwipeTurnTimeRef = useRef(0);
  const turnCounterRef = useRef(0);
  const lockInputRef = useRef<HTMLInputElement | null>(null);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const scheduleTimeout = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    timersRef.current.push(id);
    return id;
  }, []);

  // Preload all 93 photographs + 3 video posters so page turns reveal frames instantaneously
  useEffect(() => {
    const slots: readonly OneLastPagePhotoSlot[] = [
      ...ONE_LAST_PAGE_BOOK_CONFIG.page1Coffee.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page2Summer.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page3Corn.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page4Jamun.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page5Dahi.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page6Breakfast.photos,
      ONE_LAST_PAGE_BOOK_CONFIG.page7Milk.photo,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page8IceCream.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page9NutsPlums.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page10RecipeOne.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page11RecipeTwo.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page12Ganesh.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page13Janmashtami.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page14DiwaliLamps.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page15FamilySmiles.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page16OutfitsMens.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page17OutfitsDresses.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page18UrjotsavPhotos.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page19UrjotsavVideos.videos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page20Rain.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page21Incidents.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page22NightSkies.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page23AfterHours.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page24RetroTrend.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page25ChatsMusicStart.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page26ChatsPasswordMid.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page27ChatsPasswordClues.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page28ChatsPasswordSolved.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page29CallMemoriesWhatsAppEarly.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page30CallMemoriesWhatsAppNov.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page31CallLogsOctober.photos,
      ...ONE_LAST_PAGE_BOOK_CONFIG.page32CallLogsWeekend.photos,
    ];
    slots.forEach((slot) => {
      if (slot.mediaType === 'video') {
        if (slot.posterSrc) {
          const poster = new Image();
          poster.src = slot.posterSrc;
        }
      } else if (slot.src) {
        const img = new Image();
        img.src = slot.src;
      }
    });
  }, []);

  const handleOpenCover = useCallback(() => {
    if (bookStage !== 'closedCover') return;
    clearAllTimers();
    setActivePage(1);
    setBookStage('openingCover');
    scheduleTimeout(
      () => {
        setBookStage('openBook');
      },
      reduced ? 300 : 1120
    );
  }, [bookStage, clearAllTimers, reduced, scheduleTimeout]);

  const isTargetPageLocked = useCallback(
    (page: number): page is 2 | 18 | 25 => {
      if (page === 2 || page === 18 || page === 25) {
        return !unlockedSections[BOOK_SECTION_LOCKS[page].id];
      }
      return false;
    },
    [unlockedSections]
  );

  const triggerPageTurnAnimation = useCallback(
    (direction: 'next' | 'prev') => {
      if (reduced) return;
      turnCounterRef.current += 1;
      const turnKey = turnCounterRef.current;
      setActiveTurn({ key: turnKey, direction });
      scheduleTimeout(() => {
        setActiveTurn((prev) => (prev?.key === turnKey ? null : prev));
      }, 780);
    },
    [reduced, scheduleTimeout]
  );

  useEffect(() => {
    if (pendingLockPage === null || isUnlockingLock) return;
    const id = window.setTimeout(() => {
      lockInputRef.current?.focus();
    }, reduced ? 40 : 260);
    return () => window.clearTimeout(id);
  }, [isUnlockingLock, pendingLockPage, reduced]);

  const turnToPage = useCallback(
    (targetPage: PageNumber) => {
      if (bookStage !== 'openBook' || isUnlockingLock) return;
      if (pendingLockPage !== null) return;
      if (targetPage === activePage) return;

      if (targetPage > activePage && isTargetPageLocked(targetPage)) {
        setEditingReflection(false);
        setLockInput('');
        setLockError(false);
        setIsUnlockingLock(false);
        setPendingLockPage(targetPage);
        triggerPageTurnAnimation('next');
        return;
      }

      const direction: 'next' | 'prev' =
        targetPage > activePage ? 'next' : 'prev';

      setEditingReflection(false);
      setActivePage(targetPage);
      triggerPageTurnAnimation(direction);
    },
    [
      activePage,
      bookStage,
      isTargetPageLocked,
      isUnlockingLock,
      pendingLockPage,
      triggerPageTurnAnimation,
    ]
  );

  const handleNextPage = useCallback(() => {
    if (bookStage === 'closedCover') {
      handleOpenCover();
      return;
    }
    if (bookStage !== 'openBook' || isUnlockingLock) return;
    if (pendingLockPage !== null) {
      lockInputRef.current?.focus();
      return;
    }
    if (activePage < TOTAL_PAGES) {
      turnToPage((activePage + 1) as PageNumber);
    }
  }, [
    activePage,
    bookStage,
    handleOpenCover,
    isUnlockingLock,
    pendingLockPage,
    turnToPage,
  ]);

  const handlePrevPage = useCallback(() => {
    if (bookStage !== 'openBook' || isUnlockingLock) return;
    if (pendingLockPage !== null) {
      setPendingLockPage(null);
      setLockInput('');
      setLockError(false);
      triggerPageTurnAnimation('prev');
      return;
    }
    if (activePage > 1) {
      turnToPage((activePage - 1) as PageNumber);
    }
  }, [
    activePage,
    bookStage,
    isUnlockingLock,
    pendingLockPage,
    triggerPageTurnAnimation,
    turnToPage,
  ]);

  const handleUnlockSectionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingLockPage || isUnlockingLock) return;

    const lockConfig = BOOK_SECTION_LOCKS[pendingLockPage];
    const normalizedInput = lockInput.trim().toLowerCase();
    const normalizedExpected = lockConfig.answer.trim().toLowerCase();

    if (normalizedInput && normalizedInput === normalizedExpected) {
      setLockError(false);
      setIsUnlockingLock(true);
      const targetPage = lockConfig.targetPage;
      const lockId = lockConfig.id;

      scheduleTimeout(
        () => {
          setUnlockedSections((prev) => ({ ...prev, [lockId]: true }));
          setPendingLockPage(null);
          setIsUnlockingLock(false);
          setLockInput('');
          setActivePage(targetPage);
          triggerPageTurnAnimation('next');
        },
        reduced ? 420 : 950
      );
      return;
    }

    setLockError(true);
    setLockShakeTick((prev) => prev + 1);
    lockInputRef.current?.focus();
  };

  const handleTurnFinalPage = useCallback(() => {
    if (bookStage !== 'openBook' || activePage !== TOTAL_PAGES) return;
    clearAllTimers();
    setActiveTurn(null);
    setBookStage('closingBook');
    scheduleTimeout(
      () => {
        onContinue?.();
      },
      reduced ? 450 : 1550
    );
  }, [activePage, bookStage, clearAllTimers, onContinue, reduced, scheduleTimeout]);

  // Keyboard navigation + lightbox Escape / arrow handling
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (zoomedGallery) {
        if (e.key === 'Escape') {
          setZoomedGallery(null);
        } else if (e.key === 'ArrowRight') {
          setZoomedGallery((prev) =>
            prev
              ? { ...prev, index: (prev.index + 1) % prev.items.length }
              : null
          );
        } else if (e.key === 'ArrowLeft') {
          setZoomedGallery((prev) =>
            prev
              ? {
                  ...prev,
                  index:
                    (prev.index - 1 + prev.items.length) % prev.items.length,
                }
              : null
          );
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNextPage, handlePrevPage, zoomedGallery]);

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (bookStage !== 'openBook' || editingReflection) {
      touchStartRef.current = null;
      return;
    }
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'button, input, textarea, label, a, figure, img, video, [data-no-page-turn]'
      )
    ) {
      touchStartRef.current = null;
      return;
    }
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      lastSwipeTurnTimeRef.current = Date.now();
      if (dx < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
  };

  const handleSpreadClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (bookStage !== 'openBook' || editingReflection) return;
    if (Date.now() - lastSwipeTurnTimeRef.current < 450) return;

    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim().length > 0) return;

    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'button, input, textarea, label, a, figure, img, video, [data-no-page-turn]'
      )
    ) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    if (relX >= rect.width / 2) {
      handleNextPage();
    } else {
      handlePrevPage();
    }
  };

  const handleSpreadMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (bookStage !== 'openBook' || editingReflection) {
      if (hoverSide !== null) setHoverSide(null);
      return;
    }
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'button, input, textarea, label, a, figure, img, video, [data-no-page-turn]'
      )
    ) {
      if (hoverSide !== null) setHoverSide(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const side: 'left' | 'right' = relX >= rect.width / 2 ? 'right' : 'left';
    const canTurnThatWay =
      (side === 'left' && (pendingLockPage !== null || activePage > 1)) ||
      (side === 'right' && !pendingLockPage && activePage < TOTAL_PAGES);

    const nextHover = canTurnThatWay ? side : null;
    if (hoverSide !== nextHover) {
      setHoverSide(nextHover);
    }
  };

  const markImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const activeLockConfig: BookSectionLockConfig | null = pendingLockPage
    ? BOOK_SECTION_LOCKS[pendingLockPage]
    : null;

  const canTurnHoveredSide =
    bookStage === 'openBook' &&
    !editingReflection &&
    !isUnlockingLock &&
    ((hoverSide === 'left' && (pendingLockPage !== null || activePage > 1)) ||
      (hoverSide === 'right' && !pendingLockPage && activePage < TOTAL_PAGES));

  const cfg = ONE_LAST_PAGE_BOOK_CONFIG;

  return (
    <motion.div
      key="one-last-page-book-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.25 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden text-[#4E3B2B]"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #F1E7D6 0%, #EDE0CB 50%, #E8D9C2 100%)',
      }}
    >
      {/* Subtle parchment-inspired backdrop texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.038] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bookDeskGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23bookDeskGrain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Delicate warm golden ambient light & soft antique edge vignette (#DCC7A8) */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0.6 }}
        animate={{
          opacity:
            bookStage === 'closingBook'
              ? 0.35
              : bookStage === 'openBook'
                ? 1
                : 0.78,
        }}
        transition={{ duration: reduced ? 0.25 : 0.9, ease: 'easeInOut' }}
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(252, 245, 228, 0.56) 0%, rgba(236, 214, 174, 0.16) 42%, rgba(220, 199, 168, 0.52) 100%)',
          boxShadow: 'inset 0 0 96px rgba(220, 199, 168, 0.45)',
        }}
      />

      {/* Minimal Header */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 pt-3 pb-1 sm:px-10 sm:pt-4">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={() => {
                clearAllTimers();
                onBack();
              }}
              className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-[#6B5442] transition-colors duration-150 hover:text-[#2D2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Letter</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered Illustrated Interactive Book */}
      <main
        className="relative z-20 flex flex-1 flex-col items-center justify-center px-3 pt-1 pb-6 sm:px-6 sm:pb-8 lg:px-10"
        style={{ perspective: '2200px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {bookStage === 'closedCover' ? (
            /* 1. CLOSED ILLUSTRATED COVER */
            <motion.div
              key="book-closed-cover"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                transition: { duration: reduced ? 0.12 : 0.18 },
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-[330px] sm:max-w-[400px] lg:max-w-[440px]"
            >
              <IllustratedBookCover interactive onOpen={handleOpenCover} />
            </motion.div>
          ) : bookStage === 'closingBook' ? (
            /* 5. GENTLE BOOK CLOSING & SCENE FADE OUT */
            <motion.div
              key="book-closing-sequence"
              initial={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1.03, rotateY: -26 }
              }
              animate={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: [1, 1, 0],
                      scale: [1.03, 0.98, 0.94],
                      rotateY: [-26, 0, 0],
                    }
              }
              transition={{
                duration: reduced ? 0.45 : 1.5,
                times: reduced ? undefined : [0, 0.52, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto w-full max-w-[330px] sm:max-w-[400px] lg:max-w-[440px]"
            >
              <IllustratedBookCover />
            </motion.div>
          ) : (
            /* 2. OPEN MULTI-PAGE ILLUSTRATED JOURNAL SPREAD */
            <motion.section
              key="book-open-spread"
              aria-label="One Last Page Interactive Memory Book"
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0.9, scale: 0.96, x: -24 }
              }
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{
                duration: reduced ? 0.25 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto flex w-full max-w-[1060px] flex-col items-center xl:max-w-[1120px]"
            >
              {/* Outer Mocha Hardcover Board Cradle */}
              <div
                className="relative w-full rounded-[14px] border border-[#3B261B] p-3 shadow-[0_32px_68px_-18px_rgba(16,9,5,0.74),0_12px_26px_-10px_rgba(16,9,5,0.45)] sm:p-5 lg:p-6"
                style={{
                  background:
                    'linear-gradient(145deg, #6A4C3A 0%, #4E372A 54%, #3A261C 100%)',
                }}
              >
                {/* Visible stepped layered page stacks */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 top-4 bottom-2 rounded-[8px] border border-[#C9B393] bg-[#DCC9AD] sm:inset-x-6 sm:top-6 sm:bottom-3 lg:inset-x-7 lg:top-7"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4.5 top-3.5 bottom-2.5 rounded-[7px] border border-[#D7C4A7] bg-[#E9DCC8] sm:inset-x-7 sm:top-5.5 sm:bottom-3.5 lg:inset-x-8 lg:top-6.5"
                />

                {/* Satin ribbon bookmark */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 left-7 z-0 h-9 w-3.5 rounded-b-[2px] bg-gradient-to-b from-[#9E7847] to-[#745229] shadow-sm md:left-1/2 md:-translate-x-1/2"
                />

                {/* Open Book Paper Spread Surface — full left/right surface navigation */}
                <div
                  onClick={handleSpreadClick}
                  onMouseMove={handleSpreadMouseMove}
                  onMouseLeave={() => setHoverSide(null)}
                  className={`relative z-10 grid h-[640px] w-full grid-cols-1 overflow-hidden rounded-[6px] border border-[#CBB696] text-[#3B2C22] sm:h-[680px] md:h-[min(760px,80dvh)] md:grid-cols-2 lg:h-[min(810px,82dvh)] ${
                    canTurnHoveredSide ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{
                    background:
                      'radial-gradient(circle at 50% 44%, #FBF6EC 0%, #F7F0E4 56%, #E9DCC8 100%)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Extremely subtle natural vintage parchment grain across open spread */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[15] opacity-[0.036] mix-blend-multiply"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='openSpreadPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23openSpreadPaper)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Soft antique parchment edge vignette around open spread */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[15]"
                    style={{
                      boxShadow:
                        'inset 0 0 46px rgba(220, 201, 173, 0.36), inset 0 0 14px rgba(220, 201, 173, 0.22)',
                    }}
                  />

                  {/* Mobile left-spine gutter shadow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-20 w-7 bg-gradient-to-r from-[#8C6D4E]/22 via-[#B89A78]/8 to-transparent md:hidden"
                  />

                  {/* Desktop center book-binding spine crease & stitched gutter */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-12 -translate-x-1/2 md:block"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(130,102,72,0) 0%, rgba(112,84,56,0.16) 44%, rgba(78,56,35,0.28) 50%, rgba(112,84,56,0.16) 56%, rgba(130,102,72,0) 100%)',
                    }}
                  >
                    <div className="mx-auto flex h-full w-[1px] flex-col justify-evenly py-10">
                      <span className="h-3 w-[2px] -translate-x-[0.5px] rounded-full bg-[#7A5E42]/55" />
                      <span className="h-3 w-[2px] -translate-x-[0.5px] rounded-full bg-[#7A5E42]/55" />
                      <span className="h-3 w-[2px] -translate-x-[0.5px] rounded-full bg-[#7A5E42]/55" />
                    </div>
                  </div>

                  {/* ==================== LEFT PAGE LEAF (Desktop Facing Page) ==================== */}
                  <div
                    className="relative z-10 hidden h-full flex-col justify-between overflow-hidden border-r border-[#D6C3A4]/60 px-8 py-6 md:flex lg:px-11 lg:py-7"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 44%, #FBF6EC 0%, #F7F0E4 56%, #E9DCC8 92%, rgba(220, 201, 173, 0.72) 100%)',
                      boxShadow: 'inset 0 0 34px rgba(220, 201, 173, 0.3)',
                    }}
                  >
                    <BotanicalSprigCorner className="absolute top-3 left-3 h-20 w-20 lg:h-24 lg:w-24" />

                    {activeLockConfig ? (
                      <div className="my-auto flex flex-col items-center text-center">
                        <div className="mx-auto w-full max-w-[310px] rounded-[6px] border border-[#D4C09E]/80 bg-[#FAF4E5]/75 px-7 py-10 lg:max-w-[340px] lg:px-8 lg:py-12">
                          <p className="font-editorial text-[11.5px] tracking-[0.16em] uppercase text-[#8C7158]">
                            Protected Chapter
                          </p>
                          <div className="mx-auto my-3.5 h-[1px] w-14 bg-[#C49E5B]/60" />
                          <p className="font-editorial text-[1.6rem] italic text-[#3E2C21] lg:text-[1.8rem]">
                            {activeLockConfig.sectionLabel}
                          </p>
                          <p className="font-editorial mt-2.5 text-[1.02rem] leading-relaxed text-[#715A47] lg:text-[1.08rem]">
                            Answer the question on the facing page to open this
                            chapter.
                          </p>
                          <div className="mx-auto mt-5 h-[1px] w-10 bg-[#C49E5B]/35" />
                          <p className="font-handwritten mt-3 text-[1.15rem] text-[#8B6F56]">
                            {activeLockConfig.leftTagline}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* LEFT LEAF — PAGE 1: Keepsake Folio Title Plate */}
                        {activePage === 1 && (
                      <div className="my-auto flex flex-col items-center text-center">
                        <div className="mx-auto w-full max-w-[310px] rounded-[6px] border border-[#D4C09E]/80 bg-[#FAF4E5]/75 px-7 py-10 lg:max-w-[340px] lg:px-8 lg:py-12">
                          <p className="font-editorial text-[11.5px] tracking-[0.14em] uppercase text-[#8C7158]">
                            {cfg.cover.spineLabel}
                          </p>
                          <div className="mx-auto my-3.5 h-[1px] w-14 bg-[#C49E5B]/60" />
                          <p className="font-editorial text-[1.65rem] italic text-[#3E2C21] lg:text-[1.85rem]">
                            {cfg.cover.title}
                          </p>
                          <p className="font-editorial mt-2.5 text-[1.06rem] leading-relaxed text-[#715A47] lg:text-[1.12rem]">
                            {cfg.cover.subtitle}
                          </p>
                          <div className="mx-auto mt-5 h-[1px] w-10 bg-[#C49E5B]/35" />
                          <p className="font-handwritten mt-3 text-[1.1rem] text-[#8B6F56]">
                            {cfg.page1Coffee.marginNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 2: Watermelon Duo (Museum Mat Diagonals) */}
                    {activePage === 2 && (
                      <div className="my-auto flex flex-col gap-3">
                        <p className="font-handwritten pl-2 text-[1.15rem] text-[#7D644F]">
                          {cfg.page2Summer.topNote}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <div className="-mt-2">
                            <ScrapbookPhotoFrame
                              slot={cfg.page2Summer.photos[0]}
                              variant="museum-mat"
                              tiltClass="-rotate-[2.4deg]"
                              washiPosition="top-left-corner"
                              washiVariant="sage"
                              imgMaxHeightClass="max-h-[210px] lg:max-h-[245px]"
                              imgError={Boolean(
                                imgErrors[cfg.page2Summer.photos[0].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page2Summer.photos[0].id)
                              }
                            />
                          </div>
                          <div className="mt-7">
                            <ScrapbookPhotoFrame
                              slot={cfg.page2Summer.photos[1]}
                              variant="museum-mat"
                              tiltClass="rotate-[2.2deg]"
                              washiPosition="top-right-corner"
                              washiVariant="champagne"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page2Summer.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page2Summer.photos[1].id)
                              }
                            />
                          </div>
                        </div>
                        <p className="font-handwritten pr-2 text-right text-[1.18rem] text-[#5B4535]">
                          {cfg.page2Summer.notes[0]}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 3: Roasted Corn Feature (Kraft Pinned) */}
                    {activePage === 3 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page3Corn.photos[0]}
                          variant="kraft-pinned"
                          tiltClass="-rotate-[1.6deg]"
                          washiPosition="none"
                          imgMaxHeightClass="max-h-[min(290px,33dvh)] lg:max-h-[min(330px,35dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page3Corn.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page3Corn.photos[0].id)
                          }
                        />
                        <p className="font-editorial max-w-[28ch] text-center text-[1.02rem] italic leading-relaxed text-[#6E5643]">
                          {cfg.page3Corn.subNote}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 4: Jamun Bowl (Arched Cameo Mat) */}
                    {activePage === 4 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page4Jamun.photos[0]}
                          variant="arched-cameo"
                          tiltClass="-rotate-[1.2deg]"
                          washiPosition="none"
                          imgMaxHeightClass="max-h-[min(290px,33dvh)] lg:max-h-[min(330px,35dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page4Jamun.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page4Jamun.photos[0].id)
                          }
                        />
                        <p className="font-handwritten text-[1.18rem] text-[#765D49]">
                          {cfg.page4Jamun.marginLabel}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 5: Frothy Chilled Companion (Paired with Dahi) */}
                    {activePage === 5 && (
                      <div className="my-auto flex flex-col items-center justify-center gap-4">
                        <div className="relative rounded-[8px] border border-[#D4BC93]/70 bg-[#FAF3E3]/75 px-6 py-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]">
                          <div className="mx-auto mb-3 h-[1px] w-12 bg-[#C8A15A]/60" />
                          <ScrapbookPhotoFrame
                            slot={cfg.page5Dahi.photos[1]}
                            variant="museum-mat"
                            tiltClass=""
                            washiPosition="top-center"
                            washiVariant="champagne"
                            imgMaxHeightClass="max-h-[265px] lg:max-h-[310px]"
                            imgError={Boolean(
                              imgErrors[cfg.page5Dahi.photos[1].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page5Dahi.photos[1].id)
                            }
                          />
                          <p className="font-handwritten mt-3 text-center text-[1.16rem] text-[#7D644F]">
                            {cfg.page5Dahi.leftMarginLabel}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 6: Morning Breakfasts (Poha & Jalebi Duo) */}
                    {activePage === 6 && (
                      <div className="my-auto flex flex-col gap-3.5">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page6Breakfast.leftMarginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <div className="-mt-2">
                            <ScrapbookPhotoFrame
                              slot={cfg.page6Breakfast.photos[0]}
                              variant="kraft-pinned"
                              tiltClass="-rotate-[2deg]"
                              washiPosition="none"
                              imgMaxHeightClass="max-h-[215px] lg:max-h-[255px]"
                              imgError={Boolean(
                                imgErrors[cfg.page6Breakfast.photos[0].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page6Breakfast.photos[0].id)
                              }
                            />
                          </div>
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page6Breakfast.photos[1]}
                              variant="polaroid-taped"
                              tiltClass="rotate-[1.8deg]"
                              washiPosition="top-right-corner"
                              washiVariant="champagne"
                              imgMaxHeightClass="max-h-[215px] lg:max-h-[255px]"
                              imgError={Boolean(
                                imgErrors[cfg.page6Breakfast.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page6Breakfast.photos[1].id)
                              }
                            />
                          </div>
                        </div>
                        <p className="font-editorial text-center text-[0.95rem] italic text-[#735B47]">
                          {cfg.page6Breakfast.subNote}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 7: Solo Milk Ritual Dedication */}
                    {activePage === 7 && (
                      <div className="my-auto flex flex-col items-center justify-center px-3 text-center">
                        <div className="w-full max-w-[300px] rounded-[6px] border border-[#D4BF9B]/80 bg-[#FAF4E4]/80 px-7 py-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]">
                          <svg
                            aria-hidden="true"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mx-auto mb-3 opacity-80"
                          >
                            <path
                              d="M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z"
                              fill="#D7B26B"
                            />
                          </svg>
                          <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8C7158]">
                            {cfg.page7Milk.marginLabel}
                          </p>
                          <div className="mx-auto my-3.5 h-[1px] w-12 bg-[#C49E5B]/60" />
                          <p className="font-editorial text-[1.18rem] italic leading-relaxed text-[#4C392B]">
                            “{cfg.page7Milk.leftQuote}”
                          </p>
                          <div className="mx-auto my-4 h-[1px] w-8 bg-[#C49E5B]/40" />
                          <p className="font-handwritten text-[1.16rem] text-[#7A614C]">
                            {cfg.page7Milk.subNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 8: Malai Kulfi Polaroid */}
                    {activePage === 8 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page8IceCream.photos[0]}
                          variant="polaroid-taped"
                          tiltClass="-rotate-[2deg]"
                          washiPosition="top-center"
                          washiVariant="striped"
                          imgMaxHeightClass="max-h-[min(290px,33dvh)] lg:max-h-[min(330px,35dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page8IceCream.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page8IceCream.photos[0].id)
                          }
                        />
                        <p className="font-handwritten text-[1.18rem] text-[#6D5643]">
                          {cfg.page8IceCream.marginLabel}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 9: Almonds Pair */}
                    {activePage === 9 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page9NutsPlums.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page9NutsPlums.photos[0]}
                            variant="kraft-pinned"
                            tiltClass="-rotate-[2deg]"
                            washiPosition="none"
                            imgMaxHeightClass="max-h-[220px] lg:max-h-[255px]"
                            imgError={Boolean(
                              imgErrors[cfg.page9NutsPlums.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page9NutsPlums.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page9NutsPlums.photos[1]}
                              variant="arched-cameo"
                              tiltClass="rotate-[1.8deg]"
                              washiPosition="none"
                              imgMaxHeightClass="max-h-[215px] lg:max-h-[250px]"
                              imgError={Boolean(
                                imgErrors[cfg.page9NutsPlums.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page9NutsPlums.photos[1].id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 10: Recipe Part I (Steps 1 & 2) */}
                    {activePage === 10 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page10RecipeOne.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page10RecipeOne.photos[0]}
                            variant="polaroid-taped"
                            tiltClass="-rotate-[1.8deg]"
                            washiPosition="top-center"
                            washiVariant="champagne"
                            imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                            imgError={Boolean(
                              imgErrors[cfg.page10RecipeOne.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page10RecipeOne.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page10RecipeOne.photos[1]}
                              variant="kraft-pinned"
                              tiltClass="rotate-[1.8deg]"
                              washiPosition="none"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page10RecipeOne.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page10RecipeOne.photos[1].id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 11: Recipe Part II (Steps 5 & 6) */}
                    {activePage === 11 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page11RecipeTwo.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page11RecipeTwo.photos[0]}
                            variant="museum-mat"
                            tiltClass="-rotate-[1.8deg]"
                            washiPosition="top-left-corner"
                            washiVariant="sage"
                            imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                            imgError={Boolean(
                              imgErrors[cfg.page11RecipeTwo.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page11RecipeTwo.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page11RecipeTwo.photos[1]}
                              variant="polaroid-taped"
                              tiltClass="rotate-[1.6deg]"
                              washiPosition="top-right-corner"
                              washiVariant="striped"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page11RecipeTwo.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page11RecipeTwo.photos[1].id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 12: Ganesh Ji Gold Folio */}
                    {activePage === 12 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page12Ganesh.photos[0]}
                          variant="gold-folio"
                          tiltClass=""
                          washiPosition="none"
                          imgMaxHeightClass="max-h-[min(300px,34dvh)] lg:max-h-[min(340px,36dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page12Ganesh.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page12Ganesh.photos[0].id)
                          }
                        />
                        <p className="font-editorial max-w-[28ch] text-center text-[0.98rem] italic text-[#735B47]">
                          {cfg.page12Ganesh.subNote}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 13: Janmashtami Centerpiece */}
                    {activePage === 13 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page13Janmashtami.photos[0]}
                          variant="arched-cameo"
                          tiltClass="-rotate-[1deg]"
                          washiPosition="none"
                          imgMaxHeightClass="max-h-[min(295px,34dvh)] lg:max-h-[min(335px,36dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page13Janmashtami.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page13Janmashtami.photos[0].id)
                          }
                        />
                        <p className="font-handwritten text-[1.15rem] text-[#765D49]">
                          {cfg.page13Janmashtami.marginLabel}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 14: Diwali Diyas Pair */}
                    {activePage === 14 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page14DiwaliLamps.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page14DiwaliLamps.photos[0]}
                            variant="gold-folio"
                            tiltClass="-rotate-[1.6deg]"
                            washiPosition="none"
                            imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                            imgError={Boolean(
                              imgErrors[cfg.page14DiwaliLamps.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page14DiwaliLamps.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page14DiwaliLamps.photos[1]}
                              variant="gold-folio"
                              tiltClass="rotate-[1.6deg]"
                              washiPosition="none"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page14DiwaliLamps.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page14DiwaliLamps.photos[1].id
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 15: Festive Family Selfie + Home Sofa */}
                    {activePage === 15 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#765D49]">
                          {cfg.page15FamilySmiles.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page15FamilySmiles.photos[0]}
                            variant="gold-folio"
                            tiltClass="-rotate-[1.5deg]"
                            washiPosition="none"
                            imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                            imgError={Boolean(
                              imgErrors[cfg.page15FamilySmiles.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page15FamilySmiles.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page15FamilySmiles.photos[1]}
                              variant="polaroid-taped"
                              tiltClass="rotate-[1.6deg]"
                              washiPosition="top-center"
                              washiVariant="champagne"
                              imgMaxHeightClass="max-h-[205px] lg:max-h-[235px]"
                              imgError={Boolean(
                                imgErrors[cfg.page15FamilySmiles.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page15FamilySmiles.photos[1].id
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 16: Shirts & Pairs Landscape Stack (1.jpeg + 3.jpeg) */}
                    {activePage === 16 && (
                      <div className="my-auto flex flex-col items-center gap-3">
                        <p className="font-handwritten self-start pl-1 text-[1.12rem] text-[#7D644F]">
                          {cfg.page16OutfitsMens.marginLabel}
                        </p>
                        <ScrapbookPhotoFrame
                          slot={cfg.page16OutfitsMens.photos[0]}
                          variant="museum-mat"
                          tiltClass="-rotate-[1deg]"
                          washiPosition="top-left-corner"
                          washiVariant="champagne"
                          compactCaption
                          imgMaxHeightClass="max-h-[min(190px,22.5dvh)] lg:max-h-[min(220px,24.5dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page16OutfitsMens.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page16OutfitsMens.photos[0].id)
                          }
                        />
                        <ScrapbookPhotoFrame
                          slot={cfg.page16OutfitsMens.photos[1]}
                          variant="polaroid-taped"
                          tiltClass="rotate-[1deg]"
                          washiPosition="top-right-corner"
                          washiVariant="sage"
                          compactCaption
                          imgMaxHeightClass="max-h-[min(190px,22.5dvh)] lg:max-h-[min(220px,24.5dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page16OutfitsMens.photos[1].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page16OutfitsMens.photos[1].id)
                          }
                        />
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 17: Dresses Pair (dress 1 + dress 2) */}
                    {activePage === 17 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page17OutfitsDresses.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page17OutfitsDresses.photos[0]}
                            variant="arched-cameo"
                            tiltClass="-rotate-[1.6deg]"
                            washiPosition="none"
                            imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                            imgError={Boolean(
                              imgErrors[cfg.page17OutfitsDresses.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(
                                cfg.page17OutfitsDresses.photos[0].id
                              )
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page17OutfitsDresses.photos[1]}
                              variant="museum-mat"
                              tiltClass="rotate-[1.6deg]"
                              washiPosition="top-right-corner"
                              washiVariant="champagne"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page17OutfitsDresses.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page17OutfitsDresses.photos[1].id
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 18: Urjotsav Portrait I */}
                    {activePage === 18 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page18UrjotsavPhotos.photos[0]}
                          variant="gold-folio"
                          tiltClass="-rotate-[1.2deg]"
                          washiPosition="top-left-corner"
                          washiVariant="champagne"
                          imgMaxHeightClass="max-h-[min(295px,34dvh)] lg:max-h-[min(335px,36dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page18UrjotsavPhotos.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(
                              cfg.page18UrjotsavPhotos.photos[0].id
                            )
                          }
                        />
                        <p className="font-handwritten text-[1.16rem] text-[#7A624E]">
                          {cfg.page18UrjotsavPhotos.marginLabel}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 19: Urjotsav Stage Reel I (Playable Portrait Video) */}
                    {activePage === 19 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page19UrjotsavVideos.videos[0]}
                          variant="ticket-cinema"
                          tiltClass="-rotate-[1deg]"
                          washiPosition="top-left-corner"
                          washiVariant="striped"
                          imgMaxHeightClass="max-h-[min(290px,34dvh)] lg:max-h-[min(330px,36dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page19UrjotsavVideos.videos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(
                              cfg.page19UrjotsavVideos.videos[0].id
                            )
                          }
                        />
                        <p className="font-handwritten text-[1.16rem] text-[#7A624E]">
                          {cfg.page19UrjotsavVideos.marginLabel}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 20: Rainy Balcony Views */}
                    {activePage === 20 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page20Rain.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page20Rain.photos[0]}
                            variant="museum-mat"
                            tiltClass="-rotate-[1.8deg]"
                            washiPosition="top-left-corner"
                            washiVariant="sage"
                            imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                            imgError={Boolean(
                              imgErrors[cfg.page20Rain.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page20Rain.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page20Rain.photos[1]}
                              variant="museum-mat"
                              tiltClass="rotate-[1.8deg]"
                              washiPosition="top-right-corner"
                              washiVariant="sage"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page20Rain.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page20Rain.photos[1].id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 21: Little Incidents (Swelling + Ointment) */}
                    {activePage === 21 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.15rem] text-[#7D644F]">
                          {cfg.page21Incidents.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page21Incidents.photos[0]}
                            variant="kraft-pinned"
                            tiltClass="-rotate-[1.8deg]"
                            washiPosition="none"
                            imgMaxHeightClass="max-h-[210px] lg:max-h-[245px]"
                            imgError={Boolean(
                              imgErrors[cfg.page21Incidents.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page21Incidents.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page21Incidents.photos[1]}
                              variant="polaroid-taped"
                              tiltClass="rotate-[1.8deg]"
                              washiPosition="top-center"
                              washiVariant="champagne"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page21Incidents.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(cfg.page21Incidents.photos[1].id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 22: Moonlit Sky Pair */}
                    {activePage === 22 && (
                      <div className="my-auto flex flex-col gap-4">
                        <p className="font-handwritten pl-1 text-[1.16rem] text-[#7A624E]">
                          {cfg.page22NightSkies.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <ScrapbookPhotoFrame
                            slot={cfg.page22NightSkies.photos[0]}
                            variant="midnight-frame"
                            tiltClass="-rotate-[1.6deg]"
                            washiPosition="top-left-corner"
                            washiVariant="striped"
                            imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                            imgError={Boolean(
                              imgErrors[cfg.page22NightSkies.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(cfg.page22NightSkies.photos[0].id)
                            }
                          />
                          <div className="mt-5">
                            <ScrapbookPhotoFrame
                              slot={cfg.page22NightSkies.photos[1]}
                              variant="midnight-frame"
                              tiltClass="rotate-[1.6deg]"
                              washiPosition="top-right-corner"
                              washiVariant="champagne"
                              imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                              imgError={Boolean(
                                imgErrors[cfg.page22NightSkies.photos[1].id]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page22NightSkies.photos[1].id
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 23: Late-Night Gaming Frame */}
                    {activePage === 23 && (
                      <div className="my-auto flex flex-col items-center gap-4">
                        <ScrapbookPhotoFrame
                          slot={cfg.page23AfterHours.photos[0]}
                          variant="midnight-frame"
                          tiltClass="-rotate-[1.2deg]"
                          washiPosition="top-left-corner"
                          washiVariant="champagne"
                          imgMaxHeightClass="max-h-[min(290px,33dvh)] lg:max-h-[min(330px,35dvh)]"
                          imgError={Boolean(
                            imgErrors[cfg.page23AfterHours.photos[0].id]
                          )}
                          onImageError={() =>
                            markImageError(cfg.page23AfterHours.photos[0].id)
                          }
                        />
                        <p className="font-handwritten text-[1.16rem] text-[#7A624E]">
                          {cfg.page23AfterHours.marginLabel}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 24: Vintage 90s Throwback Keepsake Plate */}
                    {activePage === 24 && (
                      <div className="my-auto flex flex-col items-center text-center">
                        <div className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[6px] border border-[#CBB38D] bg-[#FAF2E1]/85 px-6 py-8 shadow-[0_14px_26px_-18px_rgba(44,26,12,0.32)] lg:max-w-[350px] lg:px-8 lg:py-10">
                          {/* Subtle 90s 35mm film-strip perforation border bands */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 flex h-3.5 items-center justify-evenly border-b border-[#D2BE9B]/75 bg-[#EFE2CA]/70 px-2"
                          >
                            {Array.from({ length: 10 }).map((_, idx) => (
                              <span
                                key={idx}
                                className="h-1.5 w-2.5 rounded-[1px] border border-[#B89D76]/55 bg-[#FCF8EE]"
                              />
                            ))}
                          </div>
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 flex h-3.5 items-center justify-evenly border-t border-[#D2BE9B]/75 bg-[#EFE2CA]/70 px-2"
                          >
                            {Array.from({ length: 10 }).map((_, idx) => (
                              <span
                                key={idx}
                                className="h-1.5 w-2.5 rounded-[1px] border border-[#B89D76]/55 bg-[#FCF8EE]"
                              />
                            ))}
                          </div>

                          <p className="font-editorial mt-2 text-[10.5px] tracking-[0.16em] uppercase text-[#8A6D53]">
                            {cfg.page24RetroTrend.editionLabel}
                          </p>
                          <div className="mx-auto my-3.5 h-[1px] w-14 bg-[#C49E5B]/60" />
                          <p className="font-editorial text-[1.45rem] italic leading-snug text-[#3D2B20] lg:text-[1.65rem]">
                            {cfg.page24RetroTrend.heading}
                          </p>
                          <p className="font-editorial mt-3 text-[1.02rem] italic leading-relaxed text-[#6E5643] lg:text-[1.08rem]">
                            “{cfg.page24RetroTrend.subtitle}”
                          </p>
                          <div className="mx-auto mt-5 h-[1px] w-10 bg-[#C49E5B]/35" />
                          <p className="font-handwritten mt-3 mb-1 text-[1.12rem] text-[#846850]">
                            {cfg.page24RetroTrend.marginNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 25: Conversations Part I (Music + Banter) */}
                    {activePage === 25 && (
                      <div className="my-auto flex flex-col gap-3">
                        <p className="font-handwritten pl-1 text-[1.12rem] text-[#7A624E]">
                          {cfg.page25ChatsMusicStart.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-3.5">
                          <ScrapbookPhotoFrame
                            slot={cfg.page25ChatsMusicStart.photos[0]}
                            variant="polaroid-taped"
                            tiltClass="-rotate-[1.2deg]"
                            washiPosition="top-left-corner"
                            washiVariant="sage"
                            compactCaption
                            imgMaxHeightClass="max-h-[min(445px,51dvh)] lg:max-h-[min(500px,55dvh)]"
                            imgError={Boolean(
                              imgErrors[cfg.page25ChatsMusicStart.photos[0].id]
                            )}
                            onImageError={() =>
                              markImageError(
                                cfg.page25ChatsMusicStart.photos[0].id
                              )
                            }
                            onZoom={() =>
                              setZoomedGallery({
                                items: cfg.page25ChatsMusicStart.photos,
                                index: 0,
                              })
                            }
                          />
                          <div className="mt-3">
                            <ScrapbookPhotoFrame
                              slot={cfg.page25ChatsMusicStart.photos[1]}
                              variant="museum-mat"
                              tiltClass="rotate-[1.2deg]"
                              washiPosition="top-right-corner"
                              washiVariant="champagne"
                              compactCaption
                              imgMaxHeightClass="max-h-[min(445px,51dvh)] lg:max-h-[min(500px,55dvh)]"
                              imgError={Boolean(
                                imgErrors[
                                  cfg.page25ChatsMusicStart.photos[1].id
                                ]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page25ChatsMusicStart.photos[1].id
                                )
                              }
                              onZoom={() =>
                                setZoomedGallery({
                                  items: cfg.page25ChatsMusicStart.photos,
                                  index: 1,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 26: Password Hunt Screenshots 1 & 2 */}
                    {activePage === 26 && (
                      <div className="my-auto flex flex-col gap-3">
                        <p className="font-handwritten pl-1 text-[1.12rem] text-[#7A624E]">
                          {cfg.page26ChatsPasswordMid.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-3.5">
                          <ScrapbookPhotoFrame
                            slot={cfg.page26ChatsPasswordMid.photos[0]}
                            variant="museum-mat"
                            tiltClass="-rotate-[1deg]"
                            washiPosition="top-left-corner"
                            washiVariant="champagne"
                            compactCaption
                            imgMaxHeightClass="max-h-[min(445px,51dvh)] lg:max-h-[min(500px,55dvh)]"
                            imgError={Boolean(
                              imgErrors[
                                cfg.page26ChatsPasswordMid.photos[0].id
                              ]
                            )}
                            onImageError={() =>
                              markImageError(
                                cfg.page26ChatsPasswordMid.photos[0].id
                              )
                            }
                            onZoom={() =>
                              setZoomedGallery({
                                items: cfg.page26ChatsPasswordMid.photos,
                                index: 0,
                              })
                            }
                          />
                          <div className="mt-3">
                            <ScrapbookPhotoFrame
                              slot={cfg.page26ChatsPasswordMid.photos[1]}
                              variant="polaroid-taped"
                              tiltClass="rotate-[1deg]"
                              washiPosition="top-right-corner"
                              washiVariant="striped"
                              compactCaption
                              imgMaxHeightClass="max-h-[min(445px,51dvh)] lg:max-h-[min(500px,55dvh)]"
                              imgError={Boolean(
                                imgErrors[
                                  cfg.page26ChatsPasswordMid.photos[1].id
                                ]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page26ChatsPasswordMid.photos[1].id
                                )
                              }
                              onZoom={() =>
                                setZoomedGallery({
                                  items: cfg.page26ChatsPasswordMid.photos,
                                  index: 1,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 27: Password Clues Screenshots 1 & 2 */}
                    {activePage === 27 && (
                      <div className="my-auto flex flex-col gap-3">
                        <p className="font-handwritten pl-1 text-[1.12rem] text-[#7A624E]">
                          {cfg.page27ChatsPasswordClues.marginLabel}
                        </p>
                        <div className="grid grid-cols-2 items-center gap-3.5">
                          <ScrapbookPhotoFrame
                            slot={cfg.page27ChatsPasswordClues.photos[0]}
                            variant="polaroid-taped"
                            tiltClass="-rotate-[1deg]"
                            washiPosition="top-left-corner"
                            washiVariant="sage"
                            compactCaption
                            imgMaxHeightClass="max-h-[min(445px,51dvh)] lg:max-h-[min(500px,55dvh)]"
                            imgError={Boolean(
                              imgErrors[
                                cfg.page27ChatsPasswordClues.photos[0].id
                              ]
                            )}
                            onImageError={() =>
                              markImageError(
                                cfg.page27ChatsPasswordClues.photos[0].id
                              )
                            }
                            onZoom={() =>
                              setZoomedGallery({
                                items: cfg.page27ChatsPasswordClues.photos,
                                index: 0,
                              })
                            }
                          />
                          <div className="mt-3">
                            <ScrapbookPhotoFrame
                              slot={cfg.page27ChatsPasswordClues.photos[1]}
                              variant="museum-mat"
                              tiltClass="rotate-[1deg]"
                              washiPosition="top-right-corner"
                              washiVariant="champagne"
                              compactCaption
                              imgMaxHeightClass="max-h-[min(445px,51dvh)] lg:max-h-[min(500px,55dvh)]"
                              imgError={Boolean(
                                imgErrors[
                                  cfg.page27ChatsPasswordClues.photos[1].id
                                ]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page27ChatsPasswordClues.photos[1].id
                                )
                              }
                              onZoom={() =>
                                setZoomedGallery({
                                  items: cfg.page27ChatsPasswordClues.photos,
                                  index: 1,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 28: Password Solved Part I */}
                    {activePage === 28 && (
                      <div className="my-auto flex flex-col items-center gap-3.5">
                        <ScrapbookPhotoFrame
                          slot={cfg.page28ChatsPasswordSolved.photos[0]}
                          variant="gold-folio"
                          tiltClass="-rotate-[1deg]"
                          washiPosition="top-left-corner"
                          washiVariant="champagne"
                          imgMaxHeightClass="max-h-[min(480px,54dvh)] lg:max-h-[min(535px,58dvh)]"
                          imgError={Boolean(
                            imgErrors[
                              cfg.page28ChatsPasswordSolved.photos[0].id
                            ]
                          )}
                          onImageError={() =>
                            markImageError(
                              cfg.page28ChatsPasswordSolved.photos[0].id
                            )
                          }
                          onZoom={() =>
                            setZoomedGallery({
                              items: cfg.page28ChatsPasswordSolved.photos,
                              index: 0,
                            })
                          }
                        />
                        <p className="font-handwritten text-[1.14rem] text-[#7A624E]">
                          {cfg.page28ChatsPasswordSolved.marginLabel}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 29: WhatsApp Call Info Early Pair (21 Aug + 9 Sep large stacked) */}
                    {activePage === 29 && (
                      <div className="my-auto flex flex-col gap-3.5">
                        <p className="font-handwritten pl-1 text-[1.12rem] text-[#7A624E]">
                          {cfg.page29CallMemoriesWhatsAppEarly.marginLabel}
                        </p>
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-[90%] self-start">
                            <ScrapbookPhotoFrame
                              slot={
                                cfg.page29CallMemoriesWhatsAppEarly.photos[0]
                              }
                              variant="ticket-cinema"
                              tiltClass="-rotate-[0.7deg]"
                              washiPosition="top-center"
                              washiVariant="champagne"
                              compactCaption
                              imgMaxHeightClass="max-h-[min(145px,17.5dvh)] lg:max-h-[min(165px,19dvh)]"
                              imgError={Boolean(
                                imgErrors[
                                  cfg.page29CallMemoriesWhatsAppEarly.photos[0]
                                    .id
                                ]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page29CallMemoriesWhatsAppEarly.photos[0]
                                    .id
                                )
                              }
                              onZoom={() =>
                                setZoomedGallery({
                                  items:
                                    cfg.page29CallMemoriesWhatsAppEarly.photos,
                                  index: 0,
                                })
                              }
                            />
                          </div>
                          <div className="w-[86%] self-end">
                            <ScrapbookPhotoFrame
                              slot={
                                cfg.page29CallMemoriesWhatsAppEarly.photos[1]
                              }
                              variant="museum-mat"
                              tiltClass="rotate-[0.8deg]"
                              washiPosition="top-right-corner"
                              washiVariant="striped"
                              compactCaption
                              imgMaxHeightClass="max-h-[min(220px,26dvh)] lg:max-h-[min(255px,28dvh)]"
                              imgError={Boolean(
                                imgErrors[
                                  cfg.page29CallMemoriesWhatsAppEarly.photos[1]
                                    .id
                                ]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page29CallMemoriesWhatsAppEarly.photos[1]
                                    .id
                                )
                              }
                              onZoom={() =>
                                setZoomedGallery({
                                  items:
                                    cfg.page29CallMemoriesWhatsAppEarly.photos,
                                  index: 1,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 30: WhatsApp Call Info November (2 Nov Large Centerpiece) */}
                    {activePage === 30 && (
                      <div className="my-auto flex flex-col items-center gap-3.5">
                        <p className="font-handwritten self-start pl-1 text-[1.12rem] text-[#7A624E]">
                          {cfg.page30CallMemoriesWhatsAppNov.marginLabel}
                        </p>
                        <div className="w-[84%]">
                          <ScrapbookPhotoFrame
                            slot={cfg.page30CallMemoriesWhatsAppNov.photos[0]}
                            variant="polaroid-taped"
                            tiltClass="-rotate-[0.9deg]"
                            washiPosition="top-center"
                            washiVariant="sage"
                            imgMaxHeightClass="max-h-[min(390px,45dvh)] lg:max-h-[min(440px,49dvh)]"
                            imgError={Boolean(
                              imgErrors[
                                cfg.page30CallMemoriesWhatsAppNov.photos[0].id
                              ]
                            )}
                            onImageError={() =>
                              markImageError(
                                cfg.page30CallMemoriesWhatsAppNov.photos[0].id
                              )
                            }
                            onZoom={() =>
                              setZoomedGallery({
                                items: cfg.page30CallMemoriesWhatsAppNov.photos,
                                index: 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 31: October Call Logs (Oct 24 + Oct 24–25) */}
                    {activePage === 31 && (
                      <div className="my-auto flex flex-col gap-3">
                        <p className="font-handwritten pl-1 text-[1.12rem] text-[#7A624E]">
                          {cfg.page31CallLogsOctober.marginLabel}
                        </p>
                        <div className="flex flex-col gap-3.5">
                          <div className="w-[86%] self-start">
                            <ScrapbookPhotoFrame
                              slot={cfg.page31CallLogsOctober.photos[0]}
                              variant="midnight-frame"
                              tiltClass="-rotate-[0.8deg]"
                              washiPosition="top-left-corner"
                              washiVariant="champagne"
                              compactCaption
                              imgMaxHeightClass="max-h-[min(175px,21dvh)] lg:max-h-[min(205px,23dvh)]"
                              imgError={Boolean(
                                imgErrors[
                                  cfg.page31CallLogsOctober.photos[0].id
                                ]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page31CallLogsOctober.photos[0].id
                                )
                              }
                              onZoom={() =>
                                setZoomedGallery({
                                  items: cfg.page31CallLogsOctober.photos,
                                  index: 0,
                                })
                              }
                            />
                          </div>
                          <div className="w-[86%] self-end">
                            <ScrapbookPhotoFrame
                              slot={cfg.page31CallLogsOctober.photos[1]}
                              variant="midnight-frame"
                              tiltClass="rotate-[0.9deg]"
                              washiPosition="top-right-corner"
                              washiVariant="sage"
                              compactCaption
                              imgMaxHeightClass="max-h-[min(175px,21dvh)] lg:max-h-[min(205px,23dvh)]"
                              imgError={Boolean(
                                imgErrors[
                                  cfg.page31CallLogsOctober.photos[1].id
                                ]
                              )}
                              onImageError={() =>
                                markImageError(
                                  cfg.page31CallLogsOctober.photos[1].id
                                )
                              }
                              onZoom={() =>
                                setZoomedGallery({
                                  items: cfg.page31CallLogsOctober.photos,
                                  index: 1,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 32: Until Morning Editorial Call Plate */}
                    {activePage === 32 && (
                      <div className="my-auto flex flex-col items-center text-center">
                        <div className="relative mx-auto w-full max-w-[320px] rounded-[6px] border border-[#CBB38D] bg-[#FAF2E1]/85 px-6 py-8 shadow-[0_14px_26px_-18px_rgba(44,26,12,0.32)] lg:max-w-[350px] lg:px-8 lg:py-10">
                          <p className="font-editorial text-[10.5px] tracking-[0.16em] uppercase text-[#8A6D53]">
                            {cfg.page32CallLogsWeekend.editionLabel}
                          </p>
                          <div className="mx-auto my-3.5 h-[1px] w-14 bg-[#C49E5B]/60" />
                          <p className="font-editorial text-[1.45rem] italic leading-snug text-[#3D2B20] lg:text-[1.65rem]">
                            {cfg.page32CallLogsWeekend.sectionTitle}
                          </p>
                          <p className="font-editorial mt-3 text-[1.02rem] italic leading-relaxed text-[#6E5643] lg:text-[1.08rem]">
                            “{cfg.page32CallLogsWeekend.quote}”
                          </p>
                          <div className="mx-auto mt-5 h-[1px] w-10 bg-[#C49E5B]/35" />
                          <p className="font-handwritten mt-3 text-[1.12rem] text-[#846850]">
                            {cfg.page32CallLogsWeekend.marginLabel}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 33: Botanical Folio Reflection Illustration */}
                    {activePage === 33 && (
                      <div className="my-auto flex flex-col items-center justify-center text-center">
                        <MinimalBotanicalFolioIllustration />
                        <p className="font-handwritten mt-2 text-[1.15rem] text-[#7C634E]">
                          {cfg.pageReflection.marginAnnotation}
                        </p>
                      </div>
                    )}

                    {/* LEFT LEAF — PAGE 34: Final Botanical Folio Illustration */}
                    {activePage === 34 && (
                      <div className="my-auto flex flex-col items-center justify-center px-4 text-center">
                        <MinimalBotanicalFolioIllustration />
                        <div className="mx-auto my-3 h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C49E5B]/75 to-transparent" />
                        <p className="font-editorial max-w-[28ch] text-[1.08rem] italic leading-relaxed text-[#6B5441]">
                          {cfg.pageFinal.bodyLines[0]}
                        </p>
                      </div>
                    )}
                      </>
                    )}

                    <div className="flex items-center justify-between text-[11.5px] tracking-[0.06em] text-[#8E745B] tabular-nums">
                      <span>{cfg.cover.title}</span>
                      <span>
                        {activeLockConfig
                          ? 'Protected'
                          : String(activePage * 2 - 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* ==================== RIGHT PAGE LEAF (Primary Pages 1–33) ==================== */}
                  <div
                    className="relative z-10 flex h-full min-h-0 flex-col justify-between overflow-hidden px-4 py-4 sm:px-7 sm:py-6 lg:px-11 lg:py-7"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 44%, #FBF6EC 0%, #F7F0E4 56%, #E9DCC8 92%, rgba(220, 201, 173, 0.72) 100%)',
                      boxShadow: 'inset 0 0 34px rgba(220, 201, 173, 0.3)',
                    }}
                  >
                    <BotanicalSprigCorner
                      flip
                      className="absolute right-2.5 bottom-2.5 h-16 w-16 sm:h-22 sm:w-22 lg:h-24 lg:w-24"
                    />

                    {/* Subtle gold inner border detail on Page 33 (The Last Page) */}
                    {!activeLockConfig && activePage === TOTAL_PAGES && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-4 rounded-[3px] border border-[#C9A35B]/35 sm:inset-5"
                      />
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={
                          activeLockConfig
                            ? `book-lock-${activeLockConfig.targetPage}`
                            : `book-page-${activePage}`
                        }
                        initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.16 } }}
                        transition={{
                          duration: reduced ? 0.18 : 0.42,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative z-10 flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-1 pl-2 md:px-1.5"
                      >
                        {activeLockConfig ? (
                          <div
                            data-no-page-turn="true"
                            className="my-auto flex flex-col items-center justify-center px-2 py-2 text-center sm:px-4"
                          >
                            <VintageBookLockIllustration
                              isUnlocking={isUnlockingLock}
                              reduced={reduced}
                            />

                            <p className="font-editorial mt-3 text-[11px] tracking-[0.18em] uppercase text-[#8B7159]">
                              Locked Section · {activeLockConfig.sectionLabel}
                            </p>

                            <div className="mx-auto my-2.5 h-[1px] w-14 bg-gradient-to-r from-transparent via-[#C49E5B]/75 to-transparent" />

                            <form
                              onSubmit={handleUnlockSectionSubmit}
                              noValidate
                              className="w-full max-w-[360px]"
                            >
                              <label
                                htmlFor={lockInputId}
                                className="font-editorial block text-[clamp(1.22rem,2.45vw,1.62rem)] leading-[1.3] font-medium text-[#3A291F]"
                                style={{ textWrap: 'balance' }}
                              >
                                {activeLockConfig.question}
                              </label>

                              <motion.div
                                animate={
                                  lockShakeTick > 0 && !reduced
                                    ? { x: [0, -7, 7, -5, 5, -2, 2, 0] }
                                    : { x: 0 }
                                }
                                transition={{ duration: 0.32, ease: 'easeOut' }}
                                className="mt-5"
                              >
                                <input
                                  ref={lockInputRef}
                                  id={lockInputId}
                                  type="text"
                                  value={lockInput}
                                  onChange={(e) => {
                                    setLockInput(e.target.value);
                                    if (lockError) setLockError(false);
                                  }}
                                  disabled={isUnlockingLock}
                                  autoComplete="off"
                                  autoCorrect="off"
                                  spellCheck={false}
                                  placeholder={activeLockConfig.placeholder}
                                  aria-invalid={lockError}
                                  className={`font-editorial w-full rounded-[6px] border bg-[#FFFDF8] px-4 py-2.5 text-center text-[1.15rem] text-[#3A291F] placeholder:italic placeholder:text-[#A99278] shadow-[inset_0_1px_4px_rgba(88,63,38,0.06)] transition-all duration-200 focus:outline-none sm:py-3 sm:text-[1.24rem] ${
                                    isUnlockingLock
                                      ? 'border-[#B88946] bg-[#FAF2DF] text-[#4E3824]'
                                      : lockError
                                        ? 'border-[#C18976] focus:border-[#A86D59] focus:ring-2 focus:ring-[#C18976]/25'
                                        : 'border-[#D5C09F] focus:border-[#B88946] focus:ring-2 focus:ring-[#C8A464]/25'
                                  }`}
                                />
                              </motion.div>

                              <div
                                className="mt-2.5 flex min-h-[26px] items-center justify-center"
                                aria-live="polite"
                              >
                                <AnimatePresence mode="wait">
                                  {isUnlockingLock ? (
                                    <motion.p
                                      key="lock-unlocked-msg"
                                      initial={{ opacity: 0, y: 4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.28 }}
                                      className="inline-flex items-center gap-1.5 font-editorial text-[0.98rem] italic text-[#7B5A2C]"
                                    >
                                      <Check
                                        className="h-3.5 w-3.5 stroke-[2.2]"
                                        aria-hidden="true"
                                      />
                                      <span>Unlocked</span>
                                    </motion.p>
                                  ) : lockError ? (
                                    <motion.p
                                      key={`lock-error-${lockShakeTick}`}
                                      role="alert"
                                      initial={{ opacity: 0, y: -3 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="font-editorial text-[0.98rem] italic text-[#8F4E3D]"
                                    >
                                      Try again
                                    </motion.p>
                                  ) : null}
                                </AnimatePresence>
                              </div>

                              <div className="mt-3 flex flex-col items-center gap-2.5">
                                <button
                                  type="submit"
                                  disabled={isUnlockingLock}
                                  className="inline-flex min-h-[42px] min-w-[168px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#E7D8C0]/45 bg-[#3E2B1E] px-6 py-2 text-[13px] font-medium tracking-[0.03em] text-[#FAF3EA] shadow-[0_10px_22px_-12px_rgba(88,63,38,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2F2016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF3E5] disabled:cursor-default disabled:opacity-65 disabled:hover:translate-y-0"
                                >
                                  <span>
                                    {isUnlockingLock
                                      ? 'Opening…'
                                      : 'Unlock Page'}
                                  </span>
                                  {!isUnlockingLock && (
                                    <ArrowRight
                                      className="h-3.5 w-3.5 stroke-[1.9]"
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={handlePrevPage}
                                  disabled={isUnlockingLock}
                                  className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 text-[12px] font-medium text-[#7A624B] transition-colors hover:text-[#3A291F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60 md:hidden"
                                >
                                  <ArrowLeft
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                  />
                                  <span>Previous page</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <>
                            {/* PAGE 1: Coffee + Cold Coffee */}
                            {activePage === 1 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 1
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.65rem,3.3vw,2.35rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page1Coffee.heading}
                                </h2>
                                <p className="font-editorial mt-1 text-[0.98rem] italic text-[#735B47] sm:text-[1.08rem]">
                                  {cfg.page1Coffee.leadNote}
                                </p>
                              </div>

                              <div className="mt-4 grid grid-cols-2 items-center gap-3 sm:mt-6 sm:gap-5">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page1Coffee.photos[0]}
                                  variant="polaroid-taped"
                                  tiltClass="-rotate-[2deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  imgMaxHeightClass="max-h-[215px] sm:max-h-[255px] lg:max-h-[285px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page1Coffee.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page1Coffee.photos[0].id)
                                  }
                                />
                                <div className="mt-4">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page1Coffee.photos[1]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[1.9deg]"
                                    washiPosition="top-center"
                                    washiVariant="sage"
                                    imgMaxHeightClass="max-h-[215px] sm:max-h-[255px] lg:max-h-[285px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page1Coffee.photos[1].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page1Coffee.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 border-t border-dashed border-[#D6C2A3] pt-3">
                              {cfg.page1Coffee.annotations.map((note, idx) => (
                                <p
                                  key={idx}
                                  className={`font-handwritten text-[1.12rem] leading-snug sm:text-[1.22rem] ${
                                    idx === 0
                                      ? 'text-[#5A4434]'
                                      : 'text-[#785F4B]'
                                  }`}
                                >
                                  {note}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* PAGE 2: Watermelon + Mango Juice (4 photos together) */}
                        {activePage === 2 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 2
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page2Summer.heading}
                                </h2>
                              </div>

                              {/* Mobile: all 4 photos cleanly arranged in a staggered 2x2 collage */}
                              <div className="mt-2.5 grid grid-cols-2 items-center gap-2 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page2Summer.photos[0]}
                                  variant="museum-mat"
                                  tiltClass="-rotate-[1.2deg]"
                                  washiPosition="top-left-corner"
                                  washiVariant="sage"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page2Summer.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page2Summer.photos[0].id)
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page2Summer.photos[1]}
                                  variant="museum-mat"
                                  tiltClass="rotate-[1.2deg]"
                                  washiPosition="top-right-corner"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page2Summer.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page2Summer.photos[1].id)
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page2Summer.photos[2]}
                                  variant="kraft-pinned"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page2Summer.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page2Summer.photos[2].id)
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page2Summer.photos[3]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page2Summer.photos[3].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page2Summer.photos[3].id)
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Mango Juice Duo */}
                              <div className="mt-4 hidden grid-cols-2 items-center gap-4 md:grid">
                                <div className="mt-4">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page2Summer.photos[2]}
                                    variant="kraft-pinned"
                                    tiltClass="-rotate-[1.8deg]"
                                    washiPosition="none"
                                    imgMaxHeightClass="max-h-[min(235px,29dvh)] lg:max-h-[min(270px,31dvh)]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page2Summer.photos[2].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page2Summer.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="-mt-3">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page2Summer.photos[3]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[2deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    imgMaxHeightClass="max-h-[min(230px,28dvh)] lg:max-h-[min(265px,30dvh)]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page2Summer.photos[3].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page2Summer.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-handwritten mt-3 border-t border-[#D8C5A7]/60 pt-2.5 text-center text-[1.12rem] text-[#5B4535] md:text-left md:text-[1.22rem]">
                              {cfg.page2Summer.notes[1]}
                            </p>
                          </div>
                        )}

                        {/* PAGE 3: Corn 1 + Corn */}
                        {activePage === 3 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 3
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.65rem,3.3vw,2.35rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page3Corn.heading}
                                </h2>
                              </div>

                              {/* Mobile: both Corn frames side by side */}
                              <div className="mt-4 grid grid-cols-2 items-center gap-3 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page3Corn.photos[0]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[1.6deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[210px] sm:max-h-[240px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page3Corn.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page3Corn.photos[0].id)
                                  }
                                />
                                <div className="mt-4">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page3Corn.photos[1]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[1.8deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[225px] sm:max-h-[255px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page3Corn.photos[1].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(cfg.page3Corn.photos[1].id)
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop: single offset tall frame + ruled note block */}
                              <div className="mt-5 hidden flex-col items-center gap-4 md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page3Corn.photos[1]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1.6deg]"
                                  washiPosition="top-right-corner"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(285px,33dvh)] lg:max-h-[min(325px,35dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page3Corn.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page3Corn.photos[1].id)
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-3 rounded-[4px] border border-[#D9C7A7]/70 bg-[#FAF4E5]/75 px-4 py-2.5 text-center md:text-left">
                              <p className="font-handwritten text-[1.15rem] text-[#5B4535] sm:text-[1.22rem]">
                                {cfg.page3Corn.candidNote}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 4: Jamun 1 + Jamun */}
                        {activePage === 4 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 4
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.65rem,3.3vw,2.35rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page4Jamun.heading}
                                </h2>
                              </div>

                              {/* Mobile: arched + pinned side-by-side */}
                              <div className="mt-4 grid grid-cols-2 items-center gap-3 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page4Jamun.photos[0]}
                                  variant="arched-cameo"
                                  tiltClass="-rotate-[1.2deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[210px] sm:max-h-[245px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page4Jamun.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page4Jamun.photos[0].id)
                                  }
                                />
                                <div className="mt-5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page4Jamun.photos[1]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[200px] sm:max-h-[235px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page4Jamun.photos[1].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page4Jamun.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop: Second Jamun photo offset gracefully */}
                              <div className="mt-6 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page4Jamun.photos[1]}
                                  variant="museum-mat"
                                  tiltClass="rotate-[1.8deg]"
                                  washiPosition="top-center"
                                  washiVariant="sage"
                                  imgMaxHeightClass="max-h-[min(285px,33dvh)] lg:max-h-[min(325px,35dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page4Jamun.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page4Jamun.photos[1].id)
                                  }
                                />
                              </div>
                            </div>

                            <p className="font-handwritten mt-3 border-t border-dashed border-[#D6C2A3] pt-2.5 text-center text-[1.15rem] text-[#5B4535] md:text-left sm:text-[1.22rem]">
                              {cfg.page4Jamun.candidNote}
                            </p>
                          </div>
                        )}

                        {/* PAGE 5: Dahi + Frothy Glass Together */}
                        {activePage === 5 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 5
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.65rem,3.3vw,2.35rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page5Dahi.heading}
                                </h2>
                                <p className="font-editorial mt-1 text-[0.95rem] italic text-[#735B47]">
                                  {cfg.page5Dahi.subNote}
                                </p>
                              </div>

                              {/* Mobile: Dahi + Frothy Glass side by side */}
                              <div className="mt-4 grid grid-cols-2 items-center gap-3 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page5Dahi.photos[0]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[1.4deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[215px] sm:max-h-[250px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page5Dahi.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page5Dahi.photos[0].id)
                                  }
                                />
                                <div className="mt-4">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page5Dahi.photos[1]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[215px] sm:max-h-[250px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page5Dahi.photos[1].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page5Dahi.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Dahi Bowl */}
                              <div className="mt-6 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page5Dahi.photos[0]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[1.4deg]"
                                  washiPosition="none"
                                  imgMaxHeightClass="max-h-[min(280px,32dvh)] lg:max-h-[min(320px,34dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page5Dahi.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page5Dahi.photos[0].id)
                                  }
                                />
                              </div>
                            </div>

                            <p className="font-handwritten mt-3 border-t border-dashed border-[#D6C2A3] pt-2.5 text-center text-[1.15rem] text-[#5B4535] md:text-left sm:text-[1.22rem]">
                              {cfg.page5Dahi.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 6: Morning Breakfasts (4 photos together) */}
                        {activePage === 6 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 6
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page6Breakfast.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 morning plates collage */}
                              <div className="mt-3 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page6Breakfast.photos[0]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[1.2deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page6Breakfast.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page6Breakfast.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page6Breakfast.photos[1]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1.2deg]"
                                  washiPosition="top-right-corner"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page6Breakfast.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page6Breakfast.photos[1].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page6Breakfast.photos[2]}
                                  variant="museum-mat"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-left-corner"
                                  washiVariant="sage"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page6Breakfast.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page6Breakfast.photos[2].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page6Breakfast.photos[3]}
                                  variant="museum-mat"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page6Breakfast.photos[3].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page6Breakfast.photos[3].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Dhokla & Chilla Duo */}
                              <div className="mt-5 hidden grid-cols-2 items-center gap-4 md:grid">
                                <div className="-mt-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page6Breakfast.photos[2]}
                                    variant="museum-mat"
                                    tiltClass="-rotate-[1.6deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="sage"
                                    imgMaxHeightClass="max-h-[235px] lg:max-h-[270px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page6Breakfast.photos[2].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page6Breakfast.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="mt-5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page6Breakfast.photos[3]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1.8deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    imgMaxHeightClass="max-h-[235px] lg:max-h-[270px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page6Breakfast.photos[3].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page6Breakfast.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-handwritten mt-3 border-t border-dashed border-[#D6C2A3] pt-2.5 text-center text-[1.12rem] text-[#5B4535] md:text-left sm:text-[1.2rem]">
                              {cfg.page6Breakfast.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 7: MILK — Solo Centerpiece Page */}
                        {activePage === 7 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="text-center">
                              <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                Page 7 · Special Feature
                              </p>
                              <h2
                                className="font-editorial mt-1 text-[clamp(1.7rem,3.3vw,2.4rem)] font-medium leading-[1.12] text-[#3A291F]"
                                style={{ textWrap: 'balance' }}
                              >
                                {cfg.page7Milk.heading}
                              </h2>
                              <p className="font-editorial mt-1 text-[0.95rem] italic text-[#735B47]">
                                {cfg.page7Milk.subNote}
                              </p>
                            </div>

                            {/* Solo Hero Centerpiece Milk Layout (Desktop & Mobile) */}
                            <div className="my-auto flex flex-col items-center">
                              <svg
                                aria-hidden="true"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="mb-1.5 opacity-80"
                              >
                                <path
                                  d="M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z"
                                  fill="#D7B26B"
                                />
                              </svg>
                              <ScrapbookPhotoFrame
                                slot={cfg.page7Milk.photo}
                                variant="gold-folio"
                                tiltClass=""
                                washiPosition="none"
                                imgMaxHeightClass="max-h-[min(255px,31dvh)] sm:max-h-[min(285px,32dvh)] lg:max-h-[min(325px,34dvh)]"
                                imgError={Boolean(
                                  imgErrors[cfg.page7Milk.photo.id]
                                )}
                                onImageError={() =>
                                  markImageError(cfg.page7Milk.photo.id)
                                }
                              />
                            </div>

                            <div className="mx-auto max-w-[36ch] border-t border-[#D6B882]/60 pt-2.5 text-center">
                              <p className="font-editorial text-[0.98rem] italic leading-relaxed text-[#554132] sm:text-[1.06rem]">
                                {cfg.page7Milk.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 8: Kulfi & Sweet Scoops */}
                        {activePage === 8 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 8
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.65rem,3.3vw,2.35rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page8IceCream.heading}
                                </h2>
                              </div>

                              {/* Mobile: both Kulfi & Choco Ice Cream side by side */}
                              <div className="mt-4 grid grid-cols-2 items-center gap-3 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page8IceCream.photos[0]}
                                  variant="polaroid-taped"
                                  tiltClass="-rotate-[1.6deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[220px] sm:max-h-[255px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page8IceCream.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page8IceCream.photos[0].id
                                    )
                                  }
                                />
                                <div className="mt-4">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page8IceCream.photos[1]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[1.8deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[220px] sm:max-h-[255px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page8IceCream.photos[1].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page8IceCream.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Choco Almond Ice Cream */}
                              <div className="mt-5 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page8IceCream.photos[1]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1.8deg]"
                                  washiPosition="top-right-corner"
                                  washiVariant="sage"
                                  imgMaxHeightClass="max-h-[min(290px,33dvh)] lg:max-h-[min(330px,35dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page8IceCream.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page8IceCream.photos[1].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <p className="font-handwritten mt-3 border-t border-dashed border-[#D6C2A3] pt-2.5 text-center text-[1.15rem] text-[#5B4535] md:text-left sm:text-[1.22rem]">
                              {cfg.page8IceCream.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 9: Almonds & Ruby Plums (4 photos) */}
                        {activePage === 9 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 9
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page9NutsPlums.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 collage */}
                              <div className="mt-3 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page9NutsPlums.photos[0]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page9NutsPlums.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page9NutsPlums.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page9NutsPlums.photos[1]}
                                  variant="arched-cameo"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page9NutsPlums.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page9NutsPlums.photos[1].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page9NutsPlums.photos[2]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page9NutsPlums.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page9NutsPlums.photos[2].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page9NutsPlums.photos[3]}
                                  variant="museum-mat"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="top-right-corner"
                                  washiVariant="sage"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page9NutsPlums.photos[3].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page9NutsPlums.photos[3].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Ruby Plums Pair */}
                              <div className="mt-5 hidden grid-cols-2 items-center gap-4 md:grid">
                                <div className="-mt-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page9NutsPlums.photos[2]}
                                    variant="polaroid-taped"
                                    tiltClass="-rotate-[1.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="champagne"
                                    imgMaxHeightClass="max-h-[240px] lg:max-h-[275px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page9NutsPlums.photos[2].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page9NutsPlums.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="mt-5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page9NutsPlums.photos[3]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1.8deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="sage"
                                    imgMaxHeightClass="max-h-[235px] lg:max-h-[270px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page9NutsPlums.photos[3].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page9NutsPlums.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D8C5A7]/60 pt-2.5 text-center text-[0.95rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.04rem]">
                              {cfg.page9NutsPlums.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 10: In The Kitchen Part I (Steps 1–4) */}
                        {activePage === 10 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 10
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page10RecipeOne.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 recipe steps 1–4 */}
                              <div className="mt-3 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page10RecipeOne.photos[0]}
                                  variant="polaroid-taped"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page10RecipeOne.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page10RecipeOne.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page10RecipeOne.photos[1]}
                                  variant="kraft-pinned"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page10RecipeOne.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page10RecipeOne.photos[1].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page10RecipeOne.photos[2]}
                                  variant="museum-mat"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-left-corner"
                                  washiVariant="sage"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page10RecipeOne.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page10RecipeOne.photos[2].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page10RecipeOne.photos[3]}
                                  variant="polaroid-taped"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="top-right-corner"
                                  washiVariant="striped"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page10RecipeOne.photos[3].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page10RecipeOne.photos[3].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Steps 3 & 4 */}
                              <div className="mt-5 hidden grid-cols-2 items-center gap-4 md:grid">
                                <div className="-mt-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page10RecipeOne.photos[2]}
                                    variant="museum-mat"
                                    tiltClass="-rotate-[1.5deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="sage"
                                    imgMaxHeightClass="max-h-[235px] lg:max-h-[270px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page10RecipeOne.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page10RecipeOne.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="mt-5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page10RecipeOne.photos[3]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[1.6deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="striped"
                                    imgMaxHeightClass="max-h-[235px] lg:max-h-[270px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page10RecipeOne.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page10RecipeOne.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D8C5A7]/60 pt-2.5 text-center text-[0.94rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.02rem]">
                              {cfg.page10RecipeOne.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 11: Simmer & Serve Part II (Steps 5–7) */}
                        {activePage === 11 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 11
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page11RecipeTwo.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2 cooking steps + 1 finished plate */}
                              <div className="mt-3 space-y-2.5 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2.5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page11RecipeTwo.photos[0]}
                                    variant="museum-mat"
                                    tiltClass="-rotate-[1deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[130px] sm:max-h-[155px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page11RecipeTwo.photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page11RecipeTwo.photos[0].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page11RecipeTwo.photos[1]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[1deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[130px] sm:max-h-[155px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page11RecipeTwo.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page11RecipeTwo.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page11RecipeTwo.photos[2]}
                                    variant="gold-folio"
                                    tiltClass=""
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[165px] sm:max-h-[195px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page11RecipeTwo.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page11RecipeTwo.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Hero Plated Dish */}
                              <div className="mt-5 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page11RecipeTwo.photos[2]}
                                  variant="gold-folio"
                                  tiltClass="rotate-[0.8deg]"
                                  washiPosition="none"
                                  imgMaxHeightClass="max-h-[min(285px,33dvh)] lg:max-h-[min(325px,35dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page11RecipeTwo.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page11RecipeTwo.photos[2].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D8C5A7]/60 pt-2.5 text-center text-[0.94rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.02rem]">
                              {cfg.page11RecipeTwo.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 12: Ganesh Ji + Ganesh Ji 2 */}
                        {activePage === 12 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 12
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.65rem,3.3vw,2.35rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page12Ganesh.heading}
                                </h2>
                              </div>

                              {/* Mobile: Festive twin diptych */}
                              <div className="mt-4 grid grid-cols-2 items-center gap-3 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page12Ganesh.photos[0]}
                                  variant="gold-folio"
                                  tiltClass=""
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[225px] sm:max-h-[260px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page12Ganesh.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page12Ganesh.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page12Ganesh.photos[1]}
                                  variant="gold-folio"
                                  tiltClass=""
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[225px] sm:max-h-[260px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page12Ganesh.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page12Ganesh.photos[1].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Second Ganesh Ji shrine */}
                              <div className="mt-5 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page12Ganesh.photos[1]}
                                  variant="gold-folio"
                                  tiltClass=""
                                  washiPosition="none"
                                  imgMaxHeightClass="max-h-[min(295px,34dvh)] lg:max-h-[min(335px,36dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page12Ganesh.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page12Ganesh.photos[1].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D6B882]/60 pt-2.5 text-center text-[1rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.08rem]">
                              {cfg.page12Ganesh.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 13: Janmashtami Darshan (3 photos) */}
                        {activePage === 13 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 13
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page13Janmashtami.heading}
                                </h2>
                              </div>

                              {/* Mobile: 3-photo shrine triptych */}
                              <div className="mt-3 grid grid-cols-3 items-center gap-2 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page13Janmashtami.photos[0]}
                                  variant="arched-cameo"
                                  tiltClass=""
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[185px] sm:max-h-[215px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page13Janmashtami.photos[0].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page13Janmashtami.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page13Janmashtami.photos[1]}
                                  variant="gold-folio"
                                  tiltClass=""
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[185px] sm:max-h-[215px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page13Janmashtami.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page13Janmashtami.photos[1].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page13Janmashtami.photos[2]}
                                  variant="gold-folio"
                                  tiltClass=""
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[185px] sm:max-h-[215px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page13Janmashtami.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page13Janmashtami.photos[2].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Twin Shrine Diptych */}
                              <div className="mt-5 hidden grid-cols-2 items-center gap-4 md:grid">
                                <div className="-mt-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page13Janmashtami.photos[1]}
                                    variant="gold-folio"
                                    tiltClass="-rotate-[1.2deg]"
                                    washiPosition="none"
                                    imgMaxHeightClass="max-h-[245px] lg:max-h-[285px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page13Janmashtami.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page13Janmashtami.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="mt-5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page13Janmashtami.photos[2]}
                                    variant="gold-folio"
                                    tiltClass="rotate-[1.2deg]"
                                    washiPosition="none"
                                    imgMaxHeightClass="max-h-[245px] lg:max-h-[285px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page13Janmashtami.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page13Janmashtami.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D6B882]/60 pt-2.5 text-center text-[0.98rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.06rem]">
                              {cfg.page13Janmashtami.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 14: Diwali Lamps & Gathering (4 photos) */}
                        {activePage === 14 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 14
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page14DiwaliLamps.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 Diwali diya & family grid */}
                              <div className="mt-3 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page14DiwaliLamps.photos[0]}
                                  variant="gold-folio"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[128px] sm:max-h-[155px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page14DiwaliLamps.photos[0].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page14DiwaliLamps.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page14DiwaliLamps.photos[1]}
                                  variant="gold-folio"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[128px] sm:max-h-[155px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page14DiwaliLamps.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page14DiwaliLamps.photos[1].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page14DiwaliLamps.photos[2]}
                                  variant="gold-folio"
                                  tiltClass="rotate-[0.8deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[128px] sm:max-h-[155px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page14DiwaliLamps.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page14DiwaliLamps.photos[2].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page14DiwaliLamps.photos[3]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[0.8deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[128px] sm:max-h-[155px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page14DiwaliLamps.photos[3].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page14DiwaliLamps.photos[3].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Kurta Diya + Family Gathering Table */}
                              <div className="mt-5 hidden grid-cols-2 items-center gap-4 md:grid">
                                <div className="-mt-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page14DiwaliLamps.photos[2]}
                                    variant="gold-folio"
                                    tiltClass="-rotate-[1.4deg]"
                                    washiPosition="none"
                                    imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page14DiwaliLamps.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page14DiwaliLamps.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="mt-5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page14DiwaliLamps.photos[3]}
                                    variant="kraft-pinned"
                                    tiltClass="rotate-[1.4deg]"
                                    washiPosition="none"
                                    imgMaxHeightClass="max-h-[225px] lg:max-h-[260px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page14DiwaliLamps.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page14DiwaliLamps.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D6B882]/60 pt-2.5 text-center text-[0.98rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.06rem]">
                              {cfg.page14DiwaliLamps.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 15: Festive Family Memories (4 photos) */}
                        {activePage === 15 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 15
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page15FamilySmiles.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 family selfies & sofa memories */}
                              <div className="mt-3 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page15FamilySmiles.photos[0]}
                                  variant="gold-folio"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[128px] sm:max-h-[155px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page15FamilySmiles.photos[0].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page15FamilySmiles.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page15FamilySmiles.photos[1]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[120px] sm:max-h-[145px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page15FamilySmiles.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page15FamilySmiles.photos[1].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page15FamilySmiles.photos[2]}
                                  variant="museum-mat"
                                  tiltClass="rotate-[0.8deg]"
                                  washiPosition="top-left-corner"
                                  washiVariant="sage"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[115px] sm:max-h-[140px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page15FamilySmiles.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page15FamilySmiles.photos[2].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page15FamilySmiles.photos[3]}
                                  variant="polaroid-taped"
                                  tiltClass="-rotate-[0.8deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[128px] sm:max-h-[155px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page15FamilySmiles.photos[3].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page15FamilySmiles.photos[3].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Wide Sofa Trio + Portrait */}
                              <div className="mt-3 hidden flex-col items-center gap-3 md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page15FamilySmiles.photos[2]}
                                  variant="museum-mat"
                                  tiltClass="-rotate-[0.8deg]"
                                  washiPosition="top-left-corner"
                                  washiVariant="sage"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[min(185px,21dvh)] lg:max-h-[min(215px,23.5dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page15FamilySmiles.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page15FamilySmiles.photos[2].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page15FamilySmiles.photos[3]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1.4deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[min(185px,21dvh)] lg:max-h-[min(215px,23.5dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page15FamilySmiles.photos[3].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page15FamilySmiles.photos[3].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <p className="font-handwritten mt-3 border-t border-dashed border-[#D6C2A3] pt-2.5 text-center text-[1.12rem] text-[#5B4535] md:text-left sm:text-[1.2rem]">
                              {cfg.page15FamilySmiles.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 16: Outfit Picks — Shirts & Pairs (5 photos) */}
                        {activePage === 16 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 16
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.55rem,3vw,2.2rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page16OutfitsMens.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2 wide landscape pairs + 3 portrait picks */}
                              <div className="mt-2.5 space-y-2 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[0]}
                                    variant="museum-mat"
                                    tiltClass="-rotate-[0.8deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[82px] sm:max-h-[100px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[0].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[1]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[0.8deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[82px] sm:max-h-[100px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[2]}
                                    variant="kraft-pinned"
                                    tiltClass=""
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[135px] sm:max-h-[160px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[2].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[3]}
                                    variant="polaroid-taped"
                                    tiltClass=""
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[135px] sm:max-h-[160px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[3].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[4]}
                                    variant="museum-mat"
                                    tiltClass=""
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[135px] sm:max-h-[160px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[4].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[4].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Three Shirt & Denim Picks */}
                              <div className="mt-3 hidden space-y-2.5 md:block">
                                <div className="grid grid-cols-2 items-center gap-3.5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[2]}
                                    variant="kraft-pinned"
                                    tiltClass="-rotate-[1.4deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(168px,19dvh)] lg:max-h-[min(192px,21dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[2].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[3]}
                                    variant="polaroid-taped"
                                    tiltClass="rotate-[1.4deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(168px,19dvh)] lg:max-h-[min(192px,21dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page16OutfitsMens.photos[4]}
                                    variant="museum-mat"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(168px,19dvh)] lg:max-h-[min(192px,21dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page16OutfitsMens.photos[4].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page16OutfitsMens.photos[4].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-editorial mt-2.5 border-t border-[#D8C5A7]/60 pt-2 text-center text-[0.92rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1rem]">
                              {cfg.page16OutfitsMens.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 17: Dresses & Festive Choices (5 photos) */}
                        {activePage === 17 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 17
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.55rem,3vw,2.2rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page17OutfitsDresses.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2 dresses top + 3 outfits bottom */}
                              <div className="mt-2.5 space-y-2 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[0]}
                                    variant="arched-cameo"
                                    tiltClass="-rotate-[1deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[135px] sm:max-h-[160px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[0].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[1]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[135px] sm:max-h-[160px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[2]}
                                    variant="polaroid-taped"
                                    tiltClass=""
                                    washiPosition="top-center"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[130px] sm:max-h-[155px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[2].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[3]}
                                    variant="kraft-pinned"
                                    tiltClass=""
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[130px] sm:max-h-[155px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[3].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[4]}
                                    variant="museum-mat"
                                    tiltClass=""
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[130px] sm:max-h-[155px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[4].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[4].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: 3-card Dress & Top Trio */}
                              <div className="mt-3 hidden space-y-2.5 md:block">
                                <div className="grid grid-cols-2 items-center gap-3.5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[2]}
                                    variant="polaroid-taped"
                                    tiltClass="-rotate-[1.4deg]"
                                    washiPosition="top-center"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(168px,19dvh)] lg:max-h-[min(192px,21dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[2].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[3]}
                                    variant="kraft-pinned"
                                    tiltClass="rotate-[1.4deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(168px,19dvh)] lg:max-h-[min(192px,21dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page17OutfitsDresses.photos[4]}
                                    variant="museum-mat"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(168px,19dvh)] lg:max-h-[min(192px,21dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page17OutfitsDresses.photos[4].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page17OutfitsDresses.photos[4].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-editorial mt-2.5 border-t border-[#D8C5A7]/60 pt-2 text-center text-[0.92rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1rem]">
                              {cfg.page17OutfitsDresses.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 18: Urjotsav Nights (2 portraits) */}
                        {activePage === 18 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 18 · Urjotsav
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page18UrjotsavPhotos.heading}
                                </h2>
                                <p className="font-editorial mt-1 text-[0.94rem] italic text-[#735B47] sm:text-[1.02rem]">
                                  {cfg.page18UrjotsavPhotos.subtitle}
                                </p>
                              </div>

                              {/* Mobile: Balanced side-by-side portraits */}
                              <div className="mt-4 grid grid-cols-2 items-center gap-3 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page18UrjotsavPhotos.photos[0]}
                                  variant="gold-folio"
                                  tiltClass="-rotate-[1.2deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[210px] sm:max-h-[245px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page18UrjotsavPhotos.photos[0].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page18UrjotsavPhotos.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page18UrjotsavPhotos.photos[1]}
                                  variant="gold-folio"
                                  tiltClass="rotate-[1.2deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[210px] sm:max-h-[245px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page18UrjotsavPhotos.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page18UrjotsavPhotos.photos[1].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Urjotsav Portrait II */}
                              <div className="mt-4 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page18UrjotsavPhotos.photos[1]}
                                  variant="gold-folio"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(280px,32dvh)] lg:max-h-[min(320px,34dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page18UrjotsavPhotos.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page18UrjotsavPhotos.photos[1].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-3 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-4 py-2.5 text-center md:text-left">
                              <p className="font-editorial text-[0.94rem] italic leading-relaxed text-[#554132] sm:text-[1.02rem]">
                                {cfg.page18UrjotsavPhotos.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 19: Urjotsav Stage & Lights (2 playable videos) */}
                        {activePage === 19 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 19 · Urjotsav Reels
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.55rem,3.1vw,2.25rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page19UrjotsavVideos.heading}
                                </h2>
                                <p className="font-editorial mt-0.5 text-[0.92rem] italic text-[#735B47] sm:text-[1rem]">
                                  {cfg.page19UrjotsavVideos.subtitle}
                                </p>
                              </div>

                              {/* Mobile: Stacked playable Urjotsav videos within page height */}
                              <div className="mt-2.5 space-y-2.5 md:hidden">
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page19UrjotsavVideos.videos[0]}
                                    variant="ticket-cinema"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[155px] sm:max-h-[175px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page19UrjotsavVideos.videos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page19UrjotsavVideos.videos[0].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page19UrjotsavVideos.videos[1]}
                                    variant="ticket-cinema"
                                    tiltClass="rotate-[0.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[135px] sm:max-h-[155px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page19UrjotsavVideos.videos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page19UrjotsavVideos.videos[1].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Urjotsav Main-Stage Video */}
                              <div className="mt-5 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page19UrjotsavVideos.videos[1]}
                                  variant="ticket-cinema"
                                  tiltClass="rotate-[0.6deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  imgMaxHeightClass="max-h-[min(245px,30dvh)] lg:max-h-[min(285px,33dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page19UrjotsavVideos.videos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page19UrjotsavVideos.videos[1].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.9rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page19UrjotsavVideos.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 20: Monsoon & Rainy Windows (2 photos + 1 video clip) */}
                        {activePage === 20 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 20
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page20Rain.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2 balcony stills side-by-side + video clip below */}
                              <div className="mt-3 space-y-2.5 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2.5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page20Rain.photos[0]}
                                    variant="museum-mat"
                                    tiltClass="-rotate-[1deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page20Rain.photos[0].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page20Rain.photos[0].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page20Rain.photos[1]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[125px] sm:max-h-[150px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page20Rain.photos[1].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page20Rain.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page20Rain.photos[2]}
                                    variant="ticket-cinema"
                                    tiltClass=""
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[155px] sm:max-h-[180px]"
                                    imgError={Boolean(
                                      imgErrors[cfg.page20Rain.photos[2].id]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page20Rain.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Playable Monsoon Clip */}
                              <div className="mt-4 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page20Rain.photos[2]}
                                  variant="ticket-cinema"
                                  tiltClass="rotate-[0.6deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(280px,32dvh)] lg:max-h-[min(320px,34dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page20Rain.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(cfg.page20Rain.photos[2].id)
                                  }
                                />
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D8C5A7]/60 pt-2.5 text-center text-[0.95rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.04rem]">
                              {cfg.page20Rain.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 21: Little Incidents & Care (4 photos) */}
                        {activePage === 21 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 21
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page21Incidents.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 subtle little incidents + medicine care */}
                              <div className="mt-3 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page21Incidents.photos[0]}
                                  variant="kraft-pinned"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[135px] sm:max-h-[165px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page21Incidents.photos[0].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page21Incidents.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page21Incidents.photos[1]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[135px] sm:max-h-[165px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page21Incidents.photos[1].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page21Incidents.photos[1].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page21Incidents.photos[2]}
                                  variant="arched-cameo"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[135px] sm:max-h-[165px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page21Incidents.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page21Incidents.photos[2].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page21Incidents.photos[3]}
                                  variant="arched-cameo"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="none"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[135px] sm:max-h-[165px]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page21Incidents.photos[3].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page21Incidents.photos[3].id
                                    )
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Medicine & Care Check-ins */}
                              <div className="mt-5 hidden grid-cols-2 items-center gap-4 md:grid">
                                <div className="-mt-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page21Incidents.photos[2]}
                                    variant="arched-cameo"
                                    tiltClass="-rotate-[1.5deg]"
                                    washiPosition="none"
                                    imgMaxHeightClass="max-h-[235px] lg:max-h-[270px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page21Incidents.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page21Incidents.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="mt-5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page21Incidents.photos[3]}
                                    variant="arched-cameo"
                                    tiltClass="rotate-[1.6deg]"
                                    washiPosition="none"
                                    imgMaxHeightClass="max-h-[245px] lg:max-h-[280px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page21Incidents.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page21Incidents.photos[3].id
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="font-editorial mt-3 border-t border-[#D8C5A7]/60 pt-2.5 text-center text-[0.95rem] italic leading-relaxed text-[#554132] md:text-left sm:text-[1.04rem]">
                              {cfg.page21Incidents.note}
                            </p>
                          </div>
                        )}

                        {/* PAGE 22: Moonlight & Starlight (3 night sky photos) */}
                        {activePage === 22 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 22
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page22NightSkies.heading}
                                </h2>
                              </div>

                              {/* Mobile: Moon pair above Lone Star frame */}
                              <div className="mt-3 space-y-2.5 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2.5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page22NightSkies.photos[0]}
                                    variant="midnight-frame"
                                    tiltClass="-rotate-[1deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[140px] sm:max-h-[168px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page22NightSkies.photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page22NightSkies.photos[0].id
                                      )
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page22NightSkies.photos[1]}
                                    variant="midnight-frame"
                                    tiltClass="rotate-[1deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[140px] sm:max-h-[168px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page22NightSkies.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page22NightSkies.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page22NightSkies.photos[2]}
                                    variant="midnight-frame"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[165px] sm:max-h-[190px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page22NightSkies.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page22NightSkies.photos[2].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Hero Starlight Frame */}
                              <div className="mt-5 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page22NightSkies.photos[2]}
                                  variant="midnight-frame"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(285px,33dvh)] lg:max-h-[min(325px,35dvh)]"
                                  imgError={Boolean(
                                    imgErrors[cfg.page22NightSkies.photos[2].id]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page22NightSkies.photos[2].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-3 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-4 py-2.5 text-center md:text-left">
                              <p className="font-editorial text-[0.96rem] italic leading-relaxed text-[#554132] sm:text-[1.04rem]">
                                {cfg.page22NightSkies.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 23: After Hours & Screens (Game + Movie) */}
                        {activePage === 23 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 23
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page23AfterHours.heading}
                                </h2>
                              </div>

                              {/* Mobile: Game screen above Panoramic Movie Ticket */}
                              <div className="mt-3 space-y-3 md:hidden">
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page23AfterHours.photos[0]}
                                    variant="midnight-frame"
                                    tiltClass="-rotate-[1deg]"
                                    washiPosition="top-center"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[168px] sm:max-h-[195px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page23AfterHours.photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page23AfterHours.photos[0].id
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page23AfterHours.photos[1]}
                                    variant="ticket-cinema"
                                    tiltClass="rotate-[0.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[135px] sm:max-h-[160px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page23AfterHours.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page23AfterHours.photos[1].id
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Panoramic Movie Ticket Frame */}
                              <div className="mt-8 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page23AfterHours.photos[1]}
                                  variant="ticket-cinema"
                                  tiltClass="-rotate-[0.6deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(250px,30dvh)] lg:max-h-[min(290px,33dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page23AfterHours.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page23AfterHours.photos[1].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-3 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-4 py-2.5 text-center md:text-left">
                              <p className="font-editorial text-[0.96rem] italic leading-relaxed text-[#554132] sm:text-[1.04rem]">
                                {cfg.page23AfterHours.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 24: A Little 90s Throwback (2 paired portraits side-by-side) */}
                        {activePage === 24 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 24 · 90s Throwback
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page24RetroTrend.heading}
                                </h2>
                                <p className="font-editorial mt-1 text-[0.95rem] italic text-[#735B47] sm:text-[1.04rem]">
                                  {cfg.page24RetroTrend.subtitle}
                                </p>
                              </div>

                              {/* Equal side-by-side vintage Polaroid composition on both desktop & mobile */}
                              <div className="mt-4 grid grid-cols-2 items-center gap-3 sm:mt-6 sm:gap-5">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page24RetroTrend.photos[0]}
                                  variant="polaroid-taped"
                                  tiltClass="-rotate-[1.4deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  imgMaxHeightClass="max-h-[min(265px,31dvh)] sm:max-h-[min(300px,34dvh)] lg:max-h-[min(340px,37dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page24RetroTrend.photos[0].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page24RetroTrend.photos[0].id
                                    )
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page24RetroTrend.photos[1]}
                                  variant="polaroid-taped"
                                  tiltClass="rotate-[1.4deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(265px,31dvh)] sm:max-h-[min(300px,34dvh)] lg:max-h-[min(340px,37dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page24RetroTrend.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page24RetroTrend.photos[1].id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-3 rounded-[4px] border border-dashed border-[#CDB692]/80 bg-[#FAF3E3]/75 px-4 py-2.5 text-center md:text-left">
                              <p className="font-editorial text-[0.94rem] italic leading-relaxed text-[#554132] sm:text-[1.02rem]">
                                {cfg.page24RetroTrend.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 25: Conversations & Little Connections — Part I (Music + Banter + Password Start) */}
                        {activePage === 25 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 25 · {cfg.page25ChatsMusicStart.sectionTitle}
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.5rem,3vw,2.2rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page25ChatsMusicStart.heading}
                                </h2>
                                <p className="font-editorial mt-0.5 text-[0.9rem] italic text-[#735B47] sm:text-[1rem]">
                                  {cfg.page25ChatsMusicStart.subtitle}
                                </p>
                              </div>

                              {/* Mobile: 2 top side-by-side + 1 bottom centered */}
                              <div className="mt-2.5 space-y-2 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2.5">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page25ChatsMusicStart.photos[0]}
                                    variant="polaroid-taped"
                                    tiltClass="-rotate-[1deg]"
                                    washiPosition="top-left-corner"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[175px] sm:max-h-[195px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page25ChatsMusicStart.photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page25ChatsMusicStart.photos[0].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items: cfg.page25ChatsMusicStart.photos,
                                        index: 0,
                                      })
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page25ChatsMusicStart.photos[1]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[175px] sm:max-h-[195px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page25ChatsMusicStart.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page25ChatsMusicStart.photos[1].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items: cfg.page25ChatsMusicStart.photos,
                                        index: 1,
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex justify-center">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page25ChatsMusicStart.photos[2]}
                                    variant="gold-folio"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[175px] sm:max-h-[195px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page25ChatsMusicStart.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page25ChatsMusicStart.photos[2].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items: cfg.page25ChatsMusicStart.photos,
                                        index: 2,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Opening Locked-Screen Chat */}
                              <div className="mt-3 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page25ChatsMusicStart.photos[2]}
                                  variant="gold-folio"
                                  tiltClass="rotate-[0.8deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(395px,44dvh)] lg:max-h-[min(435px,47dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page25ChatsMusicStart.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page25ChatsMusicStart.photos[2].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items: cfg.page25ChatsMusicStart.photos,
                                      index: 2,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.9rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page25ChatsMusicStart.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 26: Conversations & Little Connections — Part II (Password Hunt 12:22–12:32 am) */}
                        {activePage === 26 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 26 · {cfg.page26ChatsPasswordMid.sectionTitle}
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.55rem,3vw,2.2rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page26ChatsPasswordMid.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 chronological chat grid */}
                              <div className="mt-2.5 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                {cfg.page26ChatsPasswordMid.photos.map(
                                  (slot, idx) => (
                                    <ScrapbookPhotoFrame
                                      key={slot.id}
                                      slot={slot}
                                      variant={
                                        idx % 2 === 0
                                          ? 'museum-mat'
                                          : 'polaroid-taped'
                                      }
                                      tiltClass={
                                        idx % 2 === 0
                                          ? '-rotate-[0.8deg]'
                                          : 'rotate-[0.8deg]'
                                      }
                                      washiPosition="top-center"
                                      washiVariant={
                                        idx % 2 === 0 ? 'champagne' : 'sage'
                                      }
                                      compactCaption
                                      imgMaxHeightClass="max-h-[175px] sm:max-h-[195px]"
                                      imgError={Boolean(imgErrors[slot.id])}
                                      onImageError={() =>
                                        markImageError(slot.id)
                                      }
                                      onZoom={() =>
                                        setZoomedGallery({
                                          items:
                                            cfg.page26ChatsPasswordMid.photos,
                                          index: idx,
                                        })
                                      }
                                    />
                                  )
                                )}
                              </div>

                              {/* Desktop Right Leaf: Screenshots 3 & 4 side-by-side */}
                              <div className="mt-3 hidden grid-cols-2 items-center gap-3.5 md:grid">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page26ChatsPasswordMid.photos[2]}
                                  variant="polaroid-taped"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="top-left-corner"
                                  washiVariant="sage"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[min(395px,44dvh)] lg:max-h-[min(435px,47dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page26ChatsPasswordMid.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page26ChatsPasswordMid.photos[2].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items: cfg.page26ChatsPasswordMid.photos,
                                      index: 2,
                                    })
                                  }
                                />
                                <div className="mt-3">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page26ChatsPasswordMid.photos[3]}
                                    variant="museum-mat"
                                    tiltClass="rotate-[1deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(395px,44dvh)] lg:max-h-[min(435px,47dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page26ChatsPasswordMid.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page26ChatsPasswordMid.photos[3].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page26ChatsPasswordMid.photos,
                                        index: 3,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.9rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page26ChatsPasswordMid.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 27: Conversations & Little Connections — Part III (Four Digits & Close Guesses) */}
                        {activePage === 27 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 27 · {cfg.page27ChatsPasswordClues.sectionTitle}
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.55rem,3vw,2.2rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page27ChatsPasswordClues.heading}
                                </h2>
                              </div>

                              {/* Mobile: 2x2 chronological chat grid */}
                              <div className="mt-2.5 grid grid-cols-2 items-center gap-2.5 md:hidden">
                                {cfg.page27ChatsPasswordClues.photos.map(
                                  (slot, idx) => (
                                    <ScrapbookPhotoFrame
                                      key={slot.id}
                                      slot={slot}
                                      variant={
                                        idx % 2 === 0
                                          ? 'polaroid-taped'
                                          : 'museum-mat'
                                      }
                                      tiltClass={
                                        idx % 2 === 0
                                          ? '-rotate-[0.8deg]'
                                          : 'rotate-[0.8deg]'
                                      }
                                      washiPosition="top-center"
                                      washiVariant={
                                        idx % 2 === 0 ? 'striped' : 'champagne'
                                      }
                                      compactCaption
                                      imgMaxHeightClass="max-h-[175px] sm:max-h-[195px]"
                                      imgError={Boolean(imgErrors[slot.id])}
                                      onImageError={() =>
                                        markImageError(slot.id)
                                      }
                                      onZoom={() =>
                                        setZoomedGallery({
                                          items:
                                            cfg.page27ChatsPasswordClues.photos,
                                          index: idx,
                                        })
                                      }
                                    />
                                  )
                                )}
                              </div>

                              {/* Desktop Right Leaf: Screenshots 3 & 4 side-by-side */}
                              <div className="mt-3 hidden grid-cols-2 items-center gap-3.5 md:grid">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page27ChatsPasswordClues.photos[2]}
                                  variant="museum-mat"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="top-left-corner"
                                  washiVariant="striped"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[min(395px,44dvh)] lg:max-h-[min(435px,47dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page27ChatsPasswordClues.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page27ChatsPasswordClues.photos[2].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items:
                                        cfg.page27ChatsPasswordClues.photos,
                                      index: 2,
                                    })
                                  }
                                />
                                <div className="mt-3">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page27ChatsPasswordClues.photos[3]
                                    }
                                    variant="gold-folio"
                                    tiltClass="rotate-[1deg]"
                                    washiPosition="top-right-corner"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(395px,44dvh)] lg:max-h-[min(435px,47dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page27ChatsPasswordClues.photos[3]
                                          .id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page27ChatsPasswordClues.photos[3]
                                          .id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page27ChatsPasswordClues.photos,
                                        index: 3,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.9rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page27ChatsPasswordClues.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 28: Conversations & Little Connections — Part IV (Unlocked at 1:03 AM) */}
                        {activePage === 28 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 28 · {cfg.page28ChatsPasswordSolved.sectionTitle}
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.6rem,3.1vw,2.25rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page28ChatsPasswordSolved.heading}
                                </h2>
                                <p className="font-editorial mt-0.5 text-[0.92rem] italic text-[#735B47] sm:text-[1rem]">
                                  {cfg.page28ChatsPasswordSolved.subtitle}
                                </p>
                              </div>

                              {/* Mobile: Side-by-side finale chat pair */}
                              <div className="mt-3 grid grid-cols-2 items-center gap-3 md:hidden">
                                <ScrapbookPhotoFrame
                                  slot={
                                    cfg.page28ChatsPasswordSolved.photos[0]
                                  }
                                  variant="gold-folio"
                                  tiltClass="-rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[250px] sm:max-h-[285px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page28ChatsPasswordSolved.photos[0].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page28ChatsPasswordSolved.photos[0].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items:
                                        cfg.page28ChatsPasswordSolved.photos,
                                      index: 0,
                                    })
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={
                                    cfg.page28ChatsPasswordSolved.photos[1]
                                  }
                                  variant="gold-folio"
                                  tiltClass="rotate-[1deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[250px] sm:max-h-[285px]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page28ChatsPasswordSolved.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page28ChatsPasswordSolved.photos[1].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items:
                                        cfg.page28ChatsPasswordSolved.photos,
                                      index: 1,
                                    })
                                  }
                                />
                              </div>

                              {/* Desktop Right Leaf: Finale Chat Screenshot */}
                              <div className="mt-3 hidden flex-col items-center md:flex">
                                <ScrapbookPhotoFrame
                                  slot={
                                    cfg.page28ChatsPasswordSolved.photos[1]
                                  }
                                  variant="gold-folio"
                                  tiltClass="rotate-[0.9deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  imgMaxHeightClass="max-h-[min(395px,44dvh)] lg:max-h-[min(435px,47dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page28ChatsPasswordSolved.photos[1].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page28ChatsPasswordSolved.photos[1].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items:
                                        cfg.page28ChatsPasswordSolved.photos,
                                      index: 1,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.92rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page28ChatsPasswordSolved.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 29: Conversations & Little Connections — Phone Call Memories I (Aug & Sep WhatsApp Calls) */}
                        {activePage === 29 && (
                          <div className="flex min-h-0 flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 29 ·{' '}
                                  {
                                    cfg.page29CallMemoriesWhatsAppEarly
                                      .sectionTitle
                                  }
                                </p>
                                <h2
                                  className="font-editorial mt-0.5 text-[clamp(1.32rem,2.35vw,1.84rem)] font-medium leading-[1.1] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page29CallMemoriesWhatsAppEarly.heading}
                                </h2>
                                <p className="font-editorial mt-0.5 text-[0.86rem] italic text-[#735B47] sm:text-[0.95rem]">
                                  {cfg.page29CallMemoriesWhatsAppEarly.subtitle}
                                </p>
                              </div>

                              {/* Mobile: 2x2 readable grid for Aug & Sep */}
                              <div className="mt-2 space-y-2 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page29CallMemoriesWhatsAppEarly
                                        .photos[0]
                                    }
                                    variant="ticket-cinema"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[90px] sm:max-h-[108px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[0].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page29CallMemoriesWhatsAppEarly
                                            .photos,
                                        index: 0,
                                      })
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page29CallMemoriesWhatsAppEarly
                                        .photos[1]
                                    }
                                    variant="museum-mat"
                                    tiltClass="rotate-[0.6deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[105px] sm:max-h-[125px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[1].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page29CallMemoriesWhatsAppEarly
                                            .photos,
                                        index: 1,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page29CallMemoriesWhatsAppEarly
                                        .photos[2]
                                    }
                                    variant="polaroid-taped"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[140px] sm:max-h-[162px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[2].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page29CallMemoriesWhatsAppEarly
                                            .photos,
                                        index: 2,
                                      })
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page29CallMemoriesWhatsAppEarly
                                        .photos[3]
                                    }
                                    variant="ticket-cinema"
                                    tiltClass="rotate-[0.6deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[90px] sm:max-h-[108px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[3].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page29CallMemoriesWhatsAppEarly
                                            .photos,
                                        index: 3,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: 11 Sep + 29 Sep stacked cleanly */}
                              <div className="mt-2 hidden flex-col items-center gap-2 md:flex">
                                <div className="w-[62%]">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page29CallMemoriesWhatsAppEarly
                                        .photos[2]
                                    }
                                    variant="polaroid-taped"
                                    tiltClass="-rotate-[0.8deg]"
                                    washiPosition="top-center"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(165px,18.5dvh)] lg:max-h-[min(195px,21dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[2].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page29CallMemoriesWhatsAppEarly
                                            .photos,
                                        index: 2,
                                      })
                                    }
                                  />
                                </div>
                                <div className="w-[88%]">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page29CallMemoriesWhatsAppEarly
                                        .photos[3]
                                    }
                                    variant="ticket-cinema"
                                    tiltClass="rotate-[0.7deg]"
                                    washiPosition="top-center"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[min(95px,11dvh)] lg:max-h-[min(115px,12.5dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page29CallMemoriesWhatsAppEarly
                                          .photos[3].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page29CallMemoriesWhatsAppEarly
                                            .photos,
                                        index: 3,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-1.5 text-center md:px-4 md:py-2 md:text-left">
                              <p className="font-editorial text-[0.86rem] italic leading-snug text-[#554132] sm:text-[0.94rem]">
                                {cfg.page29CallMemoriesWhatsAppEarly.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 30: Conversations & Little Connections — Phone Call Memories II (November WhatsApp Calls) */}
                        {activePage === 30 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 30 ·{' '}
                                  {
                                    cfg.page30CallMemoriesWhatsAppNov
                                      .sectionTitle
                                  }
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.45rem,2.8vw,2.1rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page30CallMemoriesWhatsAppNov.heading}
                                </h2>
                                <p className="font-editorial mt-0.5 text-[0.88rem] italic text-[#735B47] sm:text-[0.98rem]">
                                  {cfg.page30CallMemoriesWhatsAppNov.subtitle}
                                </p>
                              </div>

                              {/* Mobile: 2 big November WhatsApp Call cards */}
                              <div className="mt-3 flex flex-col items-center gap-3 md:hidden">
                                <div className="w-[74%]">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page30CallMemoriesWhatsAppNov
                                        .photos[0]
                                    }
                                    variant="polaroid-taped"
                                    tiltClass="-rotate-[0.7deg]"
                                    washiPosition="top-center"
                                    washiVariant="sage"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[210px] sm:max-h-[240px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page30CallMemoriesWhatsAppNov
                                          .photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page30CallMemoriesWhatsAppNov
                                          .photos[0].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page30CallMemoriesWhatsAppNov
                                            .photos,
                                        index: 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="w-[92%]">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page30CallMemoriesWhatsAppNov
                                        .photos[1]
                                    }
                                    variant="ticket-cinema"
                                    tiltClass="rotate-[0.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[115px] sm:max-h-[135px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page30CallMemoriesWhatsAppNov
                                          .photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page30CallMemoriesWhatsAppNov
                                          .photos[1].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page30CallMemoriesWhatsAppNov
                                            .photos,
                                        index: 1,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: 10 Nov Large Centered Banner */}
                              <div className="my-auto hidden flex-col items-center pt-10 md:flex">
                                <div className="w-[94%]">
                                  <ScrapbookPhotoFrame
                                    slot={
                                      cfg.page30CallMemoriesWhatsAppNov
                                        .photos[1]
                                    }
                                    variant="ticket-cinema"
                                    tiltClass="rotate-[0.7deg]"
                                    washiPosition="top-center"
                                    washiVariant="striped"
                                    imgMaxHeightClass="max-h-[min(210px,24dvh)] lg:max-h-[min(240px,27dvh)]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page30CallMemoriesWhatsAppNov
                                          .photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page30CallMemoriesWhatsAppNov
                                          .photos[1].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items:
                                          cfg.page30CallMemoriesWhatsAppNov
                                            .photos,
                                        index: 1,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.9rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page30CallMemoriesWhatsAppNov.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 31: Conversations & Little Connections — Phone Call Memories III (October Dialer Logs) */}
                        {activePage === 31 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 31 · {cfg.page31CallLogsOctober.sectionTitle}
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.5rem,3vw,2.15rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page31CallLogsOctober.heading}
                                </h2>
                              </div>

                              {/* Mobile: Balanced 2x2 dialer log composition */}
                              <div className="mt-2.5 space-y-2.5 md:hidden">
                                <div className="grid grid-cols-2 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page31CallLogsOctober.photos[0]}
                                    variant="midnight-frame"
                                    tiltClass="-rotate-[0.6deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[120px] sm:max-h-[140px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page31CallLogsOctober.photos[0].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page31CallLogsOctober.photos[0].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items: cfg.page31CallLogsOctober.photos,
                                        index: 0,
                                      })
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page31CallLogsOctober.photos[1]}
                                    variant="midnight-frame"
                                    tiltClass="rotate-[0.6deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[120px] sm:max-h-[140px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page31CallLogsOctober.photos[1].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page31CallLogsOctober.photos[1].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items: cfg.page31CallLogsOctober.photos,
                                        index: 1,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 items-center gap-2">
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page31CallLogsOctober.photos[2]}
                                    variant="ticket-cinema"
                                    tiltClass="-rotate-[0.5deg]"
                                    washiPosition="none"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[95px] sm:max-h-[115px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page31CallLogsOctober.photos[2].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page31CallLogsOctober.photos[2].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items: cfg.page31CallLogsOctober.photos,
                                        index: 2,
                                      })
                                    }
                                  />
                                  <ScrapbookPhotoFrame
                                    slot={cfg.page31CallLogsOctober.photos[3]}
                                    variant="gold-folio"
                                    tiltClass="rotate-[0.6deg]"
                                    washiPosition="top-center"
                                    washiVariant="champagne"
                                    compactCaption
                                    imgMaxHeightClass="max-h-[110px] sm:max-h-[130px]"
                                    imgError={Boolean(
                                      imgErrors[
                                        cfg.page31CallLogsOctober.photos[3].id
                                      ]
                                    )}
                                    onImageError={() =>
                                      markImageError(
                                        cfg.page31CallLogsOctober.photos[3].id
                                      )
                                    }
                                    onZoom={() =>
                                      setZoomedGallery({
                                        items: cfg.page31CallLogsOctober.photos,
                                        index: 3,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              {/* Desktop Right Leaf: Oct 25 + Oct 28 Call Logs */}
                              <div className="mt-4 hidden flex-col items-center gap-3.5 md:flex">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page31CallLogsOctober.photos[2]}
                                  variant="ticket-cinema"
                                  tiltClass="-rotate-[0.6deg]"
                                  washiPosition="top-center"
                                  washiVariant="striped"
                                  compactCaption
                                  imgMaxHeightClass="max-h-[min(105px,13dvh)] lg:max-h-[min(120px,14dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page31CallLogsOctober.photos[2].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page31CallLogsOctober.photos[2].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items: cfg.page31CallLogsOctober.photos,
                                      index: 2,
                                    })
                                  }
                                />
                                <ScrapbookPhotoFrame
                                  slot={cfg.page31CallLogsOctober.photos[3]}
                                  variant="gold-folio"
                                  tiltClass="rotate-[0.8deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  imgMaxHeightClass="max-h-[min(165px,20dvh)] lg:max-h-[min(195px,23dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page31CallLogsOctober.photos[3].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page31CallLogsOctober.photos[3].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items: cfg.page31CallLogsOctober.photos,
                                      index: 3,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.9rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page31CallLogsOctober.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 32: Conversations & Little Connections — Phone Call Memories IV (Until Morning Full Log) */}
                        {activePage === 32 && (
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="text-center md:text-left">
                                <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                  Page 32 · {cfg.page32CallLogsWeekend.sectionTitle}
                                </p>
                                <h2
                                  className="font-editorial mt-1 text-[clamp(1.55rem,3vw,2.2rem)] font-medium leading-[1.12] text-[#3A291F]"
                                  style={{ textWrap: 'balance' }}
                                >
                                  {cfg.page32CallLogsWeekend.heading}
                                </h2>
                                <p className="font-editorial mt-0.5 text-[0.92rem] italic text-[#735B47] sm:text-[1rem]">
                                  {cfg.page32CallLogsWeekend.subtitle}
                                </p>
                              </div>

                              <div className="mt-3 flex justify-center md:mt-4">
                                <ScrapbookPhotoFrame
                                  slot={cfg.page32CallLogsWeekend.photos[0]}
                                  variant="midnight-frame"
                                  tiltClass="rotate-[0.6deg]"
                                  washiPosition="top-center"
                                  washiVariant="champagne"
                                  imgMaxHeightClass="max-h-[min(340px,40dvh)] sm:max-h-[min(370px,41dvh)] lg:max-h-[min(410px,44dvh)]"
                                  imgError={Boolean(
                                    imgErrors[
                                      cfg.page32CallLogsWeekend.photos[0].id
                                    ]
                                  )}
                                  onImageError={() =>
                                    markImageError(
                                      cfg.page32CallLogsWeekend.photos[0].id
                                    )
                                  }
                                  onZoom={() =>
                                    setZoomedGallery({
                                      items: cfg.page32CallLogsWeekend.photos,
                                      index: 0,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-2.5 rounded-[4px] border border-[#D8C5A7]/70 bg-[#FAF4E5]/75 px-3.5 py-2 text-center md:px-4 md:py-2.5 md:text-left">
                              <p className="font-editorial text-[0.9rem] italic leading-relaxed text-[#554132] sm:text-[1rem]">
                                {cfg.page32CallLogsWeekend.note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PAGE 33: Before We Turn The Page */}
                        {activePage === 33 && (
                          <div className="flex flex-1 flex-col justify-center">
                            <div className="mx-auto w-full max-w-[38ch] text-center">
                              <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                Page 33
                              </p>
                              <h2
                                className="font-editorial mt-2 text-[clamp(1.8rem,3.6vw,2.55rem)] font-medium leading-[1.15] text-[#3A291F]"
                                style={{ textWrap: 'balance' }}
                              >
                                {cfg.pageReflection.heading}
                              </h2>

                              <div className="mx-auto my-5 h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C49A52]/70 to-transparent" />

                              {editingReflection ? (
                                <div className="space-y-3 text-left">
                                  <textarea
                                    rows={4}
                                    value={reflectionDraft}
                                    onChange={(e) =>
                                      setReflectionDraft(e.target.value)
                                    }
                                    placeholder="Write a brief, quiet reflection before the final page"
                                    aria-label="Edit reflection text for Before We Turn The Page"
                                    className="font-editorial w-full rounded-md border border-[#CBB492] bg-[#FAF5E8] p-3.5 text-[1.1rem] leading-[1.6] text-[#3B2C22] focus:border-[#A88246] focus:outline-none"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingReflection(false)
                                      }
                                      className="min-h-[36px] cursor-pointer rounded-md px-3 text-[12px] text-[#7A614C] hover:text-[#3A291F]"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const trimmed = reflectionDraft.trim();
                                        if (trimmed) setReflectionText(trimmed);
                                        setEditingReflection(false);
                                      }}
                                      className="min-h-[36px] cursor-pointer rounded-md border border-[#C7B08E] bg-[#EFE2CA] px-4 text-[12px] font-medium text-[#3A291F] hover:bg-[#E6D4B4]"
                                    >
                                      Save note
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="font-editorial text-[clamp(1.12rem,2.4vw,1.34rem)] italic leading-[1.7] text-[#4E3B2E]">
                                    {reflectionText}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReflectionDraft(reflectionText);
                                      setEditingReflection(true);
                                    }}
                                    className="mt-6 inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 text-[11.5px] font-medium text-[#856B54] underline decoration-[#CBB596] underline-offset-4 hover:text-[#3A291F]"
                                  >
                                    <Pencil
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                    <span>Edit note</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* PAGE 34: The Last Page */}
                        {activePage === 34 && (
                          <div className="flex flex-1 flex-col justify-center">
                            <div className="mx-auto flex w-full max-w-[38ch] flex-col items-center text-center">
                              <svg
                                aria-hidden="true"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="mb-3 opacity-85"
                              >
                                <path
                                  d="M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z"
                                  fill="#D7B26B"
                                />
                              </svg>

                              <p className="font-editorial text-[11px] tracking-[0.14em] uppercase text-[#8B7159]">
                                Page 34
                              </p>
                              <h2
                                className="font-editorial mt-1.5 text-[clamp(1.9rem,4vw,2.65rem)] font-medium leading-[1.12] text-[#3A291F]"
                                style={{ textWrap: 'balance' }}
                              >
                                {cfg.pageFinal.heading}
                              </h2>

                              <p className="font-editorial mt-2.5 text-[1.12rem] italic text-[#735B47] lg:text-[1.2rem]">
                                {cfg.pageFinal.subtitle}
                              </p>

                              <div className="mx-auto my-5 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C6A05A]/80 to-transparent" />

                              <p className="font-editorial text-[1.12rem] leading-[1.7] text-[#4E3B2E] lg:text-[1.2rem]">
                                {cfg.pageFinal.bodyLines[1]}
                              </p>

                              {/* Final CTA: closes the book gently -> Final Birthday Reveal */}
                              <button
                                type="button"
                                onClick={handleTurnFinalPage}
                                className="mt-8 inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#B99252]/65 bg-[#F2E4CA] px-6 py-2.5 text-[13.5px] font-medium tracking-[0.03em] text-[#3E2C20] shadow-[0_10px_20px_-12px_rgba(44,28,14,0.38)] transition-all duration-200 hover:border-[#9E773B] hover:bg-[#FAF1E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99252]/70"
                              >
                                <span>{cfg.pageFinal.finalButtonLabel}</span>
                                <ArrowRight
                                  className="h-3.5 w-3.5 text-[#8A6734]"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        )}

                          </>
                        )}

                        {/* Bottom right page number folio */}
                        <div className="mt-2 flex shrink-0 items-center justify-between border-t border-[#DECBA9]/50 pt-2 text-[11.5px] tracking-[0.06em] text-[#8E745B] tabular-nums sm:mt-3 sm:pt-2.5">
                          <span>
                            {!activeLockConfig && activePage === TOTAL_PAGES
                              ? cfg.pageFinal.closingMark
                              : cfg.cover.title}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            {activeLockConfig ? (
                              <>
                                <Lock
                                  className="h-3 w-3 text-[#9B7B54]"
                                  aria-hidden="true"
                                />
                                <span>Locked</span>
                              </>
                            ) : (
                              String(activePage * 2).padStart(2, '0')
                            )}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Subtle non-intrusive bottom corner page-curl hint when hovering left/right side */}
                  {bookStage === 'openBook' &&
                    !editingReflection &&
                    !isUnlockingLock && (
                      <>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute bottom-2 left-2 z-25 hidden h-6 w-6 rounded-tr-[5px] border-t border-r transition-all duration-200 md:block ${
                            hoverSide === 'left' &&
                            (pendingLockPage !== null || activePage > 1)
                              ? 'border-[#B69468]/65 bg-gradient-to-tr from-[#E4D1B0]/75 to-transparent opacity-100'
                              : 'border-transparent opacity-0'
                          }`}
                        />
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute right-2 bottom-2 z-25 hidden h-6 w-6 rounded-tl-[5px] border-t border-l transition-all duration-200 md:block ${
                            hoverSide === 'right' &&
                            !pendingLockPage &&
                            activePage < TOTAL_PAGES
                              ? 'border-[#B69468]/65 bg-gradient-to-tl from-[#E4D1B0]/75 to-transparent opacity-100'
                              : 'border-transparent opacity-0'
                          }`}
                        />
                      </>
                    )}

                  {/* ==================== REAL 3D PAGE-TURNING LEAF OVERLAY ==================== */}
                  {!reduced && activeTurn && (
                    <>
                      <motion.div
                        key={`turning-shadow-${activeTurn.key}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.26, 0] }}
                        transition={{
                          duration: 0.78,
                          times: [0, 0.48, 1],
                          ease: 'easeInOut',
                        }}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-25 bg-gradient-to-r from-[#2D1B10]/20 via-[#2D1B10]/38 to-transparent"
                      />

                      <motion.div
                        key={`turning-leaf-${activeTurn.key}`}
                        initial={{
                          rotateY: activeTurn.direction === 'next' ? 0 : -178,
                          opacity: 0.99,
                        }}
                        animate={{
                          rotateY: activeTurn.direction === 'next' ? -178 : 0,
                          opacity: [0.99, 0.99, 0],
                        }}
                        transition={{
                          duration: 0.78,
                          times: [0, 0.86, 1],
                          ease: [0.28, 0.08, 0.22, 1],
                        }}
                        style={{
                          transformOrigin: 'left center',
                          transformStyle: 'preserve-3d',
                        }}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 md:left-1/2"
                      >
                        <div
                          className="absolute inset-0 rounded-r-[6px] border border-[#D4C0A2] shadow-[12px_16px_32px_rgba(32,18,10,0.32)]"
                          style={{
                            backfaceVisibility: 'hidden',
                            background:
                              'linear-gradient(90deg, #DCC9AD 0%, #E9DCC8 7%, #F7F0E4 22%, #FBF6EC 50%, #F7F0E4 80%, #E9DCC8 94%, #DCC9AD 100%)',
                          }}
                        />
                        <div
                          className="absolute inset-0 rounded-l-[6px] border border-[#D4C0A2] shadow-[-12px_16px_32px_rgba(32,18,10,0.28)]"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background:
                              'linear-gradient(90deg, #DCC9AD 0%, #E9DCC8 6%, #F7F0E4 20%, #FBF6EC 50%, #F7F0E4 78%, #E9DCC8 93%, #DCC9AD 100%)',
                          }}
                        />
                      </motion.div>
                    </>
                  )}

                  {/* ==================== REALISTIC 3D HARDCOVER OPENING HINGE ==================== */}
                  {bookStage === 'openingCover' && (
                    <>
                      <motion.div
                        aria-hidden="true"
                        initial={{ opacity: 0.42 }}
                        animate={{ opacity: 0 }}
                        transition={{
                          duration: reduced ? 0.28 : 1.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="pointer-events-none absolute inset-0 z-35 bg-[#24150C]/45"
                      />

                      <motion.div
                        aria-hidden="true"
                        initial={{ rotateY: 0, opacity: 1 }}
                        animate={
                          reduced
                            ? { opacity: 0 }
                            : { rotateY: -178, opacity: [1, 1, 0] }
                        }
                        transition={{
                          duration: reduced ? 0.28 : 1.08,
                          times: reduced ? undefined : [0, 0.82, 1],
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          transformOrigin: 'left center',
                          transformStyle: 'preserve-3d',
                        }}
                        className="pointer-events-none absolute inset-y-0 left-0 right-0 z-40 md:left-1/2"
                      >
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center rounded-r-[11px] border border-[#3A251A] px-8 py-10 text-center shadow-[16px_18px_36px_rgba(18,10,5,0.48)]"
                          style={{
                            backfaceVisibility: 'hidden',
                            background:
                              'linear-gradient(145deg, #6E503E 0%, #563D2E 52%, #3D291E 100%)',
                          }}
                        >
                          <div className="pointer-events-none absolute inset-4 left-7 rounded-[4px] border border-[#DFC086]/45" />
                          <p className="font-editorial text-[1.7rem] font-medium tracking-[0.02em] text-[#F4E6CE]">
                            {cfg.cover.title}
                          </p>
                          <p className="font-editorial mt-2 max-w-[20ch] text-[0.98rem] italic text-[#DFCBAF]/80">
                            {cfg.cover.subtitle}
                          </p>
                        </div>

                        <div
                          className="absolute inset-0 rounded-l-[11px] border border-[#C6B192] shadow-[-12px_14px_30px_rgba(24,14,8,0.34)]"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background:
                              'linear-gradient(180deg, #FBF6EC 0%, #F7F0E4 58%, #E9DCC8 100%)',
                          }}
                        >
                          <div className="pointer-events-none absolute inset-4 rounded-[4px] border border-[#C9B28D]/45" />
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Full-size readable chat & call screenshot lightbox */}
      {zoomedGallery && zoomedGallery.items[zoomedGallery.index] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoomedGallery.items[zoomedGallery.index].caption}
          data-no-page-turn="true"
          onClick={() => setZoomedGallery(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#180E08]/88 p-4 backdrop-blur-xs sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col items-center rounded-xl border border-[#CBB38D]/70 bg-[#FBF4E5] p-3.5 shadow-[0_24px_60px_rgba(12,6,2,0.65)] sm:p-5"
          >
            <div className="mb-2.5 flex w-full items-center justify-between gap-3 border-b border-[#DECBA9]/60 pb-2">
              <p className="font-handwritten text-[1.15rem] text-[#3E2C20] sm:text-[1.28rem]">
                {zoomedGallery.items[zoomedGallery.index].caption}
              </p>
              <button
                type="button"
                onClick={() => setZoomedGallery(null)}
                aria-label="Close full-size screenshot"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#D4BE9B] bg-[#F3E6CE] text-[#4A3628] transition-colors hover:bg-[#E7D4B3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-md bg-[#F2E6D1] p-2">
              <img
                src={zoomedGallery.items[zoomedGallery.index].src}
                alt={zoomedGallery.items[zoomedGallery.index].alt}
                className="max-h-[72dvh] w-auto max-w-full rounded-xs object-contain"
              />
            </div>

            {zoomedGallery.items.length > 1 && (
              <div className="mt-3 flex w-full items-center justify-between text-[12px] text-[#6B5441]">
                <button
                  type="button"
                  onClick={() =>
                    setZoomedGallery((prev) =>
                      prev
                        ? {
                            ...prev,
                            index:
                              (prev.index - 1 + prev.items.length) %
                              prev.items.length,
                          }
                        : null
                    )
                  }
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-md border border-[#D4BE9B] bg-[#F3E6CE] px-3 py-1 font-medium text-[#3E2C20] hover:bg-[#E7D4B3]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Previous</span>
                </button>
                <span className="tabular-nums">
                  {zoomedGallery.index + 1} / {zoomedGallery.items.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoomedGallery((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: (prev.index + 1) % prev.items.length,
                          }
                        : null
                    )
                  }
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-md border border-[#D4BE9B] bg-[#F3E6CE] px-3 py-1 font-medium text-[#3E2C20] hover:bg-[#E7D4B3]"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
