// Lightbox and category filtering for the academy gallery.
document.addEventListener('DOMContentLoaded', () => {
  window.lightbox?.option({ resizeDuration: 180, wrapAround: true, albumLabel: 'Image %1 of %2' });
  document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.style.display = filter === 'all' || item.dataset.category === filter ? 'block' : 'none';
    });
  }));
});
