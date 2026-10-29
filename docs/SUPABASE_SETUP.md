# Supabase Setup Guide

This document outlines the foundation for the MediSetu backend using Supabase.
**Note:** The backend is currently in **Phase 1 preparation mode**. The live frontend and demo functionality remain entirely untouched and decoupled from this backend until a real Supabase instance is provisioned and linked.

## 1. Project Initialization

1. Create a new Supabase project in the Supabase Dashboard.
2. In the project dashboard, go to the SQL Editor.
3. Apply the migrations located in `supabase/migrations/` sequentially:
   - `00001_initial_schema.sql` (Creates tables, relations, types, and triggers)
   - `00002_rls_policies.sql` (Enables Row Level Security on all tables)

## 2. Environment Variables

Once the Supabase project is running, create a `.env.local` file in the project root containing only the public details. **Never commit this file or the service role key.**

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

When deploying (e.g. via GitHub Actions), add these exact names to your repository hosting secrets.

## 3. Security Model (Row Level Security)

All application tables are protected by Row Level Security (RLS) ensuring strict data isolation:
- **Roles:** User permissions are determined strictly by the `profiles.role` column (`patient`, `hospital`, `admin`). A user cannot escalate their own privileges (enforced via update checks).
- **Patients:** Can only view, create, and manage their *own* appointments and documents. They cannot see other patients' data.
- **Hospitals:** Can only view and update data associated with their own `hospital_id`. They can see appointment requests sent to their facilities but cannot access the larger patient dataset.
- **Unverified Hospitals:** Hospitals begin as `unverified`. Unverified hospitals are invisible to the public and patients. They will only become visible when an admin updates the `verification_status` to `verified`.
- **Admins:** Read and update permissions across tables necessary for verification processes. Sensitive actions are restricted.

## 4. Current State Note

The setup here establishes the foundation, schemas, and security. No real user data or live database connection is enabled in the frontend yet. Do not swap `directoryService` or `appointmentService` over to real Supabase client calls until authentication is also fully wired in a subsequent phase.
