/**
 * Authentication and contact services: PROTOTYPE STUBS.
 *
 * Nothing here authenticates anyone, creates an account or sends a message.
 * Every function resolves to a "backend_not_connected" result and the UI says so.
 * Passwords and personal details are never stored, logged or transmitted.
 *
 * BACKEND SEAM (Supabase Auth): replace the bodies and extend the result types
 * (for example { ok: true; user } | { ok: false; error }). Role (patient,
 * hospital, admin) must come from the server session, never from the client.
 */
import { simulateNetwork } from './simulate';

export interface PrototypeResult {
  ok: false;
  reason: 'backend_not_connected';
}

export type UserRole = 'patient' | 'hospital' | 'admin';

const NOT_CONNECTED: PrototypeResult = { ok: false, reason: 'backend_not_connected' };

export function signIn(): Promise<PrototypeResult> {
  return simulateNetwork(NOT_CONNECTED);
}

export function registerPatient(): Promise<PrototypeResult> {
  return simulateNetwork(NOT_CONNECTED);
}

export function registerHospital(): Promise<PrototypeResult> {
  return simulateNetwork(NOT_CONNECTED);
}

export function sendContactMessage(): Promise<PrototypeResult> {
  return simulateNetwork(NOT_CONNECTED);
}
