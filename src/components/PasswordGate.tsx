import { useRef, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Lock } from 'lucide-react';
import type { SurpriseData, UnlockMode } from '../types';

interface PasswordGateProps {
  onUnlock: (data: SurpriseData, mode: UnlockMode) => void;
}

const FALLBACK_ERROR = "Oops! That's not the right password. Try again ♡";

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeTick, setShakeTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const candidate = password;
    if (!candidate.trim()) {
      setError(FALLBACK_ERROR);
      setPassword('');
      setShakeTick((prev) => prev + 1);
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: candidate }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok: true; surprise: SurpriseData; unlockMode?: UnlockMode }
        | { ok: false; error?: string }
        | null;

      if (response.ok && payload && payload.ok && payload.surprise) {
        setPassword('');
        onUnlock(payload.surprise, payload.unlockMode ?? 'later-escapes');
        return;
      }

      setPassword('');
      setError(
        payload && !payload.ok && payload.error ? payload.error : FALLBACK_ERROR
      );
      setShakeTick((prev) => prev + 1);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } catch {
      setPassword('');
      setError(FALLBACK_ERROR);
      setShakeTick((prev) => prev + 1);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.main
      key="password-gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.985,
        transition: { duration: prefersReducedMotion ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] },
      }}
      transition={{ duration: prefersReducedMotion ? 0.15 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#FAF7F2] px-6 py-12"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 35%, rgba(235, 224, 208, 0.45) 0%, rgba(250, 247, 242, 0.95) 68%)',
      }}
    >
      <motion.section
        aria-labelledby="gate-heading"
        animate={
          shakeTick > 0 && !prefersReducedMotion
            ? { x: [0, -7, 7, -5, 5, -2, 2, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.38, ease: 'easeOut' }}
        className="w-full max-w-[440px] rounded-2xl border border-[#E6DDD1] bg-[#FDFBF7] p-8 shadow-[0_20px_50px_-18px_rgba(45,35,28,0.09)] sm:p-11"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div
            aria-hidden="true"
            className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#E6DDD1] bg-[#F5EFE6] text-[#5C493E]"
          >
            <Lock className="h-4 w-4 stroke-[1.6]" />
          </div>

          <h1
            id="gate-heading"
            className="font-editorial text-[2rem] leading-[1.15] font-medium tracking-[-0.015em] text-[#2D231C] sm:text-[2.35rem]"
            style={{ textWrap: 'balance' }}
          >
            Enter the password to view
          </h1>

          <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-[#6E5D52]">
            
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="surprise-password" className="sr-only">
              Password
            </label>
            <input
              ref={inputRef}
              id="surprise-password"
              name="password"
              type="password"
              inputMode="text"
              autoComplete="off"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter password"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'password-error' : undefined}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#DFD4C5] bg-[#FAF7F2] px-4 py-3.5 text-center text-[15px] tracking-[0.2em] text-[#2D231C] placeholder:tracking-normal placeholder:text-[#A39386] transition-colors duration-200 focus:border-[#7A6252] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A6252]/25 disabled:opacity-60"
            />
          </div>

          <div className="min-h-[24px] text-center" aria-live="polite">
            {error && (
              <motion.p
                id="password-error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[13.5px] leading-snug text-[#8C4A3E]"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[46px] cursor-pointer rounded-xl bg-[#3D2F27] px-6 py-3 text-[14.5px] font-medium tracking-[0.02em] text-[#FAF7F2] shadow-[0_8px_20px_-8px_rgba(45,35,28,0.45)] transition-all duration-200 hover:bg-[#2B201A] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D2F27] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-not-allowed disabled:opacity-65 whitespace-nowrap"
          >
            {isSubmitting ? 'Unlocking...' : 'Continue'}
          </button>
        </form>
      </motion.section>
    </motion.main>
  );
}
