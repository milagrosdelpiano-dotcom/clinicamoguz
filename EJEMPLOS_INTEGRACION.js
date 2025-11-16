// EJEMPLOS DE INTEGRACIÓN CON EL SISTEMA ACTUAL
// Copiar estas funciones en tu código existente

// ============================================
// 1. MODIFICAR turnos.html O DONDE SE CREAN TURNOS
// ============================================

// Agregar esto donde se manejan los turnos de pacientes
async function crearTurnoConDoctor(formData) {
  // Obtener lista de doctores disponibles
  const { data: doctors } = await supabase
    .from('doctors')
    .select('id, full_name, specialty')
    .eq('specialty', formData.specialty);
  
  // Si hay varios doctores, tomar el primero o dejar que el paciente elija
  const doctorId = doctors?.[0]?.id;
  
  // Crear el turno
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      patient_name: formData.patientName,
      patient_email: formData.email,
      patient_phone: formData.phone,
      doctor_id: doctorId, // IMPORTANTE: asignar doctor
      type: formData.type, // 'presencial' o 'virtual'
      specialty: formData.specialty,
      date: formData.date,
      time: formData.time,
      status: 'pendiente',
      notes: formData.notes || null
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creando turno:', error);
    return null;
  }
  
  return appointment;
}

// ============================================
// 2. AGREGAR SELECTOR DE DOCTOR EN EL FORMULARIO
// ============================================

// HTML adicional para el formulario de turnos
const doctorSelectorHTML = `
  <div class="form-group">
    <label for="doctor-select">Profesional (opcional)</label>
    <select id="doctor-select" name="doctor">
      <option value="">Sin preferencia</option>
    </select>
  </div>
`;

// JavaScript para cargar doctores dinámicamente
async function loadDoctorsIntoSelect(specialty) {
  const select = document.getElementById('doctor-select');
  
  const { data: doctors } = await supabase
    .from('doctors')
    .select('id, full_name, specialty')
    .eq('specialty', specialty);
  
  select.innerHTML = '<option value="">Sin preferencia</option>';
  
  doctors.forEach(doctor => {
    const option = document.createElement('option');
    option.value = doctor.id;
    option.textContent = `${doctor.full_name} - ${doctor.specialty}`;
    select.appendChild(option);
  });
}

// Llamar cuando cambie la especialidad
document.getElementById('specialty-select')?.addEventListener('change', (e) => {
  loadDoctorsIntoSelect(e.target.value);
});

// ============================================
// 3. MOSTRAR TURNOS DEL PACIENTE (Si tienes login de pacientes)
// ============================================

