(function () {
    function setupPlayer(frame) {
        var video = frame.querySelector('video');
        var cover = frame.querySelector('.player-cover');
        if (!video) {
            return;
        }

        var stream = video.getAttribute('data-stream');
        var hlsInstance = null;

        function attachStream() {
            if (!stream || video.getAttribute('data-ready') === 'true') {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            }

            video.setAttribute('data-ready', 'true');
        }

        function beginPlayback() {
            attachStream();
            video.controls = true;
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    video.controls = true;
                });
            }
        }

        if (cover) {
            cover.addEventListener('click', beginPlayback);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                beginPlayback();
            }
        });

        video.addEventListener('play', function () {
            if (cover) {
                cover.classList.add('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
