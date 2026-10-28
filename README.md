# MediSetu: frontend foundation (prototype)

MediSetu is a planned hospital and doctor discovery platform for India, launching first in **Siwan, Bihar**.
Patients will search hospitals and doctors by location, view profiles and send appointment requests.
Hospitals will manage their own listings and replies; an admin will verify hospitals.

> **This repository is a PROTOTYPE.** Every hospital, doctor, phone number and appointment is **fictional demo data**.
> No real bookings, accounts, messages, documents or medical information are handled. The privacy policy and terms
> pages are **initial drafts that need legal review**. The Hindi translations need review by a native speaker.

Stack: React 18 + TypeScript + Vite, React Router 6, plain CSS. Runtime dependencies: `react`, `react-dom`, `react-router-dom` only.
Interface languages: English and Hindi (toggle in the header).

## Quick start

Requires Node.js 18 or newer (20 recommended).

```bash
npm install        # also creates package-lock.json: commit it
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript only
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## What works today (on demo data)

- 19 routes: home, hospital search + profile, doctor directory + profile, appointment request form, My appointments,
  patient and hospital login/registration screens, patient/hospital/admin dashboards, About, Contact, Privacy (draft),
  Terms (draft), custom 404.
- Search and filters: hospital or doctor name, specialty, state, district, city/locality, facility type, and everyday
  words such as "pain", "fever", "teeth" (English and Hindi). Filters live in the URL, so results can be shared.
- Loading, empty, no-results and error states (add `?simulateError=1` to a URL to see the error state).
- Forms with frontend validation, visible labels, error messages and focus on the first error.
- Prototype actions that only change in-memory demo data: create/cancel an appointment draft, hospital reply, admin approve/reject.
- English / Hindi toggle, responsive layouts, keyboard navigation, visible focus styles, skip link, accessible modal.

## What is NOT implemented

- No backend, database, real authentication, roles or Row Level Security.
- Login, registration and the contact form validate input and then say plainly that nothing is connected.
- Appointment requests are **not sent anywhere** and disappear on refresh (status "Prototype draft (not sent)").
- No document or prescription upload (the field is shown disabled). No notifications.
- No hospital verification workflow and **no verified badges** (all demo records are "Not verified").
- No ratings or reviews. No doctor qualifications (none are invented).
- No pagination, code splitting, analytics, SEO tags per page, automated tests or CI checks beyond the Pages deploy.

## Folder map

```
index.html              HTML entry
vite.config.ts          Vite config (base path comes from VITE_BASE_PATH)
.env.example            Documented environment variables (no secrets)
.github/workflows/      deploy.yml: builds and publishes to GitHub Pages
docs/ROADMAP.md         Phased plan, suggested data model, RLS notes
public/                 Static assets (favicon)
src/
  main.tsx, App.tsx     Providers and route rendering
  routes/               paths.ts (all URLs) and index.tsx (route table)
  layouts/              MainLayout, AuthLayout, DashboardLayout
  pages/                One file per page (auth/, dashboards/ subfolders)
  components/
    ui/                 Button, Fields, Modal, Badge, Notice, States, Icon, PageHeader, ContentPage, StatCard
    layout/             Header, Footer, LanguageToggle, PrototypeBanner, BrandMark, ScrollToTop
    hospital/ doctor/ appointment/ auth/   Feature components
  services/             THE BACKEND SEAM: all data access goes through here
  data/
    reference.ts        States, facility types, specialties, services (pages may import)
    demo/               Fictional records (ONLY services may import)
  hooks/                useAsync (loading/error), useForm (validation), useDocumentTitle
  i18n/                 Provider + translations/en.ts, hi.ts (flat keys, typed)
  types/index.ts        Shared TypeScript types
  utils/                format, validation, schedule helpers
  config/site.ts        Site constants (name, emergency number, launch area)
  styles/               tokens.css (design tokens), base.css, components.css, pages.css
