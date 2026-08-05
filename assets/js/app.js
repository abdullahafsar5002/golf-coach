// Shared navigation, motion setup, newsletter feedback, scroll progress and stat counters.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (nav && !nav.id) nav.id = 'primary-navigation';
  if (toggle && nav) toggle.setAttribute('aria-controls', nav.id);
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backToTop);

  const fixText = (value) => value.replaceAll('â€”', '—').replaceAll('â€™', '’').replaceAll('â€œ', '“').replaceAll('â€', '”').replaceAll('Â©', '©').replaceAll('Â·', '·');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    if (/[âÂ]/.test(node.nodeValue)) node.nodeValue = fixText(node.nodeValue);
  });

// Ensure all WhatsApp links use the real booking number.
  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    link.href = link.href.replace(/wa\.me\/\d+/, 'wa.me/923333442012');
  });

  document.querySelectorAll('.socials a[aria-label="Instagram"]').forEach((link) => {
    link.href = 'https://www.instagram.com/afsar4900?igsh=MWswYmVwNDNmdTU1eg==';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const heroKicker = document.querySelector('.hero-kicker');
  if (heroKicker) heroKicker.lastChild.nodeValue = ' Private golf coaching · Karachi Golf Club';

  const setActiveLink = () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === path || (path === '' && href === 'index.html'));
    });
  };

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? scrollTop / height : 0;
    progressBar.style.width = `${Math.min(ratio * 100, 100)}%`;
    backToTop.classList.toggle('visible', scrollTop > 600);
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !nav?.classList.contains('open')) return;
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.focus();
  });

  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('open') || nav.contains(event.target) || toggle?.contains(event.target)) return;
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  window.AOS?.init({ once: true, offset: 50, duration: 700, easing: 'ease-out-cubic' });

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

  const footerCopy = document.querySelector('.footer-bottom span');
  if (footerCopy && footerCopy.textContent.includes('©')) {
    footerCopy.textContent = footerCopy.textContent.replace(/\d{4}/, new Date().getFullYear());
  }

  document.querySelectorAll('[data-newsletter]').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    if (input?.value) {
      input.value = '';
      input.placeholder = 'Thanks — you are on the list!';
    }
  }));

  setActiveLink();
  updateProgress();
});
