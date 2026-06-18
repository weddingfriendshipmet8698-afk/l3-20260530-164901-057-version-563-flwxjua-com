
(function () {
  var menuButton = document.querySelector('.mobile-menu-button');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var open = mobilePanel.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slider = document.querySelector('.hero-slider');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    slider.querySelectorAll('[data-hero]').forEach(function (button) {
      button.addEventListener('click', function () {
        var direction = button.getAttribute('data-hero');
        showSlide(direction === 'next' ? index + 1 : index - 1);
        startTimer();
      });
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide') || 0));
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var urlParams = new URLSearchParams(window.location.search);
  var query = (urlParams.get('q') || '').trim();
  var searchInputs = document.querySelectorAll('input[name="q"], .grid-search');

  searchInputs.forEach(function (input) {
    if (query && (!input.value || input.name === 'q')) {
      input.value = query;
    }
  });

  var searchableGrid = document.querySelector('.searchable-grid');
  var filterInput = document.querySelector('.grid-search');
  var chipButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));
  var emptyState = document.querySelector('.empty-state');
  var activeChip = '';

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applyFilters() {
    if (!searchableGrid) {
      return;
    }

    var items = Array.prototype.slice.call(searchableGrid.children);
    var keyword = normalize(filterInput ? filterInput.value : query);
    var chip = normalize(activeChip);
    var shown = 0;

    items.forEach(function (item) {
      var filterText = normalize(item.getAttribute('data-filter') || item.textContent);
      var matchesKeyword = !keyword || filterText.indexOf(keyword) !== -1;
      var matchesChip = !chip || filterText.indexOf(chip) !== -1 || normalize(item.getAttribute('data-category')).indexOf(chip) !== -1 || normalize(item.getAttribute('data-region')).indexOf(chip) !== -1;
      var visible = matchesKeyword && matchesChip;
      item.hidden = !visible;
      if (visible) {
        shown += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = shown !== 0;
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilters);
  }

  chipButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      chipButtons.forEach(function (item) {
        item.classList.remove('active');
      });
      button.classList.add('active');
      activeChip = button.getAttribute('data-filter-chip') || '';
      applyFilters();
    });
  });

  if (query || searchableGrid) {
    applyFilters();
  }
})();
