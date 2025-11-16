// API Helper para interactuar con Supabase desde el frontend
// Archivo: assets/doctor-api.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Configuración (REEMPLAZAR con tus credenciales)
const SUPABASE_URL = 'https://csrmylnhdhwurnmmogfl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcm15bG5oZGh3dXJubW1vZ2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTcxODcsImV4cCI6MjA3ODEzMzE4N30.GEnlUM_PiPK2X_lpoio9gm0pwBAC7uLbhqkJ5HohHug';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { storageKey: 'sb-doctor', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

// ==================== AUTENTICACIÓN ====================

export async function loginWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

export async function loginWithMagicLink(email, redirectTo) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo }
  });
  
  if (error) throw error;
  return true;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ==================== DOCTORES ====================

export async function getDoctorByEmail(email) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateDoctorProfile(doctorId, updates) {
  const { data, error } = await supabase
    .from('doctors')
    .update(updates)
    .eq('id', doctorId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== TURNOS ====================

export async function getAppointmentsByDoctor(doctorId, filters = {}) {
  let query = supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId);
  
  // Aplicar filtros opcionales
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters.date) {
    query = query.eq('date', filters.date);
  }
  
  if (filters.startDate && filters.endDate) {
    query = query.gte('date', filters.startDate).lte('date', filters.endDate);
  }
  
  // Ordenar por fecha y hora
  query = query.order('date', { ascending: true }).order('time', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function getAppointmentById(appointmentId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(appointmentId, status) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', appointmentId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateAppointmentVideoLink(appointmentId, videoLink) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      video_link: videoLink,
      updated_at: new Date().toISOString()
    })
    .eq('id', appointmentId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function addAppointmentNotes(appointmentId, notes) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', appointmentId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== ESTADÍSTICAS ====================

export async function getDoctorStats(doctorId) {
  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
  
  // Turnos de hoy
  const { data: todayData } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', doctorId)
    .eq('date', today);
  
  // Turnos pendientes
  const { data: pendingData } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', doctorId)
    .eq('status', 'pendiente');
  
  // Turnos confirmados
  const { data: confirmedData } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', doctorId)
    .eq('status', 'confirmado');
  
  // Turnos del mes
  const { data: monthData } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', doctorId)
    .gte('date', startOfMonth)
    .lte('date', endOfMonth);
  
  return {
    today: todayData?.length || 0,
    pending: pendingData?.length || 0,
    confirmed: confirmedData?.length || 0,
    month: monthData?.length || 0
  };
}

// ==================== PACIENTES ====================

export async function getPatientById(patientId) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getPatientAppointments(patientId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// ==================== VIDEOLLAMADAS ====================

// Generar link de Google Meet (simulado - en producción usar API de Google)
export function generateGoogleMeetLink() {
  const meetId = Math.random().toString(36).substring(2, 12);
  return `https://meet.google.com/${meetId}`;
}

// Generar link de Jitsi Meet (alternativa open source)
export function generateJitsiMeetLink(appointmentId) {
  const roomName = `clinica-moguz-${appointmentId}`;
  return `https://meet.jit.si/${roomName}`;
}

// ==================== NOTIFICACIONES ====================

// Enviar notificación al paciente (requiere configurar en Supabase Edge Functions)
export async function notifyPatient(appointmentId, message) {
  // Esto requeriría una Edge Function en Supabase
  // Por ahora solo un placeholder
  console.log('Notificación enviada:', message);
  return true;
}

// ==================== REAL-TIME ====================

// Suscribirse a cambios en los turnos
export function subscribeToAppointments(doctorId, callback) {
  const subscription = supabase
    .channel('appointments-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `doctor_id=eq.${doctorId}`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
  
  return subscription;
}

// Cancelar suscripción
export async function unsubscribe(subscription) {
  await supabase.removeChannel(subscription);
}
