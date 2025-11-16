-- ============================================
-- ESTRUCTURA COMPLETA DE BASE DE DATOS
-- Para ejecutar en Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. TABLA DE DOCTORES
-- ============================================
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  license_number TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  years_experience INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices
  CONSTRAINT doctors_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Comentarios de columnas
COMMENT ON TABLE doctors IS 'Tabla de médicos/doctores de la clínica';
COMMENT ON COLUMN doctors.email IS 'Email institucional del doctor (debe coincidir con Supabase Auth)';
COMMENT ON COLUMN doctors.license_number IS 'Número de matrícula profesional';
COMMENT ON COLUMN doctors.is_active IS 'Si el doctor está activo y puede recibir turnos';

-- ============================================
-- 2. TABLA DE PACIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('masculino', 'femenino', 'otro', 'prefiero_no_decir')),
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_history TEXT,
  allergies TEXT,
  current_medications TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE patients IS 'Tabla de pacientes de la clínica';
COMMENT ON COLUMN patients.medical_history IS 'Historial médico relevante';
COMMENT ON COLUMN patients.allergies IS 'Alergias conocidas';

-- ============================================
-- 3. TABLA DE TURNOS/CITAS
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relaciones
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  
  -- Datos del paciente (para turnos sin registro completo)
  patient_name TEXT NOT NULL,
  patient_email TEXT,
  patient_phone TEXT,
  
  -- Detalles del turno
  type TEXT NOT NULL CHECK (type IN ('presencial', 'virtual')),
  specialty TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  
  -- Estado
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'atendido', 'cancelado', 'no_asistio')),
  
  -- Información adicional
  reason TEXT,
  notes TEXT,
  doctor_notes TEXT,
  prescription TEXT,
  
  -- Videollamada (si es virtual)
  video_link TEXT,
  video_platform TEXT CHECK (video_platform IN ('google_meet', 'jitsi', 'zoom', 'custom')),
  
  -- Recordatorios
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by TEXT,
  cancellation_reason TEXT,
  
  -- Restricción: no puede haber dos turnos al mismo tiempo para el mismo doctor
  CONSTRAINT unique_doctor_datetime UNIQUE (doctor_id, date, time)
);

COMMENT ON TABLE appointments IS 'Tabla de turnos/citas médicas';
COMMENT ON COLUMN appointments.patient_id IS 'ID del paciente si está registrado (nullable)';
COMMENT ON COLUMN appointments.patient_name IS 'Nombre del paciente (siempre requerido)';
COMMENT ON COLUMN appointments.duration_minutes IS 'Duración estimada de la consulta en minutos';
COMMENT ON COLUMN appointments.doctor_notes IS 'Notas privadas del doctor sobre la consulta';
COMMENT ON COLUMN appointments.prescription IS 'Receta o prescripción médica';

-- ============================================
-- 4. TABLA DE ESPECIALIDADES (Opcional)
-- ============================================
CREATE TABLE IF NOT EXISTS specialties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE specialties IS 'Catálogo de especialidades médicas disponibles';

-- Insertar especialidades predefinidas
INSERT INTO specialties (name, description, icon) VALUES
  ('Cirugía Plástica', 'Procedimientos estéticos y reconstructivos', '💉'),
  ('Cirugía Reconstructiva', 'Reconstrucción post-trauma o enfermedad', '🏥'),
  ('Medicina Estética', 'Tratamientos no invasivos', '✨'),
  ('Dermatología', 'Cuidado de la piel', '🧴')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 5. TABLA DE HORARIOS DE DOCTORES
-- ============================================
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL, -- 0=Domingo, 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

COMMENT ON TABLE doctor_schedules IS 'Horarios de atención de cada doctor';
COMMENT ON COLUMN doctor_schedules.day_of_week IS '0=Domingo, 1=Lunes, ..., 6=Sábado';

-- ============================================
-- 6. TABLA DE BLOQUES DE TIEMPO NO DISPONIBLES
-- ============================================
CREATE TABLE IF NOT EXISTS doctor_unavailability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_datetime_range CHECK (end_datetime > start_datetime)
);

COMMENT ON TABLE doctor_unavailability IS 'Períodos en los que el doctor no está disponible (vacaciones, licencias, etc.)';

-- ============================================
-- 7. ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ============================================

-- Índices en appointments
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(type);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_email ON appointments(patient_email);

-- Índices en doctors
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON doctors(is_active);

