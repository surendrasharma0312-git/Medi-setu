/**
 * FICTIONAL DEMO DATA. Names end in "Demo", "Sample" or "Example" so they cannot
 * be mistaken for real doctors. No qualifications, registration numbers,
 * experience, ratings or reviews are invented. Real credentials must come from
 * hospital submissions that an admin has verified (see docs/ROADMAP.md).
 *
 * Only src/services may import this file. Pages must go through the services.
 */
import type { Doctor, DoctorAvailability, Weekday } from '../../types';

const MON_SAT: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const slot = (hospitalId: string, days: Weekday[], from: string, to: string): DoctorAvailability => ({
  hospitalId,
  days,
  from,
  to,
});

function doctor(id: string, name: string, specialtyId: string, availability: DoctorAvailability[]): Doctor {
  return {
    id,
    name,
    specialtyId,
    hospitalIds: availability.map((a) => a.hospitalId),
    availability,
    isDemo: true,
  };
}

export const DEMO_DOCTORS: Doctor[] = [
  doctor('d-demo-001', 'Dr. Asha Demo', 'general_medicine', [slot('h-demo-001', MON_SAT, '10:00', '14:00')]),
  doctor('d-demo-002', 'Dr. Ravi Sample', 'paediatrics', [
    slot('h-demo-001', ['mon', 'wed', 'fri'], '10:00', '13:00'),
    slot('h-demo-007', ['tue', 'thu', 'sat'], '11:00', '14:00'),
  ]),
  doctor('d-demo-003', 'Dr. Meera Example', 'gynaecology', [
    slot('h-demo-001', ['mon', 'tue', 'thu', 'fri'], '11:00', '15:00'),
    slot('h-demo-007', ['wed', 'sat'], '10:00', '13:00'),
  ]),
  doctor('d-demo-004', 'Dr. Imran Demo', 'general_surgery', [slot('h-demo-001', ['tue', 'thu', 'sat'], '14:00', '17:00')]),
  doctor('d-demo-005', 'Dr. Sunita Sample', 'dermatology', [slot('h-demo-002', ['mon', 'wed', 'fri'], '10:00', '14:00')]),
  doctor('d-demo-006', 'Dr. Vikram Example', 'general_medicine', [slot('h-demo-002', MON_SAT, '15:00', '19:00')]),
  doctor('d-demo-007', 'Dr. Pooja Demo', 'physiotherapy', [slot('h-demo-003', MON_SAT, '09:30', '13:30')]),
  doctor('d-demo-008', 'Dr. Anil Sample', 'orthopaedics', [
    slot('h-demo-003', ['mon', 'wed', 'fri'], '11:00', '16:00'),
    slot('h-demo-009', ['tue', 'thu'], '10:00', '13:00'),
  ]),
  doctor('d-demo-009', 'Dr. Farhana Example', 'ophthalmology', [slot('h-demo-004', MON_SAT, '09:00', '15:00')]),
  doctor('d-demo-010', 'Dr. Kiran Demo', 'dental', [slot('h-demo-005', MON_SAT, '10:00', '17:00')]),
  doctor('d-demo-011', 'Dr. Rajesh Sample', 'cardiology', [
    slot('h-demo-008', ['mon', 'wed', 'fri'], '10:00', '14:00'),
    slot('h-demo-009', ['tue', 'thu', 'sat'], '10:00', '14:00'),
  ]),
  doctor('d-demo-012', 'Dr. Neha Example', 'ent', [
    slot('h-demo-009', ['mon', 'wed', 'fri'], '12:00', '16:00'),
    slot('h-demo-011', ['tue', 'thu'], '10:00', '13:00'),
  ]),
  doctor('d-demo-013', 'Dr. Suresh Demo', 'paediatrics', [slot('h-demo-010', MON_SAT, '10:00', '16:00')]),
  doctor('d-demo-014', 'Dr. Priya Sample', 'general_medicine', [slot('h-demo-011', MON_SAT, '09:30', '16:30')]),
  doctor('d-demo-015', 'Dr. Manoj Example', 'general_surgery', [slot('h-demo-008', ['tue', 'thu', 'sat'], '11:00', '15:00')]),
];
