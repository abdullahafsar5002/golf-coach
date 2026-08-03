// Shared navigation, motion setup, newsletter feedback and stat counters.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // AOS respects the reduced-motion stylesheet override.
  window.AOS?.init({ once: true, offset: 50, duration: 700, easing: 'ease-out-cubic' });

  // Count numbers only once they are visible.
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const end = Number(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const start = performance.now();
      const tick = (time) => {
        const progress = Math.min((time - start) / 1200, 1);
        counter.textContent = `${Math.floor((1 - Math.pow(1 - progress, 3)) * end)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(counter);
    }), { threshold: 0.5 });
    counters.forEach((counter) => observer.observe(counter));
  }

  document.querySelectorAll('[data-newsletter]').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    if (input?.value) { input.value = ''; input.placeholder = 'Thanks — you are on the list!'; }
  }));
});
