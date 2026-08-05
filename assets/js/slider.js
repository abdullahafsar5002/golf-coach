// Initialize the testimonial carousel only on the testimonials page.
document.addEventListener('DOMContentLoaded', () => {
  if (!window.Swiper || !document.querySelector('.testimonial-swiper')) return;
  new Swiper('.testimonial-swiper', {
    loop: true,
    spaceBetween: 18,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 0: { slidesPerView: 1 }, 700: { slidesPerView: 2 }, 1000: { slidesPerView: 3 } }
  });
});
