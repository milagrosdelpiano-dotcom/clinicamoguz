(function(){
  // If index.html already defines translations, reuse it; otherwise define a compact set
  if (!window.translations) {
    window.translations = {
      es: {
        // Menú / Header
        menuHome:'Inicio',menuTreatments:'Tratamientos',menuProfessionals:'Profesionales',menuTurns:'Turnos',menuContact:'Contacto',
        login:'Iniciar sesión',requestTurn:'Solicitar turno',
        brandSubtitle:'Cirugía plástica • Reconstructiva • Estética',
        footerQuickLinks:'Enlaces rápidos: Turnos • Tratamientos • Contacto',
        footerPolicies:'Políticas: Privacidad • T&C',
        // Home
        homeTitle:'Clínica Moguz — Excelencia en cirugía plástica y estética',
        homeSubtitle:'Atención personalizada, equipo profesional y tecnología de vanguardia. Pedí tu turno presencial o virtual con unos pocos pasos.',
        heroTreatments:'Conocé nuestros tratamientos',
        nextTurns:'Próximos turnos',noNextTurns:'No hay turnos próximos',
        // Tratamientos
        treatments:'Tratamientos y Servicios',viewMore:'Ver más',requestTurnFor:'Solicitar turno',
        treatment1Name:'Rinoplastía',treatment1Spec:'Cirugía facial',
        treatment2Name:'Liposucción',treatment2Spec:'Contorno corporal',
        treatment3Name:'Aumento mamario',treatment3Spec:'Cirugía mamaria',
        treatment4Name:'Toxina botulínica',treatment4Spec:'Estética',
        treatmentsIntro:'En Clínica Moguz ofrecemos una amplia gama de procedimientos quirúrgicos y estéticos con tecnología de vanguardia y un equipo médico altamente calificado. Cada tratamiento es personalizado según las necesidades y expectativas de nuestros pacientes.',
        duration:'Duración',recovery:'Recuperación',anesthesia:'Anestesia',
        treatmentDuration1:'2-3 horas',treatmentRecovery1:'7-10 días',treatmentAnesthesia1:'General',
        treatmentDesc1:'Corrección estética y funcional de la nariz. Mejoramos la armonía facial respetando las características naturales de cada paciente.',
        treatmentDuration2:'1-3 horas',treatmentRecovery2:'5-7 días',treatmentAnesthesia2:'General o local con sedación',
        treatmentDesc2:'Eliminación de depósitos de grasa localizada mediante técnicas avanzadas. Ideal para moldear el contorno corporal.',
        treatmentDuration3:'1.5-2 horas',treatmentRecovery3:'7-14 días',treatmentAnesthesia3:'General',
        treatmentDesc3:'Aumento del volumen mamario con implantes de alta calidad. Resultados naturales y duraderos con técnicas mínimamente invasivas.',
        treatmentDuration4:'15-30 minutos',treatmentRecovery4:'Inmediata',treatmentAnesthesia4:'No requiere',
        treatmentDesc4:'Tratamiento no quirúrgico para reducir arrugas de expresión. Resultados visibles en pocos días con efecto natural.',
        needAdvice:'¿Necesitás asesoramiento personalizado?',
        adviceText:'Nuestro equipo médico está disponible para una consulta sin cargo donde evaluaremos tu caso particular y te recomendaremos el mejor tratamiento.',
        scheduleFreeConsult:'Agendar consulta gratuita',
        // Profesionales
        professionals:'Profesionales',
        prof1Spec:'Cirugía Plástica',prof1Bio:'Matrícula 12345. 15 años de experiencia.',
        prof2Spec:'Cirugía Reconstructiva',prof2Bio:'Especialista en reconstrucción post-trauma.',
        prof3Spec:'Estética',prof3Bio:'Tratamientos mínimamente invasivos.',
        profIntro:'Contamos con un equipo de especialistas certificados con años de experiencia en cirugía plástica y estética. Cada profesional está comprometido con la excelencia médica y el bienestar de nuestros pacientes.',
        education:'Formación',specialization:'Especialización',certifications:'Certificaciones',experience:'Experiencia',
        quote1:'Mi compromiso es lograr resultados naturales que realcen la belleza única de cada paciente.',
        quote2:'Cada cirugía es única. Mi enfoque personalizado garantiza resultados excepcionales.',
        quote3:'La belleza no tiene edad. Mi objetivo es que cada paciente se sienta seguro y radiante.',
        excellenceCommitment:'Nuestro compromiso con la excelencia',
        intlCertifications:'Certificaciones internacionales',
        intlCertificationsDesc:'Nuestro equipo cuenta con certificaciones de las principales sociedades médicas del mundo.',
        cuttingEdgeTech:'Tecnología de vanguardia',
        cuttingEdgeTechDesc:'Equipamiento de última generación para procedimientos seguros y efectivos.',
        personalizedCare:'Atención personalizada',
        personalizedCareDesc:'Seguimiento integral desde la primera consulta hasta la recuperación completa.',
        book:'Sacar turno',
        // Turnos
        formType:'Tipo',formSpec:'Especialidad',formDate:'Fecha',formTime:'Hora',formPatient:'Nombre del paciente',professionalOptional:'Profesional (opcional)',
        confirmTurn:'Confirmar turno',cancel:'Cancelar',
        inPerson:'Presencial',virtual:'Virtual',
        specPlastic:'Cirugía Plástica',specReconstructive:'Cirugía Reconstructiva',specAesthetic:'Estética',
        rescheduleHint:'Podés reprogramar o cancelar luego desde tu cuenta.',
        turnRequestedSimple:'Turno solicitado con éxito',
        // Contacto
        contact:'Contacto',sendQuery:'Enviar consulta',contactSent:'Consulta enviada. Nos contactaremos por correo.',
        address:'Dirección',phone:'Tel',hours:'Horarios',
        namePlaceholder:'Nombre',emailPlaceholder:'Email',messagePlaceholder:'Consulta',
        contactIntro:'Estamos para ayudarte. Comunicate con nosotros por cualquiera de estos medios y te responderemos a la brevedad.',
        visitUs:'Visitanos',contactUs:'Contactanos',howToArrive:'Cómo llegar',
        byCar:'En auto',byPublicTransport:'En transporte público',
        addressDetails:'Planta Baja - Frente a Plaza Juan de Vera',
        accessibility:'Accesibilidad para personas con movilidad reducida',
        scheduleRequired:'Consultas con turno previo',
        whatsappAvailable:'WhatsApp disponible para consultas rápidas',
        followInstagram:'Seguinos para ver casos reales y novedades',
        freeParking:'Estacionamiento gratuito en la zona. Acceso directo por Av. España.',
        busLines:'Líneas: 103, 105, 107. Parada España y San Martín.',
        interactiveMapSoon:'Mapa interactivo próximamente',
        sendYourInquiry:'Envianos tu consulta',
        replyIn24:'Completá el formulario y te responderemos en menos de 24 horas',
        fullName:'Nombre completo',phoneOptional:'Teléfono (opcional)',writeInquiry:'Escribí tu consulta aquí...',
        replyShortly:'Te responderemos a la brevedad',
        faq:'Preguntas frecuentes',
        faqQ1:'¿Necesito turno para una consulta?',
        faqA1:'Sí, trabajamos únicamente con sistema de turnos para garantizar la mejor atención personalizada.',
        faqQ2:'¿Atienden obras sociales?',
        faqA2:'Trabajamos con las principales obras sociales y prepagas. Consultá disponibilidad.',
        faqQ3:'¿Hacen consultas virtuales?',
        faqA3:'Sí, ofrecemos videoconsultas para evaluaciones preliminares y seguimientos post-operatorios.',
        // Chat
        chatTitle:'Asistente Clínica Moguz',
        chatGreeting:'Hola 👋 Soy el asistente virtual de Clínica Moguz. ¿En qué puedo ayudarte?',
        chatQueryTurns:'Consultar turnos',chatQueryTreatments:'Ver tratamientos',chatQueryContact:'Horarios y contacto',chatPlaceholder:'Escribí tu consulta',
        chatBotName:'Dr. Bot Moguz',
        chatMyAppointments:'📅 Mis turnos',
        chatNewAppointment:'➕ Nuevo turno',
        chatTreatments:'💉 Tratamientos',
        chatProfessionals:'👨‍⚕️ Profesionales',
        chatSchedule:'🕐 Horarios',
        chatContact:'📞 Contacto',
        chatInputPlaceholder:'Escribí tu consulta...',
        chatResponseAppointments:'Para ver tus turnos, visitá la página principal. <br>¿Querés <strong>solicitar uno nuevo</strong>? 📅',
        chatResponseNewAppointment:'¡Perfecto! Para solicitar un turno, visitá nuestra <a href="turnos.html" style="color:#1976d2;font-weight:bold">página de turnos</a>. 📅',
        chatResponseTreatments:'Ofrecemos diversos tratamientos:<br>• Rinoplastía<br>• Liposucción<br>• Aumento mamario<br>• Toxina botulínica<br><br>¿Querés conocer más detalles? 💉',
        chatResponseProfessionals:'Nuestro equipo está conformado por:<br>• <strong>Dra. Ana Moguz</strong> - Cirugía Plástica<br>• <strong>Dr. Luis Pérez</strong> - Cirugía Reconstructiva<br>• <strong>Dr. Mario Guzmán</strong> - Estética<br><br>Todos con amplia experiencia. 👨‍⚕️',
        chatResponseSchedule:'<strong>Horarios de atención:</strong><br>🕐 Lunes a Viernes: 9:00 - 18:00<br>🕐 Sábados: 9:00 - 13:00<br><br>¡Te esperamos! 😊',
        chatResponseContact:'<strong>Datos de contacto:</strong><br>📞 Tel: (+54) 9 11 1234 5678<br>📧 Email: contacto@clinicamoguz.com<br>📍 Dirección: Av. Corrientes 1234, CABA<br><br>¡Estamos para ayudarte! 💙',
        chatResponsePricing:'Los precios varían según el tratamiento. <br>Te recomiendo <strong>solicitar un turno</strong> para una evaluación personalizada y presupuesto sin cargo. 💰',
        chatResponseUnknown:'Disculpá, no entendí tu consulta. 🤔<br>Probá con las opciones rápidas o escribí:<br>• "Ver turnos"<br>• "Tratamientos"<br>• "Horarios"<br>• "Contacto"'
      },
      en: {
        // Menu / Header
        menuHome:'Home',menuTreatments:'Treatments',menuProfessionals:'Professionals',menuTurns:'Appointments',menuContact:'Contact',
        login:'Sign in',requestTurn:'Request appointment',
        brandSubtitle:'Plastic Surgery • Reconstructive • Aesthetic',
        footerQuickLinks:'Quick links: Appointments • Treatments • Contact',
        footerPolicies:'Policies: Privacy • Terms',
        // Home
        homeTitle:'Moguz Clinic — Excellence in plastic and aesthetic surgery',
        homeSubtitle:'Personalized care, professional team and cutting-edge technology. Book your in-person or virtual appointment in just a few steps.',
        heroTreatments:'Discover our treatments',
        nextTurns:'Upcoming appointments',noNextTurns:'No upcoming appointments',
        // Treatments
        treatments:'Treatments and Services',viewMore:'View more',requestTurnFor:'Request appointment',
        treatment1Name:'Rhinoplasty',treatment1Spec:'Facial Surgery',
        treatment2Name:'Liposuction',treatment2Spec:'Body Contouring',
        treatment3Name:'Breast Augmentation',treatment3Spec:'Breast Surgery',
        treatment4Name:'Botulinum Toxin',treatment4Spec:'Aesthetic',
        treatmentsIntro:'At Moguz Clinic we offer a wide range of surgical and aesthetic procedures with cutting-edge technology and a highly qualified medical team. Each treatment is personalized according to the needs and expectations of our patients.',
        duration:'Duration',recovery:'Recovery',anesthesia:'Anesthesia',
        treatmentDuration1:'2-3 hours',treatmentRecovery1:'7-10 days',treatmentAnesthesia1:'General',
        treatmentDesc1:'Aesthetic and functional nose correction. We improve facial harmony respecting the natural characteristics of each patient.',
        treatmentDuration2:'1-3 hours',treatmentRecovery2:'5-7 days',treatmentAnesthesia2:'General or local with sedation',
        treatmentDesc2:'Removal of localized fat deposits using advanced techniques. Ideal for shaping body contour.',
        treatmentDuration3:'1.5-2 hours',treatmentRecovery3:'7-14 days',treatmentAnesthesia3:'General',
        treatmentDesc3:'Breast volume increase with high-quality implants. Natural and lasting results with minimally invasive techniques.',
        treatmentDuration4:'15-30 minutes',treatmentRecovery4:'Immediate',treatmentAnesthesia4:'Not required',
        treatmentDesc4:'Non-surgical treatment to reduce expression wrinkles. Visible results in a few days with natural effect.',
        needAdvice:'Need personalized advice?',
        adviceText:'Our medical team is available for a free consultation where we will evaluate your particular case and recommend the best treatment.',
        scheduleFreeConsult:'Schedule free consultation',
        // Professionals
        professionals:'Professionals',
        prof1Spec:'Plastic Surgery',prof1Bio:'License 12345. 15 years of experience.',
        prof2Spec:'Reconstructive Surgery',prof2Bio:'Specialist in post-trauma reconstruction.',
        prof3Spec:'Aesthetic',prof3Bio:'Minimally invasive treatments.',
        profIntro:'We have a team of certified specialists with years of experience in plastic and aesthetic surgery. Each professional is committed to medical excellence and the well-being of our patients.',
        education:'Education',specialization:'Specialization',certifications:'Certifications',experience:'Experience',
        quote1:'My commitment is to achieve natural results that enhance the unique beauty of each patient.',
        quote2:'Each surgery is unique. My personalized approach guarantees exceptional results.',
        quote3:'Beauty has no age. My goal is for each patient to feel confident and radiant.',
        excellenceCommitment:'Our commitment to excellence',
        intlCertifications:'International certifications',
        intlCertificationsDesc:'Our team has certifications from the main medical societies in the world.',
        cuttingEdgeTech:'Cutting-edge technology',
        cuttingEdgeTechDesc:'State-of-the-art equipment for safe and effective procedures.',
        personalizedCare:'Personalized care',
        personalizedCareDesc:'Comprehensive follow-up from the first consultation to complete recovery.',
        book:'Book',
        // Appointments
        formType:'Type',formSpec:'Specialty',formDate:'Date',formTime:'Time',formPatient:'Patient name',professionalOptional:'Professional (optional)',
        confirmTurn:'Confirm appointment',cancel:'Cancel',
        inPerson:'In-person',virtual:'Virtual',
        specPlastic:'Plastic Surgery',specReconstructive:'Reconstructive Surgery',specAesthetic:'Aesthetic',
        rescheduleHint:'You can reschedule or cancel later from your account.',
        turnRequestedSimple:'Appointment requested successfully',
        // Contact
        contact:'Contact',sendQuery:'Send inquiry',contactSent:'Message sent. We will contact you by email.',
        address:'Address',phone:'Phone',hours:'Hours',
        namePlaceholder:'Name',emailPlaceholder:'Email',messagePlaceholder:'Inquiry',
        contactIntro:'We are here to help you. Contact us by any of these means and we will respond shortly.',
        visitUs:'Visit us',contactUs:'Contact us',howToArrive:'How to get here',
        byCar:'By car',byPublicTransport:'By public transport',
        addressDetails:'Ground Floor - Facing Plaza Juan de Vera',
        accessibility:'Accessibility for people with reduced mobility',
        scheduleRequired:'Appointments by prior arrangement',
        whatsappAvailable:'WhatsApp available for quick inquiries',
        followInstagram:'Follow us to see real cases and news',
        freeParking:'Free parking in the area. Direct access via Av. España.',
        busLines:'Lines: 103, 105, 107. Stop España and San Martín.',
        interactiveMapSoon:'Interactive map coming soon',
        sendYourInquiry:'Send us your inquiry',
        replyIn24:'Complete the form and we will respond in less than 24 hours',
        fullName:'Full name',phoneOptional:'Phone (optional)',writeInquiry:'Write your inquiry here...',
        replyShortly:'We will respond shortly',
        faq:'Frequently asked questions',
        faqQ1:'Do I need an appointment for a consultation?',
        faqA1:'Yes, we work exclusively by appointment to guarantee the best personalized care.',
        faqQ2:'Do you accept health insurance?',
        faqA2:'We work with the main health insurance and prepaid plans. Check availability.',
        faqQ3:'Do you do virtual consultations?',
        faqA3:'Yes, we offer video consultations for preliminary evaluations and post-operative follow-ups.',
        // Chat
        chatTitle:'Moguz Clinic Assistant',
        chatGreeting:'Hello 👋 I am the virtual assistant of Moguz Clinic. How can I help you?',
        chatQueryTurns:'Check appointments',chatQueryTreatments:'View treatments',chatQueryContact:'Hours and contact',chatPlaceholder:'Type your inquiry',
        chatBotName:'Dr. Bot Moguz',
        chatMyAppointments:'📅 My appointments',
        chatNewAppointment:'➕ New appointment',
        chatTreatments:'💉 Treatments',
        chatProfessionals:'👨‍⚕️ Professionals',
        chatSchedule:'🕐 Schedule',
        chatContact:'📞 Contact',
        chatInputPlaceholder:'Type your question...',
        chatResponseAppointments:'To view your appointments, visit the main page. <br>Do you want to <strong>request a new one</strong>? 📅',
        chatResponseNewAppointment:'Perfect! To request an appointment, visit our <a href="turnos.html" style="color:#1976d2;font-weight:bold">appointments page</a>. 📅',
        chatResponseTreatments:'We offer various treatments:<br>• Rhinoplasty<br>• Liposuction<br>• Breast Augmentation<br>• Botulinum Toxin<br><br>Want to know more details? 💉',
        chatResponseProfessionals:'Our team consists of:<br>• <strong>Dr. Ana Moguz</strong> - Plastic Surgery<br>• <strong>Dr. Luis Pérez</strong> - Reconstructive Surgery<br>• <strong>Dr. Mario Guzmán</strong> - Aesthetic<br><br>All with extensive experience. 👨‍⚕️',
        chatResponseSchedule:'<strong>Office hours:</strong><br>🕐 Monday to Friday: 9:00 - 18:00<br>🕐 Saturdays: 9:00 - 13:00<br><br>We look forward to seeing you! 😊',
        chatResponseContact:'<strong>Contact information:</strong><br>📞 Phone: (+54) 9 11 1234 5678<br>📧 Email: contacto@clinicamoguz.com<br>📍 Address: Av. Corrientes 1234, CABA<br><br>We are here to help you! 💙',
        chatResponsePricing:'Prices vary depending on the treatment. <br>I recommend <strong>requesting an appointment</strong> for a personalized evaluation and free quote. 💰',
        chatResponseUnknown:'Sorry, I didn\'t understand your question. 🤔<br>Try the quick options or type:<br>• "View appointments"<br>• "Treatments"<br>• "Schedule"<br>• "Contact"'
      }
    };
  }

  const lang = localStorage.getItem('clinicLang') || 'es';
  function t(key){ return (window.translations[lang] && window.translations[lang][key]) || key; }
  window.i18nT = t;

  function applyI18n(){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t(key);
      } else {
        el.textContent = t(key);
      }
    });
    // Menu text
    const menuLinks = document.querySelectorAll('.dropdown-menu a');
    if (menuLinks.length >= 5) {
      menuLinks[0].innerHTML = '🏠 '+t('menuHome');
      menuLinks[1].innerHTML = '💉 '+t('menuTreatments');
      menuLinks[2].innerHTML = '👨‍⚕️ '+t('menuProfessionals');
      menuLinks[3].innerHTML = '📅 '+t('menuTurns');
      menuLinks[4].innerHTML = '📞 '+t('menuContact');
    }
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.textContent = t('login');

    // Inicio: placeholder en Próximos turnos si existe (vacío)
    const nextTurnsDiv = document.getElementById('next-turns');
    if (nextTurnsDiv && nextTurnsDiv.childElementCount === 0) {
      nextTurnsDiv.innerHTML = `<div style="color:var(--muted);padding:10px;border:1px dashed var(--muted);border-radius:var(--radius-md);margin-top:10px">${t('noNextTurns')}</div>`;
    }
  }

  // Chatbot i18n
  window.initChatbot = function(){
    const chatRoot = document.getElementById('chat-root');
    if(!chatRoot) return;
    
    function renderChat(open=false){
      chatRoot.innerHTML = open ? `
        <div class="chat-window" role="dialog" aria-label="${t('chatTitle')}">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:24px">🤖</span>
              <strong style="font-size:16px;color:#1565c0">${t('chatBotName')}</strong>
            </div>
            <button id="close-chat" class='btn btn-ghost' style='border-radius:50%;width:32px;height:32px;min-width:32px;display:flex;align-items:center;justify-content:center;padding:0;font-size:18px;margin:-6px -6px 0 0;background:white;border:1px solid #90caf9'>✕</button>
          </div>
          <div class="chat-log" id="chat-log"><div class="msg bot">${t('chatGreeting')}</div></div>
          <div class="quick-buttons">
            <button onclick="window.chatQuick('${t('chatMyAppointments')}')">${t('chatMyAppointments')}</button>
            <button onclick="window.chatQuick('${t('chatNewAppointment')}')">${t('chatNewAppointment')}</button>
            <button onclick="window.chatQuick('${t('chatTreatments')}')">${t('chatTreatments')}</button>
            <button onclick="window.chatQuick('${t('chatProfessionals')}')">${t('chatProfessionals')}</button>
            <button onclick="window.chatQuick('${t('chatSchedule')}')">${t('chatSchedule')}</button>
            <button onclick="window.chatQuick('${t('chatContact')}')">${t('chatContact')}</button>
          </div>
          <form id="chat-form" style="margin-top:12px">
            <input name="q" placeholder="${t('chatInputPlaceholder')}" style="width:100%;padding:12px;border-radius:var(--radius-md);border:2px solid #90caf9;font-size:14px" />
          </form>
        </div>
      ` : `<div class="chat-bubble" id="open-chat" aria-label="Abrir chat">💬</div>`;
      if(open) document.getElementById('close-chat').addEventListener('click', ()=>renderChat(false)); 
      else document.getElementById('open-chat').addEventListener('click', ()=>renderChat(true));
      const cf = document.getElementById('chat-form'); 
      if(cf){ cf.addEventListener('submit', (e)=>{ e.preventDefault(); const q = cf.q.value.trim(); if(!q) return; pushUserMsg(q); cf.q.value=''; setTimeout(()=>botReply(q),600) }) }
    }
    
    function pushUserMsg(txt){ 
      const log = document.getElementById('chat-log'); if(!log) return; 
      const el = document.createElement('div'); el.className='msg user'; el.textContent = txt; 
      log.appendChild(el); log.scrollTop = log.scrollHeight; 
    }
    
    function pushBotMsg(txt){ 
      const log = document.getElementById('chat-log'); if(!log) return; 
      const el = document.createElement('div'); el.className='msg bot'; el.innerHTML = txt; 
      log.appendChild(el); log.scrollTop = log.scrollHeight; 
    }
    
    function botReply(q){
      const query = q.toLowerCase();
      if(/mis turnos|ver.*turnos|my appointments|check appointments/.test(query)){ 
        pushBotMsg(t('chatResponseAppointments')); return 
      }
      if(/solicitar.*turno|nuevo.*turno|pedir.*turno|request.*appointment|new.*appointment/.test(query)){ 
        pushBotMsg(t('chatResponseNewAppointment')); return 
      }
      if(/tratamiento|estética|rinoplast|lipo|botox|cirug|treatment|aesthetic|rhinoplast|surgery/.test(query)){ 
        pushBotMsg(t('chatResponseTreatments')); return 
      }
      if(/profesional|doctor|médico|equipo|professional|team/.test(query)){ 
        pushBotMsg(t('chatResponseProfessionals')); return 
      }
      if(/horario|hora|atencion|atención|schedule|hours|office hours/.test(query)){ 
        pushBotMsg(t('chatResponseSchedule')); return 
      }
      if(/contacto|tel|telefono|teléfono|email|mail|dirección|direccion|ubicación|ubicacion|contact|phone|address|location/.test(query)){ 
        pushBotMsg(t('chatResponseContact')); return 
      }
      if(/precio|costo|cuanto.*cuesta|valor|price|pricing|cost/.test(query)){ 
        pushBotMsg(t('chatResponsePricing')); return 
      }
      pushBotMsg(t('chatResponseUnknown'))
    }
    
    window.chatQuick = function(q){ pushUserMsg(q); setTimeout(()=>botReply(q),200) };
    renderChat(false);
  };

  // Auto-inicializar en páginas simples (no en index.html que tiene su propio init)
  document.addEventListener('DOMContentLoaded', () => {
    applyI18n();
    // Solo inicializar chatbot si no estamos en index.html (que tiene su propia lógica init)
    if(document.getElementById('chat-root') && !document.getElementById('turnos')) {
      if(window.initChatbot) window.initChatbot();
    }
  });
})();

