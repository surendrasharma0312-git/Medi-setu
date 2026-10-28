# MediSetu roadmap

This file is the plan for whoever works on the project next (a developer or a coding agent such as Google Jules).
Work phase by phase. Do not overwrite working features without a clear reason, and keep the safety rules in the README.

## Rules for every phase

- Keep function names and return types in `src/services`; change their bodies, not the pages.
- Keep demo labels until a screen shows real data. Move demo data into a seed script, not into production paths.
- Never store real patient medical information outside the secure document flow (Phase 4).
- Never show "verified" without a real verification record created by an admin.
- Run `npm run build` before every pull request and list what you could not verify.
- Every new user-facing string goes into **both** `en.ts` and `hi.ts`.

## Phase 0: Frontend foundation (done in this repository)

- [x] 19 routes, shared design system, English/Hindi toggle, responsive and keyboard-friendly UI
- [x] Search and filters on demo data, loading/empty/no-results/error states
- [x] Service layer that isolates demo data (the backend seam), typed forms with validation
- [x] Honest prototype labelling, draft privacy policy and terms, GitHub Pages workflow
- [ ] Known gaps: no automated tests, no pagination, no code splitting, Hindi unreviewed, real build not yet run (see README)

## Phase 1: Backend foundation (Supabase)

- [ ] Create the Supabase project; add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon key only) via `.env.local` and hosting secrets
- [ ] Write SQL migrations for the tables below; enable Row Level Security on **every** table before adding data
- [ ] Supabase Auth: sign-in with phone or email; `profiles` row per user with a `role` (`patient`, `hospital`, `admin`)
- [ ] Replace the bodies of `directoryService`, `appointmentService`, `adminService`, `authService`; keep types in `src/types`
- [ ] Add a session/auth context and route guards (UI hiding is not security; RLS is the real protection)
- [ ] Remove the dashboard role tabs; each role sees only its own dashboard
- [ ] Seed script for local development only; production starts empty
- [ ] Server-side search and pagination (start with Postgres `ILIKE` and `pg_trgm`; later full-text search)

## Phase 2: Hospital onboarding and verification

- [ ] Registration creates a hospital in status `pending`; it is hidden from search until reviewed (decide whether `unverified` listings may appear at launch, and label them clearly if so)
- [ ] Admin review queue with approve / reject and a reason; every decision is written to an audit log
- [ ] Hospital dashboard: edit profile, hours, services; add doctors and weekly schedules
- [ ] Private upload of verification documents (licence, registration) with admin-only access
- [ ] Show a verified badge only when `verification_status = 'verified'`

## Phase 3: Appointment workflow

- [ ] Status machine: `requested` -> `confirmed` | `rescheduled` | `declined`; patient may `cancel`; hospital may mark `completed`
- [ ] Hospital reply stores date, time and message; patient sees it in My appointments
- [ ] Notifications (SMS / WhatsApp / email): choose provider, collect consent, keep messages free of medical details
- [ ] Abuse protection: rate limits, duplicate-request checks, bot protection on public forms
- [ ] Remove the "Prototype draft" status and notices once requests are really sent

## Phase 4: Secure documents

- [ ] Private storage bucket; no public URLs; short-lived signed URLs; only the patient and the involved hospital can read
- [ ] Explicit consent text before upload; file type and size limits; malware scanning if available
- [ ] Retention and deletion policy; access log; patient can delete their documents
- [ ] Enable the (currently disabled) attachment field on the appointment form

## Phase 5: Launch readiness for Siwan, Bihar

- [ ] Lawyer review of Privacy Policy and Terms (including the Digital Personal Data Protection Act, 2023); remove "draft" labels only after review
- [ ] Native Hindi review of every string, especially medical and legal wording; consider Bhojpuri later
- [ ] Accessibility audit: keyboard, screen reader (TalkBack), contrast, 200% zoom, axe/Lighthouse
- [ ] Performance on low-end phones and slow networks: route-level code splitting, self-hosted fonts, image budgets
- [ ] Real hospital data collected and verified; contact details, address and office hours for the Contact page
- [ ] Error tracking, uptime monitoring, backups, support process, emergency-notice review (112)
- [ ] Analytics only with consent and without health data

## Phase 6: Scale across India

- [ ] Full state / district / locality directory (for example Local Government Directory codes) replacing `PLACE_NAMES_HI`
- [ ] Better search: full-text, typo tolerance, distance sorting, optional map view
- [ ] Doctor profiles with verified credentials; doctors linked to multiple hospitals
- [ ] Ratings and reviews only if genuine, moderated and verifiable (never invented)
- [ ] Business model decisions after the product proves useful (the current plan is free listing at launch)

## Suggested data model (starting point)

| Table | Key columns |
|---|---|
| `profiles` | `id` (= auth user id), `role`, `full_name`, `phone`, `email`, `created_at` |
| `hospitals` | `id`, `owner_id`, `name`, `facility_type`, `state_code`, `district`, `city`, `locality`, `address_line`, `phone`, `email`, `verification_status`, `verified_by`, `verified_at` |
| `hospital_specialties` | `hospital_id`, `specialty_id` |
| `hospital_services` | `hospital_id`, `service_id` |
| `hospital_hours` | `hospital_id`, `weekday`, `opens`, `closes` |
| `doctors` | `id`, `name`, `specialty_id`, `credentials` (only after verification), `created_by` |
| `doctor_schedules` | `doctor_id`, `hospital_id`, `weekday`, `from_time`, `to_time` |
| `appointments` | `id`, `patient_id`, `hospital_id`, `doctor_id`, `preferred_date`, `preferred_time`, `note`, `status`, `created_at` |
| `appointment_events` | `appointment_id`, `actor_id`, `from_status`, `to_status`, `message`, `proposed_date`, `proposed_time`, `created_at` |
| `documents` | `id`, `appointment_id`, `owner_id`, `storage_path` (private), `consent_at`, `deleted_at` |
| `verification_requests` | `id`, `hospital_id`, `submitted_at`, `decision`, `decided_by`, `reason` |
| `audit_log` | `id`, `actor_id`, `action`, `target_table`, `target_id`, `created_at` |

Keep specialties, services and states as reference tables (they mirror `src/data/reference.ts`).

## Row Level Security principles

- Roles come from the server (`profiles.role` or `app_metadata` set by an admin function), **never** from user-editable metadata.
- Patients: read/insert/cancel only their own appointments and documents.
- Hospital staff: read and answer appointments where `hospital_id` belongs to a hospital they own; edit only their own hospital and doctors.
- Admins: verification decisions and audit log; every admin write is logged.
- Public (not signed in): read hospitals and doctors that are allowed to be public (decide by verification status); no read access to appointments or documents.
- Storage policies mirror table policies; documents are never public.
- Test policies with one case per role and per table before enabling real data.
