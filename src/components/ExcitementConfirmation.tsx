import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import pjMemoryImg from '../assets/images/pj.jpeg';

interface ExcitementConfirmationProps {
  onConfirm: () => void;
}

type SequencePhase = 'idle' | 'activating' | 'flash' | 'revealed';

const REVEAL_IMAGE_URL = pjMemoryImg;

function HandDrawnVintageCamera({
  isActivating,
  reducedMotion,
}: {
  isActivating: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      animate={
        reducedMotion
          ? {}
          : isActivating
            ? { scale: 1.045, rotate: -0.75 }
            : { y: [0, -4, 0], scale: 1, rotate: 0 }
      }
      transition={
        isActivating
          ? { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
          : { duration: 5.4, repeat: Infinity, ease: 'easeInOut' }
      }
      className="relative mx-auto my-7 w-full max-w-[260px] sm:my-9 sm:max-w-[300px]"
    >
      <svg
        viewBox="0 0 260 205"
        fill="none"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Delicate hand-drawn vintage 35mm film camera line illustration with a tiny outline heart and subtle sparkles"
      >
        {/* Subtle outline sparkles near the camera */}
        <motion.path
          animate={
            reducedMotion
              ? {}
              : {
                  opacity: isActivating ? [0.6, 1, 0.8] : [0.45, 0.9, 0.45],
                  scale: isActivating ? [1, 1.15, 1] : [0.92, 1.08, 0.92],
                }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '37px 54px' }}
          d="M37 44 C37.8 50.5, 40.5 53.2, 47 54 C40.5 54.8, 37.8 57.5, 37 64 C36.2 57.5, 33.5 54.8, 27 54 C33.5 53.2, 36.2 50.5, 37 44 Z"
          stroke="#C2A376"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <motion.path
          animate={
            reducedMotion
              ? {}
              : {
                  opacity: [0.35, 0.85, 0.35],
                  scale: [0.9, 1.08, 0.9],
                }
          }
          transition={{
            duration: 3.3,
            delay: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '220px 138px' }}
          d="M220 131 C220.6 135.4, 222.6 137.4, 227 138 C222.6 138.6, 220.6 140.6, 220 145 C219.4 140.6, 217.4 138.6, 213 138 C217.4 137.4, 219.4 135.4, 220 131 Z"
          stroke="#C2A376"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <motion.path
          animate={
            reducedMotion
              ? {}
              : { opacity: [0.35, 0.8, 0.35] }
          }
          transition={{
            duration: 3.1,
            delay: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          d="M204 42 L204 50 M200 46 L208 46"
          stroke="#B59876"
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* One tiny outline heart near upper right */}
        <motion.path
          animate={
            reducedMotion
              ? {}
              : {
                  y: [0, -2.5, 0],
                  opacity: [0.75, 1, 0.75],
                }
          }
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          d="M215 68 C215 68, 206.5 62.6, 206.5 57.5 C206.5 54.6, 208.7 52.6, 211.2 52.6 C213 52.6, 214.2 53.7, 215 55.2 C215.8 53.7, 217 52.6, 218.8 52.6 C221.3 52.6, 223.5 54.6, 223.5 57.5 C223.5 62.6, 215 68, 215 68 Z"
          stroke="#B98E80"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vintage Camera — Front Three-Quarter Delicate Line Art (no fills) */}
        <g
          stroke="#8E7964"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main front body */}
          <path d="M52 74 C52 69.5, 55.5 66, 60 66 L178 66 C182.5 66, 186 69.5, 186 74 L186 154 C186 158.5, 182.5 162, 178 162 L60 162 C55.5 162, 52 158.5, 52 154 Z" />

          {/* Three-quarter right-side depth edge */}
          <path d="M181 66.8 L196 61.5 C199.5 60.5, 203 63, 203 67 L203 144 C203 147.5, 200.5 150.5, 197 152 L183 160" />

          {/* Top plate receding plane */}
          <path d="M55 67 L70 60.5 L197 60.8" />

          {/* Top plate horizontal trim line */}
          <path d="M52 86 L101 86 M149 86 L186 86" strokeWidth="1.1" />
          {/* Bottom plate subtle trim line */}
          <path d="M52 153 L186 153" strokeWidth="1.05" />

          {/* Pentaprism / Viewfinder housing */}
          <path d="M97 66 L105 46 C106.2 43.5, 108.5 42, 111.5 42 L138.5 42 C141.5 42, 143.8 43.5, 145 46 L151 66" />
          {/* Three-quarter prism side facet */}
          <path d="M142 43 L154 40 C156.5 39.5, 158.5 41, 159.5 43.5 L164 60.5" strokeWidth="1.15" />

          {/* Hot shoe on top of prism */}
          <path d="M114 42 L114 37.5 L136 37.5 L136 42" strokeWidth="1.1" />
          <path d="M118 37.5 L121 34.5 L132 34.5 L134 37.5" strokeWidth="1.05" />

          {/* Subtle viewfinder window on upper front */}
          <rect x="115" y="51" width="20" height="10" rx="2.2" strokeWidth="1.1" />

          {/* Left Rewind Crank Dial */}
          <path d="M68 62 L68 54.5 C68 53, 70 52, 74 52 L82 52 C86 52, 88 53, 88 54.5 L88 61" strokeWidth="1.15" />
          <path d="M72 52 L75 47.5 L82 47.5" strokeWidth="1.05" />

          {/* Right Shutter Speed Dial */}
          <path d="M158 61 L158 53.5 C158 51.8, 162 50.8, 168 50.8 C174 50.8, 178 51.8, 178 53.5 L178 61" strokeWidth="1.15" />
          <path d="M162 54 L162 59 M168 53.5 L168 59 M174 54 L174 59" strokeWidth="0.9" />

          {/* Shutter release button */}
          <path d="M182 61 L182 55.5 C182 54.5, 184 54, 186.5 54 C189 54, 191 54.5, 191 55.5 L191 61" strokeWidth="1.1" />
          <path d="M184.5 54 L184.5 51.5 L188.5 51.5 L188.5 54" strokeWidth="1" />

          {/* Film advance lever (subtle curve on right) */}
          <path d="M192 59.5 C197 58.5, 202 59.5, 205 62" strokeWidth="1.1" />

          {/* Strap eyelets */}
          <circle cx="49" cy="84" r="3" strokeWidth="1.1" />
          <circle cx="203" cy="80" r="2.8" strokeWidth="1.1" />

          {/* Self-timer lever & small flash sync port on left front */}
          <path d="M72 106 L72 126" strokeWidth="1.2" />
          <circle cx="72" cy="130" r="4" strokeWidth="1.1" />
          <circle cx="67" cy="95" r="2.5" strokeWidth="1.05" />

          {/* Subtle leatherette vertical seam lines */}
          <path d="M84 86 L84 153" strokeWidth="0.95" strokeDasharray="2 3" opacity="0.65" />
          <path d="M170 86 L170 153" strokeWidth="0.95" strokeDasharray="2 3" opacity="0.65" />

          {/* Protruding 35mm Lens in gentle 3/4 perspective */}
          {/* Lens mount base ring */}
          <ellipse cx="122" cy="118" rx="35" ry="36" strokeWidth="1.35" />
          {/* Protruding outer barrel (shifted slightly toward viewer-left) */}
          <path d="M100 88 C113 80, 134 81, 146 92" strokeWidth="1.2" />
          <path d="M98 147 C112 155, 133 154, 145 144" strokeWidth="1.2" />

          {/* Front lens barrel ring */}
          <ellipse cx="117" cy="118" rx="31" ry="32.5" strokeWidth="1.35" />

          {/* Inner rotating focus & aperture rings */}
          <motion.g
            animate={
              isActivating && !reducedMotion
                ? { rotate: 14 }
                : { rotate: 0 }
            }
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '117px 118px' }}
          >
            <ellipse cx="117" cy="118" rx="24.5" ry="25.5" strokeWidth="1.15" />
            {/* Delicate knurled focus grip ticks */}
            <path
              d="M117 92.5 L117 96 M135 100 L132.5 102.5 M141.5 118 L138 118 M135 136 L132.5 133.5 M117 143.5 L117 140 M99 136 L101.5 133.5 M92.5 118 L96 118 M99 100 L101.5 102.5"
              strokeWidth="1"
              opacity="0.8"
            />
            <ellipse cx="117" cy="118" rx="16" ry="16.8" strokeWidth="1.2" />
          </motion.g>

          {/* Inner optical glass element & delicate reflection curves */}
          <ellipse cx="117" cy="118" rx="9" ry="9.5" strokeWidth="1.05" opacity="0.8" />
          <path
            d="M106 111 C108 106, 113 103.5, 118 104"
            stroke="#A18C77"
            strokeWidth="1.05"
          />
          <path
            d="M124 127 C122 129.5, 119 131, 116 131"
            stroke="#A18C77"
            strokeWidth="0.95"
          />
        </g>
      </svg>
    </motion.div>
  );
}

