(function () {
  const menuButton = document.querySelector("[data-menu-button]");
  const siteNav = document.querySelector("[data-site-nav]");

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function () {
      siteNav.classList.toggle("is-open");
    });
  }

  const searchInput = document.querySelector("[data-search-input]");
  const yearFilter = document.querySelector("[data-year-filter]");

  function applyFilters() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const year = yearFilter ? yearFilter.value : "";
    const cards = document.querySelectorAll("[data-movie-card]");

    cards.forEach(function (card) {
      const searchable = (card.getAttribute("data-search") || "").toLowerCase();
      const cardYear = card.getAttribute("data-year") || "";
      const matchKeyword = !keyword || searchable.indexOf(keyword) !== -1;
      const matchYear = !year || cardYear === year;
      card.hidden = !(matchKeyword && matchYear);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (yearFilter) {
    yearFilter.addEventListener("change", applyFilters);
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q");
  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
    applyFilters();
  }

  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const prevButton = document.querySelector("[data-hero-prev]");
  const nextButton = document.querySelector("[data-hero-next]");
  const dotsWrap = document.querySelector("[data-hero-dots]");
  let currentSlide = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });

    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === currentSlide);
      });
    }
  }

  function restartSlider() {
    if (timer) {
      clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = setInterval(function () {
        showSlide(currentSlide + 1);
      }, 5200);
    }
  }

  if (slides.length && dotsWrap) {
    slides.forEach(function (_, index) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot";
      dot.setAttribute("aria-label", "切换影片" + (index + 1));
      dot.addEventListener("click", function () {
        showSlide(index);
        restartSlider();
      });
      dotsWrap.appendChild(dot);
    });

    showSlide(0);
    restartSlider();
  }

  if (prevButton) {
    prevButton.addEventListener("click", function () {
      showSlide(currentSlide - 1);
      restartSlider();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      showSlide(currentSlide + 1);
      restartSlider();
    });
  }

  window.setupMoviePlayer = function (config) {
    const video = document.getElementById(config.videoId);
    const button = document.getElementById(config.buttonId);
    const message = document.querySelector("[data-player-message]");
    let hlsInstance = null;
    let loaded = false;

    if (!video || !button || !config.source) {
      return;
    }

    function setMessage(text) {
      if (message) {
        message.textContent = text || "";
      }
    }

    function loadVideo() {
      if (loaded) {
        return Promise.resolve();
      }

      loaded = true;
      setMessage("");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = config.source;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(config.source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
            } else {
              setMessage("暂时无法播放，请稍后重试");
            }
          }
        });
        return Promise.resolve();
      }

      setMessage("暂时无法播放，请稍后重试");
      return Promise.reject(new Error("playback unavailable"));
    }

    function startPlayback() {
      loadVideo()
        .then(function () {
          button.classList.add("is-hidden");
          video.controls = true;
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
              button.classList.remove("is-hidden");
            });
          }
        })
        .catch(function () {
          button.classList.remove("is-hidden");
        });
    }

    button.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
