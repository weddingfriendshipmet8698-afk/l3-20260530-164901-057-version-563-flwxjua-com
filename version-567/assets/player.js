function startMoviePlayer(src) {
    var video = document.getElementById('movieVideo');
    var cover = document.getElementById('playerCover');
    var started = false;

    if (!video || !src) {
        return;
    }

    function attachSource() {
        if (started) {
            return;
        }
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            video.src = src;
        }
    }

    function playVideo() {
        attachSource();
        if (cover) {
            cover.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (!started || video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    });
}