async function loadPatientAppointments(patientEmail) {
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      doctors (
        full_name,
        specialty
      )
    `)
    .eq('patient_email', patientEmail)
    .order('date', { ascending: true });
  
  const container = document.getElementById('my-appointments');
  
  if (!appointments || appointments.length === 0) {
    container.innerHTML = '<p>No tienes turnos agendados</p>';
    return;
  }
  
  container.innerHTML = appointments.map(apt => `
    <div class="appointment-card">
      <h4>${new Date(apt.date).toLocaleDateString('es-AR')} a las ${apt.time}</h4>
      <p><strong>Doctor:</strong> ${apt.doctors?.full_name || 'No asignado'}</p>
      <p><strong>Tipo:</strong> ${apt.type}</p>
      <p><strong>Estado:</strong> <span class="badge-${apt.status}">${apt.status}</span></p>
      
      ${apt.type === 'virtual' && apt.video_link ? `
        <a href="${apt.video_link}" target="_blank" class="btn btn-primary">
          Iniciar videollamada
        </a>
      ` : ''}
      
      ${apt.status === 'pendiente' ? `
        <button onclick="cancelAppointment('${apt.id}')" class="btn btn-danger">
          Cancelar turno
        </button>
      ` : ''}
    </div>
  `).join('');
}

// ============================================
// 4. CANCELAR TURNO (DESDE VISTA DEL PACIENTE)
// ============================================

async function cancelAppointment(appointmentId) {
  if (!confirm('¿Estás seguro de cancelar este turno?')) return;
  
  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelado' })
    .eq('id', appointmentId);
  
  if (error) {
    alert('Error al cancelar: ' + error.message);
    return;
  }
  
  alert('Turno cancelado correctamente');
  // Recargar la lista
  loadPatientAppointments(/* email del paciente */);
}

// ============================================
// 5. NOTIFICACIONES EN TIEMPO REAL
// ============================================

// Para que el paciente reciba notificaciones cuando el doctor cambia el estado
function subscribeToAppointmentUpdates(patientEmail) {
  const subscription = supabase
    .channel('patient-appointments')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'appointments',
        filter: `patient_email=eq.${patientEmail}`
      },
      (payload) => {
        // Mostrar notificación al paciente
        showNotification(
          'Actualización de turno',
          `Tu turno cambió a: ${payload.new.status}`
        );
        
        // Recargar turnos
        loadPatientAppointments(patientEmail);
      }
    )
    .subscribe();
  
  return subscription;
}

function showNotification(title, message) {
  // Notificación browser nativa
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: message });
  }
  
  // O mostrar alert personalizado
  const alertDiv = document.createElement('div');
  alertDiv.className = 'notification-toast';
  alertDiv.innerHTML = `
    <strong>${title}</strong>
    <p>${message}</p>
  `;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9999;
  `;
  document.body.appendChild(alertDiv);
  
  setTimeout(() => alertDiv.remove(), 5000);
}

// ============================================
// 6. INTEGRACIÓN CON GOOGLE CALENDAR
// ============================================

async function addToGoogleCalendar(appointment) {
  const startDate = new Date(`${appointment.date}T${appointment.time}`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora después
  
  const event = {
    title: `Consulta médica - ${appointment.specialty}`,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    description: `
      Doctor: ${appointment.doctor_name}
      Tipo: ${appointment.type}
      ${appointment.video_link ? `Link: ${appointment.video_link}` : ''}
    `,
    location: appointment.type === 'presencial' 
      ? 'España 1115, Corrientes' 
      : 'Videollamada'
  };
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
  
  window.open(googleCalendarUrl, '_blank');
}

// Agregar botón en la confirmación del turno
function showAppointmentConfirmation(appointment) {
  const html = `
    <div class="confirmation-modal">
      <h2>✅ Turno confirmado</h2>
      <p>Tu turno ha sido agendado para:</p>
      <p><strong>${new Date(appointment.date).toLocaleDateString('es-AR')} a las ${appointment.time}</strong></p>
      
      <button onclick="addToGoogleCalendar(${JSON.stringify(appointment)})" class="btn btn-secondary">
        📅 Agregar a Google Calendar
      </button>
      
      <button onclick="closeModal()" class="btn btn-primary">
        Aceptar
      </button>
    </div>
  `;
  
  // Mostrar modal
}

// ============================================
// 7. RECORDATORIOS AUTOMÁTICOS (Supabase Edge Function)
// ============================================

/* 
Crear en Supabase → Edge Functions → New Function

Nombre: send-appointment-reminders

Código:
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  // Obtener turnos de mañana
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('date', tomorrowStr)
    .eq('status', 'confirmado')
  
  // Enviar email a cada paciente
  for (const apt of appointments) {
    // Aquí integrar con servicio de email (SendGrid, Resend, etc.)
    console.log(`Recordatorio enviado a ${apt.patient_email}`)
  }
  
  return new Response(
    JSON.stringify({ sent: appointments.length }),
    { headers: { "Content-Type": "application/json" } }
  )
})

/*
Configurar Cron Job en Supabase:
- Ve a Edge Functions → Configuración
- Agregar Cron: 0 9 * * * (cada día a las 9am)
*/

// ============================================
// 8. VERIFICAR DISPONIBILIDAD DE HORARIOS
// ============================================

async function checkAvailability(doctorId, date) {
  const { data: appointments } = await supabase
    .from('appointments')
    .select('time')
    .eq('doctor_id', doctorId)
    .eq('date', date)
    .in('status', ['pendiente', 'confirmado']);
  
  const bookedTimes = appointments.map(a => a.time);
  
  // Horarios disponibles (9am a 6pm, cada hora)
  const allTimes = [];
  for (let hour = 9; hour <= 18; hour++) {
    allTimes.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
  
  return availableTimes;
}

// Mostrar horarios disponibles en el formulario
async function renderAvailableTimeSlots(doctorId, date) {
  const times = await checkAvailability(doctorId, date);
  const container = document.getElementById('time-slots');
  
  container.innerHTML = times.map(time => `
    <button class="time-slot-btn" onclick="selectTime('${time}')">
      ${time}
    </button>
  `).join('');
}

// ============================================
// 9. ENVIAR LINK DE VIDEOLLAMADA AL PACIENTE (Email)
// ============================================

// Edge Function para enviar email cuando se genera link
async function sendVideoLinkToPatient(appointmentId, videoLink) {
  // Llamar a tu Edge Function
  const response = await fetch('https://tu-proyecto.supabase.co/functions/v1/send-video-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({
      appointmentId,
      videoLink
    })
  });
  
  return response.json();
}