function playVintageShutterSound(delaySeconds: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const triggerCurtainClick = (
      offsetSec: number,
      centerFreq: number,
      qValue: number,
      noiseDuration: number,
      gainLevel: number,
      bodyFreqStart: number,
      bodyFreqEnd: number
    ) => {
      const startTime = ctx.currentTime + offsetSec;
      const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * noiseDuration));
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      const channelData = buffer.getChannelData(0);

      for (let i = 0; i < sampleCount; i++) {
        const decay = Math.pow(1 - i / sampleCount, 2.2);
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(centerFreq, startTime);
      filter.Q.setValueAtTime(qValue, startTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, startTime);
      noiseGain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.002);
      noiseGain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + noiseDuration
      );

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(startTime);
      noiseSource.stop(startTime + noiseDuration);

      // Soft mechanical body resonance
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(bodyFreqStart, startTime);
      osc.frequency.exponentialRampToValueAtTime(bodyFreqEnd, startTime + 0.028);

      oscGain.gain.setValueAtTime(0.0001, startTime);
      oscGain.gain.linearRampToValueAtTime(gainLevel * 0.45, startTime + 0.003);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.032);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.035);
    };

    // First curtain + mirror release, followed ~65ms later by second curtain
    triggerCurtainClick(delaySeconds, 2300, 1.7, 0.024, 0.14, 195, 78);
    triggerCurtainClick(delaySeconds + 0.065, 3100, 2.1, 0.018, 0.1, 240, 110);

    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, Math.ceil((delaySeconds + 0.45) * 1000));
  } catch {
    // Audio failure never blocks the visual reveal sequence
  }
}

