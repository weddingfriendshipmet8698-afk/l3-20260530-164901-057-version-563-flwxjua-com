(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    if (!toggle || !links) {
      return;
    }

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function setupHeroSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var previous = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');

    if (slides.length === 0) {
      return;
    }

    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide') || 0));
        restart();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function setupGlobalSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('.site-search'));
    var movies = window.SEARCH_MOVIES || [];

    forms.forEach(function (form) {
      var input = form.querySelector('.site-search-input');
      var box = form.querySelector('.search-results');

      if (!input || !box) {
        return;
      }

      function renderResults() {
        var query = normalize(input.value);
        box.innerHTML = '';

        if (query.length === 0) {
          box.classList.remove('is-open');
          return;
        }

        var matches = movies.filter(function (movie) {
          return normalize(movie.title + ' ' + movie.region + ' ' + movie.type + ' ' + movie.year + ' ' + movie.genre + ' ' + movie.tags).indexOf(query) !== -1;
        }).slice(0, 12);

        if (matches.length === 0) {
          box.innerHTML = '<div class="search-result-empty">没有找到相关影片</div>';
          box.classList.add('is-open');
          return;
        }

        box.innerHTML = matches.map(function (movie) {
          return [
            '<a class="search-result-item" href="' + movie.url + '">',
            '  <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '">',
            '  <span>',
            '    <strong>' + escapeHtml(movie.title) + '</strong>',
            '    <span>' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.type) + '</span>',
            '  </span>',
            '</a>'
          ].join('');
        }).join('');
        box.classList.add('is-open');
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var first = box.querySelector('a');
        if (first) {
          window.location.href = first.getAttribute('href');
        }
      });

      input.addEventListener('input', renderResults);
      input.addEventListener('focus', renderResults);

      document.addEventListener('click', function (event) {
        if (!form.contains(event.target)) {
          box.classList.remove('is-open');
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupPageFilters() {
    var lists = Array.prototype.slice.call(document.querySelectorAll('[data-filter-list]'));

    lists.forEach(function (list) {
      var section = list.closest('.content-section') || document;
      var search = section.querySelector('[data-filter-search]');
      var region = section.querySelector('[data-filter-region]');
      var type = section.querySelector('[data-filter-type]');
      var clear = section.querySelector('[data-clear-filters]');
      var counter = section.querySelector('[data-result-count]');
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

      function applyFilters() {
        var query = normalize(search ? search.value : '');
        var regionValue = normalize(region ? region.value : '');
        var typeValue = normalize(type ? type.value : '');
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre')
          ].join(' '));
          var matchesQuery = query.length === 0 || haystack.indexOf(query) !== -1;
          var matchesRegion = regionValue.length === 0 || normalize(card.getAttribute('data-region')) === regionValue;
          var matchesType = typeValue.length === 0 || normalize(card.getAttribute('data-type')) === typeValue;
          var shouldShow = matchesQuery && matchesRegion && matchesType;

          card.style.display = shouldShow ? '' : 'none';
          if (shouldShow) {
            visible += 1;
          }
        });

        if (counter) {
          counter.textContent = '共 ' + visible + ' 部';
        }
      }

      [search, region, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilters);
          control.addEventListener('change', applyFilters);
        }
      });

      if (clear) {
        clear.addEventListener('click', function () {
          if (search) {
            search.value = '';
          }
          if (region) {
            region.value = '';
          }
          if (type) {
            type.value = '';
          }
          applyFilters();
        });
      }

      applyFilters();
    });
  }

  function setupPlayers() {
    var playerCards = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    playerCards.forEach(function (card) {
      var button = card.querySelector('.play-button');
      var video = card.querySelector('.video-player');
      var status = card.querySelector('.player-status');
      var stream = card.getAttribute('data-stream');

      if (!button || !video || !stream) {
        return;
      }

      button.addEventListener('click', function () {
        startPlayback(card, video, status, stream);
      });
    });
  }

  function setPlayerStatus(status, message) {
    if (status) {
      status.textContent = message || '';
    }
  }

  function startPlayback(card, video, status, stream) {
    setPlayerStatus(status, '正在加载播放源…');
    card.classList.add('is-playing');
    video.controls = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.play().catch(function () {
        setPlayerStatus(status, '点击播放器上的播放按钮继续');
      });
      return;
    }

    loadLocalHls()
      .then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            setPlayerStatus(status, '播放源已就绪');
            video.play().catch(function () {
              setPlayerStatus(status, '点击播放器上的播放按钮继续');
            });
          });
          hls.on(Hls.Events.ERROR, function (_, data) {
            if (data && data.fatal) {
              setPlayerStatus(status, '播放源暂时无法加载，请稍后刷新重试');
              hls.destroy();
            }
          });
          video._hlsInstance = hls;
        } else {
          video.src = stream;
          video.play().catch(function () {
            setPlayerStatus(status, '当前浏览器需要原生 HLS 支持');
          });
        }
      })
      .catch(function () {
        loadCdnHls(function (Hls) {
          if (Hls && Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(stream);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              setPlayerStatus(status, '播放源已就绪');
              video.play().catch(function () {
                setPlayerStatus(status, '点击播放器上的播放按钮继续');
              });
            });
          } else {
            video.src = stream;
            video.play().catch(function () {
              setPlayerStatus(status, '当前浏览器需要原生 HLS 支持');
            });
          }
        });
      });
  }

  function loadLocalHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    return import('./hls-player.js').then(function (module) {
      return module.H || module.default;
    });
  }

  function loadCdnHls(callback) {
    if (window.Hls) {
      callback(window.Hls);
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
    script.async = true;
    script.onload = function () {
      callback(window.Hls);
    };
    script.onerror = function () {
      callback(null);
    };
    document.head.appendChild(script);
  }

  ready(function () {
    setupNavigation();
    setupHeroSlider();
    setupGlobalSearch();
    setupPageFilters();
    setupPlayers();
  });
})();
