(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  function startCarousel() {
    if (!slides.length) {
      return;
    }

    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var next = document.querySelector('.hero-next');
  var prev = document.querySelector('.hero-prev');

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      startCarousel();
    });
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
      startCarousel();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-slide')) || 0);
      startCarousel();
    });
  });

  startCarousel();

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function decadeOf(year) {
    var match = String(year || '').match(/\d{4}/);
    if (!match) {
      return '';
    }

    var number = Number(match[0]);
    return Math.floor(number / 10) * 10 + '年代';
  }

  function setupSearch(scope) {
    var input = scope.querySelector('.search-input');
    var yearSelect = scope.querySelector('.year-filter');
    var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-row'));

    if (!input && !yearSelect) {
      return;
    }

    function apply() {
      var query = normalize(input ? input.value : '');
      var selectedYear = yearSelect ? yearSelect.value : '全部年代';

      items.forEach(function (item) {
        var text = normalize([
          item.getAttribute('data-title'),
          item.getAttribute('data-tags'),
          item.getAttribute('data-year'),
          item.getAttribute('data-region'),
          item.getAttribute('data-category')
        ].join(' '));
        var itemDecade = decadeOf(item.getAttribute('data-year'));
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesYear = !selectedYear || selectedYear === '全部年代' || selectedYear === itemDecade;
        item.classList.toggle('is-hidden', !(matchesQuery && matchesYear));
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', apply);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.search-scope')).forEach(setupSearch);
})();
