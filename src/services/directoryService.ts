/**
 * Directory service: hospitals and doctors.
 *
 * BACKEND SEAM: this is the only place (besides the other files in src/services)
 * that reads demo data. To connect Supabase, keep these function names and
 * return types and replace the bodies with database queries (ideally with
 * server-side filtering and pagination). Pages should not need to change.
 */
import { SITE } from '../config/site';
import { DEMO_DOCTORS } from '../data/demo/doctors';
import { DEMO_HOSPITALS } from '../data/demo/hospitals';
import { PLACE_NAMES_HI, getFacilityType, getService, getSpecialty, getStateInfo } from '../data/reference';
import type { Doctor, DoctorWithHospitals, Hospital, HospitalSummary } from '../types';
import { compactStrings, normalizeText } from '../utils/format';
import { simulateNetwork } from './simulate';

export interface HospitalSearchParams {
  /** Free text: hospital, doctor, specialty, area or an everyday word such as "pain". */
  query?: string;
  /** State code, e.g. "BR" */
  state?: string;
  district?: string;
  /** City or locality text */
  place?: string;
  specialtyId?: string;
  facilityType?: string;
}

export interface DoctorSearchParams {
  query?: string;
  specialtyId?: string;
  district?: string;
  hospitalId?: string;
}

export interface HospitalFilterOptions {
  /** State codes that have at least one listing */
  states: string[];
  districts: { state: string; district: string }[];
}

/* ----- helpers ----- */

/** Every whitespace-separated word of the query must appear somewhere in the text. */
function matchesAllWords(searchText: string, query: string): boolean {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  return words.every((word) => searchText.includes(word));
}

function toSummary(hospital: Hospital): HospitalSummary {
  return { id: hospital.id, name: hospital.name, city: hospital.city, district: hospital.district };
}

// Cached map of doctors per hospital to prevent N+1 performance issue during search
let cachedHospitalDoctorsMap: Map<string, Doctor[]> | null = null;

function getHospitalDoctorsMap(): Map<string, Doctor[]> {
  if (cachedHospitalDoctorsMap) return cachedHospitalDoctorsMap;

  const map = new Map<string, Doctor[]>();
  for (const doctor of DEMO_DOCTORS) {
    for (const hospitalId of doctor.hospitalIds) {
      let list = map.get(hospitalId);
      if (!list) {
        list = [];
        map.set(hospitalId, list);
      }
      list.push(doctor);
    }
  }
  cachedHospitalDoctorsMap = map;
  return map;
}

function doctorsOfHospital(hospitalId: string): Doctor[] {
  return getHospitalDoctorsMap().get(hospitalId) || [];
}

const hospitalMap = new Map(DEMO_HOSPITALS.map((h) => [h.id, h]));

function toDoctorWithHospitals(doctor: Doctor): DoctorWithHospitals {
  const hospitals = doctor.hospitalIds.flatMap((id) => {
    const hospital = hospitalMap.get(id);
    return hospital ? [toSummary(hospital)] : [];
  });
  return { ...doctor, hospitals };
}

function placeWords(city: string, district: string, locality?: string): Array<string | undefined> {
  return [city, district, locality, PLACE_NAMES_HI[city], PLACE_NAMES_HI[district]];
}

function getSpecialtyWords(id?: string): string[] {
  if (!id) return [];
  const specialty = getSpecialty(id);
  return specialty ? [specialty.name.en, specialty.name.hi, ...specialty.keywords] : [];
}

function getServiceWords(id?: string): string[] {
  if (!id) return [];
  const service = getService(id);
  return service ? [service.name.en, service.name.hi] : [];
}

function hospitalSearchText(hospital: Hospital): string {
  const state = getStateInfo(hospital.state);
  const facility = getFacilityType(hospital.facilityType);
  const words = compactStrings([
    hospital.name,
    ...placeWords(hospital.city, hospital.district, hospital.locality),
    state?.name.en,
    state?.name.hi,
    facility?.name.en,
    facility?.name.hi,
    ...hospital.specialtyIds.flatMap(getSpecialtyWords),
    ...hospital.serviceIds.flatMap(getServiceWords),
    ...doctorsOfHospital(hospital.id).map((doctor) => doctor.name),
  ]);
  return normalizeText(words.join(' '));
}

