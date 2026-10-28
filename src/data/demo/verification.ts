/**
 * FICTIONAL DEMO DATA: hospital registrations waiting for admin review.
 * Approving or rejecting here changes in-memory prototype state only. It never
 * produces a public "verified" badge.
 *
 * Only src/services may import this file. Pages must go through the services.
 */
import type { VerificationRequest } from '../../types';
import { addDaysISO } from '../../utils/format';

export const DEMO_VERIFICATION_QUEUE: VerificationRequest[] = [
  {
    id: 'v-demo-1',
    hospitalName: 'Demo Pending Clinic A',
    facilityType: 'clinic',
    state: 'BR',
    district: 'Siwan',
    submittedAt: addDaysISO(-1),
    decision: 'pending',
  },
  {
    id: 'v-demo-2',
    hospitalName: 'Sample Pending Nursing Home B',
    facilityType: 'nursing_home',
    state: 'BR',
    district: 'Saran',
    submittedAt: addDaysISO(-2),
    decision: 'pending',
  },
  {
    id: 'v-demo-3',
    hospitalName: 'Example Pending Diagnostic Centre C',
    facilityType: 'diagnostic_centre',
    state: 'BR',
    district: 'Gopalganj',
    submittedAt: addDaysISO(-4),
    decision: 'pending',
  },
  {
    id: 'v-demo-4',
    hospitalName: 'Demo Pending Dental Clinic D',
    facilityType: 'dental_clinic',
    state: 'UP',
    district: 'Gorakhpur',
    submittedAt: addDaysISO(-5),
    decision: 'pending',
  },
];
