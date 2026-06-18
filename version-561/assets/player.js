
function startMoviePlayer(videoUrl) {
  var video = document.querySelector('.video-player');
  var trigger = document.querySelector('.video-play-trigger');
  var message = document.querySelector('.video-message');
  var hlsInstance = null;
  var sourceReady = false;

  if (!video || !videoUrl) {
    return;
  }

  function setMessage(value) {
    if (message) {
      message.textContent = value || '';
    }
  }

  function attachSource() {
    if (sourceReady) {
      return;
    }

    sourceReady = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setMessage('播放暂时不可用，请稍后重试');
        }
      });
      return;
    }

    setMessage('播放暂时不可用，请稍后重试');
  }

  function beginPlay() {
    attachSource();

    if (trigger) {
      trigger.classList.add('is-hidden');
    }

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (trigger) {
          trigger.classList.remove('is-hidden');
        }
        setMessage('点击播放按钮继续观看');
      });
    }
  }

  if (trigger) {
    trigger.addEventListener('click', beginPlay);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      beginPlay();
    }
  });

  video.addEventListener('play', function () {
    setMessage('');
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (trigger && video.currentTime === 0) {
      trigger.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
