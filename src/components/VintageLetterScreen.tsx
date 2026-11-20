import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { VINTAGE_LETTER_CONFIG } from '../config/vintageLetter';

interface VintageLetterScreenProps {
  onLock: () => void;
  onContinue: () => void;
  onBack?: () => void;
}

type LetterStage = 'folded' | 'unfolding' | 'reading';

/**
 * Naturally torn, softly irregular handmade paper silhouette in normalized 0..1
 * coordinates with gently rounded, organically uneven corners (no sharp zigzags).
 */
const MAIN_TORN_PAPER_PATH = `
  M 0.019 0.046
  C 0.019 0.028, 0.028 0.019, 0.046 0.017
  C 0.098 0.013, 0.142 0.023, 0.194 0.019
  C 0.252 0.015, 0.296 0.025, 0.352 0.022
  C 0.405 0.019, 0.448 0.012, 0.506 0.016
  C 0.566 0.019, 0.624 0.013, 0.682 0.018
  C 0.738 0.022, 0.794 0.014, 0.852 0.018
  C 0.898 0.022, 0.930 0.015, 0.958 0.020
  C 0.974 0.023, 0.983 0.035, 0.984 0.054
  C 0.985 0.114, 0.978 0.172, 0.982 0.232
  C 0.986 0.292, 0.974 0.350, 0.979 0.412
  C 0.984 0.474, 0.977 0.532, 0.983 0.596
  C 0.988 0.660, 0.976 0.722, 0.981 0.786
  C 0.985 0.846, 0.977 0.900, 0.980 0.946
  C 0.981 0.966, 0.969 0.979, 0.948 0.981
  C 0.896 0.984, 0.844 0.975, 0.786 0.980
  C 0.728 0.985, 0.672 0.976, 0.614 0.982
  C 0.556 0.987, 0.502 0.975, 0.444 0.979
  C 0.386 0.983, 0.332 0.974, 0.274 0.981
  C 0.216 0.986, 0.162 0.975, 0.106 0.980
  C 0.072 0.983, 0.050 0.979, 0.038 0.976
  C 0.023 0.972, 0.015 0.958, 0.016 0.938
  C 0.017 0.875, 0.024 0.812, 0.019 0.748
  C 0.014 0.684, 0.023 0.622, 0.017 0.558
  C 0.012 0.494, 0.024 0.432, 0.018 0.368
  C 0.013 0.304, 0.022 0.242, 0.016 0.178
  C 0.012 0.124, 0.019 0.082, 0.019 0.046
  Z
`;

/**
 * Secondary torn parchment scrap path for the layered collage underneath,
 * using soft organic curves matching the main sheet.
 */
const SECONDARY_SCRAP_PATH = `
  M 0.022 0.045
  C 0.022 0.026, 0.035 0.018, 0.058 0.017
  C 0.17 0.014, 0.28 0.024, 0.40 0.018
  C 0.54 0.013, 0.68 0.023, 0.82 0.017
  C 0.90 0.014, 0.94 0.019, 0.962 0.026
  C 0.978 0.032, 0.985 0.048, 0.984 0.072
  C 0.982 0.22, 0.976 0.36, 0.983 0.51
  C 0.988 0.66, 0.975 0.81, 0.981 0.946
  C 0.982 0.967, 0.969 0.980, 0.945 0.981
  C 0.81 0.984, 0.66 0.974, 0.50 0.981
  C 0.34 0.986, 0.19 0.975, 0.052 0.980
  C 0.028 0.981, 0.017 0.966, 0.018 0.942
  C 0.019 0.79, 0.025 0.63, 0.018 0.48
  C 0.012 0.33, 0.024 0.18, 0.022 0.045
  Z
`;

/**
 * Folded packet softly irregular handmade edge path.
 */
const FOLDED_PACKET_PATH = `
  M 0.020 0.042
  C 0.020 0.025, 0.032 0.017, 0.052 0.016
  C 0.18 0.013, 0.32 0.022, 0.48 0.018
  C 0.65 0.014, 0.81 0.022, 0.948 0.018
  C 0.970 0.018, 0.983 0.032, 0.984 0.056
  C 0.985 0.24, 0.976 0.43, 0.983 0.63
  C 0.988 0.80, 0.977 0.90, 0.979 0.952
  C 0.979 0.972, 0.966 0.983, 0.942 0.984
  C 0.79 0.986, 0.62 0.975, 0.47 0.982
  C 0.31 0.987, 0.16 0.975, 0.048 0.981
  C 0.026 0.982, 0.016 0.968, 0.017 0.944
  C 0.018 0.76, 0.024 0.56, 0.018 0.36
  C 0.013 0.21, 0.020 0.11, 0.020 0.042
  Z
`;

/**
 * Minimal, quiet golden sparkle accents on the warm mocha backdrop—kept sparse
 * so the handwritten letter remains the centerpiece.
 */
