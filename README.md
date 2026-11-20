<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9c23cbb1-83ce-4ce9-a61a-14b4267b1bea

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

The frontend is built with Vite, and the `/api/*` endpoints are served by a Vercel Function in `api/[...route].ts`.

1. Import this repository into Vercel and keep the Vite framework preset and `npm run build` build command.
2. In **Project Settings → Environment Variables**, add `BIRTHDAY_PASSWORD` with the entry password. Add `BIRTHDAY_ALT_PASSWORD`, `SECRET_PASSCODE`, and `NEXT_SECRET_PASSCODE` only if you want to override their built-in defaults.
3. Select the environments you use (Production and, if needed, Preview), save, then redeploy so the new values take effect.

For local development, put the same variables in `.env.local` (see `.env.example`). Do not commit `.env.local` or put these passwords in `VITE_*` variables; those are exposed to browser code.