-- Índices en patients
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- ============================================
-- 8. FUNCIONES AUXILIARES
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para generar link de Google Meet
CREATE OR REPLACE FUNCTION generate_meet_link(appointment_id UUID)
RETURNS TEXT AS $$
DECLARE
  meet_link TEXT;
BEGIN
  -- En producción, esto debería llamar a la API de Google Meet
  -- Por ahora generamos un link simulado
  meet_link := 'https://meet.google.com/' || substring(md5(random()::text || appointment_id::text) from 1 for 10);
  
  -- Actualizar el appointment con el link generado
  UPDATE appointments 
  SET video_link = meet_link, 
      video_platform = 'google_meet',
      updated_at = NOW()
  WHERE id = appointment_id;
  
  RETURN meet_link;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar disponibilidad de un horario
CREATE OR REPLACE FUNCTION check_availability(
  p_doctor_id UUID,
  p_date DATE,
  p_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  is_available BOOLEAN;
BEGIN
  SELECT NOT EXISTS (
    SELECT 1 FROM appointments
    WHERE doctor_id = p_doctor_id
      AND date = p_date
      AND time = p_time
      AND status IN ('pendiente', 'confirmado')
  ) INTO is_available;
  
  RETURN is_available;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de un doctor
CREATE OR REPLACE FUNCTION get_doctor_stats(p_doctor_id UUID)
RETURNS TABLE (
  total_appointments BIGINT,
  pending_appointments BIGINT,
  confirmed_appointments BIGINT,
  attended_appointments BIGINT,
  cancelled_appointments BIGINT,
  today_appointments BIGINT,
  month_appointments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE true),
    COUNT(*) FILTER (WHERE status = 'pendiente'),
    COUNT(*) FILTER (WHERE status = 'confirmado'),
    COUNT(*) FILTER (WHERE status = 'atendido'),
    COUNT(*) FILTER (WHERE status = 'cancelado'),
    COUNT(*) FILTER (WHERE date = CURRENT_DATE),
    COUNT(*) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
  FROM appointments
  WHERE doctor_id = p_doctor_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. TRIGGERS
-- ============================================

-- Trigger para actualizar updated_at en doctors
CREATE TRIGGER update_doctors_updated_at 
BEFORE UPDATE ON doctors
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en appointments
CREATE TRIGGER update_appointments_updated_at 
BEFORE UPDATE ON appointments
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en patients
CREATE TRIGGER update_patients_updated_at 
BEFORE UPDATE ON patients
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para registrar fecha de cancelación
CREATE OR REPLACE FUNCTION set_cancelled_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'cancelado' AND OLD.status != 'cancelado' THEN
    NEW.cancelled_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_appointment_cancelled_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION set_cancelled_at();

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_unavailability ENABLE ROW LEVEL SECURITY;

-- Políticas para DOCTORS

-- Los doctores pueden ver sus propios datos
CREATE POLICY "Doctors can view own data" ON doctors
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM doctors WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Los doctores pueden actualizar sus propios datos
CREATE POLICY "Doctors can update own data" ON doctors
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM doctors WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Políticas para APPOINTMENTS

-- Los doctores pueden ver sus propios turnos
CREATE POLICY "Doctors can view own appointments" ON appointments
  FOR SELECT USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Los doctores pueden actualizar sus propios turnos
CREATE POLICY "Doctors can update own appointments" ON appointments
  FOR UPDATE USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Los pacientes pueden ver sus propios turnos (si tienen cuenta)
CREATE POLICY "Patients can view own appointments" ON appointments
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'
    )
    OR
    patient_email = auth.jwt() ->> 'email'
  );

-- Cualquiera puede crear un turno (para permitir solicitudes sin login)
CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 11. VISTAS ÚTILES
-- ============================================

-- Vista de turnos con información completa
CREATE OR REPLACE VIEW appointments_full AS
SELECT 
  a.*,
  d.full_name as doctor_name,
  d.specialty as doctor_specialty,
  d.phone as doctor_phone,
  p.full_name as patient_full_name,
  p.phone as patient_full_phone,
  p.date_of_birth as patient_dob
FROM appointments a
LEFT JOIN doctors d ON a.doctor_id = d.id
LEFT JOIN patients p ON a.patient_id = p.id;

-- Vista de turnos de hoy
CREATE OR REPLACE VIEW today_appointments AS
SELECT * FROM appointments_full
WHERE date = CURRENT_DATE
ORDER BY time;

