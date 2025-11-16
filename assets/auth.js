(function(){
  const SUPABASE_URL = 'https://csrmylnhdhwurnmmogfl.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcm15bG5oZGh3dXJubW1vZ2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTcxODcsImV4cCI6MjA3ODEzMzE4N30.GEnlUM_PiPK2X_lpoio9gm0pwBAC7uLbhqkJ5HohHug';

  function loadSupabase(){
    return new Promise((resolve)=>{
      if (window.supabase) return resolve();
      const s = document.createElement('script'); s.src = 'https://unpkg.com/@supabase/supabase-js'; s.onload = ()=>resolve(); document.head.appendChild(s);
    });
  }

  // Verificar sesión al cargar la página
  window.addEventListener('DOMContentLoaded', async ()=>{
    await loadSupabase();
    if (!window.supabaseClient) {
      window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    // Forzar origen válido si estamos en localhost
    window.AUTH_SITE_ORIGIN = window.location.origin.includes('localhost')
      ? 'https://elaborate-sprinkles-563313.netlify.app'
      : window.location.origin;
    
    // Verificar si hay sesión activa
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
      window.currentUser = session.user;
      updateAuthUI(true);
      console.log('✅ Usuario logueado:', session.user.email);
    }

    // Escuchar cambios de autenticación
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        window.currentUser = session.user;
        updateAuthUI(true);
        console.log('✅ Sesión iniciada:', session.user.email);
      } else if (event === 'SIGNED_OUT') {
        window.currentUser = null;
        updateAuthUI(false);
        console.log('👋 Sesión cerrada');
      }
    });
  });

  // Actualizar UI según estado de autenticación
  function updateAuthUI(isLoggedIn) {
    const lang = localStorage.getItem('clinicLang') || 'es';
    // Buscar botón por diferentes selectores para soportar todas las páginas
    let loginBtn = document.querySelector('[onclick="openLoginModal()"]');
    if (!loginBtn) loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;

    if (isLoggedIn && window.currentUser) {
      const email = window.currentUser.email;
      const shortEmail = email.length > 20 ? email.substring(0, 17) + '...' : email;
      loginBtn.innerHTML = `👤 ${shortEmail}`;
      loginBtn.onclick = openUserMenu;
    } else {
      loginBtn.innerHTML = lang === 'es' ? '👤 Iniciar sesión' : '👤 Sign in';
      loginBtn.onclick = openLoginModal;
    }
  }

  // Menú de usuario logueado
  window.openUserMenu = function() {
    const lang = localStorage.getItem('clinicLang') || 'es';
    const t = (es,en)=> lang==='es'?es:en;
    const rootId = 'user-menu-root';
    let root = document.getElementById(rootId); 
    if(!root){ 
      root = document.createElement('div'); 
      root.id = rootId; 
      document.body.appendChild(root); 
    }
    
    root.innerHTML = `
      <div class="modal-backdrop" style="position:fixed;inset:0;background:rgba(2,6,23,0.45);display:flex;align-items:center;justify-content:center;z-index:60;backdrop-filter:blur(4px)">
        <div class="modal" style="width:100%;max-width:400px;background:var(--card);padding:32px;border-radius:16px;box-shadow:0 12px 40px var(--shadow-color)">
          <h3>${t('Mi Cuenta','My Account')}</h3>
          <div style="margin:20px 0;padding:16px;background:var(--bg);border-radius:8px">
            <div style="color:var(--muted);font-size:13px;margin-bottom:4px">${t('Email','Email')}</div>
            <div style="font-weight:500">${window.currentUser.email}</div>
          </div>
          <button id="logout-btn" class="btn btn-primary" style="width:100%;margin-bottom:12px">${t('Cerrar sesión','Sign out')}</button>
          <button id="close-user-menu" class="btn btn-ghost" style="width:100%">${t('Cancelar','Cancel')}</button>
        </div>
      </div>`;
    
    const close = ()=>{ root.innerHTML = ''; };
    document.getElementById('close-user-menu').onclick = close;
    document.getElementById('logout-btn').onclick = async ()=>{
      await window.supabaseClient.auth.signOut();
      close();
      alert(t('✅ Sesión cerrada correctamente','✅ Successfully signed out'));
    };
  };

  window.openLoginModal = async function(){
    await loadSupabase();
    if (!window.supabaseClient) {
      window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    const lang = localStorage.getItem('clinicLang') || 'es';
    const t = (es,en)=> lang==='es'?es:en;
    const rootId = 'login-modal-root';
    let root = document.getElementById(rootId); if(!root){ root = document.createElement('div'); root.id = rootId; document.body.appendChild(root); }
    
    const googleDemo = t('Demo: Integración con Google pendiente', 'Demo: Google integration pending');
    const facebookDemo = t('Demo: Integración con Facebook pendiente', 'Demo: Facebook integration pending');
    
    root.innerHTML = `
      <div class="modal-backdrop" role="dialog" aria-modal="true" style="position:fixed;inset:0;background:rgba(2,6,23,0.45);display:flex;align-items:center;justify-content:center;z-index:60;backdrop-filter:blur(4px)">
        <div class="modal" style="width:100%;max-width:450px;background:var(--card);padding:32px;border-radius:16px;box-shadow:0 12px 40px var(--shadow-color)">
          <div style="display:flex;justify-content:flex-end;margin-bottom:8px">
            <button aria-label="${t('Cerrar','Close')}" id="close-login-modal" class='btn btn-ghost' style="border-radius:50%;padding:6px 10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center">✕</button>
          </div>
          <h3 style="font-size:28px;margin-bottom:8px;text-align:center;font-weight:700;color:#212529">${t('Bienvenido','Welcome')}</h3>
          <div style="text-align:center;color:var(--muted);margin-bottom:24px;font-size:14px">${t('Inicia sesión para acceder a tu cuenta','Sign in to access your account')}</div>
          <form id="login-form">
            <div style="margin-bottom:20px">
              <label for="login-email" style="display:block;margin-bottom:8px;font-weight:600;color:var(--text);font-size:14px">${t('Email','Email')}</label>
              <input type="email" id="login-email" name="email" placeholder="${t('tu@email.com','your@email.com')}" required style="width:100%;padding:14px 16px;font-size:16px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--card);color:var(--text)" />
            </div>
            <div style="color:var(--muted);font-size:13px;margin-bottom:20px;text-align:center;line-height:1.5">
              ${t('Te enviaremos un enlace mágico a este correo para iniciar sesión de forma segura.','We will send you a magic link to this email to sign in securely.')}
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;padding:14px;font-size:16px;margin-bottom:16px">${t('Continuar con email','Continue with email')}</button>
            
            <div style="display:flex;align-items:center;margin:24px 0;color:var(--muted);font-size:12px">
              <div style="flex:1;height:1px;background:var(--border-color)"></div>
              <span style="padding:0 12px">${t('o continúa con','or continue with')}</span>
              <div style="flex:1;height:1px;background:var(--border-color)"></div>
            </div>
            
            <div style="display:flex;gap:12px;margin-bottom:20px">
              <button type="button" id="google-btn" style="flex:1;padding:12px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--card);color:var(--text);font-weight:600;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px">
                <span>🔵</span> Google
              </button>
              <button type="button" id="facebook-btn" style="flex:1;padding:12px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--card);color:var(--text);font-weight:600;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px">
                <span>🔵</span> Facebook
              </button>
            </div>
            
            <div style="text-align:center;margin-top:20px">
              <button type="button" id="cancel-login-modal" class="btn btn-ghost" style="font-size:14px">${t('Cancelar','Cancel')}</button>
            </div>
          </form>
        </div>
      </div>`;
    const close = ()=>{ root.innerHTML = ''; };
    document.getElementById('close-login-modal').onclick = close;
    document.getElementById('cancel-login-modal').onclick = close;
    document.getElementById('google-btn').onclick = ()=> alert(googleDemo);
    document.getElementById('facebook-btn').onclick = ()=> alert(facebookDemo);
    document.getElementById('login-form').onsubmit = async (e)=>{
      e.preventDefault();
      const email = e.target.email.value.trim();
      if (!email) { alert(t('Ingrese un correo electrónico','Please enter an email address')); return; }
      try {
        const redirectTo = (window.AUTH_SITE_ORIGIN || window.location.origin) + window.location.pathname;
        const { error } = await window.supabaseClient.auth.signInWithOtp({ 
          email,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;
        alert(t(`✅ Enlace mágico enviado a ${email}. Revise su bandeja de entrada (y Spam).`,`✅ Magic link sent to ${email}. Check your inbox (and Spam).`));
        close();
      } catch(err){
        console.error(err);
        alert(t('Error al enviar el enlace. Verifique su correo o la configuración de Supabase.','Error sending link. Please check your email or Supabase configuration.'));
      }
    };
  };
})();
