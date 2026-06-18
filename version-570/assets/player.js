(function () {
  var box = document.querySelector('.player-box');

  if (!box) {
    return;
  }

  var video = box.querySelector('video');
  var button = box.querySelector('.play-overlay');
  var stream = box.getAttribute('data-stream');
  var ready = false;
  var hls = null;

  function prepare() {
    if (!video || !stream || ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      return;
    }

    video.src = stream;
  }

  function start() {
    prepare();
    box.classList.add('is-playing');

    if (video) {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        start();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
