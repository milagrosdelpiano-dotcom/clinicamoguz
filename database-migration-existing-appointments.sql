-- Idempotent migration to align an existing appointments table
-- with the Doctor Panel schema while preserving data.
-- Safe to run multiple times.

-- 0) Extensions
create extension if not exists pgcrypto;

-- 1) Ensure core tables exist to allow FKs
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  specialty text,
  license_number text,
  phone text,
  bio text,
  avatar_url text,
  years_experience int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  phone text,
  date_of_birth date,
  gender text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_history text,
  allergies text,
  current_medications text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Appointments: add missing columns (no drops)
-- Note: Uses IF NOT EXISTS to avoid errors if columns already there
alter table public.appointments add column if not exists id uuid;
update public.appointments set id = gen_random_uuid() where id is null;
alter table public.appointments alter column id set default gen_random_uuid();

alter table public.appointments add column if not exists patient_id uuid;
alter table public.appointments add column if not exists doctor_id uuid;
alter table public.appointments add column if not exists patient_name text;
alter table public.appointments add column if not exists patient_email text;
alter table public.appointments add column if not exists patient_phone text;
alter table public.appointments add column if not exists type text; -- 'presencial' | 'virtual'
alter table public.appointments add column if not exists specialty text;
alter table public.appointments add column if not exists date date;
alter table public.appointments add column if not exists time time without time zone;
alter table public.appointments add column if not exists duration_minutes integer default 30;
alter table public.appointments add column if not exists status text; -- 'pendiente' | 'confirmado' | 'atendido' | 'cancelado' | 'no_asistio'
alter table public.appointments add column if not exists reason text;
alter table public.appointments add column if not exists notes text;
alter table public.appointments add column if not exists doctor_notes text;
alter table public.appointments add column if not exists prescription text;
alter table public.appointments add column if not exists video_link text;
alter table public.appointments add column if not exists video_platform text;
alter table public.appointments add column if not exists reminder_sent boolean default false;
alter table public.appointments add column if not exists reminder_sent_at timestamptz;
alter table public.appointments add column if not exists created_at timestamptz default now();
alter table public.appointments add column if not exists updated_at timestamptz default now();
alter table public.appointments add column if not exists cancelled_at timestamptz;
alter table public.appointments add column if not exists cancelled_by uuid;
alter table public.appointments add column if not exists cancellation_reason text;

-- 3) Primary key on id (only if table has none yet)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'appointments' AND c.contype = 'p'
  ) THEN
    -- ensure all rows have an id
    UPDATE public.appointments SET id = gen_random_uuid() WHERE id IS NULL;
    BEGIN
      ALTER TABLE public.appointments ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);
    EXCEPTION WHEN duplicate_table THEN
      -- ignore if already created concurrently
      NULL;
    END;
  END IF;
END$$;

-- 4) Check constraints (skip if they already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'appointments_status_check') THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_status_check
      CHECK (status IN ('pendiente','confirmado','atendido','cancelado','no_asistio'));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'appointments_type_check') THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_type_check
      CHECK (type IN ('presencial','virtual'));
  END IF;
END$$;

-- 5) Foreign keys (only if target tables exist and constraint missing)
DO $$
BEGIN
  IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema='public' AND table_name='doctors'
    ) AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='appointments_doctor_id_fkey')
  THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_doctor_id_fkey
      FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema='public' AND table_name='patients'
    ) AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='appointments_patient_id_fkey')
  THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_patient_id_fkey
      FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE SET NULL;
  END IF;
END$$;

-- 6) Indexes
create unique index if not exists idx_appointments_doctor_datetime
  on public.appointments (doctor_id, date, time)
  where doctor_id is not null and date is not null and time is not null;

create index if not exists idx_appointments_status on public.appointments (status);
create index if not exists idx_appointments_date on public.appointments (date);
create index if not exists idx_appointments_doctor on public.appointments (doctor_id);

-- 7) updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'appointments_set_updated_at') THEN
    CREATE TRIGGER appointments_set_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- 8) RLS and policies (minimal for doctors)
alter table public.appointments enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='appointments' AND policyname='appointments_doctors_select'
  ) THEN
    CREATE POLICY appointments_doctors_select ON public.appointments
      FOR SELECT USING (
        doctor_id IN (SELECT id FROM public.doctors WHERE email = auth.jwt() ->> 'email')
      );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='appointments' AND policyname='appointments_doctors_update'
  ) THEN
    CREATE POLICY appointments_doctors_update ON public.appointments
      FOR UPDATE USING (
        doctor_id IN (SELECT id FROM public.doctors WHERE email = auth.jwt() ->> 'email')
      );
  END IF;
END$$;

-- 9) Helper view (optional)
create or replace view public.today_appointments as
select * from public.appointments where date = (current_date);

-- 10) Done
-- You can run: select * from information_schema.columns where table_name='appointments' order by ordinal_position;