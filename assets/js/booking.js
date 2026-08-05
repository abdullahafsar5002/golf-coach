// Booking form handler using Formspree with a static-site fallback.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('.form-status');
  const endpoint = form.dataset.endpoint || '';
  const submitButton = form.querySelector('[type="submit"]');
  const dateInput = form.querySelector('input[type="date"]');
  const whatsappButton = form.querySelector('[data-whatsapp-booking]');
  const programSelect = form.querySelector('[name="program"]');
  const selectedPackage = new URLSearchParams(window.location.search).get('package');
  const selectedProgram = new URLSearchParams(window.location.search).get('program');

  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  // Prefill the program/package select from a ?package= or ?program= URL parameter.
  const preselected = selectedPackage || selectedProgram;
  const preselectedKey = preselected?.toLowerCase() || '';
  if (preselected && programSelect) {
    // Try an exact match first, then a partial ("starts with") match so
    // package values like "Single Lesson" match "Single Lesson (Rs. 5,000)".
    const match = [...programSelect.options].find((opt) => opt.value.toLowerCase() === preselectedKey)
      || [...programSelect.options].find((opt) => opt.value.toLowerCase().startsWith(preselectedKey));
    if (match) {
      programSelect.value = match.value;
    } else {
      const messageInput = form.querySelector('[name="message"]');
      if (messageInput && !messageInput.value) messageInput.value = `I am interested in the ${preselected}.`;
    }
  }

  whatsappButton?.addEventListener('click', () => {
    const values = Object.fromEntries(new FormData(form).entries());
    const name = values.name?.trim();
    const phone = values.phone?.trim();
    const skillLevel = values.skillLevel;
    const date = values.preferredDate;

    if (!name || !phone || !skillLevel) {
      if (status) {
        status.textContent = 'For WhatsApp booking, please add your name, phone number, and skill level.';
        status.focus();
      }
      return;
    }

    const program = values.program?.trim();
    const details = [
      'Hello Afsar, I would like to book a golf lesson at Karachi Golf Club.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      program ? `Program/Package: ${program}` : 'Program/Package: (not selected)',
      `Preferred date: ${date || 'Please suggest available slots'}`,
      `Preferred time: ${values.preferredTime || 'Please suggest available slots'}`,
      `Skill level: ${skillLevel}`,
      `Notes: ${values.message?.trim() || 'None'}`,
      '',
      'Please let me know the available time slots. Thank you!'
    ].join('\n');

    window.location.href = `https://wa.me/923333442012?text=${encodeURIComponent(details)}`;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const lead = Object.fromEntries(formData.entries());
    const payload = { ...lead, createdAt: new Date().toISOString() };

    if (status) {
      status.textContent = 'Sending your lesson request...';
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }
      }

      localStorage.setItem('golfAcademyLead', JSON.stringify(payload));
      form.reset();

      if (status) {
        status.textContent = endpoint
          ? 'Thanks — your lesson request has been received.'
          : 'Thanks — your lesson request is ready. We will be in touch shortly.';
        status.focus();
      }
    } catch (error) {
      localStorage.setItem('golfAcademyLead', JSON.stringify(payload));
      if (status) {
        status.innerHTML = 'We could not send that request. Please <a href="https://wa.me/923333442012?text=Hello%20Afsar%2C%20I%27d%20like%20to%20book%20a%20golf%20lesson.">message Afsar on WhatsApp</a> and we will help you book.';
        status.focus();
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  });
});
