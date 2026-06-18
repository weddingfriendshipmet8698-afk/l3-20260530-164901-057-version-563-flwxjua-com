(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.watch-player'));
  blocks.forEach(function (block) {
    var video = block.querySelector('video');
    var overlay = block.querySelector('.player-overlay');
    var play = block.getAttribute('data-play');
    var hls = null;
    var ready = false;
    var start = function () {
      if (!video || !play) return;
      if (!ready) {
        ready = true;
        video.setAttribute('controls', 'controls');
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = play;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(play);
          hls.attachMedia(video);
        } else {
          video.src = play;
        }
      }
      if (overlay) overlay.classList.add('is-hidden');
      var promise = video.play();
      if (promise && promise.catch) promise.catch(function () {});
    };
    if (overlay) overlay.addEventListener('click', start);
    if (video) video.addEventListener('click', function () {
      if (!ready) start();
    });
    window.addEventListener('pagehide', function () {
      if (hls && hls.destroy) hls.destroy();
    });
  });
})();
