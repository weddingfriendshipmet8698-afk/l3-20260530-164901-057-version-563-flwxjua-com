(function() {
  var box = document.querySelector('[data-player]');

  if (!box) {
    return;
  }

  var video = box.querySelector('video');
  var button = box.querySelector('[data-play-button]');
  var src = box.getAttribute('data-src');
  var ready = false;
  var instance = null;

  function prepare() {
    if (!video || !src || ready) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      instance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      instance.loadSource(src);
      instance.attachMedia(video);
    } else {
      video.src = src;
    }

    ready = true;
  }

  function start() {
    prepare();

    if (button) {
      button.classList.add('is-hidden');
    }

    var attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function() {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  prepare();

  if (button) {
    button.addEventListener('click', start);
  }

  video.addEventListener('play', function() {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function() {
    if (button && video.currentTime === 0) {
      button.classList.remove('is-hidden');
    }
  });

  window.addEventListener('pagehide', function() {
    if (instance) {
      instance.destroy();
    }
  });
})();
