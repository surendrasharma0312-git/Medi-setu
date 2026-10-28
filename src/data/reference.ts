/**
 * Reference data that changes rarely: states, facility types, specialties, services.
 * Pages may import this file directly. Later it can stay static or be loaded from the database.
 *
 * Search keywords on specialties are only a search aid ("pain" -> bone & joint, general medicine).
 * They are NOT a diagnosis and the UI must never present them as medical advice.
 */
import type { FacilityTypeInfo, ServiceInfo, Specialty, StateInfo, Weekday } from '../types';

export const STATES: StateInfo[] = [
  { code: 'AP', name: { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' } },
  { code: 'AR', name: { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश' } },
  { code: 'AS', name: { en: 'Assam', hi: 'असम' } },
  { code: 'BR', name: { en: 'Bihar', hi: 'बिहार' } },
  { code: 'CG', name: { en: 'Chhattisgarh', hi: 'छत्तीसगढ़' } },
  { code: 'GA', name: { en: 'Goa', hi: 'गोवा' } },
  { code: 'GJ', name: { en: 'Gujarat', hi: 'गुजरात' } },
  { code: 'HR', name: { en: 'Haryana', hi: 'हरियाणा' } },
  { code: 'HP', name: { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश' } },
  { code: 'JH', name: { en: 'Jharkhand', hi: 'झारखंड' } },
  { code: 'KA', name: { en: 'Karnataka', hi: 'कर्नाटक' } },
  { code: 'KL', name: { en: 'Kerala', hi: 'केरल' } },
  { code: 'MP', name: { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश' } },
  { code: 'MH', name: { en: 'Maharashtra', hi: 'महाराष्ट्र' } },
  { code: 'MN', name: { en: 'Manipur', hi: 'मणिपुर' } },
  { code: 'ML', name: { en: 'Meghalaya', hi: 'मेघालय' } },
  { code: 'MZ', name: { en: 'Mizoram', hi: 'मिज़ोरम' } },
  { code: 'NL', name: { en: 'Nagaland', hi: 'नागालैंड' } },
  { code: 'OD', name: { en: 'Odisha', hi: 'ओडिशा' } },
  { code: 'PB', name: { en: 'Punjab', hi: 'पंजाब' } },
  { code: 'RJ', name: { en: 'Rajasthan', hi: 'राजस्थान' } },
  { code: 'SK', name: { en: 'Sikkim', hi: 'सिक्किम' } },
  { code: 'TN', name: { en: 'Tamil Nadu', hi: 'तमिलनाडु' } },
  { code: 'TS', name: { en: 'Telangana', hi: 'तेलंगाना' } },
  { code: 'TR', name: { en: 'Tripura', hi: 'त्रिपुरा' } },
  { code: 'UP', name: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' } },
  { code: 'UK', name: { en: 'Uttarakhand', hi: 'उत्तराखंड' } },
  { code: 'WB', name: { en: 'West Bengal', hi: 'पश्चिम बंगाल' } },
  { code: 'AN', name: { en: 'Andaman and Nicobar Islands', hi: 'अंडमान और निकोबार द्वीपसमूह' } },
  { code: 'CH', name: { en: 'Chandigarh', hi: 'चंडीगढ़' } },
  { code: 'DH', name: { en: 'Dadra and Nagar Haveli and Daman and Diu', hi: 'दादरा और नगर हवेली और दमन और दीव' } },
  { code: 'DL', name: { en: 'Delhi', hi: 'दिल्ली' } },
  { code: 'JK', name: { en: 'Jammu and Kashmir', hi: 'जम्मू और कश्मीर' } },
  { code: 'LA', name: { en: 'Ladakh', hi: 'लद्दाख' } },
  { code: 'LD', name: { en: 'Lakshadweep', hi: 'लक्षद्वीप' } },
  { code: 'PY', name: { en: 'Puducherry', hi: 'पुदुच्चेरी' } },
];

export const FACILITY_TYPES: FacilityTypeInfo[] = [
  { id: 'hospital', name: { en: 'Hospital', hi: 'अस्पताल' } },
  { id: 'clinic', name: { en: 'Clinic', hi: 'क्लिनिक' } },
  { id: 'nursing_home', name: { en: 'Nursing home', hi: 'नर्सिंग होम' } },
  { id: 'diagnostic_centre', name: { en: 'Diagnostic centre', hi: 'जाँच केंद्र' } },
  { id: 'dental_clinic', name: { en: 'Dental clinic', hi: 'दंत चिकित्सालय' } },
  { id: 'eye_centre', name: { en: 'Eye care centre', hi: 'नेत्र चिकित्सालय' } },
];

export const SPECIALTIES: Specialty[] = [
  {
    id: 'general_medicine',
    name: { en: 'General Medicine', hi: 'सामान्य चिकित्सा' },
    keywords: ['fever', 'cold', 'cough', 'weakness', 'body pain', 'physician', 'bukhar', 'sardi', 'khansi', 'बुखार', 'सर्दी', 'खांसी', 'खाँसी', 'कमज़ोरी', 'कमजोरी', 'बदन दर्द'],
  },
  {
    id: 'orthopaedics',
    name: { en: 'Orthopaedics (Bone & Joint)', hi: 'हड्डी एवं जोड़ रोग' },
    keywords: ['pain', 'back pain', 'joint', 'knee', 'bone', 'fracture', 'dard', 'kamar', 'हड्डी', 'जोड़', 'दर्द', 'कमर', 'घुटना', 'घुटने'],
  },
  {
    id: 'gynaecology',
    name: { en: 'Gynaecology & Maternity', hi: 'स्त्री रोग एवं प्रसूति' },
    keywords: ['pregnancy', 'pregnant', 'delivery', 'women', 'periods', 'garbh', 'गर्भावस्था', 'गर्भ', 'प्रसव', 'महिला', 'माहवारी'],
  },
  {
    id: 'paediatrics',
    name: { en: 'Paediatrics (Child Health)', hi: 'बाल रोग' },
    keywords: ['child', 'children', 'baby', 'infant', 'vaccine', 'vaccination', 'bachcha', 'बच्चा', 'बच्चे', 'शिशु', 'टीका', 'टीकाकरण'],
  },
  {
    id: 'cardiology',
    name: { en: 'Cardiology (Heart)', hi: 'हृदय रोग' },
    keywords: ['heart', 'chest', 'bp', 'blood pressure', 'ecg', 'dil', 'हृदय', 'दिल', 'सीना', 'बीपी'],
  },
  {
    id: 'dermatology',
    name: { en: 'Dermatology (Skin)', hi: 'त्वचा रोग' },
    keywords: ['skin', 'rash', 'itching', 'acne', 'pimple', 'hair', 'khujli', 'त्वचा', 'खुजली', 'दाद'],
  },
  {
    id: 'ent',
    name: { en: 'ENT (Ear, Nose, Throat)', hi: 'कान, नाक एवं गला रोग' },
    keywords: ['ear', 'nose', 'throat', 'hearing', 'sinus', 'kaan', 'gala', 'कान', 'नाक', 'गला'],
  },
  {
    id: 'ophthalmology',
    name: { en: 'Eye Care (Ophthalmology)', hi: 'नेत्र रोग' },
    keywords: ['eye', 'eyes', 'vision', 'cataract', 'glasses', 'aankh', 'आँख', 'आंख', 'नज़र', 'मोतियाबिंद', 'चश्मा'],
  },
  {
    id: 'dental',
    name: { en: 'Dental Care', hi: 'दंत रोग' },
    keywords: ['tooth', 'teeth', 'dentist', 'gum', 'dant', 'दाँत', 'दांत', 'मसूड़े', 'दंत'],
  },
  {
    id: 'physiotherapy',
    name: { en: 'Physiotherapy', hi: 'फिजियोथेरेपी' },
    keywords: ['physio', 'rehab', 'exercise', 'stiffness', 'फिजियो', 'मालिश'],
  },
  {
    id: 'general_surgery',
    name: { en: 'General Surgery', hi: 'सामान्य शल्य चिकित्सा' },
    keywords: ['surgery', 'operation', 'hernia', 'piles', 'appendix', 'ऑपरेशन', 'सर्जरी', 'बवासीर'],
  },
];

export const SERVICES: ServiceInfo[] = [
  { id: 'opd', name: { en: 'OPD consultation', hi: 'ओपीडी परामर्श' } },
  { id: 'lab', name: { en: 'Pathology lab', hi: 'पैथोलॉजी लैब' } },
  { id: 'xray', name: { en: 'X-ray', hi: 'एक्स-रे' } },
  { id: 'ultrasound', name: { en: 'Ultrasound', hi: 'अल्ट्रासाउंड' } },
  { id: 'pharmacy', name: { en: 'Pharmacy', hi: 'दवा की दुकान' } },
  { id: 'maternity', name: { en: 'Maternity care', hi: 'प्रसूति सेवा' } },
  { id: 'vaccination', name: { en: 'Vaccination', hi: 'टीकाकरण' } },
  { id: 'dental_care', name: { en: 'Dental care', hi: 'दंत देखभाल' } },
  { id: 'eye_checkup', name: { en: 'Eye check-up', hi: 'आँखों की जाँच' } },
  { id: 'physio_unit', name: { en: 'Physiotherapy unit', hi: 'फिजियोथेरेपी इकाई' } },
];

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/**
 * Hindi display names for the districts/cities used in demo data.
 * Names missing here are shown as written (English). Replace with a full
 * place directory (e.g. Local Government Directory codes) in the backend phase.
 */
export const PLACE_NAMES_HI: Record<string, string | undefined> = {
  Siwan: 'सीवान',
  Gopalganj: 'गोपालगंज',
  Saran: 'सारण',
  Chapra: 'छपरा',
  Patna: 'पटना',
  Gorakhpur: 'गोरखपुर',
  Maharajganj: 'महाराजगंज',
  Mairwa: 'मैरवा',
  Barharia: 'बड़हरिया',
};

export function getStateInfo(code: string): StateInfo | undefined {
  return STATES.find((s) => s.code === code);
}

export function getSpecialty(id: string): Specialty | undefined {
  return SPECIALTIES.find((s) => s.id === id);
}

export function getService(id: string): ServiceInfo | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function getFacilityType(id: string): FacilityTypeInfo | undefined {
  return FACILITY_TYPES.find((f) => f.id === id);
}