function StationeryBackdropAccents({ reduced }: { reduced: boolean }) {
  const starPositions = [
    { top: '12%', left: '9%', size: 13, delay: 0.2, type: 'four' as const },
    { top: '14%', right: '11%', size: 13, delay: 0.7, type: 'four' as const },
    { top: '48%', left: '6%', size: 8, delay: 1.1, type: 'dot' as const },
    { bottom: '18%', left: '11%', size: 11, delay: 0.5, type: 'five' as const },
    { bottom: '16%', right: '10%', size: 12, delay: 0.9, type: 'four' as const },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {starPositions.map((star, idx) => (
        <motion.div
          key={idx}
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            bottom: star.bottom,
          }}
          initial={reduced ? { opacity: 0.3 } : { opacity: 0.18, scale: 0.94 }}
          animate={
            reduced
              ? { opacity: 0.3 }
              : {
                  opacity: [0.18, 0.42, 0.2],
                  scale: [0.94, 1.04, 0.95],
                }
          }
          transition={{
            duration: 5.2 + (idx % 3) * 0.9,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute"
        >
          {star.type === 'four' && (
            <svg
              width={star.size}
              height={star.size}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2.2 C12.7 8.4, 15.6 11.3, 21.8 12 C15.6 12.7, 12.7 15.6, 12 21.8 C11.3 15.6, 8.4 12.7, 2.2 12 C8.4 11.3, 11.3 8.4, 12 2.2 Z"
                fill="#E8C98A"
                stroke="#B88946"
                strokeWidth="0.75"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {star.type === 'five' && (
            <svg
              width={star.size}
              height={star.size}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2.6 L14.5 8.8 L21.1 9.3 L16 13.6 L17.6 20.1 L12 16.5 L6.4 20.1 L8 13.6 L2.9 9.3 L9.5 8.8 Z"
                fill="#DFBE82"
                stroke="#A87B3B"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {star.type === 'dot' && (
            <svg
              width={star.size}
              height={star.size}
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="2.3"
                fill="#E8C98A"
                stroke="#A87B3B"
                strokeWidth="0.65"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Decorative illustrated antique-gold stationery pin holding the letter
 * onto the layered handmade collage at the top center.
 */
function DecorativeGoldenPin() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative flex flex-col items-center"
    >
      <svg
        width="44"
        height="48"
        viewBox="0 0 44 48"
        fill="none"
        className="drop-shadow-[0_6px_8px_rgba(32,18,10,0.42)]"
      >
        {/* Soft cast shadow on the paper below the pin */}
        <ellipse
          cx="24.5"
          cy="34"
          rx="7.5"
          ry="4.2"
          fill="#583E2B"
          fillOpacity="0.24"
        />
        {/* Metallic pin needle tucking into the torn paper */}
        <path
          d="M22 26 L22 36.5"
          stroke="#6A5238"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M21.4 26 L21.4 35.5"
          stroke="#E5C687"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Brass collar */}
        <ellipse
          cx="22"
          cy="24.5"
          rx="7.2"
          ry="2.8"
          fill="#B6843D"
          stroke="#4A3219"
          strokeWidth="1.2"
        />
        {/* Illustrated round golden pinhead */}
        <circle
          cx="22"
          cy="15.5"
          r="10.2"
          fill="url(#goldenPinHeadGrad)"
          stroke="#4A3219"
          strokeWidth="1.35"
        />
        {/* Hand-drawn inner glint ring & highlight */}
        <path
          d="M16.2 11.2 C17.8 8.7, 21.4 8.0, 24.4 9.2"
          stroke="#FFF6DC"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="17.2" cy="14.2" r="1.2" fill="#FFF7DF" fillOpacity="0.85" />
        {/* Tiny decorative engraved star at the center of the golden pin */}
        <path
          d="M22 11.4 L22.9 14.3 L25.8 15.2 L22.9 16.1 L22 19 L21.1 16.1 L18.2 15.2 L21.1 14.3 Z"
          fill="#8E5F21"
          fillOpacity="0.52"
        />
        <defs>
          <radialGradient
            id="goldenPinHeadGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(18.5 11.5) rotate(52) scale(16)"
          >
            <stop offset="0%" stopColor="#FAEAAC" />
            <stop offset="48%" stopColor="#DBAA57" />
            <stop offset="100%" stopColor="#9B6B28" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Hand-drawn botanical branch and pressed dried-flower illustration tucked
 * artfully along the upper-right edge of the handmade collage.
 */
function IllustratedBotanicalBranchTopRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 210"
      fill="none"
      className="pointer-events-none h-32 w-28 sm:h-44 sm:w-36"
    >
      {/* Main hand-inked botanical stem */}
      <path
        d="M150 18 C128 46, 108 82, 82 126 C67 151, 51 174, 32 196"
        stroke="#5F4B3B"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      {/* Secondary side twigs */}
      <path
        d="M119 64 C94 56, 70 59, 46 72"
        stroke="#6B5644"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M100 97 C124 96, 146 105, 162 119"
        stroke="#6B5644"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M78 134 C57 128, 39 132, 23 142"
        stroke="#6B5644"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Pressed dried dusty-blush blossom at top tip */}
      <g>
        <path
          d="M149 20 C138 11, 145 2, 155 8 C161 14, 154 22, 149 20 Z"
          fill="#DFB6A5"
          stroke="#6A4D3E"
          strokeWidth="1.15"
        />
        <path
          d="M151 20 C162 14, 171 21, 165 30 C158 34, 150 26, 151 20 Z"
          fill="#D39D8B"
          stroke="#6A4D3E"
          strokeWidth="1.15"
        />
        <path
          d="M148 22 C137 26, 134 36, 143 38 C151 37, 152 27, 148 22 Z"
          fill="#E8C9B8"
          stroke="#6A4D3E"
          strokeWidth="1.15"
        />
        <path
          d="M146 18 C134 15, 130 23, 138 28 C144 29, 148 23, 146 18 Z"
          fill="#D9A896"
          stroke="#6A4D3E"
          strokeWidth="1.1"
        />
        <circle
          cx="149.5"
          cy="20.5"
          r="3.1"
          fill="#D4A456"
          stroke="#5E4532"
          strokeWidth="1"
        />
      </g>

      {/* Secondary warm golden-ochre dried wildflower on left branch */}
      <g>
        <path
          d="M46 72 C34 65, 36 55, 45 58 C51 61, 50 69, 46 72 Z"
          fill="#E5C582"
          stroke="#6B5338"
          strokeWidth="1.1"
        />
        <path
          d="M46 72 C36 74, 34 83, 43 84 C49 83, 50 76, 46 72 Z"
          fill="#D8B168"
          stroke="#6B5338"
          strokeWidth="1.1"
        />
        <path
          d="M48 71 C53 62, 62 65, 59 74 C56 78, 49 76, 48 71 Z"
          fill="#EBD198"
          stroke="#6B5338"
          strokeWidth="1.1"
        />
        <circle
          cx="46.5"
          cy="71.5"
          r="2.4"
          fill="#8E5B3E"
          stroke="#5A3E2E"
          strokeWidth="0.9"
        />
      </g>

      {/* Pressed sage-olive leaves & tiny seed buds along branches */}
      <path
        d="M128 45 C119 36, 118 24, 127 28 C133 33, 132 41, 128 45 Z"
        fill="#A6AD8C"
        stroke="#5E5442"
        strokeWidth="1.05"
      />
      <path
        d="M111 78 C122 72, 132 76, 126 85 C120 88, 113 84, 111 78 Z"
        fill="#9CA481"
        stroke="#5E5442"
        strokeWidth="1.05"
      />
      <path
        d="M84 62 C78 52, 81 42, 89 47 C93 52, 89 59, 84 62 Z"
        fill="#B6BC9C"
        stroke="#5E5442"
        strokeWidth="1"
      />
      <path
        d="M132 103 C139 94, 148 96, 144 106 C140 110, 134 108, 132 103 Z"
        fill="#D6B99A"
        stroke="#5E4C3E"
        strokeWidth="1"
      />
      <ellipse
        cx="163"
        cy="120"
        rx="5.2"
        ry="3.1"
        transform="rotate(28 163 120)"
        fill="#DEC19E"
        stroke="#624F3F"
        strokeWidth="1"
      />
      <ellipse
        cx="22"
        cy="143"
        rx="5.4"
        ry="3"
        transform="rotate(-24 22 143)"
        fill="#A4AC8B"
        stroke="#5E5442"
        strokeWidth="1"
      />
      <ellipse
        cx="64"
        cy="154"
        rx="5.8"
        ry="3.1"
        transform="rotate(-48 64 154)"
        fill="#B2B998"
        stroke="#5E5442"
        strokeWidth="1"
      />
      {/* Tiny ink-drawn gold pollen dots */}
      <circle cx="62" cy="54" r="1.6" fill="#C99A4E" />
      <circle cx="139" cy="70" r="1.5" fill="#C99A4E" />
      <circle cx="38" cy="118" r="1.4" fill="#C99A4E" />
    </svg>
  );
}

/**
 * Complementary hand-drawn dried twig & wildflower sprig peeking gently near
 * the lower-left corner of the collage.
 */
function IllustratedBotanicalSprigBottomLeft() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 150"
      fill="none"
      className="pointer-events-none h-24 w-24 sm:h-32 sm:w-32"
    >
      <path
        d="M20 132 C38 106, 58 84, 84 62 C98 50, 111 40, 124 30"
        stroke="#624E3E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M52 94 C44 76, 46 58, 56 42"
        stroke="#6B5644"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M78 68 C94 72, 108 70, 122 64"
        stroke="#6B5644"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Small pressed leaves */}
      <path
        d="M40 105 C30 98, 28 86, 37 89 C43 93, 44 100, 40 105 Z"
        fill="#A4AC8B"
        stroke="#5D5240"
        strokeWidth="1"
      />
      <path
        d="M66 80 C60 68, 64 58, 72 64 C76 69, 71 76, 66 80 Z"
        fill="#B6BD9D"
        stroke="#5D5240"
        strokeWidth="1"
      />
      <path
        d="M96 54 C104 44, 115 44, 112 54 C108 59, 100 58, 96 54 Z"
        fill="#A4AC8B"
        stroke="#5D5240"
        strokeWidth="1"
      />
      {/* Tiny dried rosebud */}
      <path
        d="M55 43 C48 34, 54 25, 62 31 C66 37, 60 44, 55 43 Z"
        fill="#D9A896"
        stroke="#6A4D3E"
        strokeWidth="1.05"
      />
      <path
        d="M57 42 C64 36, 71 42, 65 49 C60 51, 55 47, 57 42 Z"
        fill="#E6C3B3"
        stroke="#6A4D3E"
        strokeWidth="1.05"
      />
      <circle
        cx="123"
        cy="63"
        r="3.2"
        fill="#DFBE7B"
        stroke="#6B5338"
        strokeWidth="1"
      />
      <circle
        cx="125"
        cy="29"
        r="2.8"
        fill="#DFBE7B"
        stroke="#6B5338"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Vintage illustrated hand-poured wax seal near the bottom corner, drawn with
 * organic melted wax lobes, ink line contours, and a tiny embossed champagne-gold star.
 */
function IllustratedWaxSeal({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const sizeClass =
    size === 'sm' ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-14 w-14 sm:h-16 sm:w-16';

  return (
    <div aria-hidden="true" className={`relative shrink-0 ${sizeClass}`}>
      <svg
        viewBox="0 0 84 84"
        fill="none"
        className="h-full w-full drop-shadow-[0_6px_10px_rgba(52,18,14,0.34)]"
      >
        {/* Organic hand-poured scalloped wax outline */}
        <path
          d="M42 7 C50 6.5, 56 10.5, 62 12 C69 13.8, 74 20.5, 74.5 28 C75 34.5, 78.5 39.5, 76.5 46.5 C74.8 53, 74 60, 69 65.5 C64 71, 56 74.5, 48.5 75.5 C42 76.4, 36.5 78.2, 29.8 75.2 C23 72.2, 16 70, 12.2 63.5 C8.4 57, 7.2 49.5, 8.2 42 C9 35.5, 6.2 29, 10.2 22.5 C14.2 16, 20.2 11.2, 27.5 9.8 C33 8.7, 36.5 7.3, 42 7 Z"
          fill="url(#waxOuterGrad)"
          stroke="#4F1915"
          strokeWidth="1.65"
          strokeLinejoin="round"
        />
        {/* Hand-drawn painterly highlight arc on wax rim */}
        <path
          d="M17.5 24.5 C22.5 16.5, 32 12.2, 42.5 12.4"
          stroke="#DF8E82"
          strokeOpacity="0.62"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        {/* Stamped inner circular wax well */}
        <circle
          cx="42"
          cy="42"
          r="21.5"
          fill="url(#waxInnerGrad)"
          stroke="#571C17"
          strokeWidth="1.4"
        />
        <circle
          cx="42"
          cy="42"
          r="18.2"
          stroke="#D78E82"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="2.5 2.5"
        />
        {/* Subtle pressed-into-wax recess shadow & lit lower-right bevel */}
        <path
          d="M42 33.6 L44.12 39.09 L49.99 39.4 L45.42 43.11 L46.94 48.8 L42 45.6 L37.06 48.8 L38.58 43.11 L34.01 39.4 L39.88 39.09 Z"
          transform="translate(-0.55 -0.55)"
          fill="#4A1511"
          fillOpacity="0.65"
          stroke="#42120E"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
        <path
          d="M42 33.6 L44.12 39.09 L49.99 39.4 L45.42 43.11 L46.94 48.8 L42 45.6 L37.06 48.8 L38.58 43.11 L34.01 39.4 L39.88 39.09 Z"
          transform="translate(0.55 0.65)"
          fill="none"
          stroke="#F4E2B6"
          strokeOpacity="0.34"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        {/* Tiny centered embossed champagne-gold five-pointed star */}
        <path
          d="M42 33.6 L44.12 39.09 L49.99 39.4 L45.42 43.11 L46.94 48.8 L42 45.6 L37.06 48.8 L38.58 43.11 L34.01 39.4 L39.88 39.09 Z"
          fill="url(#champagneStarGrad)"
          stroke="#591C16"
          strokeWidth="0.85"
          strokeLinejoin="round"
        />
        {/* Subtle gold leaf fleck detail */}
        <circle cx="56" cy="21" r="1.4" fill="#E4C17C" fillOpacity="0.78" />
        <circle cx="24" cy="61" r="1.2" fill="#E4C17C" fillOpacity="0.68" />
        <defs>
          <linearGradient
            id="champagneStarGrad"
            x1="34"
            y1="34"
            x2="50"
            y2="49"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E6CE99" />
            <stop offset="52%" stopColor="#D6B574" />
            <stop offset="100%" stopColor="#B8904D" />
          </linearGradient>
          <radialGradient
            id="waxOuterGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(32 28) rotate(54) scale(56)"
          >
            <stop offset="0%" stopColor="#B85348" />
            <stop offset="56%" stopColor="#8E342C" />
            <stop offset="100%" stopColor="#651E18" />
          </radialGradient>
          <radialGradient
            id="waxInnerGrad"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(36 35) rotate(50) scale(34)"
          >
            <stop offset="0%" stopColor="#9A3B32" />
            <stop offset="68%" stopColor="#7C2A23" />
            <stop offset="100%" stopColor="#621E18" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Secondary handwritten-paper collage layers tucked gently behind the main torn sheet.
 */
function SecondaryCollageLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none"
    >
      {/* Back-right warm kraft torn paper card peeking softly */}
      <div
        className="absolute inset-1 translate-x-2 translate-y-2.5 rotate-[2.6deg] sm:translate-x-4 sm:translate-y-3.5 sm:rotate-[3.1deg]"
        style={{
          filter: 'drop-shadow(0 10px 20px rgba(96, 70, 44, 0.16))',
        }}
      >
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d={SECONDARY_SCRAP_PATH}
            fill="#DFC9A8"
            stroke="#9B7E5E"
            strokeOpacity="0.68"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Back-left subtle handwritten parchment sheet peeking behind */}
      <div
        className="absolute inset-0 -translate-x-2 -translate-y-1.5 -rotate-[2.8deg] sm:-translate-x-4 sm:-translate-y-2.5 sm:-rotate-[3.2deg]"
        style={{
          filter: 'drop-shadow(0 12px 22px rgba(96, 70, 44, 0.18))',
        }}
      >
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient
              id="secondaryCollageWash"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#EFE3CE" />
              <stop offset="55%" stopColor="#E8D7BC" />
              <stop offset="100%" stopColor="#DFC9A8" />
            </linearGradient>
          </defs>
          <path
            d={SECONDARY_SCRAP_PATH}
            fill="url(#secondaryCollageWash)"
            stroke="#876B4E"
            strokeOpacity="0.82"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Whisper-faint ruled lines & subtle handwritten strokes along peeking margins */}
        <div className="absolute inset-5 overflow-hidden opacity-[0.22] sm:inset-7">
          <div className="space-y-4 pt-1">
            {Array.from({ length: 14 }).map((_, lineIdx) => (
              <div
                key={lineIdx}
                className="border-b border-[#9E8061]/35 pb-1"
              />
            ))}
          </div>
          <svg
            viewBox="0 0 260 220"
            fill="none"
            className="absolute top-2 left-2 h-44 w-56 opacity-60"
          >
            <path
              d="M10 24 C24 14, 34 29, 48 21 C59 15, 70 26, 86 19 C99 13, 114 25, 132 18"
              stroke="#745840"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
            <path
              d="M12 52 C28 45, 42 58, 56 49 C68 42, 82 55, 98 47"
              stroke="#745840"
              strokeWidth="1.05"
              strokeLinecap="round"
            />
            <path
              d="M14 82 C26 75, 40 86, 54 79 C64 73, 74 84, 88 78"
              stroke="#745840"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

type WritingCursorTarget =
  | { section: 'idle' }
  | { section: 'opening'; charCount: number }
  | { section: 'line'; lineIndex: number; charCount: number }
  | { section: 'closing'; charCount: number }
  | { section: 'done' };

function getNaturalCharDelay(
  char: string,
  nextChar: string | undefined,
  baseMs: number
): number {
  if (char === '.' || char === '!' || char === '?') {
    return nextChar === '.' ? 95 : 220;
  }
  if (char === ',' || char === ';' || char === ':' || char === '—') {
    return 145;
  }
  if (char === ' ') {
    return baseMs + 16;
  }
  return Math.max(24, baseMs - 6 + (char.charCodeAt(0) % 13));
}

/**
 * Subtle zero-width inline fountain-pen nib indicator that tracks the live
 * writing point without disrupting word wrapping or cursive letter joins.
 */
function PenNibIndicator() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none relative inline-block h-0 w-0 align-baseline"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -1, 0.3, -0.7, 0],
          rotate: [-1.2, 1.5, -0.8, 1.2, -1.2],
        }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{
          opacity: { duration: 0.16 },
          scale: { duration: 0.16 },
          y: { duration: 0.46, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.52, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -bottom-[2px] left-[-1px] inline-block origin-bottom-left"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-85 drop-shadow-[0_2px_3px_rgba(40,24,14,0.2)]"
        >
          <path
            d="M3 21 L7.2 11.8 L15.8 3.2 C17.1 1.9, 19.3 2.1, 20.4 3.5 C21.5 4.8, 21.3 6.8, 20 8.1 L11.6 16.5 Z"
            fill="#8D6E4E"
            stroke="#3B2C22"
            strokeWidth="1.15"
            strokeLinejoin="round"
          />
          <path
            d="M3 21 L9.6 14.4"
            stroke="#3B2C22"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle cx="10.8" cy="13.2" r="1.15" fill="#F9F3E6" />
          <circle cx="2.9" cy="21" r="1.1" fill="#3B2C22" />
        </svg>
      </motion.span>
    </span>
  );
}

/**
 * Progressive handwriting renderer: keeps Caveat's cursive joins intact for
 * written text, wraps the active word safely so lines never jump mid-word,
 * and shows the subtle moving pen nib right at the writing tip.
 */
function HandwrittenTextLine({
  text,
  writtenCount,
  isActivelyWriting,
  className,
  id,
}: {
  text: string;
  writtenCount: number;
  isActivelyWriting: boolean;
  className: string;
  id?: string;
}) {
  const clamped = Math.max(0, Math.min(text.length, writtenCount));

  if (clamped >= text.length) {
    return (
      <p id={id} className={className}>
        {text}
      </p>
    );
  }

  if (clamped === 0) {
    return (
      <p id={id} className={className} aria-label={text}>
        {isActivelyWriting && <PenNibIndicator />}
        <span className="opacity-0 select-none" aria-hidden="true">
          {text}
        </span>
      </p>
    );
  }

  let wordStart = clamped;
  if (text[clamped - 1] !== ' ') {
    wordStart = clamped - 1;
    while (wordStart > 0 && text[wordStart - 1] !== ' ') {
      wordStart--;
    }
  }

  let wordEnd = clamped;
  while (wordEnd < text.length && text[wordEnd] !== ' ') {
    wordEnd++;
  }

  const beforeActiveWord = text.slice(0, wordStart);
  const activeWordWritten = text.slice(wordStart, clamped);
  const activeWordUnwritten = text.slice(clamped, wordEnd);
  const afterActiveWord = text.slice(wordEnd);

  const activeWordPrefix =
    activeWordWritten.length > 1 ? activeWordWritten.slice(0, -1) : '';
  const freshInkGlyph =
    activeWordWritten.length > 0 ? activeWordWritten.slice(-1) : '';

  return (
    <p id={id} className={className} aria-label={text}>
      {beforeActiveWord}
      <span className="inline whitespace-nowrap">
        {activeWordPrefix}
        {freshInkGlyph && (
          <motion.span
            key={clamped}
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          >
            {freshInkGlyph}
          </motion.span>
        )}
        {isActivelyWriting && <PenNibIndicator />}
        {activeWordUnwritten && (
          <span className="opacity-0 select-none" aria-hidden="true">
            {activeWordUnwritten}
          </span>
        )}
      </span>
      {afterActiveWord && (
        <span className="opacity-0 select-none" aria-hidden="true">
          {afterActiveWord}
        </span>
      )}
    </p>
  );
}

export function VintageLetterScreen({
  onLock,
  onContinue,
  onBack,
}: VintageLetterScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const clipId = useId().replace(/:/g, '');

  const [stage, setStage] = useState<LetterStage>(
    reduced ? 'reading' : 'folded'
  );
  const [cursor, setCursor] = useState<WritingCursorTarget>(
    reduced ? { section: 'done' } : { section: 'idle' }
  );
  const [actionsVisible, setActionsVisible] = useState(reduced);

  const [openingText, setOpeningText] = useState<string>(
    VINTAGE_LETTER_CONFIG.opening
  );
  const [lines, setLines] = useState<string[]>([...VINTAGE_LETTER_CONFIG.lines]);
  const [closingText, setClosingText] = useState<string>(
    VINTAGE_LETTER_CONFIG.closing
  );

  const [isEditing, setIsEditing] = useState(false);
  const [openingDraft, setOpeningDraft] = useState<string>(
    VINTAGE_LETTER_CONFIG.opening
  );
  const [linesDraft, setLinesDraft] = useState<string>(() =>
    VINTAGE_LETTER_CONFIG.lines.join('\n')
  );
  const [closingDraft, setClosingDraft] = useState<string>(
    VINTAGE_LETTER_CONFIG.closing
  );

  const timersRef = useRef<number[]>([]);
  const reducedOnMountRef = useRef(reduced);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Sequence: Folded letter -> gentle unfolding -> progressive handwriting (opening -> sentence 1..N -> closing signature) -> Continue
  useEffect(() => {
    if (isEditing) return;

    clearTimers();

    if (reducedOnMountRef.current || reduced) {
      setStage('reading');
      setCursor({ section: 'done' });
      setActionsVisible(true);
      return;
    }

    setStage('folded');
    setCursor({ section: 'idle' });
    setActionsVisible(false);

    let cancelled = false;
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timersRef.current.push(id);
    };

    const writeTextProgressively = (
      text: string,
      onProgress: (count: number) => void,
      onDone: () => void
    ) => {
      if (text.length === 0) {
        onProgress(0);
        onDone();
        return;
      }

      let index = 0;
      const step = () => {
        if (cancelled) return;
        index += 1;
        onProgress(index);
        if (index >= text.length) {
          onDone();
          return;
        }
        const delay = getNaturalCharDelay(
          text[index - 1],
          text[index],
          VINTAGE_LETTER_CONFIG.charDelayMs
        );
        schedule(step, delay);
      };
      onProgress(0);
      schedule(step, 90);
    };

    const writeSentenceAt = (lineIdx: number) => {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        schedule(() => {
          writeTextProgressively(
            closingText,
            (count) => setCursor({ section: 'closing', charCount: count }),
            () => {
              schedule(() => {
                setCursor({ section: 'done' });
                setActionsVisible(true);
              }, 420);
            }
          );
        }, VINTAGE_LETTER_CONFIG.closingPauseMs);
        return;
      }

      const sentence = lines[lineIdx];
      writeTextProgressively(
        sentence,
        (count) =>
          setCursor({ section: 'line', lineIndex: lineIdx, charCount: count }),
        () => {
          schedule(
            () => writeSentenceAt(lineIdx + 1),
            VINTAGE_LETTER_CONFIG.sentencePauseMs
          );
        }
      );
    };

    const unfoldDelay = 950;
    const unfoldDuration = 1150;

    schedule(() => {
      setStage('unfolding');
    }, unfoldDelay);

    schedule(() => {
      setStage('reading');
      writeTextProgressively(
        openingText,
        (count) => setCursor({ section: 'opening', charCount: count }),
        () => {
          schedule(() => writeSentenceAt(0), 460);
        }
      );
    }, unfoldDelay + unfoldDuration + 250);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [clearTimers, closingText, isEditing, lines, openingText, reduced]);

  const handleSaveEdit = useCallback(() => {
    const parsedLines = linesDraft
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    setOpeningText(openingDraft.trim() || VINTAGE_LETTER_CONFIG.opening);
    setLines(
      parsedLines.length > 0 ? parsedLines : [...VINTAGE_LETTER_CONFIG.lines]
    );
    setClosingText(closingDraft.trim() || VINTAGE_LETTER_CONFIG.closing);
    setIsEditing(false);
  }, [closingDraft, linesDraft, openingDraft]);

  const isFoldedStage = stage === 'folded';
  const isUnfoldingOrReading = stage === 'unfolding' || stage === 'reading';

  const getOpeningWrittenCount = (): number => {
    if (cursor.section === 'idle') return 0;
    if (cursor.section === 'opening') return cursor.charCount;
    return openingText.length;
  };

  const getLineWrittenCount = (index: number): number => {
    if (cursor.section === 'idle' || cursor.section === 'opening') return 0;
    if (cursor.section === 'line') {
      if (index < cursor.lineIndex) return lines[index].length;
      if (index === cursor.lineIndex) return cursor.charCount;
      return 0;
    }
    return lines[index].length;
  };

  const getClosingWrittenCount = (): number => {
    if (cursor.section === 'closing') return cursor.charCount;
    if (cursor.section === 'done') return closingText.length;
    return 0;
  };

  const isClosingStarted =
    cursor.section === 'closing' || cursor.section === 'done';

  return (
    <motion.div
      key="vintage-letter-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden text-[#3B2C22]"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #F1E7D6 0%, #E8D9C2 54%, #DCC7A8 100%)',
      }}
    >
      {/* Very soft golden ambient lighting & delicate antique edge vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255, 250, 238, 0.58) 0%, rgba(236, 214, 174, 0.16) 44%, rgba(220, 199, 168, 0.44) 100%)',
          boxShadow: 'inset 0 0 110px rgba(176, 144, 102, 0.34)',
        }}
      />
      {/* Subtle parchment-inspired texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.038] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='letterParchmentWash'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23letterParchmentWash)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Tiny golden stars and delicate decorative backdrop accents */}
      <StationeryBackdropAccents reduced={reduced} />

      {/* ClipPaths matching our irregular hand-torn illustrated paper edges */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath
            id={`tornMainPaper-${clipId}`}
            clipPathUnits="objectBoundingBox"
          >
            <path d={MAIN_TORN_PAPER_PATH} />
          </clipPath>
          <clipPath
            id={`tornFoldedPacket-${clipId}`}
            clipPathUnits="objectBoundingBox"
          >
            <path d={FOLDED_PACKET_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Minimal Top Bar */}
      <header className="relative z-30 mx-auto flex w-full max-w-[1080px] items-center justify-between gap-4 px-5 pt-5 pb-2 sm:px-10 sm:pt-7">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                clearTimers();
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

      {/* Centered Illustrated Stationery Collage Stage */}
      <main
        className="relative z-10 flex flex-1 items-center justify-center px-4 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-12"
        style={{ perspective: '1500px' }}
      >
        <AnimatePresence mode="wait">
          {isFoldedStage ? (
            /* ILLUSTRATED FOLDED HANDMADE PACKET */
            <motion.div
              key="folded-letter-packet"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                scaleY: 1.15,
                y: -8,
                transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex w-full max-w-[430px] flex-col items-center justify-center"
            >
              {/* Small peeking handwritten collage slip under folded packet */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-1 -translate-x-2 translate-y-2 -rotate-[3.5deg] sm:-translate-x-4 sm:translate-y-3"
                style={{
                  filter: 'drop-shadow(0 10px 20px rgba(96, 70, 44, 0.18))',
                }}
              >
                <svg
                  viewBox="0 0 1 1"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <path
                    d={FOLDED_PACKET_PATH}
                    fill="#E3CEAE"
                    stroke="#9B7E5E"
                    strokeOpacity="0.72"
                    strokeWidth="1.25"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* Small botanical sprig tucked under upper-right corner of folded packet */}
              <div className="pointer-events-none absolute -top-10 -right-7 z-20 rotate-6 opacity-90 sm:-top-12 sm:-right-9">
                <IllustratedBotanicalBranchTopRight />
              </div>

              <div
                className="relative z-10 w-full"
                style={{
                  filter:
                    'drop-shadow(0 18px 32px rgba(88, 63, 38, 0.22)) drop-shadow(0 5px 12px rgba(88, 63, 38, 0.12))',
                }}
              >
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden"
                  style={{
                    clipPath: `url(#tornFoldedPacket-${clipId})`,
                  }}
                >
                  {/* Illustrated warm ivory paper fill & hand-inked outline */}
                  <svg
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <radialGradient
                        id={`foldedPaperGrad-${clipId}`}
                        cx="0.5"
                        cy="0.42"
                        r="0.68"
                      >
                        <stop offset="0%" stopColor="#FFFDF8" />
                        <stop offset="68%" stopColor="#FAF3E4" />
                        <stop offset="100%" stopColor="#F2E6D1" />
                      </radialGradient>
                    </defs>
                    <path
                      d={FOLDED_PACKET_PATH}
                      fill={`url(#foldedPaperGrad-${clipId})`}
                      stroke="#9F8364"
                      strokeWidth="1.4"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* Soft illustrated flap fold */}
                  <svg
                    viewBox="0 0 400 250"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    <path
                      d="M 8 10 L 200 138 L 392 10"
                      fill="#FAF2E2"
                      fillOpacity="0.68"
                      stroke="#AE9272"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Tiny corner sparkle illustration */}
                    <path
                      d="M42 206 L44 212 L50 214 L44 216 L42 222 L40 216 L34 214 L40 212 Z"
                      fill="#CE9D52"
                      fillOpacity="0.65"
                    />
                  </svg>

                  {/* Illustrated wax seal centering the folded envelope */}
                  <div className="absolute top-[54%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <IllustratedWaxSeal size="sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* UNFOLDED ILLUSTRATED HANDMADE STATIONERY COLLAGE */
            <motion.section
              key="unfolded-vintage-letter"
              aria-labelledby="vintage-letter-opening"
              initial={
                reduced
                  ? { opacity: 0 }
                  : {
                      opacity: 0.35,
                      scaleY: 0.5,
                      rotateX: -24,
                      y: 10,
                    }
              }
              animate={{
                opacity: 1,
                scaleY: 1,
                rotateX: 0,
                y: 0,
              }}
              transition={{
                duration: reduced ? 0.25 : 1.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: 'center center' }}
              className="relative mx-auto w-full max-w-[660px]"
            >
              {/* Layered secondary handwritten parchment & kraft collage underneath */}
              <SecondaryCollageLayer />

              {/* Decorative illustrated golden pin fastening the top of the letter */}
              <div className="pointer-events-none absolute -top-5 left-1/2 z-40 -translate-x-1/2 sm:-top-6">
                <DecorativeGoldenPin />
              </div>

              {/* Lower-left hand-drawn dried flower & botanical twig peeking out */}
              <div className="pointer-events-none absolute -bottom-5 -left-4 z-30 -rotate-6 opacity-90 sm:-bottom-7 sm:-left-8">
                <IllustratedBotanicalSprigBottomLeft />
              </div>

              {/* Upper-right hand-drawn botanical branch & pressed flower illustration */}
              <div className="pointer-events-none absolute -top-6 -right-4 z-30 rotate-3 opacity-90 sm:-top-8 sm:-right-7">
                <IllustratedBotanicalBranchTopRight />
              </div>

              {/* Main Irregular Torn-Edge Ivory Handmade Paper Sheet */}
              <div
                className="relative z-20"
                style={{
                  filter:
                    'drop-shadow(0 20px 36px rgba(88, 63, 38, 0.22)) drop-shadow(0 5px 12px rgba(88, 63, 38, 0.12))',
                }}
              >
                <article
                  className="relative flex min-h-[600px] w-full flex-col justify-between overflow-hidden px-7 pt-14 pb-12 sm:min-h-[680px] sm:px-14 sm:pt-16 sm:pb-14"
                  style={{
                    clipPath: `url(#tornMainPaper-${clipId})`,
                  }}
                >
                  {/* Illustrated handmade ivory paper surface, soft deckle feathering & ink edge */}
                  <svg
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <radialGradient
                        id={`ivoryPaperWash-${clipId}`}
                        cx="0.48"
                        cy="0.38"
                        r="0.72"
                      >
                        <stop offset="0%" stopColor="#FFFDF8" />
                        <stop offset="60%" stopColor="#FAF4E6" />
                        <stop offset="100%" stopColor="#F2E7D3" />
                      </radialGradient>
                    </defs>
                    <path
                      d={MAIN_TORN_PAPER_PATH}
                      fill={`url(#ivoryPaperWash-${clipId})`}
                      stroke="#E5D3B3"
                      strokeWidth="3.2"
                      strokeOpacity="0.65"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={MAIN_TORN_PAPER_PATH}
                      fill="none"
                      stroke="#A58867"
                      strokeWidth="1.25"
                      strokeOpacity="0.88"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* Soft handmade watercolor-paper fiber wash (non-photorealistic) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.052]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='illustratedPaperGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23illustratedPaperGrain)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Subtle cotton paper fibers, pulp flecks & gentle handmade corner tinting */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 660 790"
                    preserveAspectRatio="none"
                    fill="none"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    {/* Soft warm tea-wash imperfections near edges */}
                    <ellipse cx="90" cy="110" rx="88" ry="64" fill="#DFC8A6" fillOpacity="0.16" />
                    <ellipse cx="575" cy="690" rx="95" ry="72" fill="#D9BF99" fillOpacity="0.18" />
                    <ellipse cx="565" cy="145" rx="70" ry="52" fill="#E3CEAE" fillOpacity="0.13" />

                    {/* Delicate curved cotton fibers scattered along margins */}
                    <path d="M24 148 Q31 143 36 149" stroke="#9F8362" strokeOpacity="0.24" strokeWidth="0.85" strokeLinecap="round" />
                    <path d="M58 642 Q66 648 73 643" stroke="#9F8362" strokeOpacity="0.22" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M624 218 Q617 226 623 233" stroke="#9F8362" strokeOpacity="0.24" strokeWidth="0.85" strokeLinecap="round" />
                    <path d="M608 548 Q616 553 621 547" stroke="#9F8362" strokeOpacity="0.21" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M182 26 Q188 32 195 27" stroke="#9F8362" strokeOpacity="0.22" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M442 758 Q450 752 456 758" stroke="#9F8362" strokeOpacity="0.24" strokeWidth="0.85" strokeLinecap="round" />
                    <path d="M36 420 Q42 426 37 434" stroke="#FFFDF8" strokeOpacity="0.55" strokeWidth="0.9" strokeLinecap="round" />
                    <path d="M628 386 Q622 394 627 401" stroke="#FFFDF8" strokeOpacity="0.5" strokeWidth="0.9" strokeLinecap="round" />

                    {/* Tiny organic handmade pulp specks */}
                    <circle cx="44" cy="96" r="1.15" fill="#997A57" fillOpacity="0.22" />
                    <circle cx="31" cy="276" r="0.9" fill="#997A57" fillOpacity="0.2" />
                    <circle cx="52" cy="712" r="1.2" fill="#997A57" fillOpacity="0.22" />
                    <circle cx="618" cy="108" r="1.05" fill="#997A57" fillOpacity="0.2" />
                    <circle cx="632" cy="462" r="1.15" fill="#997A57" fillOpacity="0.22" />
                    <circle cx="594" cy="744" r="1" fill="#997A57" fillOpacity="0.2" />
                    <circle cx="298" cy="22" r="0.95" fill="#997A57" fillOpacity="0.2" />
                    <circle cx="348" cy="766" r="1.1" fill="#997A57" fillOpacity="0.22" />
                  </svg>

                  {/* Subtle warm sepia edge-wash tint along the torn paper border */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      boxShadow:
                        'inset 0 0 36px rgba(176, 143, 102, 0.2), inset 0 0 10px rgba(138, 104, 68, 0.12)',
                    }}
                  />

                  {/* Delicate horizontal illustrated journal crease marks */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-8 top-[34%] h-[1px] bg-gradient-to-r from-transparent via-[#BDA382]/22 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-8 top-[68%] h-[1px] bg-gradient-to-r from-transparent via-[#BDA382]/18 to-transparent"
                  />

                  <div className="relative z-20 flex flex-1 flex-col">
                    {isEditing ? (
                      /* Editable mode for replacing placeholder text later */
                      <div className="space-y-4 text-left">
                        <div>
                          <label
                            htmlFor="letter-opening-input"
                            className="mb-1.5 block text-[12.5px] font-medium text-[#6B5747]"
                          >
                            Opening line
                          </label>
                          <input
                            id="letter-opening-input"
                            type="text"
                            value={openingDraft}
                            onChange={(e) => setOpeningDraft(e.target.value)}
                            className="font-handwritten w-full rounded-lg border border-[#D4C3AA] bg-[#FCF8EE] px-4 py-2 text-[1.45rem] text-[#3B2C22] focus:border-[#9B7F62] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="letter-lines-input"
                            className="mb-1.5 block text-[12.5px] font-medium text-[#6B5747]"
                          >
                            Letter lines (one line per sentence or thought)
                          </label>
                          <textarea
                            id="letter-lines-input"
                            rows={6}
                            value={linesDraft}
                            onChange={(e) => setLinesDraft(e.target.value)}
                            className="font-handwritten w-full rounded-lg border border-[#D4C3AA] bg-[#FCF8EE] p-4 text-[1.35rem] leading-[1.6] text-[#3B2C22] focus:border-[#9B7F62] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="letter-closing-input"
                            className="mb-1.5 block text-[12.5px] font-medium text-[#6B5747]"
                          >
                            Closing line
                          </label>
                          <input
                            id="letter-closing-input"
                            type="text"
                            value={closingDraft}
                            onChange={(e) => setClosingDraft(e.target.value)}
                            className="font-handwritten w-full rounded-lg border border-[#D4C3AA] bg-[#FCF8EE] px-4 py-2 text-[1.45rem] text-[#3B2C22] focus:border-[#9B7F62] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOpeningDraft(openingText);
                              setLinesDraft(lines.join('\n'));
                              setClosingDraft(closingText);
                              setIsEditing(false);
                            }}
                            className="min-h-[40px] cursor-pointer rounded-lg px-4 py-2 text-[13px] font-medium text-[#6B5747] transition-colors hover:text-[#3B2C22]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="min-h-[40px] cursor-pointer rounded-lg border border-[#CEBC9E] bg-[#EFE3CE] px-5 py-2 text-[13px] font-medium text-[#3B2C22] transition-colors hover:bg-[#E5D5B9]"
                          >
                            Save &amp; Replay
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Spacious Handwritten Letter Reading Layout scaled proportionally to taller sheet */
                      <div className="flex flex-1 flex-col justify-between text-left">
                        <div>
                          {/* Small handwritten opening at the top */}
                          <HandwrittenTextLine
                            id="vintage-letter-opening"
                            text={openingText}
                            writtenCount={
                              isUnfoldingOrReading ? getOpeningWrittenCount() : 0
                            }
                            isActivelyWriting={cursor.section === 'opening'}
                            className="font-handwritten pr-14 text-[clamp(1.55rem,3.6vw,2rem)] leading-[1.3] font-medium text-[#544032] sm:pr-20"
                          />

                          {/* Message sentences written sequentially character by character */}
                          <div
                            className="mt-7 flex flex-col space-y-5 sm:mt-9 sm:space-y-6"
                            aria-live="polite"
                          >
                            {lines.map((line, index) => (
                              <HandwrittenTextLine
                                key={`${index}-${line.slice(0, 14)}`}
                                text={line}
                                writtenCount={getLineWrittenCount(index)}
                                isActivelyWriting={
                                  cursor.section === 'line' &&
                                  cursor.lineIndex === index
                                }
                                className="font-handwritten text-[clamp(1.38rem,3.2vw,1.72rem)] leading-[1.52] text-[#3B2C22]"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Bottom area: Handwritten closing signature, illustrated wax seal near bottom corner, and Continue button */}
                        <div className="mt-10 flex flex-col gap-5 pt-3 sm:mt-12 sm:gap-6">
                          <motion.div
                            initial={false}
                            animate={{ opacity: isClosingStarted ? 1 : 0 }}
                            transition={{
                              duration: reduced ? 0.2 : 0.45,
                              ease: 'easeOut',
                            }}
                            className="relative flex items-end justify-between gap-4 border-t border-dashed border-[#CBB394]/70 pt-6"
                          >
                            <div className="min-w-0 flex-1 pb-1">
                              <HandwrittenTextLine
                                text={closingText}
                                writtenCount={getClosingWrittenCount()}
                                isActivelyWriting={cursor.section === 'closing'}
                                className="font-handwritten text-[clamp(1.55rem,3.4vw,1.95rem)] leading-[1.25] font-medium text-[#4A382B]"
                              />
                            </div>

                            {/* Vintage illustrated wax seal tucked near bottom-right corner */}
                            <div className="relative flex shrink-0 items-center pr-1">
                              <IllustratedWaxSeal size="md" />
                            </div>
                          </motion.div>

                          <motion.div
                            aria-hidden={!actionsVisible}
                            initial={false}
                            animate={
                              actionsVisible
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: reduced ? 0 : 8 }
                            }
                            transition={{
                              duration: reduced ? 0.2 : 0.65,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={`flex flex-wrap items-center justify-between gap-4 pt-1 ${
                              actionsVisible
                                ? 'pointer-events-auto'
                                : 'pointer-events-none select-none'
                            }`}
                          >
                            <button
                              type="button"
                              tabIndex={actionsVisible ? 0 : -1}
                              onClick={() => {
                                setOpeningDraft(openingText);
                                setLinesDraft(lines.join('\n'));
                                setClosingDraft(closingText);
                                setIsEditing(true);
                              }}
                              className="min-h-[36px] cursor-pointer text-[12px] font-medium text-[#7B6652] underline decoration-[#CBB89D] underline-offset-4 transition-colors hover:text-[#3B2C22]"
                            >
                              Edit letter
                            </button>

                            {/* Wax-seal-inspired Continue button */}
                            <motion.button
                              type="button"
                              tabIndex={actionsVisible ? 0 : -1}
                              onClick={() => {
                                clearTimers();
                                onContinue();
                              }}
                              whileHover={reduced ? undefined : { y: -1.5 }}
                              whileTap={reduced ? undefined : { scale: 0.975 }}
                              transition={{
                                duration: 0.18,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#B56E63]/45 px-6 py-2.5 text-[13.5px] font-medium tracking-[0.04em] text-[#FAF3EA] shadow-[0_10px_22px_-10px_rgba(78,24,18,0.62),inset_0_1px_2px_rgba(255,220,210,0.22)] transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A85A50] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBD8] whitespace-nowrap shrink-0"
                              style={{
                                background:
                                  'radial-gradient(circle at 32% 28%, #9B463E 0%, #7C312A 62%, #63221C 100%)',
                              }}
                            >
                              <span>Continue</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 stroke-[1.9]"
                                aria-hidden="true"
                              />
                            </motion.button>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