export function ExcitementConfirmation({
  onConfirm,
}: ExcitementConfirmationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<SequencePhase>('idle');
  const [messageStep, setMessageStep] = useState<0 | 1 | 2>(0);
  const [memoryImgFailed, setMemoryImgFailed] = useState(false);

  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const preload = new Image();
    preload.src = REVEAL_IMAGE_URL;

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const schedule = (fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    timersRef.current.push(id);
  };

  const handleTriggerReveal = () => {
    if (hasStartedRef.current || phase !== 'idle') return;
    hasStartedRef.current = true;

    const activationDelaySec = prefersReducedMotion ? 0.05 : 0.36;
    playVintageShutterSound(activationDelaySec);

    if (prefersReducedMotion) {
      setPhase('flash');
      schedule(() => setPhase('revealed'), 240);
      schedule(() => setMessageStep(1), 500);
      schedule(() => setMessageStep(2), 1100);
      schedule(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onConfirm();
        }
      }, 2800);
      return;
    }

    // 1. Camera activation (focus pull + gentle lens turn)
    setPhase('activating');

    // 2 & 3. Shutter & warm-white flash
    schedule(() => {
      setPhase('flash');
    }, 380);

    // 4. Photograph reveal
    schedule(() => {
      setPhase('revealed');
    }, 680);

    // 5. Message reveal line 1 & line 2
    schedule(() => {
      setMessageStep(1);
    }, 1350);

    schedule(() => {
      setMessageStep(2);
    }, 2350);

    // 6. Smooth transition to existing birthday homepage
    schedule(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onConfirm();
      }
    }, 4550);
  };

  const isLocked = phase !== 'idle';

  return (
    <motion.main
      key="excitement-confirmation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: prefersReducedMotion ? 0.15 : 0.65,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#F8F5EF] px-6 py-12 text-[#403128]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 42%, rgba(243, 237, 228, 0.78) 0%, rgba(248, 245, 239, 0.98) 72%)',
      }}
    >
      {/* Subtle vintage film grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm-white camera flash overlay */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            key="camera-flash"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: prefersReducedMotion ? 0.3 : 0.92 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.18 : 0.32,
              ease: 'easeOut',
            }}
            className="pointer-events-none fixed inset-0 z-40 bg-[#FFFDF8]"
          />
        )}
      </AnimatePresence>

      <div
        className={`relative z-20 mx-auto flex w-full flex-col items-center text-center ${
          phase === 'revealed' ? 'max-w-[1040px]' : 'max-w-[680px]'
        }`}
      >
        <AnimatePresence mode="wait">
          {phase !== 'revealed' ? (
            /* Camera Prompt Stage */
            <motion.section
              key="camera-prompt-stage"
              aria-labelledby="camera-stage-heading"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                transition: { duration: prefersReducedMotion ? 0.12 : 0.25 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full flex-col items-center"
            >
              {/* Eyebrow */}
              <p className="text-[12px] font-medium tracking-[0.16em] text-[#A18C77]">
               
              </p>

              {/* Main Heading */}
              <h1
                id="camera-stage-heading"
                className="font-editorial mt-3 text-[clamp(2.2rem,4.6vw,3.25rem)] leading-[1.12] font-medium tracking-[-0.015em] text-[#403128]"
                style={{ textWrap: 'balance' }}
              >
                Are you really excited?
              </h1>

              {/* Hand-Drawn Vintage Analog Camera Illustration */}
              <HandDrawnVintageCamera
                isActivating={phase === 'activating'}
                reducedMotion={Boolean(prefersReducedMotion)}
              />

              {/* Supporting & Secondary Lines */}
              <div className="space-y-1.5">
                <p className="text-[16px] leading-relaxed text-[#403128]/90 sm:text-[17px]">
                  
                </p>
                <p className="font-editorial text-[1.2rem] italic text-[#A18C77] sm:text-[1.3rem]">
                 
                </p>
              </div>

              {/* Two Identical-Action YES Buttons */}
              <div className="mt-7 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
                <motion.button
                  type="button"
                  onClick={handleTriggerReveal}
                  disabled={isLocked}
                  whileHover={
                    prefersReducedMotion || isLocked ? undefined : { y: -1 }
                  }
                  whileTap={
                    prefersReducedMotion || isLocked
                      ? undefined
                      : { scale: 0.985 }
                  }
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-[46px] w-full max-w-[230px] cursor-pointer rounded-xl bg-[#403128] px-7 py-3 text-[14.5px] font-medium tracking-[0.015em] text-[#FAF7F2] shadow-[0_10px_24px_-12px_rgba(64,49,40,0.45)] transition-colors duration-150 hover:bg-[#31251E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#403128] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] disabled:cursor-default disabled:opacity-75 sm:w-auto sm:min-w-[184px] whitespace-nowrap shrink-0"
                >
                  Yes, absolutely ♡
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleTriggerReveal}
                  disabled={isLocked}
                  whileHover={
                    prefersReducedMotion || isLocked ? undefined : { y: -1 }
                  }
                  whileTap={
                    prefersReducedMotion || isLocked
                      ? undefined
                      : { scale: 0.985 }
                  }
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-[46px] w-full max-w-[230px] cursor-pointer rounded-xl border border-[#D8CBB8] bg-transparent px-7 py-3 text-[14.5px] font-medium tracking-[0.015em] text-[#403128] transition-colors duration-150 hover:border-[#A18C77] hover:bg-[#F3EDE4]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A18C77] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] disabled:cursor-default disabled:opacity-75 sm:w-auto sm:min-w-[184px] whitespace-nowrap shrink-0"
                >
                  Of course! ♡
                </motion.button>
              </div>
            </motion.section>
          ) : (
            /* Golden-Hour Photograph & Message Reveal Stage */
            <motion.section
              key="photograph-reveal-stage"
              aria-live="polite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.25 : 0.95,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex w-full flex-col items-center"
            >
              {/* Clean borderless memory photograph — scaled proportionally to the page */}
              <div className="relative w-full max-w-[min(90vw,calc(78dvh*1599/899),980px)] overflow-hidden shadow-[0_26px_62px_-20px_rgba(64,49,40,0.3)]">
                {memoryImgFailed ? (
                  <div
                    role="img"
                    aria-label="Childhood birthday photograph"
                    className="aspect-[16/9] w-full bg-gradient-to-br from-[#F3EDE4] via-[#E8D7BD] to-[#D4B894]"
                  />
                ) : (
                  <img
                    src={REVEAL_IMAGE_URL}
                    alt="Childhood birthday memory photograph"
                    onError={() => setMemoryImgFailed(true)}
                    className="block h-auto w-full"
                  />
                )}

                {/* Subtle film grain over revealed photograph */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='photoGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23photoGrain)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>

              {(messageStep >= 1 || messageStep >= 2) && (
                <span className="sr-only" aria-hidden="true" />
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
