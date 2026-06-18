(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-index]'));
        var activeIndex = 0;
        var timer = null;

        function showHero(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        function startHero() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                showHero(activeIndex + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showHero(Number(dot.getAttribute('data-hero-index')) || 0);
                startHero();
            });
        });

        if (slides.length > 1) {
            startHero();
        }
    }

    var filterPages = document.querySelectorAll('.js-filter-page');

    filterPages.forEach(function (bar) {
        var scope = bar.parentElement || document;
        var input = bar.querySelector('.filter-input');
        var type = bar.querySelector('.filter-type');
        var year = bar.querySelector('.filter-year');
        var region = bar.querySelector('.filter-region');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var noResult = scope.querySelector('.no-result');
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';

        if (input && q) {
            input.value = q;
        }

        function matchCard(card) {
            var query = input ? input.value.trim().toLowerCase() : '';
            var cardType = (card.getAttribute('data-type') || '').toLowerCase();
            var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
            var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
            var cardText = (card.getAttribute('data-search') || '').toLowerCase();
            var typeValue = type ? type.value.trim().toLowerCase() : '';
            var yearValue = year ? year.value.trim().toLowerCase() : '';
            var regionValue = region ? region.value.trim().toLowerCase() : '';

            if (query && cardText.indexOf(query) === -1) {
                return false;
            }
            if (typeValue && cardType.indexOf(typeValue) === -1) {
                return false;
            }
            if (yearValue && cardYear !== yearValue) {
                return false;
            }
            if (regionValue && cardRegion.indexOf(regionValue) === -1) {
                return false;
            }
            return true;
        }

        function applyFilter() {
            var visible = 0;
            cards.forEach(function (card) {
                var ok = matchCard(card);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (noResult) {
                noResult.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, type, year, region].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });
})();
