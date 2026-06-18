(function() {
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      panel.classList.toggle('is-open');
    });
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  if (filterInput && cards.length) {
    filterInput.addEventListener('input', function() {
      var keyword = filterInput.value.trim().toLowerCase();
      cards.forEach(function(card) {
        var content = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-meta') || '',
          card.getAttribute('data-year') || ''
        ].join(' ').toLowerCase();
        card.classList.toggle('is-hidden', keyword && content.indexOf(keyword) === -1);
      });
    });
  }

  var row = document.querySelector('[data-scroll-row]');
  var left = document.querySelector('[data-scroll-left]');
  var right = document.querySelector('[data-scroll-right]');

  if (row && left && right) {
    left.addEventListener('click', function() {
      row.scrollBy({ left: -420, behavior: 'smooth' });
    });
    right.addEventListener('click', function() {
      row.scrollBy({ left: 420, behavior: 'smooth' });
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === active);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === active);
    });
  }

  dots.forEach(function(dot, dotIndex) {
    dot.addEventListener('click', function() {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    setInterval(function() {
      showSlide(active + 1);
    }, 5200);
  }
})();
