import crypto from 'node:crypto';
import express, { type Request, type Response } from 'express';
import { SURPRISE_PAYLOAD } from '../src/config/surprisePayload';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

const verifyPasswordConstantTime = (candidate: string, expected: string) => {
  const candidateDigest = crypto.createHash('sha256').update(candidate).digest();
  const expectedDigest = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(candidateDigest, expectedDigest);
};

app.post('/api/unlock', (req: Request, res: Response) => {
  const candidate = typeof req.body?.password === 'string' ? req.body.password : '';
  const primaryPassword = process.env.BIRTHDAY_PASSWORD || '8878871157';
  const secondaryPassword = process.env.BIRTHDAY_ALT_PASSWORD || '9302370048';

  let unlockMode: 'later-escapes' | 'yes-escapes' | null = null;
  if (candidate && verifyPasswordConstantTime(candidate, primaryPassword)) {
    unlockMode = 'later-escapes';
  } else if (candidate && verifyPasswordConstantTime(candidate, secondaryPassword)) {
    unlockMode = 'yes-escapes';
  }

  if (!unlockMode) {
    res.status(401).json({ ok: false, error: "Oops! That's not the right password. Try again ♡" });
    return;
  }
  res.status(200).json({ ok: true, surprise: SURPRISE_PAYLOAD, unlockMode });
});

const registerPasscodeRoutes = (
  path: string,
  envName: 'SECRET_PASSCODE' | 'NEXT_SECRET_PASSCODE',
  fallback: string,
  singular: 'secret' | 'passcode'
) => {
  const getExpected = () => process.env[envName] || fallback;
  const prefix = path;

  app.post(`/api/${prefix}`, (req: Request, res: Response) => {
    const candidate = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    if (!candidate || !verifyPasswordConstantTime(candidate, getExpected())) {
      res.status(401).json({ ok: false, error: `Oops! That's not the right ${singular}. Try again ♡` });
      return;
    }
    res.status(200).json({ ok: true });
  });

  app.post(`/api/${prefix}-digit`, (req: Request, res: Response) => {
    const expected = getExpected();
    const { index } = req.body ?? {};
    const digit = typeof req.body?.digit === 'string' ? req.body.digit : '';
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= expected.length || !/^[0-9]$/.test(digit)) {
      res.status(400).json({ ok: false, error: 'Invalid digit input.' });
      return;
    }
    res.status(200).json({ ok: true, valid: verifyPasswordConstantTime(digit, expected[index]) });
  });
};

registerPasscodeRoutes('verify-secret', 'SECRET_PASSCODE', '8090', 'secret');
registerPasscodeRoutes('verify-next-secret', 'NEXT_SECRET_PASSCODE', '2003', 'passcode');

export default app;
