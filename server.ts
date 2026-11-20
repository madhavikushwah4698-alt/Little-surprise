import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { SURPRISE_PAYLOAD } from './src/config/surprisePayload';
import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const INCORRECT_PASSWORD_MESSAGE =
  "Oops! That's not the right password. Try again â™¡";


function verifyPasswordConstantTime(candidate: string, expected: string): boolean {
  const candidateDigest = crypto
    .createHash('sha256')
    .update(candidate, 'utf8')
    .digest();
  const expectedDigest = crypto
    .createHash('sha256')
    .update(expected, 'utf8')
    .digest();
  return crypto.timingSafeEqual(candidateDigest, expectedDigest);
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  app.post('/api/unlock', (req: Request, res: Response) => {
    const rawPassword =
      typeof req.body?.password === 'string' ? req.body.password : '';
    const primaryPassword = process.env.BIRTHDAY_PASSWORD || '8878871157';
    const secondaryPassword = process.env.BIRTHDAY_ALT_PASSWORD || '9302370048';

    let unlockMode: 'later-escapes' | 'yes-escapes' | null = null;
    if (rawPassword && verifyPasswordConstantTime(rawPassword, primaryPassword)) {
      unlockMode = 'later-escapes';
    } else if (
      rawPassword &&
      verifyPasswordConstantTime(rawPassword, secondaryPassword)
    ) {
      unlockMode = 'yes-escapes';
    }

    if (!unlockMode) {
      res.status(401).json({
        ok: false,
        error: INCORRECT_PASSWORD_MESSAGE,
      });
      return;
    }

    res.status(200).json({
      ok: true,
      surprise: SURPRISE_PAYLOAD,
      unlockMode,
    });
  });

  app.post('/api/verify-secret', (req: Request, res: Response) => {
    const rawCode =
      typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    const expectedSecret = process.env.SECRET_PASSCODE || '8090';

    if (!rawCode || !verifyPasswordConstantTime(rawCode, expectedSecret)) {
      res.status(401).json({
        ok: false,
        error: "Oops! That's not the right secret. Try again â™¡",
      });
      return;
    }

    res.status(200).json({ ok: true });
  });

  app.post('/api/verify-secret-digit', (req: Request, res: Response) => {
    const index = req.body?.index;
    const digit = typeof req.body?.digit === 'string' ? req.body.digit : '';
    const expectedSecret = process.env.SECRET_PASSCODE || '8090';

    if (
      typeof index !== 'number' ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= expectedSecret.length ||
      !/^[0-9]$/.test(digit)
    ) {
      res.status(400).json({ ok: false, error: 'Invalid digit input.' });
      return;
    }

    const valid = verifyPasswordConstantTime(digit, expectedSecret[index]);
    res.status(200).json({ ok: true, valid });
  });

  app.post('/api/verify-next-secret', (req: Request, res: Response) => {
    const rawCode =
      typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    const expectedNextSecret = process.env.NEXT_SECRET_PASSCODE || '2003';

    if (!rawCode || !verifyPasswordConstantTime(rawCode, expectedNextSecret)) {
      res.status(401).json({
        ok: false,
        error: "Oops! That's not the right passcode. Try again â™¡",
      });
      return;
    }

    res.status(200).json({ ok: true });
  });

  app.post('/api/verify-next-secret-digit', (req: Request, res: Response) => {
    const index = req.body?.index;
    const digit = typeof req.body?.digit === 'string' ? req.body.digit : '';
    const expectedNextSecret = process.env.NEXT_SECRET_PASSCODE || '2003';

    if (
      typeof index !== 'number' ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= expectedNextSecret.length ||
      !/^[0-9]$/.test(digit)
    ) {
      res.status(400).json({ ok: false, error: 'Invalid digit input.' });
      return;
    }

    const valid = verifyPasswordConstantTime(digit, expectedNextSecret[index]);
    res.status(200).json({ ok: true, valid });
  });

  const AUDIO_EXTS = new Set(['.mp3', '.m4a', '.ogg', '.wav']);
  const findBackgroundMusicFile = (): string | null => {
    const candidateDirs = [
      path.resolve(__dirname, 'public', 'audio'),
      path.resolve(__dirname, 'src', 'assets', 'audio'),
      path.resolve(__dirname, 'dist', 'audio'),
      __dirname,
    ];

    const scoreAudioName = (name: string): number => {
      const lower = name.toLowerCase();
      let score = 0;
      if (lower.includes('171223')) score += 4;
      if (lower.includes('20559')) score += 4;
      if (lower.includes('japan')) score += 3;
      if (lower.includes('piano')) score += 2;
      if (lower.endsWith('.mp3')) score += 1;
      return score;
    };

    const matches: Array<{ fullPath: string; score: number }> = [];
    for (const dir of candidateDirs) {
      if (!fs.existsSync(dir)) continue;
      let entries: fs.Dirent[] = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        const ext = path.extname(entry.name).toLowerCase();
        if (!AUDIO_EXTS.has(ext)) continue;
        const fullPath = path.join(dir, entry.name);
        try {
          if (fs.statSync(fullPath).size > 0) {
            matches.push({ fullPath, score: scoreAudioName(entry.name) });
          }
        } catch {
          // Skip unreadable files
        }
      }
    }

    if (matches.length === 0) return null;
    matches.sort((a, b) => b.score - a.score);
    return matches[0].fullPath;
  };

  app.get('/api/background-music/status', (_req: Request, res: Response) => {
    const filePath = findBackgroundMusicFile();
    res.status(200).json({
      available: Boolean(filePath),
      src: filePath ? '/api/background-music' : null,
    });
  });

  app.get('/api/background-music', (_req: Request, res: Response) => {
    const filePath = findBackgroundMusicFile();
    if (!filePath) {
      res.status(404).end();
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(filePath);
  });

  if (!IS_PRODUCTION) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

