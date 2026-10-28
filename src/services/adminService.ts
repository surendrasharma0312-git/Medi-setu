/**
 * Admin service (prototype).
 *
 * Approving or rejecting a registration here only changes in-memory demo state.
 * It does NOT verify any hospital and never creates a public "verified" badge.
 *
 * BACKEND SEAM: in the backend phase only users with the "admin" role may call
 * these functions (enforced by Row Level Security / server functions, not only
 * by hiding buttons in the UI).
 */
import { DEMO_DOCTORS } from '../data/demo/doctors';
import { DEMO_HOSPITALS } from '../data/demo/hospitals';
import { DEMO_VERIFICATION_QUEUE } from '../data/demo/verification';
import type { VerificationDecision, VerificationRequest } from '../types';
import { countSentRequests } from './appointmentService';
import { simulateNetwork } from './simulate';

let queue: VerificationRequest[] = DEMO_VERIFICATION_QUEUE.map((item) => ({ ...item }));

export interface AdminStats {
  hospitals: number;
  doctors: number;
  pendingVerifications: number;
  appointmentRequests: number;
}

export function getAdminStats(): Promise<AdminStats> {
  return simulateNetwork({
    hospitals: DEMO_HOSPITALS.length,
    doctors: DEMO_DOCTORS.length,
    pendingVerifications: queue.filter((item) => item.decision === 'pending').length,
    appointmentRequests: countSentRequests(),
  });
}

export function listVerificationQueue(): Promise<VerificationRequest[]> {
  return simulateNetwork(queue.map((item) => ({ ...item })));
}

export function decideVerification(
  id: string,
  decision: Exclude<VerificationDecision, 'pending'>,
): Promise<VerificationRequest> {
  const index = queue.findIndex((item) => item.id === id);
  if (index === -1) return Promise.reject(new Error('Registration not found'));
  queue[index] = { ...queue[index], decision };
  return simulateNetwork({ ...queue[index] });
}