// Edge Function code (crear en Supabase):
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { appointmentId, videoLink } = await req.json()
  
  // Obtener datos del turno
  const supabase = createClient(...)
  const { data: apt } = await supabase
    .from('appointments')
    .select('patient_email, patient_name, date, time')
    .eq('id', appointmentId)
    .single()
  
  // Enviar email con Resend, SendGrid, etc.
  const emailHTML = `
    <h2>Link de videollamada disponible</h2>
    <p>Hola ${apt.patient_name},</p>
    <p>Tu consulta virtual está programada para ${apt.date} a las ${apt.time}</p>
    <p><a href="${videoLink}">Hacer clic aquí para ingresar a la videollamada</a></p>
  `
  
  // Enviar email...
  
  return new Response(JSON.stringify({ success: true }))
})
*/

// ============================================
// 10. DASHBOARD PARA PACIENTES (Opcional)
// ============================================

// Crear patient-dashboard.html similar al de doctores
// Con estas características:
// - Ver mis turnos
// - Cancelar turnos
// - Solicitar nuevo turno
// - Ver historial médico
// - Chat con el doctor

const patientDashboardFeatures = {
  myAppointments: 'Ver turnos agendados',
  requestNew: 'Solicitar nuevo turno',
  history: 'Historial de consultas',
  documents: 'Documentos médicos',
  chat: 'Mensajes con el doctor'
};

// ============================================
// RESUMEN DE FLUJO COMPLETO
// ============================================

/*
FLUJO PACIENTE:
1. Paciente entra al sitio → turnos.html
2. Completa formulario (fecha, hora, especialidad, opcionalmente elige doctor)
3. Se crea turno con status 'pendiente'
4. Paciente recibe confirmación

FLUJO DOCTOR:
1. Doctor ingresa a doctor-login.html
2. Ve dashboard con todos sus turnos
3. Cambia estado a 'confirmado'
4. Si es virtual, genera link de videollamada
5. Link se guarda en BD y se envía al paciente
6. Doctor marca como 'atendido' cuando finaliza

FLUJO VIDEOLLAMADA:
1. Doctor genera link (Google Meet, Jitsi, etc.)
2. Se guarda en appointments.video_link
3. Paciente recibe email con el link
4. A la hora del turno, paciente hace clic en el link
5. Doctor también hace clic para unirse
6. Consulta virtual se realiza
7. Doctor marca como atendido en el dashboard
*/
