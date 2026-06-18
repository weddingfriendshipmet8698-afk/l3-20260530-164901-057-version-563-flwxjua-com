
import { H as Hls } from './player-hls.js';

function showMessage(stage, text) {
  var message = stage.querySelector('[data-player-message]');
  if (!message) {
    return;
  }
  message.textContent = text;
  message.classList.add('is-visible');
}

function setupPlayer(stage) {
  var video = stage.querySelector('video[data-m3u8]');
  var overlay = stage.querySelector('[data-player-overlay]');
  if (!video) {
    return;
  }

  var source = video.getAttribute('data-m3u8');
  var hlsInstance = null;

  if (source && Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hlsInstance.loadSource(source);
    hlsInstance.attachMedia(video);
    hlsInstance.on(Hls.Events.ERROR, function (_event, data) {
      if (data && data.fatal) {
        showMessage(stage, '播放源加载遇到问题，请刷新页面或稍后重试。');
      }
    });
  } else if (source && video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  } else {
    showMessage(stage, '当前浏览器不支持 HLS 播放，请更换浏览器或使用支持 HLS 的环境。');
  }

  function playVideo() {
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        showMessage(stage, '浏览器阻止了自动播放，请点击视频控件继续播放。');
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (overlay) {
      overlay.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

document.querySelectorAll('[data-player-stage]').forEach(setupPlayer);
