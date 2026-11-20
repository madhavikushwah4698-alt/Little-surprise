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
import type { UnlockMode } from '../types';

interface InteractiveWelcomeProps {
  unlockMode?: UnlockMode;
  onProceed: () => void;
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

const GENTLE_LATER_MESSAGES = [
  "Take your time — I'll be waiting right here for you ♡",
  "Are you sure? There's a quiet little note waiting inside ♡",
  'Whenever you are ready, just tap yes ♡',
];

function BabysBreathBouquet({
  isAccepted,
  reducedMotion,
}: {
  isAccepted: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      animate={
        reducedMotion
          ? {}
          : isAccepted
            ? { y: [0, -6, 0], scale: [1, 1.03, 1] }
            : { y: [0, -5, 0] }
      }
      transition={
        isAccepted
          ? { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
          : { duration: 5.4, repeat: Infinity, ease: 'easeInOut' }
      }
      className="relative mx-auto flex w-[180px] items-center justify-center sm:w-[205px]"
    >
      {/* Soft warm halo behind bouquet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full bg-[#EFE8DD]/75 blur-2xl"
      />

      <svg
        viewBox="0 0 220 230"
        fill="none"
        className="relative z-10 h-auto w-full overflow-visible"
        role="img"
        aria-label="Delicate hand-drawn baby's-breath flower bouquet tied with a ribbon and a tiny heart"
      >
        {/* Subtle parchment backdrop oval */}
        <ellipse
          cx="110"
          cy="112"
          rx="74"
          ry="84"
          fill="#EFE8DD"
          opacity="0.38"
        />

        {/* Delicate olive-toned leaves (echoing hero florals) */}
        <path
          d="M108 148 C92 126, 75 112, 62 96"
          stroke="#A18C77"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M78 113 C68 109, 64 102, 69 98 C75 95, 81 103, 78 113 Z"
          fill="#E5D9C9"
          stroke="#A18C77"
          strokeWidth="1.15"
        />
        <path
          d="M90 125 C80 124, 74 118, 78 113 C84 110, 91 116, 90 125 Z"
          fill="#EFE8DD"
          stroke="#A18C77"
          strokeWidth="1.15"
        />

        <path
          d="M112 148 C130 125, 147 110, 160 93"
          stroke="#A18C77"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M142 112 C152 108, 156 101, 151 97 C145 94, 139 102, 142 112 Z"
          fill="#E5D9C9"
          stroke="#A18C77"
          strokeWidth="1.15"
        />
        <path
          d="M130 126 C140 125, 146 119, 142 114 C136 111, 129 117, 130 126 Z"
          fill="#EFE8DD"
          stroke="#A18C77"
          strokeWidth="1.15"
        />

        {/* Main baby's-breath branching stems */}
        <g stroke="#8E7964" strokeWidth="1.25" strokeLinecap="round">
          {/* Center stem & forks */}
          <path d="M110 198 C110 170, 110 138, 110 72" />
          <path d="M110 118 C102 98, 95 82, 88 60" />
          <path d="M110 105 C119 88, 126 75, 133 56" />
          <path d="M110 86 C105 70, 102 58, 104 42" />
          <path d="M110 84 C117 70, 120 58, 119 45" />

          {/* Left spray */}
          <path d="M108 156 C101 134, 88 106, 70 72" />
          <path d="M84 100 C74 88, 63 82, 53 76" />
          <path d="M90 112 C88 94, 83 80, 76 64" />

          {/* Right spray */}
          <path d="M112 156 C119 134, 133 106, 152 74" />
          <path d="M137 100 C147 89, 158 83, 168 78" />
          <path d="M130 112 C133 95, 138 80, 144 63" />

          {/* Lower stems below bow */}
          <path d="M107 158 C104 176, 102 189, 100 197" />
          <path d="M113 158 C116 176, 119 189, 121 196" />
        </g>

        {/* Baby's-breath tiny blossom clusters */}
        {[
          { x: 104, y: 42, r: 4.5 },
          { x: 119, y: 45, r: 4.2 },
          { x: 88, y: 60, r: 4.6 },
          { x: 133, y: 56, r: 4.4 },
          { x: 110, y: 70, r: 4.8 },
          { x: 96, y: 74, r: 3.8 },
          { x: 123, y: 72, r: 3.8 },
          { x: 76, y: 64, r: 4.2 },
          { x: 70, y: 72, r: 4.6 },
          { x: 53, y: 76, r: 4.0 },
          { x: 64, y: 86, r: 3.6 },
          { x: 144, y: 63, r: 4.2 },
          { x: 152, y: 74, r: 4.6 },
          { x: 168, y: 78, r: 4.0 },
          { x: 156, y: 88, r: 3.6 },
          { x: 86, y: 92, r: 4.0 },
          { x: 134, y: 92, r: 4.0 },
          { x: 103, y: 95, r: 3.9 },
          { x: 118, y: 96, r: 3.7 },
          { x: 74, y: 106, r: 3.5 },
          { x: 146, y: 106, r: 3.5 },
        ].map((blossom, idx) => (
          <g key={idx}>
            {/* Outer delicate petal ring */}
            <circle
              cx={blossom.x}
              cy={blossom.y}
              r={blossom.r + 1.4}
              fill="#FFFFFF"
              stroke="#D8C9B6"
              strokeWidth="1"
            />
            {/* Soft petal scalloped accents */}
            <circle
              cx={blossom.x - blossom.r * 0.45}
              cy={blossom.y - blossom.r * 0.35}
              r={blossom.r * 0.45}
              fill="#FAF7F2"
            />
            <circle
              cx={blossom.x + blossom.r * 0.45}
              cy={blossom.y + blossom.r * 0.3}
              r={blossom.r * 0.4}
              fill="#FAF7F2"
            />
            {/* Warm cream-taupe blossom center */}
            <circle
              cx={blossom.x}
              cy={blossom.y}
              r={1.35}
              fill="#C7B29B"
            />
          </g>
        ))}

        {/* Delicate linen ribbon bow tying the stems */}
        <g stroke="#7E6956" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          {/* Left loop */}
          <path
            d="M108 156 C94 149, 86 155, 92 162 C97 167, 105 161, 108 156 Z"
            fill="#EFE8DD"
          />
          {/* Right loop */}
          <path
            d="M112 156 C126 149, 134 155, 128 162 C123 167, 115 161, 112 156 Z"
            fill="#EFE8DD"
          />
          {/* Ribbon tails */}
          <path d="M108 159 C103 170, 97 178, 92 184" fill="none" />
          <path d="M112 159 C117 170, 123 178, 128 184" fill="none" />
          {/* Center knot */}
          <circle cx="110" cy="156.5" r="3.4" fill="#E5D9C9" />
        </g>

        {/* Tiny hand-drawn heart nestled beside the bouquet */}
        <motion.path
          animate={
            reducedMotion
              ? {}
              : isAccepted
                ? { scale: [1, 1.25, 1.1] }
                : { scale: [1, 1.08, 1] }
          }
          transition={{
            duration: isAccepted ? 0.65 : 2.6,
            repeat: isAccepted ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '148px 142px' }}
          d="M148 150 C148 150, 139 144.2, 139 138.8 C139 135.8, 141.3 133.8, 144 133.8 C145.9 133.8, 147.2 134.9, 148 136.4 C148.8 134.9, 150.1 133.8, 152 133.8 C154.7 133.8, 157 135.8, 157 138.8 C157 144.2, 148 150, 148 150 Z"
          fill="#B37D6B"
          stroke="#7E5649"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

function MaybeLaterCharacter({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
      animate={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 1, scale: 1, y: [0, -4, 0] }
      }
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : {
              opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      className="relative mx-auto flex w-[195px] items-center justify-center sm:w-[220px]"
    >
      {/* Soft warm halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full bg-[#F3EDE4]/90 blur-2xl"
      />

      <svg
        viewBox="0 0 230 225"
        fill="none"
        className="relative z-10 h-auto w-full overflow-visible"
        role="img"
        aria-label="Cute hand-drawn chubby teddy bear with worried eyebrows, sparkling eyes, and rosy cheeks holding a sign with an X symbol"
      >
        {/* Soft parchment backdrop oval */}
        <ellipse
          cx="115"
          cy="118"
          rx="82"
          ry="84"
          fill="#F3EDE4"
          opacity="0.45"
        />

        {/* Delicate antique-gold sparkles */}
        <motion.path
          animate={
            reducedMotion
              ? {}
              : { opacity: [0.45, 0.95, 0.45], scale: [0.9, 1.1, 0.9] }
          }
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '36px 84px' }}
          d="M36 76 C36.6 80.8, 39.2 83.4, 44 84 C39.2 84.6, 36.6 87.2, 36 92 C35.4 87.2, 32.8 84.6, 28 84 C32.8 83.4, 35.4 80.8, 36 76 Z"
          stroke="#C2A376"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />

        <motion.path
          animate={
            reducedMotion
              ? {}
              : { opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.08, 0.9] }
          }
          transition={{ duration: 3.4, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '194px 104px' }}
          d="M194 96 C194.6 100.8, 197.2 103.4, 202 104 C197.2 104.6, 194.6 107.2, 194 112 C193.4 107.2, 190.8 104.6, 186 104 C190.8 103.4, 193.4 100.8, 194 96 Z"
          stroke="#C2A376"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />

        <path
          d="M52 146 L52 152 M49 149 L55 149"
          stroke="#C2A376"
          strokeWidth="1.15"
          strokeLinecap="round"
        />

        {/* Tiny floating dusty-rose hearts */}
        <motion.path
          animate={
            reducedMotion
              ? {}
              : { y: [0, -2.5, 0], opacity: [0.75, 1, 0.75] }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          d="M185 56 C185 56, 178.5 51.8, 178.5 47.9 C178.5 45.6, 180.3 44.1, 182.2 44.1 C183.6 44.1, 184.5 44.9, 185 46 C185.5 44.9, 186.4 44.1, 187.8 44.1 C189.7 44.1, 191.5 45.6, 191.5 47.9 C191.5 51.8, 185 56, 185 56 Z"
          fill="#EAD3CB"
          stroke="#B98E80"
          strokeWidth="1.05"
          strokeLinejoin="round"
        />

        <path
          d="M44 46 C44 46, 39.5 43.1, 39.5 40.4 C39.5 38.8, 40.7 37.8, 42 37.8 C43 37.8, 43.6 38.4, 44 39.1 C44.4 38.4, 45 37.8, 46 37.8 C47.3 37.8, 48.5 38.8, 48.5 40.4 C48.5 43.1, 44 46, 44 46 Z"
          fill="#F0DDD6"
          stroke="#B98E80"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Soft ground shadow beneath teddy */}
        <ellipse cx="115" cy="198" rx="44" ry="6.5" fill="#E8DFD2" opacity="0.7" />

        {/* Teddy Bear Character */}
        <g
          stroke="#7E6956"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Rounded Chubby Ears */}
          <circle cx="72" cy="52" r="14.5" fill="#F6EFE5" />
          <circle
            cx="72.5"
            cy="52.5"
            r="7.8"
            fill="#EAD2CA"
            stroke="#C39E92"
            strokeWidth="1.05"
          />
          <circle cx="158" cy="52" r="14.5" fill="#F6EFE5" />
          <circle
            cx="157.5"
            cy="52.5"
            r="7.8"
            fill="#EAD2CA"
            stroke="#C39E92"
            strokeWidth="1.05"
          />

          {/* Tiny nervous sweat drop beside right ear */}
          <path
            d="M164 65.5 C164 65.5, 161.2 70.6, 161.2 72.7 C161.2 74.3, 162.4 75.5, 164 75.5 C165.6 75.5, 166.8 74.3, 166.8 72.7 C166.8 70.6, 164 65.5, 164 65.5 Z"
            fill="#FAF7F2"
            stroke="#8E7964"
            strokeWidth="1.05"
          />

          {/* Chubby Rounded Torso behind sign */}
          <path
            d="M84 116 C71 134, 68 164, 80 181 C89 192, 141 192, 150 181 C162 164, 159 134, 146 116"
            fill="#F8F2E8"
          />
          <ellipse
            cx="115"
            cy="160"
            rx="24"
            ry="20"
            fill="#FDFBF7"
            stroke="none"
            opacity="0.7"
          />
          {/* Subtle belly seam line below sign */}
          <path d="M115 174 L115 182" stroke="#8E7964" strokeWidth="1.2" />

          {/* Plump Rounded Feet */}
          <g>
            <ellipse
              cx="87"
              cy="186"
              rx="14.5"
              ry="10.5"
              transform="rotate(-14 87 186)"
              fill="#F6EFE5"
            />
            <ellipse
              cx="86"
              cy="187"
              rx="7.5"
              ry="5.2"
              transform="rotate(-14 86 187)"
              fill="#EAD2CA"
              stroke="none"
              opacity="0.85"
            />
            <ellipse
              cx="143"
              cy="186"
              rx="14.5"
              ry="10.5"
              transform="rotate(14 143 186)"
              fill="#F6EFE5"
            />
            <ellipse
              cx="144"
              cy="187"
              rx="7.5"
              ry="5.2"
              transform="rotate(14 144 187)"
              fill="#EAD2CA"
              stroke="none"
              opacity="0.85"
            />
          </g>

          {/* Big Cute Rounded Head with chubby cheeks */}
          <path
            d="M115 41 C146 41, 165 59, 166 84 C167 109, 148 124, 115 124 C82 124, 63 109, 64 84 C65 59, 84 41, 115 41 Z"
            fill="#FAF7F2"
          />

          {/* Subtle cream shading along lower head */}
          <path
            d="M74 103 C86 117, 144 117, 156 103"
            fill="none"
            stroke="#E9DEC9"
            strokeWidth="2.5"
            opacity="0.65"
          />

          {/* Soft Rosy Blush on Both Cheeks */}
          <ellipse
            cx="81"
            cy="95"
            rx="9.5"
            ry="5.5"
            fill="#E7C1B6"
            stroke="none"
            opacity="0.78"
          />
          <ellipse
            cx="149"
            cy="95"
            rx="9.5"
            ry="5.5"
            fill="#E7C1B6"
            stroke="none"
            opacity="0.78"
          />
          {/* Tiny delicate blush lines */}
          <path
            d="M77 96 L79 93.5 M82 96.5 L84 94"
            stroke="#C89B8E"
            strokeWidth="0.9"
            opacity="0.85"
          />
          <path
            d="M146 96 L148 93.5 M151 96.5 L153 94"
            stroke="#C89B8E"
            strokeWidth="0.9"
            opacity="0.85"
          />

          {/* Gentle Worried Tilted Eyebrows */}
          <path
            d="M86.5 68.5 Q92 66.2 98 64.8"
            stroke="#8E7964"
            strokeWidth="1.2"
          />
          <path
            d="M132 64.8 Q138 66.2 143.5 68.5"
            stroke="#8E7964"
            strokeWidth="1.2"
          />

          {/* Clear, Round, Sparkling Eyes */}
          <g stroke="none">
            <circle cx="93.5" cy="82" r="5.1" fill="#3D2E25" />
            <circle cx="91.8" cy="80.2" r="1.5" fill="#FFFFFF" />
            <circle cx="95.1" cy="83.6" r="0.7" fill="#FFFFFF" />

            <circle cx="136.5" cy="82" r="5.1" fill="#3D2E25" />
            <circle cx="134.8" cy="80.2" r="1.5" fill="#FFFFFF" />
            <circle cx="138.1" cy="83.6" r="0.7" fill="#FFFFFF" />
          </g>

          {/* Soft Cream Muzzle, Small Rounded Nose & Sweet Gentle Smile */}
          <ellipse
            cx="115"
            cy="96"
            rx="15.5"
            ry="11.5"
            fill="#F4EDE2"
            stroke="#DFD2C0"
            strokeWidth="1.1"
          />
          <ellipse
            cx="115"
            cy="91.5"
            rx="4.1"
            ry="2.8"
            fill="#6F5749"
            stroke="none"
          />
          <path d="M115 94.4 L115 97.4" stroke="#7E6956" strokeWidth="1.15" />
          <path
            d="M108 97.5 Q111.5 101.2 115 97.6 Q118.5 101.2 122 97.5"
            stroke="#7E6956"
            strokeWidth="1.2"
          />

          {/* Little Arms reaching naturally to hold the sign */}
          <path
            d="M78 128 C67 134, 65 148, 74 152"
            fill="#F6EFE5"
            stroke="#7E6956"
            strokeWidth="1.35"
          />
          <path
            d="M152 128 C163 134, 165 148, 156 152"
            fill="#F6EFE5"
            stroke="#7E6956"
            strokeWidth="1.35"
          />

          {/* Handheld Little X Sign */}
          <g transform="rotate(-1.5 115 150)">
            <rect
              x="73"
              y="128"
              width="84"
              height="46"
              rx="10"
              fill="#FDFBF7"
              stroke="#8E7964"
              strokeWidth="1.35"
            />
            <rect
              x="78"
              y="133"
              width="74"
              height="36"
              rx="7"
              fill="none"
              stroke="#E2D6C5"
              strokeWidth="0.95"
              strokeDasharray="2.5 2.5"
            />

            {/* Clear Dusty Rose X Symbol */}
            <g stroke="#B98E80" strokeWidth="2.5" strokeLinecap="round">
              <path d="M107 143 L123 159" />
              <path d="M123 143 L107 159" />
            </g>
          </g>

          {/* Rounded Chubby Paws gripping the edges of the sign */}
          <g>
            <ellipse
              cx="74"
              cy="149"
              rx="8.5"
              ry="7"
              transform="rotate(-14 74 149)"
              fill="#FAF7F2"
            />
            <path
              d="M71 147.5 Q74 149 75.5 151.5"
              stroke="#D2C2AE"
              strokeWidth="0.95"
            />

            <ellipse
              cx="156"
              cy="147"
              rx="8.5"
              ry="7"
              transform="rotate(14 156 147)"
              fill="#FAF7F2"
            />
            <path
              d="M159 145.5 Q156 147 154.5 149.5"
              stroke="#D2C2AE"
              strokeWidth="0.95"
            />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

export function InteractiveWelcome({
  unlockMode = 'later-escapes',
  onProceed,
}: InteractiveWelcomeProps) {
  const prefersReducedMotion = useReducedMotion();
  const [laterCount, setLaterCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [escapeState, setEscapeState] = useState<EscapePositionState | null>(null);

  const timerRef = useRef<number | null>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const laterBtnRef = useRef<HTMLButtonElement>(null);
  const lastEscapeTimeRef = useRef(0);
  const lastTouchTimeRef = useRef(0);

  const shouldLaterEscape = unlockMode === 'later-escapes';
  const shouldYesEscape = unlockMode === 'yes-escapes';

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!escapeState) return;
    const handleResize = () => {
      const margin = 16;
      const minX = margin;
      const maxX = Math.max(margin, window.innerWidth - escapeState.width - margin);
      const minY = margin;
      const maxY = Math.max(margin, window.innerHeight - escapeState.height - margin);
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
  }, [escapeState]);

  const findSafeEscapeTarget = useCallback(
    (
      btnWidth: number,
      btnHeight: number,
      currentLeft: number,
      currentTop: number,
      pointerX?: number,
      pointerY?: number
    ) => {
      const margin = 16;
      const minX = margin;
      const maxX = Math.max(margin, window.innerWidth - btnWidth - margin);
      const minY = margin;
      const maxY = Math.max(margin, window.innerHeight - btnHeight - margin);

      const workingBtnEl = shouldYesEscape ? laterBtnRef.current : yesBtnRef.current;
      const workingRect = workingBtnEl?.getBoundingClientRect() ?? null;
      const contentRect = contentAreaRef.current?.getBoundingClientRect() ?? null;

      const px = pointerX ?? currentLeft + btnWidth / 2;
      const py = pointerY ?? currentTop + btnHeight / 2;

      for (let i = 0; i < 65; i++) {
        const candX = minX + Math.random() * (maxX - minX);
        const candY = minY + Math.random() * (maxY - minY);
        const candRect: RectBox = {
          left: candX,
          top: candY,
          right: candX + btnWidth,
          bottom: candY + btnHeight,
        };

        if (workingRect && rectsOverlap(candRect, workingRect, 16)) continue;
        if (contentRect && rectsOverlap(candRect, contentRect, 14)) continue;
        if (Math.hypot(candX - currentLeft, candY - currentTop) < 85) continue;
        if (distanceToRect(px, py, candRect) < 95) continue;

        return { x: candX, y: candY };
      }

      // Fallback for compact screens: avoid the working button and pick farthest from pointer
      let best = { x: minX, y: minY, score: -1 };
      for (let i = 0; i < 35; i++) {
        const candX = minX + Math.random() * (maxX - minX);
        const candY = minY + Math.random() * (maxY - minY);
        const candRect: RectBox = {
          left: candX,
          top: candY,
          right: candX + btnWidth,
          bottom: candY + btnHeight,
        };
        if (workingRect && rectsOverlap(candRect, workingRect, 12)) continue;
        const dist = distanceToRect(px, py, candRect);
        if (dist > best.score) {
          best = { x: candX, y: candY, score: dist };
        }
      }

      return { x: best.x, y: best.y };
    },
    [shouldYesEscape]
  );

  const triggerEscape = useCallback(
    (pointerX?: number, pointerY?: number, bypassCooldown = false) => {
      if (accepted) return;
      const now = Date.now();
      if (!bypassCooldown && now - lastEscapeTimeRef.current < 140) {
        return;
      }
      lastEscapeTimeRef.current = now;

      const escapingEl = shouldYesEscape ? yesBtnRef.current : laterBtnRef.current;
      if (!escapingEl) return;

      const rect = escapingEl.getBoundingClientRect();
      const target = findSafeEscapeTarget(
        rect.width,
        rect.height,
        rect.left,
        rect.top,
        pointerX,
        pointerY
      );

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
    [accepted, findSafeEscapeTarget, shouldYesEscape]
  );

  const handleMainMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (accepted) return;
      if (Date.now() - lastTouchTimeRef.current < 600) return;

      const escapingEl = shouldYesEscape ? yesBtnRef.current : laterBtnRef.current;
      if (!escapingEl) return;

      const rect = escapingEl.getBoundingClientRect();
      const dist = distanceToRect(event.clientX, event.clientY, rect);
      if (dist < 52) {
        triggerEscape(event.clientX, event.clientY);
      }
    },
    [accepted, shouldYesEscape, triggerEscape]
  );

