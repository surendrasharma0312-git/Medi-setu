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

export interface SignInInput {
  role: UserRole;
  /** Mobile number or email address */
  identifier: string;
  password: string;
}

export interface PatientRegistrationInput {
  fullName: string;
  /** Mobile number or email address */
  contact: string;
  password: string;
}

export interface HospitalRegistrationInput {
  hospitalName: string;
  facilityType: string;
  contactPerson: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  city: string;
  address: string;
  specialtyIds: string[];
  registrationNumber: string;
  password: string;
}

export interface ContactMessageInput {
  name: string;
  contact: string;
  message: string;
}

const NOT_CONNECTED: PrototypeResult = { ok: false, reason: 'backend_not_connected' };

// The underscore-prefixed parameters are intentionally unused in the prototype.

export function signIn(_input: SignInInput): Promise<PrototypeResult> {
  void _input;
  return simulateNetwork(NOT_CONNECTED);
}

export function registerPatient(_input: PatientRegistrationInput): Promise<PrototypeResult> {
  void _input;
  return simulateNetwork(NOT_CONNECTED);
}

export function registerHospital(_input: HospitalRegistrationInput): Promise<PrototypeResult> {
  void _input;
  return simulateNetwork(NOT_CONNECTED);
}

export function sendContactMessage(_input: ContactMessageInput): Promise<PrototypeResult> {
  void _input;
  return simulateNetwork(NOT_CONNECTED);
}
