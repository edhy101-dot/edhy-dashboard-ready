# Edhy's Learning Dashboard (Ready-to-deploy)

Project: Vite + React + TailwindCSS single-page dashboard to track a 12-week Full Stack learning roadmap.

## Features
- 12-week roadmap with tasks per week
- Progress tracking with localStorage
- Export / Import progress (JSON)
- Responsive futuristic dark UI (Tailwind)
- Quick links and daily checklist

## Setup (locally)
1. Extract the project folder.
2. Install dependencies:
   ```bash
   cd edhy-dashboard-ready
   npm install
   ```
3. Initialize Tailwind:
   Tailwind is already listed in devDependencies. You can use the provided `tailwind.config.js` and `postcss.config.cjs`.
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` (or the URL shown in terminal).

## Deploy to Vercel
1. Push the project to GitHub.
2. Go to https://vercel.com and import the repository.
3. Use the default settings (Vite will be detected).
4. Deploy — Vercel will build and provide a public URL.

## Notes
- The app stores progress in browser `localStorage`. If you want cloud sync, we can add backend + database.
- To change the start date or user name, edit inside the app UI.

Enjoy — let me know if you want me to:
- Add auth & cloud sync (Firebase / Supabase / custom backend)
- Add quizzes or notifications
- Customize branding or colors
