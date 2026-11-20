import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Delete } from 'lucide-react';

interface SecretPasscodeScreenProps {
  onSuccess: () => void;
}

const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

function WrongPasscodeCharacter({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      animate={reducedMotion ? {} : { y: [0, -4, 0] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      className="relative mx-auto my-5 flex w-[200px] items-center justify-center sm:my-7 sm:w-[224px]"
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
        aria-label="Cute hand-drawn chubby teddy bear with sparkling eyes and rosy cheeks holding a sign with an X symbol"
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
          style={{ transformOrigin: '36px 76px' }}
          d="M36 68 C36.6 72.8, 39.2 75.4, 44 76 C39.2 76.6, 36.6 79.2, 36 84 C35.4 79.2, 32.8 76.6, 28 76 C32.8 75.4, 35.4 72.8, 36 68 Z"
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
          d="M194 98 C194.5 101.6, 196.4 103.5, 200 104 C196.4 104.5, 194.5 106.4, 194 110 C193.5 106.4, 191.6 104.5, 188 104 C191.6 103.5, 193.5 101.6, 194 98 Z"
          stroke="#C2A376"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        <path
          d="M52 146 L52 152 M49 149 L55 149"
          stroke="#C2A376"
          strokeWidth="1.1"
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

        {/* Teddy Bear Character — Larger soft head, chubby rounded body */}
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

          {/* Chubby Rounded Torso behind sign */}
          <path
            d="M84 116 C71 134, 68 164, 80 181 C89 192, 141 192, 150 181 C162 164, 159 134, 146 116"
            fill="#F8F2E8"
          />
          {/* Subtle pastel tummy curve */}
          <ellipse
            cx="115"
            cy="160"
            rx="24"
            ry="20"
            fill="#FDFBF7"
            stroke="none"
            opacity="0.7"
          />

          {/* Plump Rounded Feet */}
          <g>
            <ellipse cx="87" cy="186" rx="14.5" ry="10.5" transform="rotate(-14 87 186)" fill="#F6EFE5" />
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
            <ellipse cx="143" cy="186" rx="14.5" ry="10.5" transform="rotate(14 143 186)" fill="#F6EFE5" />
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
          <path d="M77 96 L79 93.5 M82 96.5 L84 94" stroke="#C89B8E" strokeWidth="0.9" opacity="0.85" />
          <path d="M146 96 L148 93.5 M151 96.5 L153 94" stroke="#C89B8E" strokeWidth="0.9" opacity="0.85" />

          {/* Soft, Neutral Rounded Eyebrows */}
          <path d="M88 69 Q93.5 66.2 99 68.5" stroke="#8E7964" strokeWidth="1.2" />
          <path d="M131 68.5 Q136.5 66.2 142 69" stroke="#8E7964" strokeWidth="1.2" />

          {/* Clear, Round, Bright Eyes with Tiny Simple Highlights */}
          <g stroke="none">
            {/* Left eye */}
            <circle cx="93.5" cy="82" r="5.1" fill="#3D2E25" />
            <circle cx="91.8" cy="80.2" r="1.45" fill="#FFFFFF" />

            {/* Right eye */}
            <circle cx="136.5" cy="82" r="5.1" fill="#3D2E25" />
            <circle cx="134.8" cy="80.2" r="1.45" fill="#FFFFFF" />
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
          {/* Small rounded nose */}
          <ellipse cx="115" cy="91.5" rx="4.1" ry="2.8" fill="#6F5749" stroke="none" />
          {/* Tiny sweet gentle smile */}
          <path d="M115 94.4 L115 97.4" stroke="#7E6956" strokeWidth="1.15" />
          <path d="M108 97.5 Q111.5 101.2 115 97.6 Q118.5 101.2 122 97.5" stroke="#7E6956" strokeWidth="1.2" />

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

          {/* Handheld Little X Sign (gently tilted for hand-drawn warmth) */}
          <g transform="rotate(-2 115 150)">
            {/* Wooden handle tucked subtly */}
            <path d="M115 170 L115 182" stroke="#A18C77" strokeWidth="2.2" />

            {/* Sign board */}
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

          {/* Rounded Chubby Paws naturally gripping the edges of the sign */}
          <g>
            <ellipse
              cx="74"
              cy="149"
              rx="8.5"
              ry="7"
              transform="rotate(-14 74 149)"
              fill="#FAF7F2"
            />
            <path d="M71 147.5 Q74 149 75.5 151.5" stroke="#D2C2AE" strokeWidth="0.95" />

            <ellipse
              cx="156"
              cy="147"
              rx="8.5"
              ry="7"
              transform="rotate(14 156 147)"
              fill="#FAF7F2"
            />
            <path d="M159 145.5 Q156 147 154.5 149.5" stroke="#D2C2AE" strokeWidth="0.95" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

function VintageOvalPortrait({
  isSuccess,
  reducedMotion,
}: {
  isSuccess: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-[260px] items-center justify-center sm:max-w-[295px]">
      {/* Subtle outer antique-gold corner filigree accents */}
      <svg
        viewBox="0 0 300 370"
        fill="none"
        className="h-auto w-full overflow-visible drop-shadow-[0_18px_40px_rgba(64,49,40,0.08)]"
        role="img"
        aria-label="Vintage oval portrait frame with antique-gold filigree and a delicate birthday candle and rose keepsake illustration"
      >
        {/* Outer soft ivory-cream mat silhouette */}
        <ellipse
          cx="150"
          cy="185"
          rx="126"
          ry="162"
          fill="#FDFBF7"
          stroke="#E5D9C9"
          strokeWidth="1.5"
        />

        {/* Delicate antique-gold double oval frame */}
        <ellipse
          cx="150"
          cy="185"
          rx="116"
          ry="151"
          fill="#F5EFE6"
          stroke="#C2A376"
          strokeWidth="1.4"
        />
        <ellipse
          cx="150"
          cy="185"
          rx="109"
          ry="143"
          fill="#FAF7F2"
          stroke="#D4BA8B"
          strokeWidth="0.9"
          strokeDasharray="3 3"
        />

        {/* Top & Bottom antique-gold filigree crests */}
        <g stroke="#C2A376" strokeWidth="1.15" strokeLinecap="round">
          {/* Top crest */}
          <path d="M150 16 L150 26" />
          <path d="M132 23 C140 19, 146 21, 150 26 C154 21, 160 19, 168 23" />
          <circle cx="150" cy="14" r="2.2" fill="#C2A376" />

          {/* Bottom crest */}
          <path d="M150 344 L150 354" />
          <path d="M132 347 C140 351, 146 349, 150 344 C154 349, 160 351, 168 347" />
          <circle cx="150" cy="356" r="2.2" fill="#C2A376" />
        </g>

        {/* Inner Birthday Keepsake Cameo Illustration */}
        {/* Subtle parchment arch behind illustration */}
        <ellipse cx="150" cy="185" rx="84" ry="112" fill="#F3EDE4" opacity="0.55" />

        {/* Delicate botanical stems & garden rose leaves */}
        <g stroke="#9B8672" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M150 258 C134 236, 114 214, 102 184" />
          <path d="M150 258 C168 235, 186 212, 197 180" />
          <path
            d="M119 216 C108 214, 103 207, 108 202 C114 198, 121 206, 119 216 Z"
            fill="#E5D9C9"
          />
          <path
            d="M180 214 C191 212, 196 205, 191 200 C185 196, 178 204, 180 214 Z"
            fill="#E5D9C9"
          />
          <path
            d="M128 236 C118 237, 113 231, 117 226 C123 223, 129 229, 128 236 Z"
            fill="#F3EDE4"
          />
          <path
            d="M171 236 C181 237, 186 231, 182 226 C176 223, 170 229, 171 236 Z"
            fill="#F3EDE4"
          />
        </g>

        {/* Minimalist Ceramic Plate & Slender Beeswax Birthday Candle */}
        <g stroke="#7E6956" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          {/* Ceramic saucer */}
          <path d="M112 260 Q150 271 188 260" fill="none" />
          <ellipse cx="150" cy="257" rx="34" ry="6.5" fill="#EDE5D8" />
          {/* Taper candle */}
          <rect x="142" y="162" width="16" height="94" rx="4" fill="#F8F1E4" />
          <path d="M145 174 C148 179, 152 175, 155 181" stroke="#D8C9B6" strokeWidth="1.05" />
          {/* Wick */}
          <path d="M150 162 L150 153" stroke="#403128" strokeWidth="1.4" />
        </g>

        {/* Warm Candle Flame */}
        <motion.g
          animate={
            reducedMotion
              ? {}
              : {
                  scale: isSuccess ? [1, 1.18, 1.06] : [1, 1.05, 0.97, 1.03, 1],
                  opacity: isSuccess ? 1 : [0.92, 1, 0.9, 1],
                }
          }
          transition={{
            duration: isSuccess ? 0.6 : 2.6,
            repeat: isSuccess ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '150px 144px' }}
        >
          {/* Soft golden glow */}
          <circle cx="150" cy="141" r="17" fill="#E8C684" opacity="0.24" />
          {/* Outer flame */}
          <path
            d="M150 123 C156 133, 158 142, 154 148 C152 151, 148 151, 146 148 C142 142, 144 133, 150 123 Z"
            fill="#E3B263"
            stroke="#B68740"
            strokeWidth="1"
          />
          {/* Inner bright flame */}
          <path
            d="M150 132 C153 138, 153.5 144, 150 147 C146.5 144, 147 138, 150 132 Z"
            fill="#FFF7E2"
          />
        </motion.g>

        {/* Tiny antique-gold sparkles & delicate dusty-rose heart */}
        <motion.path
          animate={
            reducedMotion ? {} : { opacity: [0.45, 0.95, 0.45], scale: [0.9, 1.08, 0.9] }
          }
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '108px 134px' }}
          d="M108 126 C108.6 131, 111 133.4, 116 134 C111 134.6, 108.6 137, 108 142 C107.4 137, 105 134.6, 100 134 C105 133.4, 107.4 131, 108 126 Z"
          fill="#C2A376"
        />

        <motion.path
          animate={
            reducedMotion ? {} : { opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }
          }
          transition={{ duration: 3.4, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '193px 138px' }}
          d="M193 132 C193.5 135.8, 195.2 137.5, 199 138 C195.2 138.5, 193.5 140.2, 193 144 C192.5 140.2, 190.8 138.5, 187 138 C190.8 137.5, 192.5 135.8, 193 132 Z"
          fill="#C2A376"
        />

        {/* Delicate dusty rose heart near ribbon/base */}
        <path
          d="M150 288 C150 288, 142.5 283.2, 142.5 278.6 C142.5 276.1, 144.4 274.4, 146.7 274.4 C148.3 274.4, 149.3 275.3, 150 276.6 C150.7 275.3, 151.7 274.4, 153.3 274.4 C155.6 274.4, 157.5 276.1, 157.5 278.6 C157.5 283.2, 150 288, 150 288 Z"
          fill="#B98E80"
          stroke="#8E675A"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

type DigitStatus = 'empty' | 'checking' | 'valid' | 'invalid';

export function SecretPasscodeScreen({ onSuccess }: SecretPasscodeScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [slots, setSlots] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [slotStatuses, setSlotStatuses] = useState<
    [DigitStatus, DigitStatus, DigitStatus, DigitStatus]
  >(['empty', 'empty', 'empty', 'empty']);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [shakeTick, setShakeTick] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWrongPasscode, setIsWrongPasscode] = useState(false);

  const slotsRef = useRef<[string, string, string, string]>(['', '', '', '']);
  const slotStatusesRef = useRef<
    [DigitStatus, DigitStatus, DigitStatus, DigitStatus]
  >(['empty', 'empty', 'empty', 'empty']);
  const slotRequestTokensRef = useRef<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const timersRef = useRef<number[]>([]);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const verifyPasscode = useCallback(
    async (candidate: string) => {
      if (isVerifying || isSuccess || isWrongPasscode || hasCompletedRef.current) {
        return;
      }
      setIsVerifying(true);

      try {
        const response = await fetch('/api/verify-secret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: candidate }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { ok: true }
          | { ok: false; error?: string }
          | null;

        if (response.ok && payload && payload.ok) {
          setIsSuccess(true);
          const id = window.setTimeout(() => {
            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true;
              onSuccess();
            }
          }, prefersReducedMotion ? 400 : 850);
          timersRef.current.push(id);
          return;
        }

        const emptySlots: [string, string, string, string] = ['', '', '', ''];
        const emptyStatuses: [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ] = ['empty', 'empty', 'empty', 'empty'];
        slotsRef.current = emptySlots;
        slotStatusesRef.current = emptyStatuses;
        slotRequestTokensRef.current = [
          slotRequestTokensRef.current[0] + 1,
          slotRequestTokensRef.current[1] + 1,
          slotRequestTokensRef.current[2] + 1,
          slotRequestTokensRef.current[3] + 1,
        ];
        setSlots(emptySlots);
        setSlotStatuses(emptyStatuses);
        setSelectedSlot(null);
        setIsWrongPasscode(true);
      } catch {
        const emptySlots: [string, string, string, string] = ['', '', '', ''];
        const emptyStatuses: [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ] = ['empty', 'empty', 'empty', 'empty'];
        slotsRef.current = emptySlots;
        slotStatusesRef.current = emptyStatuses;
        setSlots(emptySlots);
        setSlotStatuses(emptyStatuses);
        setSelectedSlot(null);
        setIsWrongPasscode(true);
      } finally {
        setIsVerifying(false);
      }
    },
    [isSuccess, isVerifying, isWrongPasscode, onSuccess, prefersReducedMotion]
  );

  const validateDigitAtSlot = useCallback(
    async (slotIndex: number, digit: string, requestToken: number) => {
      try {
        const response = await fetch('/api/verify-secret-digit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index: slotIndex, digit }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { ok: true; valid: boolean }
          | { ok: false }
          | null;

        if (
          slotRequestTokensRef.current[slotIndex] !== requestToken ||
          slotsRef.current[slotIndex] !== digit
        ) {
          return;
        }

        const isValidDigit = Boolean(
          response.ok && payload && 'valid' in payload && payload.valid
        );

        const nextStatuses = [...slotStatusesRef.current] as [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ];
        nextStatuses[slotIndex] = isValidDigit ? 'valid' : 'invalid';
        slotStatusesRef.current = nextStatuses;
        setSlotStatuses(nextStatuses);

        if (!isValidDigit) {
          setShakeTick((prev) => prev + 1);
          return;
        }

        if (
          slotsRef.current.every((d) => d.length === 1) &&
          slotStatusesRef.current.every((s) => s === 'valid')
        ) {
          void verifyPasscode(slotsRef.current.join(''));
        }
      } catch {
        if (
          slotRequestTokensRef.current[slotIndex] !== requestToken ||
          slotsRef.current[slotIndex] !== digit
        ) {
          return;
        }
        const nextStatuses = [...slotStatusesRef.current] as [
          DigitStatus,
          DigitStatus,
          DigitStatus,
          DigitStatus,
        ];
        nextStatuses[slotIndex] = 'invalid';
        slotStatusesRef.current = nextStatuses;
        setSlotStatuses(nextStatuses);
        setShakeTick((prev) => prev + 1);
      }
    },
    [verifyPasscode]
  );

  const handleRetry = useCallback(() => {
    const emptySlots: [string, string, string, string] = ['', '', '', ''];
    const emptyStatuses: [DigitStatus, DigitStatus, DigitStatus, DigitStatus] =
      ['empty', 'empty', 'empty', 'empty'];
    slotsRef.current = emptySlots;
    slotStatusesRef.current = emptyStatuses;
    slotRequestTokensRef.current = [
      slotRequestTokensRef.current[0] + 1,
      slotRequestTokensRef.current[1] + 1,
      slotRequestTokensRef.current[2] + 1,
      slotRequestTokensRef.current[3] + 1,
    ];
    setSlots(emptySlots);
    setSlotStatuses(emptyStatuses);
    setSelectedSlot(null);
    setIsWrongPasscode(false);
  }, []);

  const handleDigitInput = useCallback(
    (digit: string) => {
      if (isVerifying || isSuccess || isWrongPasscode || !/^[0-9]$/.test(digit)) {
        return;
      }

      const targetIndex =
        selectedSlot !== null
          ? selectedSlot
          : slotsRef.current.findIndex((d) => d === '');

      if (targetIndex < 0 || targetIndex >= 4) {
        return;
      }

      const nextSlots = [...slotsRef.current] as [
        string,
        string,
        string,
        string,
      ];
      nextSlots[targetIndex] = digit;
      slotsRef.current = nextSlots;
      setSlots(nextSlots);

      const nextStatuses = [...slotStatusesRef.current] as [
        DigitStatus,
        DigitStatus,
        DigitStatus,
        DigitStatus,
      ];
      nextStatuses[targetIndex] = 'checking';
      slotStatusesRef.current = nextStatuses;
      setSlotStatuses(nextStatuses);

      setSelectedSlot(null);

      const nextToken = slotRequestTokensRef.current[targetIndex] + 1;
      slotRequestTokensRef.current[targetIndex] = nextToken;
      void validateDigitAtSlot(targetIndex, digit, nextToken);
    },
    [isSuccess, isVerifying, isWrongPasscode, selectedSlot, validateDigitAtSlot]
  );

  const clearSlotAt = useCallback((slotIndex: number) => {
    const nextSlots = [...slotsRef.current] as [string, string, string, string];
    nextSlots[slotIndex] = '';
    slotsRef.current = nextSlots;
    setSlots(nextSlots);

    slotRequestTokensRef.current[slotIndex] += 1;

    const nextStatuses = [...slotStatusesRef.current] as [
      DigitStatus,
      DigitStatus,
      DigitStatus,
      DigitStatus,
    ];
    nextStatuses[slotIndex] = 'empty';
    slotStatusesRef.current = nextStatuses;
    setSlotStatuses(nextStatuses);
  }, []);

  const handleBackspace = useCallback(() => {
    if (isVerifying || isSuccess || isWrongPasscode) {
      return;
    }

    if (selectedSlot !== null) {
      if (slotsRef.current[selectedSlot] !== '') {
        clearSlotAt(selectedSlot);
        return;
      }
      if (selectedSlot > 0 && slotsRef.current[selectedSlot - 1] !== '') {
        clearSlotAt(selectedSlot - 1);
        setSelectedSlot(selectedSlot - 1);
        return;
      }
    }

    let lastFilledIndex = -1;
    for (let i = 3; i >= 0; i -= 1) {
      if (slotsRef.current[i] !== '') {
        lastFilledIndex = i;
        break;
      }
    }

    if (lastFilledIndex >= 0) {
      clearSlotAt(lastFilledIndex);
      setSelectedSlot(null);
    }
  }, [clearSlotAt, isSuccess, isVerifying, isWrongPasscode, selectedSlot]);

  const handleClearAll = useCallback(() => {
    if (isVerifying || isSuccess || isWrongPasscode) return;
    const emptySlots: [string, string, string, string] = ['', '', '', ''];
    const emptyStatuses: [DigitStatus, DigitStatus, DigitStatus, DigitStatus] =
      ['empty', 'empty', 'empty', 'empty'];
    slotsRef.current = emptySlots;
    slotStatusesRef.current = emptyStatuses;
    slotRequestTokensRef.current = [
      slotRequestTokensRef.current[0] + 1,
      slotRequestTokensRef.current[1] + 1,
      slotRequestTokensRef.current[2] + 1,
      slotRequestTokensRef.current[3] + 1,
    ];
    setSlots(emptySlots);
    setSlotStatuses(emptyStatuses);
    setSelectedSlot(null);
  }, [isSuccess, isVerifying, isWrongPasscode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isWrongPasscode) {
        if (event.key === 'Enter' || event.key === 'Escape') {
          event.preventDefault();
          handleRetry();
        }
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        handleDigitInput(event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      } else if (event.key === 'Escape' && !isVerifying && !isSuccess) {
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleBackspace,
    handleClearAll,
    handleDigitInput,
    handleRetry,
    isSuccess,
    isVerifying,
    isWrongPasscode,
  ]);

  const filledCount = slots.filter((d) => d !== '').length;
  const firstEmptyIndex = slots.findIndex((d) => d === '');
  const hasInvalidDigit = slotStatuses.some((status) => status === 'invalid');
  const hasValidSoFar =
    !hasInvalidDigit &&
    filledCount > 0 &&
    slotStatuses.some((status) => status === 'valid');

  return (
    <motion.main
      key="secret-passcode-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.99,
        transition: {
          duration: prefersReducedMotion ? 0.15 : 0.55,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-[#F8F5EF] px-5 py-10 text-[#403128] sm:px-8 sm:py-14"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 42%, rgba(243, 237, 228, 0.78) 0%, rgba(248, 245, 239, 0.98) 72%)',
      }}
    >
      {/* Subtle organic paper grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='passcodePaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23passcodePaper)'/%3E%3C/svg%3E")`,
        }}
      />

      <AnimatePresence mode="wait">
        {isWrongPasscode ? (
          /* Dedicated Wrong Passcode Screen */
          <motion.section
            key="wrong-passcode-view"
            aria-labelledby="wrong-passcode-heading"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, transition: { duration: 0.25 } }
            }
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-auto flex w-full max-w-[540px] flex-col items-center text-center"
          >
            <h1
              id="wrong-passcode-heading"
              className="font-editorial text-[clamp(2.1rem,4.5vw,3rem)] leading-[1.12] font-medium tracking-[-0.015em] text-[#403128]"
              style={{ textWrap: 'balance' }}
            >
              Wrong Passcode.
            </h1>

            <WrongPasscodeCharacter
              reducedMotion={Boolean(prefersReducedMotion)}
            />

            <div className="space-y-1.5">
              <p className="text-[16px] leading-relaxed text-[#403128]/90 sm:text-[17px]">
                That wasn&apos;t the secret code! ♡
              </p>
              <p className="font-editorial text-[1.18rem] italic text-[#A18C77] sm:text-[1.28rem]">
                A little more guessing, perhaps?
              </p>
            </div>

            <motion.button
              type="button"
              onClick={handleRetry}
              whileHover={prefersReducedMotion ? undefined : { y: -1 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 min-h-[46px] min-w-[184px] cursor-pointer rounded-xl bg-[#403128] px-8 py-3 text-[14.5px] font-medium tracking-[0.04em] text-[#FFFFFF] shadow-[0_10px_24px_-12px_rgba(64,49,40,0.45)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] whitespace-nowrap shrink-0"
            >
              TRY AGAIN ♡
            </motion.button>
          </motion.section>
        ) : (
          /* Passcode Entry View */
          <motion.section
            key="passcode-entry-view"
            aria-labelledby="secret-passcode-heading"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, transition: { duration: 0.25 } }
            }
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-auto grid w-full max-w-[880px] grid-cols-1 items-center gap-10 rounded-3xl border border-[#E5D9C9] bg-[#FDFBF7]/85 p-7 shadow-[0_24px_60px_-24px_rgba(64,49,40,0.12)] sm:p-11 md:grid-cols-12 md:gap-12"
          >
            {/* Left Section: Vintage Decorative Oval Portrait Frame */}
            <div className="flex items-center justify-center md:col-span-5">
              <VintageOvalPortrait
                isSuccess={isSuccess}
                reducedMotion={Boolean(prefersReducedMotion)}
              />
            </div>

            {/* Right Section: Heading, Four Indicators & Circular Numeric Keypad */}
            <div className="flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left">
              <h1
                id="secret-passcode-heading"
                className="font-editorial text-[clamp(2rem,4vw,2.75rem)] leading-[1.14] font-medium tracking-[-0.015em] text-[#403128]"
                style={{ textWrap: 'balance' }}
              >
                A little secret awaits...
              </h1>

              <p className="mt-2.5 max-w-[36ch] text-[15px] leading-relaxed text-[#7A685B] sm:text-[15.5px]">
                Enter the passcode to unlock your surprise.
              </p>

              {/* Four Digit Indicators */}
              <motion.div
                animate={
                  shakeTick > 0 && !prefersReducedMotion
                    ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.34, ease: 'easeOut' }}
                className="mt-7 flex items-center justify-center gap-3 sm:gap-3.5 md:justify-start"
                role="group"
                aria-label="Four-digit passcode entry"
              >
                {[0, 1, 2, 3].map((slotIndex) => {
                  const char = slots[slotIndex];
                  const status = slotStatuses[slotIndex];
                  const isFilled = Boolean(char);
                  const isActiveSlot =
                    !isSuccess &&
                    !isVerifying &&
                    (selectedSlot !== null
                      ? selectedSlot === slotIndex
                      : firstEmptyIndex === slotIndex);

                  return (
                    <button
                      key={slotIndex}
                      type="button"
                      disabled={isVerifying || isSuccess}
                      onClick={() =>
                        setSelectedSlot((prev) =>
                          prev === slotIndex ? null : slotIndex
                        )
                      }
                      aria-label={
                        isFilled
                          ? `Digit ${slotIndex + 1}, ${char}${status === 'invalid' ? ', incorrect' : ''}`
                          : `Digit ${slotIndex + 1}, empty`
                      }
                      aria-invalid={status === 'invalid'}
                      className={`flex h-14 w-12 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default sm:h-[60px] sm:w-[54px] ${
                        isSuccess
                          ? 'border-[#C2A376] bg-[#F5EFE6] shadow-[0_0_0_2px_rgba(194,163,118,0.22)]'
                          : status === 'invalid'
                            ? `border-[#C97165] bg-[#FDF1EF] shadow-[0_0_0_2px_rgba(201,113,101,0.18)] ${
                                isActiveSlot ? 'ring-2 ring-[#C97165]/35' : ''
                              }`
                            : status === 'valid'
                              ? `border-[#9DB091] bg-[#F7FAF5] ${
                                  isActiveSlot
                                    ? 'shadow-[0_0_0_2px_rgba(157,176,145,0.28)]'
                                    : ''
                                }`
                              : isActiveSlot
                                ? 'border-[#A18C77] bg-[#FFFFFF] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.22)]'
                                : isFilled
                                  ? 'border-[#C2A376] bg-[#FFFFFF]'
                                  : 'border-[#E5D9C9] bg-[#FAF7F2]'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isFilled ? (
                          <motion.span
                            key={`digit-${slotIndex}-${char}`}
                            initial={
                              prefersReducedMotion
                                ? false
                                : { opacity: 0, scale: 0.75 }
                            }
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.75 }}
                            transition={{ duration: 0.14 }}
                            className={`font-editorial text-[1.65rem] font-medium tabular-nums transition-colors ${
                              status === 'invalid'
                                ? 'text-[#963B30]'
                                : 'text-[#403128]'
                            }`}
                          >
                            {char}
                          </motion.span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-[#D7C9B8]"
                          />
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </motion.div>

              {/* Status / Feedback Area */}
              <div className="mt-3.5 min-h-[26px]" aria-live="polite">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.p
                      key="passcode-success"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-1.5 font-editorial text-[1.2rem] italic text-[#8E6F46]"
                    >
                      <Check className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                      <span>Unlocked ♡</span>
                    </motion.p>
                  ) : hasInvalidDigit ? (
                    <motion.p
                      key="passcode-digit-error"
                      role="alert"
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-[13.5px] font-medium leading-snug text-[#963B30]"
                    >
                      Incorrect digit. Try again.
                    </motion.p>
                  ) : hasValidSoFar ? (
                    <motion.p
                      key="passcode-digit-valid"
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#667859]"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                      <span>Correct so far</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Circular Numeric Keypad */}
              <div
                className="mt-4 grid w-full max-w-[236px] grid-cols-3 justify-items-center gap-3 sm:max-w-[252px] sm:gap-3.5"
                role="group"
                aria-label="Numeric keypad"
              >
                {KEYPAD_DIGITS.map((digit) => (
                  <motion.button
                    key={digit}
                    type="button"
                    onClick={() => handleDigitInput(digit)}
                    disabled={isVerifying || isSuccess}
                    whileHover={
                      prefersReducedMotion || isVerifying || isSuccess
                        ? undefined
                        : { y: -1 }
                    }
                    whileTap={
                      prefersReducedMotion || isVerifying || isSuccess
                        ? undefined
                        : { scale: 0.93 }
                    }
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#E5D9C9] bg-[#FDFBF7] text-[1.1rem] font-medium tabular-nums text-[#403128] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.22)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-65 sm:h-[60px] sm:w-[60px]"
                  >
                    {digit}
                  </motion.button>
                ))}

                {/* Bottom Row: Spacer, 0, Backspace */}
                <div aria-hidden="true" className="h-14 w-14 sm:h-[60px] sm:w-[60px]" />

                <motion.button
                  type="button"
                  onClick={() => handleDigitInput('0')}
                  disabled={isVerifying || isSuccess}
                  whileHover={
                    prefersReducedMotion || isVerifying || isSuccess
                      ? undefined
                      : { y: -1 }
                  }
                  whileTap={
                    prefersReducedMotion || isVerifying || isSuccess
                      ? undefined
                      : { scale: 0.93 }
                  }
                  transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#E5D9C9] bg-[#FDFBF7] text-[1.1rem] font-medium tabular-nums text-[#403128] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.22)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-65 sm:h-[60px] sm:w-[60px]"
                >
                  0
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleBackspace}
                  disabled={isVerifying || isSuccess || filledCount === 0}
                  aria-label="Delete last digit"
                  whileHover={
                    prefersReducedMotion || isVerifying || isSuccess || filledCount === 0
                      ? undefined
                      : { y: -1 }
                  }
                  whileTap={
                    prefersReducedMotion || isVerifying || isSuccess || filledCount === 0
                      ? undefined
                      : { scale: 0.93 }
                  }
                  transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#E5D9C9] bg-[#FAF7F2] text-[#7A685B] shadow-[0_6px_16px_-10px_rgba(64,49,40,0.16)] transition-colors duration-150 hover:border-[#C2A376] hover:bg-[#F3EDE4] hover:text-[#403128] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-default disabled:opacity-45 sm:h-[60px] sm:w-[60px]"
                >
                  <Delete className="h-[18px] w-[18px] stroke-[1.75]" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
