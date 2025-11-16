(function(){
  // Theme toggle (works on all pages)
  const themeBtn = document.getElementById('toggle-theme');
  if (themeBtn) {
    // Load saved theme
    const savedTheme = localStorage.getItem('clinicTheme') || 'light';
    document.body.dataset.theme = savedTheme;
    
    themeBtn.addEventListener('click', () => {
      const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = newTheme;
      localStorage.setItem('clinicTheme', newTheme);
    });
  }

  // Dropdown menu toggle + close behaviors
  window.toggleMenuManual = function(){
    const m = document.getElementById('dropdown-menu');
    if (!m) return; 
    m.classList.toggle('active');
  };
  const menuToggle = document.getElementById('menu-toggle');
  const dropdownMenu = document.getElementById('dropdown-menu');
  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener('click', (e) => { e.stopPropagation(); window.toggleMenuManual(); });
    document.addEventListener('click', (e) => {
      if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        dropdownMenu.classList.remove('active');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dropdownMenu.classList.remove('active');
    });
  }

  // Language select: persist and reload page (keeps UI simple)
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    const saved = localStorage.getItem('clinicLang') || 'es';
    if ([...langSelect.options].some(o => o.value === saved)) {
      langSelect.value = saved;
    }
    langSelect.addEventListener('change', (e) => {
      localStorage.setItem('clinicLang', e.target.value);
      location.reload();
    });
  }

  // Login button on subpages: redirect to index and open login
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (typeof window.openLoginModal === 'function') {
        await window.openLoginModal();
      } else {
        window.location.href = 'index.html#login';
      }
    });
  }

  // Brand click: go to Dashboard (index.html)
  const brandLink = document.getElementById('brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }
})();
