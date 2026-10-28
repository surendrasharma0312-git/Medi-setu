/**
 * Central type definitions shared by the UI, the service layer and demo data.
 * When a real backend is added, keep these shapes (or generate them from the
 * database schema) so pages do not need to change.
 */

export type Language = 'en' | 'hi';

export interface LocalizedText {
  en: string;
  hi: string;
}

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type FacilityType =
  | 'hospital'
  | 'clinic'
  | 'nursing_home'
  | 'diagnostic_centre'
  | 'dental_clinic'
  | 'eye_centre';

/** "verified" is reserved for the future admin workflow. No demo record may use it. */
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

/* ----- Reference data ----- */

export interface StateInfo {
  code: string;
  name: LocalizedText;
}

export interface FacilityTypeInfo {
  id: FacilityType;
  name: LocalizedText;
}

export interface Specialty {
  id: string;
  name: LocalizedText;
  /** Everyday words (English, Hindi, Hinglish) that should lead to this specialty. Search aid only, not a diagnosis. */
  keywords: string[];
}

export interface ServiceInfo {
  id: string;
  name: LocalizedText;
}

/* ----- Directory ----- */

export interface OpeningHours {
  days: Weekday[];
  /** 24-hour "HH:MM" */
  open: string;
  close: string;
}

export interface Hospital {
  id: string;
  name: string;
  facilityType: FacilityType;
  /** State code, see data/reference.ts */
  state: string;
  district: string;
  city: string;
  locality: string;
  addressLine: string;
  phone: string;
  email?: string;
  openingHours: OpeningHours[];
  specialtyIds: string[];
  serviceIds: string[];
  verification: VerificationStatus;
  /** true for every record in this prototype */
  isDemo: boolean;
}

export interface HospitalSummary {
  id: string;
  name: string;
  city: string;
  district: string;
}

export interface DoctorAvailability {
  hospitalId: string;
  days: Weekday[];
  from: string;
  to: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  hospitalIds: string[];
  availability: DoctorAvailability[];
  isDemo: boolean;
}

export interface DoctorWithHospitals extends Doctor {
  hospitals: HospitalSummary[];
}

/* ----- Appointments ----- */

export type TimePreference = 'any' | 'morning' | 'afternoon' | 'evening';

/**
 * "prototype_draft" = created in this prototype and NOT sent to any hospital.
 * The other statuses describe the future real workflow.
 */
export type AppointmentStatus =
  | 'prototype_draft'
  | 'requested'
  | 'confirmed'
  | 'rescheduled'
  | 'declined'
  | 'cancelled'
  | 'completed';

export interface HospitalResponse {
  message: string;
  /** ISO date "YYYY-MM-DD" proposed or confirmed by the hospital */
  date?: string;
  /** "HH:MM" */
  time?: string;
  respondedAt: string;
}

export interface AppointmentRequest {
  id: string;
  hospitalId: string;
  hospitalName: string;
  doctorId?: string;
  doctorName?: string;
  patientName: string;
  contact: string;
  /** ISO date "YYYY-MM-DD" */
  preferredDate: string;
  preferredTime: TimePreference;
  note?: string;
  status: AppointmentStatus;
  /** ISO date-time */
  createdAt: string;
  response?: HospitalResponse;
  /** true when the record belongs to the demo patient shown in "My appointments" */
  ownedByDemoPatient: boolean;
  isDemo: boolean;
}

/* ----- Admin ----- */

export type VerificationDecision = 'pending' | 'approved' | 'rejected';

export interface VerificationRequest {
  id: string;
  hospitalName: string;
  facilityType: FacilityType;
  state: string;
  district: string;
  /** ISO date */
  submittedAt: string;
  decision: VerificationDecision;
}
