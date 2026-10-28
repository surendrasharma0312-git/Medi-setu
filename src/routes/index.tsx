/**
 * The complete route table. To add a page: create it in src/pages, add its path
 * to ./paths.ts, then register it here inside the layout it belongs to.
 *
 * Layout nesting:
 *   MainLayout (banner, header, footer)
 *     AuthLayout       -> login and registration screens
 *     DashboardLayout  -> patient, hospital and admin dashboards
 */
import type { RouteObject } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { MainLayout } from '../layouts/MainLayout';
import AboutPage from '../pages/AboutPage';
import AppointmentRequestPage from '../pages/AppointmentRequestPage';
import ContactPage from '../pages/ContactPage';
import DoctorDetailsPage from '../pages/DoctorDetailsPage';
import DoctorsPage from '../pages/DoctorsPage';
import HomePage from '../pages/HomePage';
import HospitalDetailsPage from '../pages/HospitalDetailsPage';
import HospitalsPage from '../pages/HospitalsPage';
import MyAppointmentsPage from '../pages/MyAppointmentsPage';
import NotFoundPage from '../pages/NotFoundPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import HospitalLoginPage from '../pages/auth/HospitalLoginPage';
import HospitalRegisterPage from '../pages/auth/HospitalRegisterPage';
import PatientLoginPage from '../pages/auth/PatientLoginPage';
import PatientRegisterPage from '../pages/auth/PatientRegisterPage';
import AdminDashboardPage from '../pages/dashboards/AdminDashboardPage';
import HospitalDashboardPage from '../pages/dashboards/HospitalDashboardPage';
import PatientDashboardPage from '../pages/dashboards/PatientDashboardPage';
import { routePatterns } from './paths';

export const appRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: routePatterns.hospitals, element: <HospitalsPage /> },
      { path: routePatterns.hospital, element: <HospitalDetailsPage /> },
      { path: routePatterns.doctors, element: <DoctorsPage /> },
      { path: routePatterns.doctor, element: <DoctorDetailsPage /> },
      { path: routePatterns.newAppointment, element: <AppointmentRequestPage /> },
      { path: routePatterns.myAppointments, element: <MyAppointmentsPage /> },
      { path: routePatterns.about, element: <AboutPage /> },
      { path: routePatterns.contact, element: <ContactPage /> },
      { path: routePatterns.privacy, element: <PrivacyPage /> },
      { path: routePatterns.terms, element: <TermsPage /> },
      {
        element: <AuthLayout />,
        children: [
          { path: routePatterns.patientLogin, element: <PatientLoginPage /> },
          { path: routePatterns.patientRegister, element: <PatientRegisterPage /> },
          { path: routePatterns.hospitalLogin, element: <HospitalLoginPage /> },
          { path: routePatterns.hospitalRegister, element: <HospitalRegisterPage /> },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          { path: routePatterns.patientDashboard, element: <PatientDashboardPage /> },
          { path: routePatterns.hospitalDashboard, element: <HospitalDashboardPage /> },
          { path: routePatterns.adminDashboard, element: <AdminDashboardPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