  const handleYesClick = () => {
    if (accepted || shouldYesEscape) return;
    setAccepted(true);
    timerRef.current = window.setTimeout(() => {
      onProceed();
    }, prefersReducedMotion ? 450 : 1200);
  };

  const handleMaybeLater = () => {
    if (accepted || shouldLaterEscape) return;
    setLaterCount((prev) => prev + 1);
  };

  const gentleMessage =
    laterCount > 0
      ? GENTLE_LATER_MESSAGES[(laterCount - 1) % GENTLE_LATER_MESSAGES.length]
      : null;

  return (
    <motion.main
      key="interactive-welcome"
      onMouseMove={handleMainMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.99,
        transition: {
          duration: prefersReducedMotion ? 0.15 : 0.5,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#F8F5EF] px-6 py-12 text-[#352A23]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 40%, rgba(239, 232, 221, 0.65) 0%, rgba(248, 245, 239, 0.96) 70%)',
      }}
    >
      {/* Subtle organic paper grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.section
        aria-labelledby="surprise-intro-heading"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-[540px] flex-col items-center text-center"
      >
        <div ref={contentAreaRef} className="flex w-full flex-col items-center">
        {/* Small elegant handwritten text */}
        <p className="font-editorial text-[1.2rem] italic tracking-[0.015em] text-[#A18C77] sm:text-[1.35rem]">
          A little something for you
        </p>

        {/* Main editorial serif heading */}
        <h1
          id="surprise-intro-heading"
          className="font-editorial mt-2.5 text-[clamp(2.15rem,4.5vw,3.15rem)] leading-[1.12] font-medium tracking-[-0.015em] text-[#352A23]"
          style={{ textWrap: 'balance' }}
        >
          I have made something for you...
        </h1>

        {/* Centered delicate hand-drawn baby's-breath bouquet (or teddy bear on Maybe later) */}
        <div className="my-7 sm:my-9">
          <AnimatePresence mode="wait">
            {laterCount > 0 && !accepted ? (
              <MaybeLaterCharacter
                key="maybe-later-character"
                reducedMotion={Boolean(prefersReducedMotion)}
              />
            ) : (
              <BabysBreathBouquet
                key="babys-breath-bouquet"
                isAccepted={accepted}
                reducedMotion={Boolean(prefersReducedMotion)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Prompt & interactive feedback */}
        <div className="min-h-[58px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {accepted ? (
              <motion.p
                key="accepted-note"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial text-[1.45rem] italic text-[#352A23] sm:text-[1.6rem]"
                aria-live="polite"
              >
                Yay! I knew you&apos;d say yes ♡
              </motion.p>
            ) : (
              <motion.div
                key="prompt-question"
                initial={false}
                className="space-y-2"
              >
                <p className="text-[16px] leading-relaxed text-[#5E4E43] sm:text-[17px]">
                  Would you like to see it?
                </p>

                <div className="min-h-[24px]" aria-live="polite">
                  {gentleMessage && (
                    <motion.p
                      key={`later-${laterCount}`}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-editorial text-[1.08rem] italic text-[#A18C77]"
                    >
                      {gentleMessage}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
          {/* Keep layout slot steady when YES escapes */}
          {shouldYesEscape && escapeState && (
            <div
              aria-hidden="true"
              style={{ width: escapeState.width, height: escapeState.height }}
              className="shrink-0"
            />
          )}

          <motion.button
            ref={yesBtnRef}
            type="button"
            onClick={
              shouldYesEscape
                ? (e: ReactMouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerEscape(e.clientX, e.clientY, true);
                  }
                : handleYesClick
            }
            onMouseEnter={
              shouldYesEscape
                ? (e: ReactMouseEvent<HTMLButtonElement>) => {
                    if (Date.now() - lastTouchTimeRef.current < 600) return;
                    triggerEscape(e.clientX, e.clientY);
                  }
                : undefined
            }
            onTouchStart={
              shouldYesEscape
                ? (e: ReactTouchEvent<HTMLButtonElement>) => {
                    lastTouchTimeRef.current = Date.now();
                    e.preventDefault();
                    const touch = e.touches[0];
                    triggerEscape(touch?.clientX, touch?.clientY, true);
                  }
                : undefined
            }
            onPointerDown={
              shouldYesEscape
                ? (e: ReactPointerEvent<HTMLButtonElement>) => {
                    if (e.pointerType === 'touch') {
                      lastTouchTimeRef.current = Date.now();
                    }
                    e.preventDefault();
                    triggerEscape(e.clientX, e.clientY, true);
                  }
                : undefined
            }
            disabled={accepted}
            style={
              shouldYesEscape && escapeState
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
              shouldYesEscape && escapeState
                ? { x: escapeState.dx, y: escapeState.dy }
                : { x: 0, y: 0 }
            }
            whileHover={
              prefersReducedMotion || accepted || shouldYesEscape
                ? undefined
                : { y: -1 }
            }
            whileTap={
              prefersReducedMotion || accepted || shouldYesEscape
                ? undefined
                : { scale: 0.985 }
            }
            transition={
              shouldYesEscape && escapeState
                ? prefersReducedMotion
                  ? { duration: 0.16, ease: 'easeOut' }
                  : { type: 'spring', stiffness: 250, damping: 22 }
                : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
            }
            className="min-h-[46px] w-full max-w-[230px] cursor-pointer rounded-xl bg-[#403128] px-7 py-3 text-[14.5px] font-medium tracking-[0.015em] text-[#FFFFFF] shadow-[0_10px_24px_-12px_rgba(53,42,35,0.45)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] disabled:cursor-default disabled:opacity-90 sm:w-auto whitespace-nowrap shrink-0"
          >
            Yes, show me ♡
          </motion.button>

          {!accepted && (
            <>
              {/* Keep layout slot steady when Maybe later escapes */}
              {shouldLaterEscape && escapeState && (
                <div
                  aria-hidden="true"
                  style={{ width: escapeState.width, height: escapeState.height }}
                  className="shrink-0"
                />
              )}

              <motion.button
                ref={laterBtnRef}
                type="button"
                onClick={
                  shouldLaterEscape
                    ? (e: ReactMouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerEscape(e.clientX, e.clientY, true);
                      }
                    : handleMaybeLater
                }
                onMouseEnter={
                  shouldLaterEscape
                    ? (e: ReactMouseEvent<HTMLButtonElement>) => {
                        if (Date.now() - lastTouchTimeRef.current < 600) return;
                        triggerEscape(e.clientX, e.clientY);
                      }
                    : undefined
                }
                onTouchStart={
                  shouldLaterEscape
                    ? (e: ReactTouchEvent<HTMLButtonElement>) => {
                        lastTouchTimeRef.current = Date.now();
                        e.preventDefault();
                        const touch = e.touches[0];
                        triggerEscape(touch?.clientX, touch?.clientY, true);
                      }
                    : undefined
                }
                onPointerDown={
                  shouldLaterEscape
                    ? (e: ReactPointerEvent<HTMLButtonElement>) => {
                        if (e.pointerType === 'touch') {
                          lastTouchTimeRef.current = Date.now();
                        }
                        e.preventDefault();
                        triggerEscape(e.clientX, e.clientY, true);
                      }
                    : undefined
                }
                style={
                  shouldLaterEscape && escapeState
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
                  shouldLaterEscape && escapeState
                    ? { x: escapeState.dx, y: escapeState.dy }
                    : { x: 0, y: 0 }
                }
                whileHover={
                  prefersReducedMotion || shouldLaterEscape
                    ? undefined
                    : { y: -1 }
                }
                whileTap={
                  prefersReducedMotion || shouldLaterEscape
                    ? undefined
                    : { scale: 0.985 }
                }
                transition={
                  shouldLaterEscape && escapeState
                    ? prefersReducedMotion
                      ? { duration: 0.16, ease: 'easeOut' }
                      : { type: 'spring', stiffness: 250, damping: 22 }
                    : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
                }
                className="min-h-[46px] w-full max-w-[230px] cursor-pointer rounded-xl border border-[#E5D9C9] bg-[#F8F5EF]/90 px-7 py-3 text-[14.5px] font-medium tracking-[0.015em] text-[#352A23] transition-colors duration-150 hover:border-[#A18C77] hover:bg-[#EFE8DD]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] sm:w-auto whitespace-nowrap shrink-0"
              >
                Maybe later
              </motion.button>
            </>
          )}
        </div>
      </motion.section>
    </motion.main>
  );
}
