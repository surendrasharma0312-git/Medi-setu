/**
 * FICTIONAL DEMO DATA for the prototype dashboards. Dates are relative to "today"
 * so the demo never looks stale. Contacts use invalid "00000" numbers and the
 * reserved example.com domain. No medical details are stored anywhere.
 *
 * Only src/services may import this file. Pages must go through the services.
 */
import type { AppointmentRequest } from '../../types';
import { addDaysISO } from '../../utils/format';

const DAY_MS = 86400000;
const daysAgo = (days: number): string => new Date(Date.now() - days * DAY_MS).toISOString();

type Seed = Omit<AppointmentRequest, 'isDemo'>;

const seed = (value: Seed): AppointmentRequest => ({ ...value, isDemo: true });

const MY_NAME = 'Demo Patient';
const MY_CONTACT = 'demo.patient@example.com';

export const DEMO_APPOINTMENTS: AppointmentRequest[] = [
  // ----- Requests that belong to the demo patient ("My appointments") -----
  seed({
    id: 'a-demo-101',
    hospitalId: 'h-demo-001',
    hospitalName: 'Demo Arogya Hospital',
    doctorId: 'd-demo-001',
    doctorName: 'Dr. Asha Demo',
    patientName: MY_NAME,
    contact: MY_CONTACT,
    preferredDate: addDaysISO(3),
    preferredTime: 'morning',
    status: 'confirmed',
    createdAt: daysAgo(1),
    response: {
      message: 'Confirmed for the time shown. Please arrive 15 minutes early. (Demo message)',
      date: addDaysISO(3),
      time: '10:30',
      respondedAt: daysAgo(0),
    },
    ownedByDemoPatient: true,
  }),
  seed({
    id: 'a-demo-102',
    hospitalId: 'h-demo-003',
    hospitalName: 'Demo Bone & Joint Care',
    doctorId: 'd-demo-008',
    doctorName: 'Dr. Anil Sample',
    patientName: MY_NAME,
    contact: MY_CONTACT,
    preferredDate: addDaysISO(6),
    preferredTime: 'afternoon',
    status: 'requested',
    createdAt: daysAgo(0),
    ownedByDemoPatient: true,
  }),
  seed({
    id: 'a-demo-103',
    hospitalId: 'h-demo-007',
    hospitalName: 'Sample Mamta Mother & Child Care',
    patientName: MY_NAME,
    contact: MY_CONTACT,
    preferredDate: addDaysISO(2),
    preferredTime: 'any',
    status: 'rescheduled',
    createdAt: daysAgo(2),
    response: {
      message: 'The requested day is full. We suggest the time shown. (Demo message)',
      date: addDaysISO(4),
      time: '11:00',
      respondedAt: daysAgo(1),
    },
    ownedByDemoPatient: true,
  }),
  seed({
    id: 'a-demo-104',
    hospitalId: 'h-demo-002',
    hospitalName: 'Sample Jeevan Clinic',
    doctorId: 'd-demo-005',
    doctorName: 'Dr. Sunita Sample',
    patientName: MY_NAME,
    contact: MY_CONTACT,
    preferredDate: addDaysISO(-10),
    preferredTime: 'morning',
    status: 'completed',
    createdAt: daysAgo(14),
    ownedByDemoPatient: true,
  }),
  seed({
    id: 'a-demo-105',
    hospitalId: 'h-demo-005',
    hospitalName: 'Example Muskan Dental Clinic',
    doctorId: 'd-demo-010',
    doctorName: 'Dr. Kiran Demo',
    patientName: MY_NAME,
    contact: MY_CONTACT,
    preferredDate: addDaysISO(-3),
    preferredTime: 'evening',
    status: 'declined',
    createdAt: daysAgo(6),
    response: {
      message: 'The doctor is not available on that date. Please request another date. (Demo message)',
      respondedAt: daysAgo(5),
    },
    ownedByDemoPatient: true,
  }),
  seed({
    id: 'a-demo-106',
    hospitalId: 'h-demo-004',
    hospitalName: 'Sample Netra Eye Centre',
    patientName: MY_NAME,
    contact: MY_CONTACT,
    preferredDate: addDaysISO(-20),
    preferredTime: 'any',
    status: 'cancelled',
    createdAt: daysAgo(25),
    ownedByDemoPatient: true,
  }),

  // ----- Requests from other (fictional) patients to the demo hospital -----
  seed({
    id: 'a-demo-201',
    hospitalId: 'h-demo-001',
    hospitalName: 'Demo Arogya Hospital',
    doctorId: 'd-demo-002',
    doctorName: 'Dr. Ravi Sample',
    patientName: 'Demo Patient A',
    contact: '+91 00000 20001',
    preferredDate: addDaysISO(1),
    preferredTime: 'morning',
    status: 'requested',
    createdAt: daysAgo(0),
    ownedByDemoPatient: false,
  }),
  seed({
    id: 'a-demo-202',
    hospitalId: 'h-demo-001',
    hospitalName: 'Demo Arogya Hospital',
    doctorId: 'd-demo-003',
    doctorName: 'Dr. Meera Example',
    patientName: 'Demo Patient B',
    contact: '+91 00000 20002',
    preferredDate: addDaysISO(2),
    preferredTime: 'afternoon',
    status: 'requested',
    createdAt: daysAgo(1),
    ownedByDemoPatient: false,
  }),
  seed({
    id: 'a-demo-203',
    hospitalId: 'h-demo-001',
    hospitalName: 'Demo Arogya Hospital',
    patientName: 'Demo Patient C',
    contact: 'patient.c@example.com',
    preferredDate: addDaysISO(4),
    preferredTime: 'any',
    status: 'requested',
    createdAt: daysAgo(1),
    ownedByDemoPatient: false,
  }),
  seed({
    id: 'a-demo-204',
    hospitalId: 'h-demo-001',
    hospitalName: 'Demo Arogya Hospital',
    doctorId: 'd-demo-004',
    doctorName: 'Dr. Imran Demo',
    patientName: 'Demo Patient D',
    contact: '+91 00000 20004',
    preferredDate: addDaysISO(5),
    preferredTime: 'afternoon',
    status: 'confirmed',
    createdAt: daysAgo(3),
    response: {
      message: 'Confirmed. (Demo message)',
      date: addDaysISO(5),
      time: '15:00',
      respondedAt: daysAgo(2),
    },
    ownedByDemoPatient: false,
  }),
  seed({
    id: 'a-demo-205',
    hospitalId: 'h-demo-001',
    hospitalName: 'Demo Arogya Hospital',
    doctorId: 'd-demo-001',
    doctorName: 'Dr. Asha Demo',
    patientName: 'Demo Patient E',
    contact: '+91 00000 20005',
    preferredDate: addDaysISO(-2),
    preferredTime: 'morning',
    status: 'completed',
    createdAt: daysAgo(6),
    ownedByDemoPatient: false,
  }),
];
