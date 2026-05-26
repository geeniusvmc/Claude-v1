(() => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };

  const openNav = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
  };

  toggle?.addEventListener('click', () => {
    const open = nav.classList.contains('is-open');
    open ? closeNav() : openNav();
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 899px)').matches) closeNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
  });

  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      form.querySelectorAll('input, textarea').forEach((el) => {
        if (!el.value) el.style.borderColor = 'var(--accent-2)';
      });
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = '¡Gracias! Te respondemos pronto.';
      btn.disabled = true;
    }
    form.reset();
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
