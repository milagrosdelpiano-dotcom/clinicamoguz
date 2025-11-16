# 📋 INSTRUCCIONES DE CONFIGURACIÓN - PANEL MÉDICO

## 🎯 Archivos Creados

1. **doctor-login.html** - Página de login para doctores
2. **doctor-dashboard.html** - Panel de control del doctor
3. **assets/doctor-api.js** - API helper con funciones reutilizables

---

## 🗄️ PASO 1: Configurar Base de Datos en Supabase

### 1.1 Crear las tablas

Ve a tu proyecto de Supabase → SQL Editor → New Query y ejecuta este código:

```sql
-- Copiar y pegar el SQL que te proporcioné anteriormente
-- (El código completo con CREATE TABLE doctors, patients, appointments, etc.)
```

### 1.2 Configurar Row Level Security (RLS)

El SQL ya incluye las políticas de seguridad. Verifica que RLS esté habilitado:

```sql
-- Verificar que RLS esté activo
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('doctors', 'appointments', 'patients');
```

### 1.3 Crear doctores de prueba

```sql
-- Primero, crear usuarios en Supabase Auth manualmente desde el panel
-- Luego insertar en la tabla doctors:

INSERT INTO doctors (email, full_name, specialty, license_number, phone) VALUES
  ('doctor1@clinicamoguz.com', 'Dra. Ana Moguz', 'Cirugía Plástica', '12345', '+54 9 11 1234-5678'),
  ('doctor2@clinicamoguz.com', 'Dr. Luis Pérez', 'Cirugía Reconstructiva', '67890', '+54 9 11 8765-4321');
```

---

## 🔑 PASO 2: Configurar Credenciales

### 2.1 Obtener las credenciales de Supabase

1. Ve a tu proyecto en Supabase
2. Settings → API
3. Copia:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon public** key

### 2.2 Actualizar los archivos HTML

En **doctor-login.html** línea ~155:
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // REEMPLAZAR
const SUPABASE_KEY = 'tu-anon-key-aqui'; // REEMPLAZAR
```

En **doctor-dashboard.html** línea ~433:
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // REEMPLAZAR
const SUPABASE_KEY = 'tu-anon-key-aqui'; // REEMPLAZAR
```

En **assets/doctor-api.js** líneas 5-6:
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // REEMPLAZAR
const SUPABASE_KEY = 'tu-anon-key-aqui'; // REEMPLAZAR
```

---

## 👥 PASO 3: Crear Usuarios Doctores en Supabase Auth

1. Ve a Authentication → Users en Supabase
2. Haz clic en "Add user" → "Create new user"
3. Ingresa:
   - Email: `doctor1@clinicamoguz.com`
   - Password: (elige una contraseña segura)
   - Auto Confirm User: ✅ SÍ
4. Repite para cada doctor

**IMPORTANTE**: El email del usuario en Auth debe coincidir con el email en la tabla `doctors`.

---

## 🔗 PASO 4: Integrar con tu Sistema Actual

### 4.1 Modificar el sistema de turnos de pacientes

En tu archivo actual donde los pacientes solicitan turnos (probablemente `turnos.html` o en `index.html`), 
al crear un turno, debes asignar un `doctor_id`.

Ejemplo de código para insertar turno:

```javascript
const { data, error } = await supabase
  .from('appointments')
  .insert({
    patient_name: 'Juan Pérez',
    patient_email: 'juan@email.com',
    patient_phone: '+54 9 11 1111-1111',
    doctor_id: 'uuid-del-doctor', // Obtener de la tabla doctors
    type: 'presencial', // o 'virtual'
    specialty: 'Cirugía Plástica',
    date: '2025-11-20',
    time: '10:00',
    status: 'pendiente'
  });
```

### 4.2 Agregar link al portal médico

En tu **index.html** o **footer**, agrega:

```html
<a href="doctor-login.html" style="color: var(--muted); font-size: 12px;">
  🩺 Acceso Médicos
</a>
```

---

## 📹 PASO 5: Configurar Videollamadas

### Opción A: Google Meet (Recomendado - Requiere API)

Para generar links reales de Google Meet, necesitas:

1. Crear un proyecto en Google Cloud Console
2. Habilitar Google Meet API
3. Crear credenciales OAuth 2.0
4. Implementar en una Edge Function de Supabase

**Edge Function ejemplo** (crear en Supabase → Edge Functions):

```typescript
// supabase/functions/generate-meet-link/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { appointmentId } = await req.json()
  
  // Llamar a la API de Google Meet aquí
  // Por ahora, generar link simulado
  const meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`
  
  return new Response(
    JSON.stringify({ meetLink }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

### Opción B: Jitsi Meet (Gratis, Open Source)

Ya implementado en el código. Solo cambiar en `doctor-dashboard.html`:

```javascript
// En lugar de:
const meetLink = `https://meet.google.com/${meetId}`;

// Usar:
const meetLink = `https://meet.jit.si/clinica-moguz-${appointmentId}`;
```

### Opción C: WebRTC (Avanzado)

Para videollamadas integradas en el sitio, puedes usar:
- **Daily.co** (https://daily.co) - API simple
- **Agora** (https://agora.io)
- **Twilio Video**

Ejemplo con Daily.co:

```html
<iframe 
  src="https://yourcompany.daily.co/room-name"
  allow="camera; microphone; fullscreen; speaker; display-capture"
  style="width: 100%; height: 100vh; border: 0">
</iframe>
```

---

## 🔒 PASO 6: Seguridad Adicional

### 6.1 Verificar que solo doctores puedan acceder

En **doctor-dashboard.html**, ya está implementado:
```javascript
// Verifica que el email del usuario esté en la tabla doctors
const { data: doctorData } = await supabase
  .from('doctors')
  .select('*')
  .eq('email', session.user.email)
  .single();
