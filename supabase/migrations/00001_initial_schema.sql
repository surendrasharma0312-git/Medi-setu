-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'hospital', 'admin');
CREATE TYPE facility_type AS ENUM ('hospital', 'clinic', 'nursing_home', 'diagnostic_centre', 'dental_clinic', 'eye_centre');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE appointment_status AS ENUM ('requested', 'confirmed', 'rescheduled', 'declined', 'cancelled', 'completed');
CREATE TYPE verification_decision AS ENUM ('pending', 'approved', 'rejected');

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'patient',
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Table: hospitals
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    facility_type facility_type NOT NULL,
    state_code TEXT NOT NULL,
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    locality TEXT,
    address_line TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_hospitals_owner_id ON hospitals(owner_id);
CREATE INDEX idx_hospitals_location ON hospitals(state_code, district);
CREATE INDEX idx_hospitals_verification ON hospitals(verification_status);

-- Table: hospital_specialties
CREATE TABLE hospital_specialties (
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    specialty_id TEXT NOT NULL,
    PRIMARY KEY (hospital_id, specialty_id)
);

-- Table: hospital_services
CREATE TABLE hospital_services (
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL,
    PRIMARY KEY (hospital_id, service_id)
);

-- Table: hospital_hours
CREATE TABLE hospital_hours (
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    weekday TEXT NOT NULL,
    opens TIME NOT NULL,
    closes TIME NOT NULL,
    PRIMARY KEY (hospital_id, weekday)
);

-- Table: doctors
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    specialty_id TEXT NOT NULL,
    credentials TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: doctor_schedules
CREATE TABLE doctor_schedules (
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    weekday TEXT NOT NULL,
    from_time TIME NOT NULL,
    to_time TIME NOT NULL,
    PRIMARY KEY (doctor_id, hospital_id, weekday, from_time, to_time)
);

-- Table: appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    note TEXT,
    status appointment_status NOT NULL DEFAULT 'requested',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_hospital_id ON appointments(hospital_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Table: appointment_events
CREATE TABLE appointment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    from_status appointment_status,
    to_status appointment_status NOT NULL,
    message TEXT,
    proposed_date DATE,
    proposed_time TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_appointment_events_appointment_id ON appointment_events(appointment_id);

-- Table: documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_documents_owner_id ON documents(owner_id);

-- Table: verification_requests
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decision verification_decision NOT NULL DEFAULT 'pending',
    decided_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_verification_requests_hospital_id ON verification_requests(hospital_id);

-- Table: audit_log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_log_actor_id ON audit_log(actor_id);
CREATE INDEX idx_audit_log_target_table_id ON audit_log(target_table, target_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_hospitals_updated_at
    BEFORE UPDATE ON hospitals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_requests_updated_at
    BEFORE UPDATE ON verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
