/**
 * Appointment service.
 *
 * PROTOTYPE BEHAVIOUR: records live in a module-level array. Nothing is sent
 * anywhere, nothing is saved in the browser, and a page refresh resets all of
 * it. New requests get the status "prototype_draft" (= NOT sent to a hospital).
 *
 * BACKEND SEAM: keep these function names and types. In the backend phase,
 * replace the bodies with Supabase calls. Patients may only read their own
 * rows and hospitals only rows for their own hospital (Row Level Security).
 */
import { DEMO_APPOINTMENTS } from '../data/demo/appointments';
import { DEMO_DOCTORS } from '../data/demo/doctors';
import { DEMO_HOSPITALS } from '../data/demo/hospitals';
import type { AppointmentRequest, TimePreference } from '../types';
import { simulateNetwork } from './simulate';

let store: AppointmentRequest[] = DEMO_APPOINTMENTS.map((appointment) => ({ ...appointment }));
let counter = 0;

const newestFirst = (a: AppointmentRequest, b: AppointmentRequest): number => b.createdAt.localeCompare(a.createdAt);

export interface NewAppointmentInput {
  hospitalId: string;
  doctorId?: string;
  patientName: string;
  contact: string;
  preferredDate: string;
  preferredTime: TimePreference;
  note?: string;
}

export type ReplyDecision = 'confirm' | 'reschedule' | 'decline';

export interface ReplyInput {
  decision: ReplyDecision;
  /** ISO date, used for "confirm" and "reschedule" */
  date?: string;
  /** "HH:MM", used for "confirm" and "reschedule" */
  time?: string;
  message: string;
}

/** Requests of the demo patient, including prototype drafts created in this session. */
export function listMyAppointments(): Promise<AppointmentRequest[]> {
  return simulateNetwork(
    store
      .filter((a) => a.ownedByDemoPatient)
      .sort(newestFirst)
      .map((a) => ({ ...a })),
  );
}

/** Requests that reached a hospital. Prototype drafts are never "sent", so they are excluded. */
export function listHospitalRequests(hospitalId: string): Promise<AppointmentRequest[]> {
  return simulateNetwork(
    store
      .filter((a) => a.hospitalId === hospitalId && a.status !== 'prototype_draft')
      .sort(newestFirst)
      .map((a) => ({ ...a })),
  );
}

/** Number of requests that reached a hospital (used by admin statistics). */
export function countSentRequests(): number {
  return store.filter((a) => a.status !== 'prototype_draft').length;
}

export function createAppointmentRequest(input: NewAppointmentInput): Promise<AppointmentRequest> {
  const hospital = DEMO_HOSPITALS.find((h) => h.id === input.hospitalId);
  if (!hospital) return Promise.reject(new Error('Hospital not found'));
  const doctor = input.doctorId ? DEMO_DOCTORS.find((d) => d.id === input.doctorId) : undefined;

  counter += 1;
  const created: AppointmentRequest = {
    id: `a-proto-${counter}`,
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    doctorId: doctor?.id,
    doctorName: doctor?.name,
    patientName: input.patientName.trim(),
    contact: input.contact.trim(),
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    note: input.note?.trim() || undefined,
    status: 'prototype_draft',
    createdAt: new Date().toISOString(),
    ownedByDemoPatient: true,
    isDemo: true,
  };
  store = [created, ...store];
  return simulateNetwork({ ...created });
}

export function cancelAppointment(id: string): Promise<AppointmentRequest> {
  const index = store.findIndex((a) => a.id === id);
  if (index === -1) return Promise.reject(new Error('Appointment not found'));
  store[index] = { ...store[index], status: 'cancelled' };
  return simulateNetwork({ ...store[index] });
}

/** Hospital reply to a request: confirm, suggest another time, or decline. */
export function respondToRequest(id: string, input: ReplyInput): Promise<AppointmentRequest> {
  const index = store.findIndex((a) => a.id === id);
  if (index === -1) return Promise.reject(new Error('Appointment not found'));
  const status = input.decision === 'confirm' ? 'confirmed' : input.decision === 'reschedule' ? 'rescheduled' : 'declined';
  store[index] = {
    ...store[index],
    status,
    response: {
      message: input.message.trim(),
      date: input.decision === 'decline' ? undefined : input.date,
      time: input.decision === 'decline' ? undefined : input.time,
      respondedAt: new Date().toISOString(),
    },
  };
  return simulateNetwork({ ...store[index] });
}