```

### 6.2 Políticas RLS (Row Level Security)

Ya configuradas en el SQL. Asegúrate de que estén activas:

```sql
-- Solo los doctores ven sus propios turnos
CREATE POLICY "Doctors can view own appointments" ON appointments
  FOR SELECT USING (doctor_id IN (SELECT id FROM doctors WHERE auth.uid() = id));
```

### 6.3 HTTPS

**IMPORTANTE**: En producción, usa HTTPS siempre. Supabase ya lo proporciona por defecto.

---

## 📱 PASO 7: Características Adicionales (Opcionales)

### 7.1 Notificaciones por Email

Configurar en Supabase → Authentication → Email Templates

```sql
-- Trigger para notificar cuando cambia el estado
CREATE OR REPLACE FUNCTION notify_patient_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Aquí puedes llamar a una Edge Function para enviar email
  PERFORM net.http_post(
    url := 'https://tu-proyecto.supabase.co/functions/v1/send-email',
    body := json_build_object(
      'to', NEW.patient_email,
      'subject', 'Estado de tu turno actualizado',
      'message', 'Tu turno ha sido ' || NEW.status
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_status_changed
  AFTER UPDATE OF status ON appointments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_patient_status_change();
```

### 7.2 Calendario Integrado

Usar FullCalendar.js para vista de calendario:

```html
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
<script>
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: appointments.map(apt => ({
      title: apt.patient_name,
      start: apt.date + 'T' + apt.time,
      color: apt.type === 'virtual' ? '#007bff' : '#28a745'
    }))
  });
  calendar.render();
</script>
```

### 7.3 Estadísticas Avanzadas

```javascript
// Agregar en doctor-dashboard.html
async function loadAdvancedStats() {
  const { data } = await supabase
    .from('appointments')
    .select('type, status')
    .eq('doctor_id', currentDoctor.id);
  
  // Gráficos con Chart.js
  const ctx = document.getElementById('statsChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pendientes', 'Confirmados', 'Atendidos'],
      datasets: [{
        data: [
          data.filter(d => d.status === 'pendiente').length,
          data.filter(d => d.status === 'confirmado').length,
          data.filter(d => d.status === 'atendido').length
        ]
      }]
    }
  });
}
```

---

## 🧪 PASO 8: Testing

### 8.1 Crear turnos de prueba

```sql
INSERT INTO appointments (
  patient_name, patient_email, patient_phone,
  doctor_id, type, specialty, date, time, status
) VALUES
  ('Juan Pérez', 'juan@email.com', '+54 9 11 1111-1111',
   (SELECT id FROM doctors WHERE email = 'doctor1@clinicamoguz.com'),
   'presencial', 'Cirugía Plástica', '2025-11-20', '10:00', 'pendiente'),
  
  ('María González', 'maria@email.com', '+54 9 11 2222-2222',
   (SELECT id FROM doctors WHERE email = 'doctor1@clinicamoguz.com'),
   'virtual', 'Cirugía Plástica', '2025-11-20', '14:00', 'confirmado');
```

### 8.2 Probar funcionalidades

1. ✅ Login con email y contraseña
2. ✅ Ver turnos en el dashboard
3. ✅ Cambiar estado de un turno
4. ✅ Generar link de videollamada
5. ✅ Filtrar por tipo y estado
6. ✅ Cerrar sesión

---

## 🚀 PASO 9: Deploy

### Si usas hosting estático (Vercel, Netlify, etc.)

1. Sube todos los archivos
2. Configura las variables de entorno:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_KEY=tu-anon-key
   ```

### Configurar redirects

En **netlify.toml** o **vercel.json**:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://tu-proyecto.supabase.co/:path*" }
  ]
}
```

---

## 📊 PASO 10: Monitoreo

### Logs en Supabase

- Ve a Logs → API Logs para ver todas las consultas
- Configura alertas para errores

### Analytics

Agregar Google Analytics o similar:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## ❓ FAQ - Preguntas Frecuentes

**P: ¿Cómo agrego más doctores?**
R: Crea el usuario en Supabase Auth, luego inserta en la tabla `doctors` con el mismo email.

**P: ¿Los pacientes pueden ver el panel de doctores?**
R: No, solo pueden acceder usuarios que existan en la tabla `doctors`.

**P: ¿Cómo cambio el diseño?**
R: Edita los estilos CSS en `doctor-dashboard.html` o crea un archivo CSS separado.

**P: ¿Puedo tener múltiples clínicas?**
R: Sí, agrega una tabla `clinics` y relaciona doctores y turnos con `clinic_id`.

**P: ¿Funciona en móvil?**
R: Sí, el diseño es responsive. Puedes mejorar la experiencia mobile ajustando los estilos.

---

## 🆘 Soporte

Si necesitas ayuda:
1. Revisa los logs en Supabase
2. Verifica que las credenciales estén correctas
3. Confirma que RLS esté configurado correctamente
4. Revisa la consola del navegador (F12) para errores JavaScript

---

## ✅ Checklist Final

- [ ] Base de datos creada en Supabase
- [ ] Doctores insertados en la tabla
- [ ] Usuarios creados en Supabase Auth
- [ ] Credenciales actualizadas en los archivos
- [ ] RLS configurado correctamente
- [ ] Turnos de prueba creados
- [ ] Login funcionando
- [ ] Dashboard mostrando turnos
- [ ] Cambio de estado funcionando
- [ ] Links de videollamada funcionando

---

¡Listo! Tu panel médico está configurado. 🎉
