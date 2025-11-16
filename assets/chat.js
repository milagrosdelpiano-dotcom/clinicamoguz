(function(){
  const rootId = 'chat-root';
  function ensureRoot(){
    let el = document.getElementById(rootId);
    if (!el) { el = document.createElement('div'); el.id = rootId; document.body.appendChild(el); }
    return el;
  }
  function t(k){
    const lang = localStorage.getItem('clinicLang') || 'es';
    const map = (window.translations && window.translations[lang]) || {};
    const fallback = (window.translations && window.translations['es']) || {};
    return map[k] || fallback[k] || k;
  }
  function renderChat(open){
    const root = ensureRoot();
    root.innerHTML = open ? (
      `<div class="chat-window" role="dialog" aria-label="${t('chatTitle')||'Asistente'}" style="position:fixed;right:18px;bottom:94px;width:340px;background:var(--card);border-radius:var(--radius-lg);padding:18px;box-shadow:0 12px 40px var(--shadow-color);z-index:80">
        <header style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;position:relative">
          <strong style="color:var(--text);font-size:16px">${t('chatTitle')||'Asistente Clínica Moguz'}</strong>
          <button id="close-chat" class='btn btn-ghost' style='padding:6px 10px;border-radius:50%;font-size:16px;line-height:1;position:absolute;top:-6px;right:-6px;background:var(--card);border:1px solid var(--border-color);box-shadow:0 2px 8px var(--shadow-color)'>✕</button>
        </header>
        <div class="quick-buttons" style="display:flex;gap:6px;margin-bottom:10px"><button class='btn btn-ghost' onclick="chatQuick('${t('chatQueryTurns')}')" style="flex:1;padding:8px;border-radius:var(--radius-md);border:1px solid var(--border-color);font-size:12px">${t('chatQueryTurns')||'Consultar turnos'}</button><button class='btn btn-ghost' onclick="chatQuick('${t('chatQueryTreatments')}')" style="flex:1;padding:8px;border-radius:var(--radius-md);border:1px solid var(--border-color);font-size:12px">${t('chatQueryTreatments')||'Ver tratamientos'}</button><button class='btn btn-ghost' onclick="chatQuick('${t('chatQueryContact')}')" style="flex:1;padding:8px;border-radius:var(--radius-md);border:1px solid var(--border-color);font-size:12px">${t('chatQueryContact')||'Horarios'}</button></div>
        <div class="chat-log" id="chat-log" style="max-height:260px;overflow:auto;margin:10px 0;padding:8px;border-radius:var(--radius-md);background:var(--glass)"><div class="msg bot" style="margin:6px 0;padding:8px;border-radius:var(--radius-md);display:inline-block;background:#f0f4f7;color:#1f2937">${t('chatGreeting')||'Hola 👋 ¿En qué puedo ayudarte?'}</div></div>
        <form id="chat-form"><input name="q" placeholder="${t('chatPlaceholder')||'Escribí tu consulta'}" style="width:100%;padding:10px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--card);color:var(--text);font-size:14px" /></form>
      </div>`
    ) : `<div class="chat-bubble" id="open-chat" aria-label="Abrir chat" style="position:fixed;right:18px;bottom:18px;width:64px;height:64px;border-radius:999px;background:linear-gradient(135deg,var(--accent),var(--accent-600));display:flex;align-items:center;justify-content:center;color:var(--text);box-shadow:0 8px 30px rgba(0,0,0,0.2);cursor:pointer;z-index:80;font-size:28px">💬</div>`;
    if (open) document.getElementById('close-chat').addEventListener('click', ()=>renderChat(false));
    else document.getElementById('open-chat').addEventListener('click', ()=>renderChat(true));
    const cf = document.getElementById('chat-form');
    if (cf) cf.addEventListener('submit', (e)=>{ e.preventDefault(); const q = cf.q.value.trim(); if(!q) return; pushUserMsg(q); cf.q.value=''; setTimeout(()=>botReply(q),600) });
  }
  function pushUserMsg(txt){ const log = document.getElementById('chat-log'); if(!log) return; const el = document.createElement('div'); el.className='msg user'; el.textContent = txt; el.style.cssText='margin:6px 0;padding:8px;border-radius:var(--radius-md);display:inline-block;background:#e6f2ff;color:#072b44'; log.appendChild(el); log.scrollTop = log.scrollHeight; }
  function pushBotMsg(txt){ const log = document.getElementById('chat-log'); if(!log) return; const el = document.createElement('div'); el.className='msg bot'; el.textContent = txt; el.style.cssText='margin:6px 0;padding:8px;border-radius:var(--radius-md);display:inline-block;background:#f0f4f7;color:#1f2937'; log.appendChild(el); log.scrollTop = log.scrollHeight; }
  function botReply(q){
    const text = q.toLowerCase();
    if(/turnos|turno|cita/.test(text)){ pushBotMsg('Tenés 0 turno(s) registrado(s) en esta vista. Podés solicitar uno desde la página de Turnos.'); return }
    if(/tratamiento|estética|rinoplast|lipo/.test(text)){ pushBotMsg('Podés ver la lista de tratamientos en la página "Tratamientos". ¿Querés que abra la página?'); return }
    if(/horario|contacto|tel|telefono/.test(text)){ pushBotMsg('Horarios: Lun-Vie 9:00-18:00. Tel: (+54) 9 11 1234 5678. Email: contacto@clinicamoguz.com'); return }
    pushBotMsg('Lo siento, no entendí. ¿Querés que derive tu consulta a un asistente?');
  }
  window.chatQuick = function(q){ const root = document.getElementById('chat-log'); if(!root){ renderChat(true); setTimeout(()=>window.chatQuick(q),100); return;} pushUserMsg(q); setTimeout(()=>botReply(q),200) };
  document.addEventListener('DOMContentLoaded', ()=>renderChat(false));
})();
