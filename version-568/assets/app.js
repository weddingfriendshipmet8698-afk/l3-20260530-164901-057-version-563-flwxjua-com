(function () {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            var isOpen = panel.hasAttribute('hidden');
            if (isOpen) {
                panel.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
                toggle.textContent = '×';
            } else {
                panel.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.textContent = '☰';
            }
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5600);
    }

    var searchInput = document.querySelector('.movie-search-input');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-list .movie-card'));

    function getQueryValue() {
        try {
            var params = new URLSearchParams(window.location.search);
            return params.get('q') || '';
        } catch (error) {
            return '';
        }
    }

    function applyFilter(value) {
        var query = String(value || '').trim().toLowerCase();
        cards.forEach(function (card) {
            var data = String(card.getAttribute('data-search') || '').toLowerCase();
            card.classList.toggle('is-filtered-out', query && data.indexOf(query) === -1);
        });
    }

    if (searchInput && cards.length) {
        var initial = getQueryValue();
        if (initial) {
            searchInput.value = initial;
            applyFilter(initial);
        }
        searchInput.addEventListener('input', function () {
            applyFilter(searchInput.value);
        });
    }

    document.querySelectorAll('[data-filter]').forEach(function (button) {
        button.addEventListener('click', function () {
            var value = button.getAttribute('data-filter') || '';
            if (searchInput) {
                searchInput.value = value;
            }
            applyFilter(value);
        });
    });
})();
