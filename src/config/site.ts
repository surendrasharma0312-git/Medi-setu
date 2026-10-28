export const SITE = {
  name: 'MediSetu',
  /** India's single emergency number, shown in safety notices. */
  emergencyNumber: '112',
  /** Placeholder address. Replace before launch. */
  contactEmail: 'contact@medisetu.example',
  /** First launch area. The rest of the app is built to work for any state. */
  launch: { stateCode: 'BR', district: 'Siwan' },
} as const;

/** Demo hospital whose requests are shown in the prototype hospital dashboard. */
export const DEMO_HOSPITAL_ID = 'h-demo-001';
