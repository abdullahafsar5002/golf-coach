// Static-site booking confirmation. Persisting locally makes the flow usable without a backend.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const lead = Object.fromEntries(new FormData(form));
    localStorage.setItem('golfAcademyLead', JSON.stringify({ ...lead, createdAt: new Date().toISOString() }));
    form.reset();
    const status = form.querySelector('.form-status');
    status.textContent = 'Thanks — your lesson request is ready. We will be in touch shortly.';
    status.focus();
  });
});