```

## How it fits together

- **Routing:** add a URL in `src/routes/paths.ts`, build the page in `src/pages`, register it in `src/routes/index.tsx`.
- **Data layer:** pages never import demo data. They call functions in `src/services` through `useAsync`.
  To connect Supabase, keep each function's name and return type and replace its body. Pages should not change.
  Each service file explains which role may call it and where Row Level Security belongs.
- **i18n:** UI text lives in `en.ts`; `hi.ts` is typed so the build fails if a key is missing. Data values that need two
  languages use `{ en, hi }` (see `data/reference.ts`). Use `t('key')`, `pick(localizedText)` and `place(name)`.
- **Forms:** `useForm` + validators in `utils/validation.ts` (return translation keys). Forms use `noValidate` and
  custom messages. Field ids are `field-<name>`.
- **Styling:** change colours, spacing and radii in `styles/tokens.css`. System fonts only (no external requests).
- **Demo labelling:** every demo record shows a "Demo data" badge; prototype-only actions say so on screen. Keep this until real data replaces it.

## Safety and privacy rules (keep these)

1. Do not request or store real patient medical information in the frontend prototype.
2. Never show a "verified" badge unless a real verification record exists.
3. Never invent hospitals, doctors, credentials, ratings or reviews; demo names must stay obviously fictional.
4. Medical documents must never be reachable by public URLs (private storage, short-lived signed links, role checks).
5. MediSetu is not an emergency service or a diagnosis tool. Keep the emergency (112) and "request is not a booking" notices.
6. Never put secrets in frontend code or `.env` files that are committed. The Supabase service-role key must never reach the browser.

## Upload to GitHub

Create a new **empty** repository (no README, no .gitignore) on github.com, for example `medisetu`.

**From a computer:** unzip the project, then in the unzipped folder run

```bash
git init -b main
git add .
git commit -m "Initial MediSetu frontend foundation"
git remote add origin https://github.com/YOUR-USERNAME/medisetu.git
git push -u origin main
```

(Alternative: on the new repository page choose "uploading an existing file" and drag in the **contents** of the unzipped folder, including the hidden `.github` folder.)

**From an Android phone:** the GitHub website cannot upload folders from a phone. Install **Termux**, then:

```bash
pkg update && pkg install git unzip -y
termux-setup-storage                      # allow storage access
cd ~ && unzip ~/storage/downloads/medisetu-frontend.zip
cd medisetu-frontend
git init -b main && git add . && git commit -m "Initial MediSetu frontend foundation"
git remote add origin https://github.com/YOUR-USERNAME/medisetu.git
git push -u origin main                   # username + a personal access token as the password
```

Create the token in GitHub: Settings, Developer settings, Personal access tokens (fine-grained), only this repository,
permission "Contents: Read and write". Never paste the token into chats, code or issues.

`node_modules/`, `dist/` and `.env` files are already in `.gitignore`, so no build artifacts or secrets are uploaded.

## Publish on GitHub Pages (optional)

1. Repository Settings, Pages, Source: **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` installs, builds and publishes the site at
   `https://YOUR-USERNAME.github.io/medisetu/`. It sets `VITE_BASE_PATH` automatically and adds a `404.html` copy so
   deep links work. For a user site (`<name>.github.io`) change `VITE_BASE_PATH` in the workflow to `/`.

## Working with Google Jules

Point Jules at the repository and start with something like:

> Read README.md and docs/ROADMAP.md. Work on Phase 1 only. Keep every page and component working; replace the bodies of
> the functions in `src/services` with Supabase calls without changing their names or return types. Keep the demo data
> only in a separate seed script. Do not remove prototype/demo labels until the data is real. Run `npm run build` before
> finishing and list anything you could not verify.

## Verification status of this delivery

Done in an offline sandbox (no internet, so `npm install` and `vite build` could **not** run):

- TypeScript strict type-check (unused code, null checks) of all source files, using small stand-in type declarations for React and React Router.
- All source bundled with esbuild (with a stand-in for React Router) and tested in headless Chromium with 228 automated checks:
  all 19 routes at 390px and 320px wide (one `h1`, no sideways scrolling, no console errors), search and filters against demo records,
  form validation, modals, the appointment draft flow, hospital reply, admin actions, and the English/Hindi toggle.
- English and Hindi dictionaries checked key by key (389 keys each, none missing or unused).

**Not verified:** the real `npm install`, `npm run build` and the compiler against the real `@types/react` and `react-router-dom`
packages (fix any small type errors first); the GitHub Actions workflow; Hindi glyph rendering and wording; real phones and screen readers;
automated accessibility or Lighthouse audits.

## License

No license has been chosen yet. Add one before sharing the code publicly.
