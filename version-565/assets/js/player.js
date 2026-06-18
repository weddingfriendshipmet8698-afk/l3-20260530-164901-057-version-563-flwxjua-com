(function () {
  var player = document.querySelector('[data-player]');

  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var button = player.querySelector('[data-play-button]');
  var overlay = player.querySelector('[data-player-overlay]');
  var status = player.querySelector('[data-player-status]');
  var hlsInstance = null;
  var loaded = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  function playVideo() {
    if (!video) {
      return;
    }

    var src = video.getAttribute('data-m3u8');
    if (!src) {
      setStatus('播放源暂时无法连接');
      return;
    }

    setStatus('正在加载高清播放内容...');

    if (!loaded) {
      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          hideOverlay();
          video.play().then(function () {
            setStatus('正在播放');
          }).catch(function () {
            setStatus('点击视频画面继续播放');
          });
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放源暂时无法连接');
            hlsInstance.destroy();
            hlsInstance = null;
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        hideOverlay();
        video.play().then(function () {
          setStatus('正在播放');
        }).catch(function () {
          setStatus('点击视频画面继续播放');
        });
      } else {
        video.src = src;
        hideOverlay();
        video.play().then(function () {
          setStatus('正在播放');
        }).catch(function () {
          setStatus('当前浏览器需要 HLS 支持');
        });
      }
    } else {
      hideOverlay();
      video.play().then(function () {
        setStatus('正在播放');
      }).catch(function () {
        setStatus('点击视频画面继续播放');
      });
    }
  }

  if (button) {
    button.addEventListener('click', playVideo);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        playVideo();
      } else {
        video.pause();
        setStatus('已暂停');
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
