-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can read their own, Admin can read all. Users can insert their own (on signup).
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id AND role = 'patient');
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (
  auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid())
);


CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (current_user_role() = 'admin');

-- Hospitals: Public can view verified, owners can view/edit their own, Admins can view/edit all.
CREATE POLICY "Anyone can view verified hospitals" ON hospitals FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Owners can view own hospital" ON hospitals FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all hospitals" ON hospitals FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Owners can insert own hospital" ON hospitals FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own hospital" ON hospitals FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (
  auth.uid() = owner_id AND verification_status = (SELECT verification_status FROM hospitals WHERE id = hospitals.id)
);
CREATE POLICY "Admins can update all hospitals" ON hospitals FOR UPDATE USING (current_user_role() = 'admin');

-- Hospital Specialties
CREATE POLICY "Anyone can view verified hospital specialties" ON hospital_specialties FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_specialties.hospital_id AND verification_status = 'verified')
);
CREATE POLICY "Owners can view own hospital specialties" ON hospital_specialties FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_specialties.hospital_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can view all hospital specialties" ON hospital_specialties FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Owners can manage own hospital specialties" ON hospital_specialties FOR ALL USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_specialties.hospital_id AND owner_id = auth.uid())
);

-- Hospital Services
CREATE POLICY "Anyone can view verified hospital services" ON hospital_services FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_services.hospital_id AND verification_status = 'verified')
);
CREATE POLICY "Owners can view own hospital services" ON hospital_services FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_services.hospital_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can view all hospital services" ON hospital_services FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Owners can manage own hospital services" ON hospital_services FOR ALL USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_services.hospital_id AND owner_id = auth.uid())
);

-- Hospital Hours
CREATE POLICY "Anyone can view verified hospital hours" ON hospital_hours FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_hours.hospital_id AND verification_status = 'verified')
);
CREATE POLICY "Owners can view own hospital hours" ON hospital_hours FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_hours.hospital_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can view all hospital hours" ON hospital_hours FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Owners can manage own hospital hours" ON hospital_hours FOR ALL USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = hospital_hours.hospital_id AND owner_id = auth.uid())
);

-- Doctors: Public can view doctors of verified hospitals
CREATE POLICY "Anyone can view doctors of verified hospitals" ON doctors FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM doctor_schedules ds
    JOIN hospitals h ON h.id = ds.hospital_id
    WHERE ds.doctor_id = doctors.id AND h.verification_status = 'verified'
  )
);
CREATE POLICY "Hospital owners can view own doctors" ON doctors FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Admins can view all doctors" ON doctors FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Hospital owners can manage own doctors" ON doctors FOR ALL USING (created_by = auth.uid());

-- Doctor Schedules
CREATE POLICY "Anyone can view schedules of verified hospitals" ON doctor_schedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = doctor_schedules.hospital_id AND verification_status = 'verified')
);
CREATE POLICY "Owners can view own schedules" ON doctor_schedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = doctor_schedules.hospital_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can view all schedules" ON doctor_schedules FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Owners can manage own schedules" ON doctor_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = doctor_schedules.hospital_id AND owner_id = auth.uid())
);

-- Appointments: Patients can see own, Hospital owners can see for their hospitals, Admins can see all
CREATE POLICY "Patients can view own appointments" ON appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Hospital owners can view appointments for their hospital" ON appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = appointments.hospital_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can view all appointments" ON appointments FOR SELECT USING (current_user_role() = 'admin');

CREATE POLICY "Patients can insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Hospital owners can update appointments for their hospital" ON appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = appointments.hospital_id AND owner_id = auth.uid())
);

-- Appointment Events
CREATE POLICY "Patients can view own appointment events" ON appointment_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM appointments WHERE id = appointment_events.appointment_id AND patient_id = auth.uid())
);
CREATE POLICY "Hospital owners can view appointment events for their hospital" ON appointment_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM appointments a
    JOIN hospitals h ON h.id = a.hospital_id
    WHERE a.id = appointment_events.appointment_id AND h.owner_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all appointment events" ON appointment_events FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Patients can insert own appointment events" ON appointment_events FOR INSERT WITH CHECK (
  auth.uid() = actor_id AND EXISTS (SELECT 1 FROM appointments WHERE id = appointment_events.appointment_id AND patient_id = auth.uid())
);
CREATE POLICY "Hospital owners can insert appointment events" ON appointment_events FOR INSERT WITH CHECK (
  auth.uid() = actor_id AND EXISTS (
    SELECT 1 FROM appointments a
    JOIN hospitals h ON h.id = a.hospital_id
    WHERE a.id = appointment_events.appointment_id AND h.owner_id = auth.uid()
  )
);

-- Documents: Only owners can view/manage
CREATE POLICY "Owners can view own documents" ON documents FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own documents" ON documents FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete own documents" ON documents FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all documents" ON documents FOR SELECT USING (current_user_role() = 'admin');

-- Verification Requests: Hospital owners can view own, Admins can manage all
CREATE POLICY "Owners can view own verification requests" ON verification_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM hospitals WHERE id = verification_requests.hospital_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can view all verification requests" ON verification_requests FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Owners can insert own verification requests" ON verification_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM hospitals WHERE id = verification_requests.hospital_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can update verification requests" ON verification_requests FOR UPDATE USING (current_user_role() = 'admin');

-- Audit Log: Only Admins can view and insert
CREATE POLICY "Admins can view audit log" ON audit_log FOR SELECT USING (current_user_role() = 'admin');
CREATE POLICY "Admins can insert audit log" ON audit_log FOR INSERT WITH CHECK (current_user_role() = 'admin');
