
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupImageFallbacks() {
    document.querySelectorAll('.poster img').forEach(function (image) {
      image.addEventListener('error', function () {
        var poster = image.closest('.poster');
        if (poster) {
          poster.classList.add('is-missing');
        }
      }, { once: true });
    });
  }

  function setupCarousels() {
    document.querySelectorAll('[data-scroll-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-scroll-target');
        var direction = button.getAttribute('data-direction') === 'left' ? -1 : 1;
        var row = document.getElementById(id);
        if (row) {
          row.scrollBy({ left: direction * 380, behavior: 'smooth' });
        }
      });
    });
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function movieMatches(movie, keyword, region) {
    var haystack = [
      movie.title,
      movie.region,
      movie.type,
      movie.year,
      movie.genre,
      movie.oneLine,
      (movie.tags || []).join(' ')
    ].join(' ').toLowerCase();

    var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
    var regionOk = !region || movie.region === region;
    return keywordOk && regionOk;
  }

  function createResultCard(movie) {
    var tagHtml = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="card-link" href="' + escapeAttribute(movie.url) + '">',
      '    <div class="poster poster-wide" data-title="' + escapeAttribute(movie.title) + '">',
      '      <img class="cover-img" src="' + escapeAttribute(movie.cover) + '" alt="' + escapeAttribute(movie.title) + ' 高清封面" loading="lazy">',
      '      <span class="poster-badge">' + escapeHtml(movie.region) + '</span>',
      '      <span class="poster-play" aria-hidden="true">▶</span>',
      '    </div>',
      '    <div class="card-body">',
      '      <div class="card-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.type) + '</div>',
      '      <h3>' + escapeHtml(movie.title) + '</h3>',
      '      <p>' + escapeHtml(movie.oneLine) + '</p>',
      '      <div class="card-tags">' + tagHtml + '</div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function setupSearch() {
    var form = document.querySelector('[data-search-form]');
    var results = document.querySelector('[data-search-results]');
    var summary = document.querySelector('[data-search-summary]');
    if (!form || !results || !summary || !window.MOVIE_INDEX) {
      return;
    }

    var input = form.querySelector('[name="q"]');
    var regionSelect = form.querySelector('[name="region"]');

    function render() {
      var keyword = normalize(input.value);
      var region = regionSelect.value;
      var matched = window.MOVIE_INDEX
        .filter(function (movie) {
          return movieMatches(movie, keyword, region);
        })
        .slice(0, 120);

      if (!keyword && !region) {
        matched = window.MOVIE_INDEX.slice(0, 48);
      }

      summary.textContent = '当前显示 ' + matched.length + ' 条结果。';
      results.innerHTML = matched.map(createResultCard).join('');
      setupImageFallbacks();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render();
    });
    input.addEventListener('input', render);
    regionSelect.addEventListener('change', render);
    render();
  }

  ready(function () {
    setupMenu();
    setupImageFallbacks();
    setupCarousels();
    setupSearch();
  });
})();