function doctorSearchText(doctor: DoctorWithHospitals): string {
  const words = compactStrings([
    doctor.name,
    ...getSpecialtyWords(doctor.specialtyId),
    ...doctor.hospitals.flatMap((h) => [h.name, ...placeWords(h.city, h.district)]),
  ]);
  return normalizeText(words.join(' '));
}

/** Launch area (Siwan, Bihar) is listed first; everything else is alphabetical. */
function isLaunchArea(hospital: Hospital): number {
  return hospital.state === SITE.launch.stateCode && hospital.district === SITE.launch.district ? 1 : 0;
}

/* ----- hospitals ----- */

export function searchHospitals(params: HospitalSearchParams): Promise<Hospital[]> {
  const place = params.place ?? '';
  const results = DEMO_HOSPITALS.filter((hospital) => {
    if (params.state && hospital.state !== params.state) return false;
    if (params.district && hospital.district !== params.district) return false;
    if (params.specialtyId && !hospital.specialtyIds.includes(params.specialtyId)) return false;
    if (params.facilityType && hospital.facilityType !== params.facilityType) return false;
    if (place.trim()) {
      const placeText = normalizeText(
        compactStrings(placeWords(hospital.city, hospital.district, hospital.locality)).join(' '),
      );
      if (!matchesAllWords(placeText, place)) return false;
    }
    if (params.query && !matchesAllWords(hospitalSearchText(hospital), params.query)) return false;
    return true;
  }).sort((a, b) => isLaunchArea(b) - isLaunchArea(a) || a.name.localeCompare(b.name));
  return simulateNetwork(results);
}

export function getHospital(id: string): Promise<Hospital | null> {
  return simulateNetwork(DEMO_HOSPITALS.find((hospital) => hospital.id === id) ?? null);
}

/** Lightweight list used by dropdowns (for example the appointment form). */
export function listHospitalOptions(): Promise<HospitalSummary[]> {
  const options = DEMO_HOSPITALS.map(toSummary).sort((a, b) => a.name.localeCompare(b.name));
  return simulateNetwork(options);
}

export function getHospitalFilterOptions(): Promise<HospitalFilterOptions> {
  const states = Array.from(new Set(DEMO_HOSPITALS.map((hospital) => hospital.state)));
  const seen = new Set<string>();
  const districts: HospitalFilterOptions['districts'] = [];
  DEMO_HOSPITALS.forEach((hospital) => {
    const key = `${hospital.state}|${hospital.district}`;
    if (!seen.has(key)) {
      seen.add(key);
      districts.push({ state: hospital.state, district: hospital.district });
    }
  });
  return simulateNetwork({ states, districts });
}

/* ----- doctors ----- */

export function searchDoctors(params: DoctorSearchParams): Promise<DoctorWithHospitals[]> {
  const results = DEMO_DOCTORS.map(toDoctorWithHospitals)
    .filter((doctor) => {
      if (params.specialtyId && doctor.specialtyId !== params.specialtyId) return false;
      if (params.hospitalId && !doctor.hospitalIds.includes(params.hospitalId)) return false;
      if (params.district && !doctor.hospitals.some((h) => h.district === params.district)) return false;
      if (params.query && !matchesAllWords(doctorSearchText(doctor), params.query)) return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return simulateNetwork(results);
}

export function getDoctor(id: string): Promise<DoctorWithHospitals | null> {
  const doctor = DEMO_DOCTORS.find((d) => d.id === id);
  return simulateNetwork(doctor ? toDoctorWithHospitals(doctor) : null);
}

export function getDoctorsByHospital(hospitalId: string): Promise<DoctorWithHospitals[]> {
  const doctors = doctorsOfHospital(hospitalId)
    .map(toDoctorWithHospitals)
    .sort((a, b) => a.name.localeCompare(b.name));
  return simulateNetwork(doctors);
}
