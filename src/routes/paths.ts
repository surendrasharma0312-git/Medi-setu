/**
 * Every URL in the app is defined here. Use `paths` for links and navigation
 * and `routePatterns` (relative, no leading slash) in the route table.
 */
export const paths = {
  home: '/',
  hospitals: '/hospitals',
  hospital: (id: string) => `/hospitals/${id}`,
  doctors: '/doctors',
  doctor: (id: string) => `/doctors/${id}`,
  newAppointment: (options: { hospitalId?: string; doctorId?: string } = {}) => {
    const query = new URLSearchParams();
    if (options.hospitalId) query.set('hospital', options.hospitalId);
    if (options.doctorId) query.set('doctor', options.doctorId);
    const text = query.toString();
    return `/appointments/new${text ? `?${text}` : ''}`;
  },
  myAppointments: '/appointments',
  patientLogin: '/patient/login',
  patientRegister: '/patient/register',
  hospitalLogin: '/hospital/login',
  hospitalRegister: '/hospital/register',
  patientDashboard: '/dashboard/patient',
  hospitalDashboard: '/dashboard/hospital',
  adminDashboard: '/dashboard/admin',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
} as const;

export const routePatterns = {
  hospitals: 'hospitals',
  hospital: 'hospitals/:hospitalId',
  doctors: 'doctors',
  doctor: 'doctors/:doctorId',
  newAppointment: 'appointments/new',
  myAppointments: 'appointments',
  patientLogin: 'patient/login',
  patientRegister: 'patient/register',
  hospitalLogin: 'hospital/login',
  hospitalRegister: 'hospital/register',
  patientDashboard: 'dashboard/patient',
  hospitalDashboard: 'dashboard/hospital',
  adminDashboard: 'dashboard/admin',
  about: 'about',
  contact: 'contact',
  privacy: 'privacy',
  terms: 'terms',
} as const;

/** Builds "/hospitals?state=BR&district=Siwan" style links, skipping empty values. */
export function withQuery(path: string, params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}
