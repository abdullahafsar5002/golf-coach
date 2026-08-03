const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('mobile-open', !open);
  if (!open) {
    Object.assign(nav.style, { display: 'flex', position: 'absolute', top: '72px', right: '0', left: '0', padding: '22px 7vw', background: '#f5f2e9', flexDirection: 'column', alignItems: 'flex-start' });
  } else {
    nav.removeAttribute('style');
  }
});

const bookingForm = document.querySelector('#booking-form');

if (bookingForm) {
  const queryLesson = new URLSearchParams(window.location.search).get('lesson');
  const lessonInput = bookingForm.querySelector(`input[name="lesson"][value="${queryLesson}"]`);
  if (lessonInput) lessonInput.checked = true;

  let currentStep = 1;
  let weekOffset = 0;
  let selectedDate = null;
  let selectedTime = null;
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dateOptions = document.querySelector('#date-options');
  const timeOptions = document.querySelector('#time-options');
  const dateLabel = document.querySelector('#selected-date-label');
  const timeError = document.querySelector('#time-error');
  const availableTimes = ['8:00 AM', '9:30 AM', '11:00 AM', '1:30 PM', '3:00 PM', '4:30 PM'];

  function getDates() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2 + weekOffset * 7);
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }

  function displayDate(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function renderTimes() {
    timeOptions.innerHTML = '';
    const variations = selectedDate?.getDate() % 2 ? availableTimes.slice(1) : availableTimes;
    variations.forEach((time) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `time-option${selectedTime === time ? ' selected' : ''}`;
      button.textContent = time;
      button.addEventListener('click', () => {
        selectedTime = time;
        timeError.classList.remove('show');
        renderTimes();
      });
      timeOptions.appendChild(button);
    });
  }

  function renderDates() {
    dateOptions.innerHTML = '';
    getDates().forEach((date) => {
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `date-option${isSelected ? ' selected' : ''}`;
      button.innerHTML = `${dayNames[date.getDay()]}<span>${date.getDate()}</span>${date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}`;
      button.addEventListener('click', () => {
        selectedDate = date;
        selectedTime = null;
        dateLabel.textContent = displayDate(date).toUpperCase();
        timeError.classList.remove('show');
        renderDates();
        renderTimes();
      });
      dateOptions.appendChild(button);
    });
    if (!selectedDate) {
      selectedDate = getDates()[0];
      dateLabel.textContent = displayDate(selectedDate).toUpperCase();
      renderDates();
      renderTimes();
    }
  }

  function showStep(step) {
    currentStep = step;
    bookingForm.querySelectorAll('.form-step').forEach((element) => element.classList.toggle('active', Number(element.dataset.step) === step));
    document.querySelectorAll('.booking-steps span').forEach((element, index) => element.classList.toggle('active', index + 1 === step));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelector('#next-week')?.addEventListener('click', () => { weekOffset += 1; selectedDate = null; selectedTime = null; renderDates(); });
  document.querySelector('#previous-week')?.addEventListener('click', () => { if (weekOffset > 0) { weekOffset -= 1; selectedDate = null; selectedTime = null; renderDates(); } });
  bookingForm.querySelectorAll('.next-step').forEach((button) => button.addEventListener('click', () => {
    if (currentStep === 2 && !selectedTime) { timeError.classList.add('show'); return; }
    showStep(currentStep + 1);
  }));
  bookingForm.querySelectorAll('.back-step').forEach((button) => button.addEventListener('click', () => showStep(currentStep - 1)));

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.checkValidity()) { bookingForm.reportValidity(); return; }
    const formData = new FormData(bookingForm);
    const lessonNames = { swing: 'Private swing session', course: 'On-course game plan', performance: 'Performance partnership consultation' };
    const appointment = { lesson: formData.get('lesson'), date: displayDate(selectedDate), time: selectedTime, name: formData.get('name'), email: formData.get('email') };
    localStorage.setItem('alexHartBooking', JSON.stringify(appointment));
    document.querySelector('#confirmation-copy').textContent = `${appointment.name}, your ${lessonNames[appointment.lesson]} is reserved for ${appointment.date} at ${appointment.time}. A confirmation will be sent to ${appointment.email}.`;
    bookingForm.hidden = true;
    document.querySelector('#confirmation').hidden = false;
  });

  renderDates();
}