-- Vista de turnos pendientes
CREATE OR REPLACE VIEW pending_appointments AS
SELECT * FROM appointments_full
WHERE status = 'pendiente'
ORDER BY date, time;

-- ============================================
-- 12. DATOS DE EJEMPLO
-- ============================================

-- Insertar doctores de ejemplo
INSERT INTO doctors (email, full_name, specialty, license_number, phone, years_experience) VALUES
  ('dr.moguz@clinicamoguz.com', 'Dra. Ana Moguz', 'Cirugía Plástica', 'MP-12345', '+54 9 11 1234-5678', 15),
  ('dr.perez@clinicamoguz.com', 'Dr. Luis Pérez', 'Cirugía Reconstructiva', 'MP-67890', '+54 9 11 8765-4321', 12),
  ('dr.martinez@clinicamoguz.com', 'Dra. Ana Martínez', 'Medicina Estética', 'MP-11111', '+54 9 11 2222-3333', 10)
ON CONFLICT (email) DO NOTHING;

-- Insertar pacientes de ejemplo
INSERT INTO patients (email, full_name, phone, date_of_birth) VALUES
  ('juan.perez@email.com', 'Juan Pérez', '+54 9 11 1111-1111', '1985-03-15'),
  ('maria.gonzalez@email.com', 'María González', '+54 9 11 2222-2222', '1990-07-20')
ON CONFLICT (email) DO NOTHING;

-- Insertar turnos de ejemplo
INSERT INTO appointments (
  patient_name, patient_email, patient_phone,
  doctor_id, type, specialty, date, time, status
) VALUES
  (
    'Juan Pérez', 
    'juan.perez@email.com', 
    '+54 9 11 1111-1111',
    (SELECT id FROM doctors WHERE email = 'dr.moguz@clinicamoguz.com' LIMIT 1),
    'presencial',
    'Cirugía Plástica',
    CURRENT_DATE + INTERVAL '3 days',
    '10:00',
    'pendiente'
  ),
  (
    'María González',
    'maria.gonzalez@email.com',
    '+54 9 11 2222-2222',
    (SELECT id FROM doctors WHERE email = 'dr.moguz@clinicamoguz.com' LIMIT 1),
    'virtual',
    'Cirugía Plástica',
    CURRENT_DATE + INTERVAL '5 days',
    '14:00',
    'confirmado'
  );

-- Insertar horarios de ejemplo
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time) VALUES
  ((SELECT id FROM doctors WHERE email = 'dr.moguz@clinicamoguz.com' LIMIT 1), 1, '09:00', '18:00'), -- Lunes
  ((SELECT id FROM doctors WHERE email = 'dr.moguz@clinicamoguz.com' LIMIT 1), 2, '09:00', '18:00'), -- Martes
  ((SELECT id FROM doctors WHERE email = 'dr.moguz@clinicamoguz.com' LIMIT 1), 3, '09:00', '18:00'), -- Miércoles
  ((SELECT id FROM doctors WHERE email = 'dr.moguz@clinicamoguz.com' LIMIT 1), 4, '09:00', '18:00'), -- Jueves
  ((SELECT id FROM doctors WHERE email = 'dr.moguz@clinicamoguz.com' LIMIT 1), 5, '09:00', '13:00'); -- Viernes

-- ============================================
-- 13. CONSULTAS ÚTILES
-- ============================================

-- Ver todos los turnos de un doctor
-- SELECT * FROM appointments WHERE doctor_id = 'uuid-del-doctor' ORDER BY date, time;

-- Ver turnos de hoy
-- SELECT * FROM today_appointments;

-- Ver disponibilidad de un doctor en una fecha
-- SELECT check_availability('uuid-del-doctor', '2025-11-20', '10:00');

-- Ver estadísticas de un doctor
-- SELECT * FROM get_doctor_stats('uuid-del-doctor');

-- Generar link de Meet para un turno
-- SELECT generate_meet_link('uuid-del-turno');

-- ============================================
-- FIN DE LA ESTRUCTURA
-- ============================================

-- Para verificar que todo se creó correctamente:
SELECT 
  'doctors' as table_name, 
  COUNT(*) as row_count 
FROM doctors
UNION ALL
SELECT 'patients', COUNT(*) FROM patients
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'specialties', COUNT(*) FROM specialties;
