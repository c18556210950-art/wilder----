/* ============================================================
   D&D THEMED PERSONAL BLOG — Scroll Reveal
   维尔德 Wilder
   ============================================================ */

(function () {
    'use strict';

    var observer;

    // ---------- Init ----------
    function init() {
        var revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            for (var i = 0; i < revealElements.length; i++) {
                revealElements[i].classList.add('revealed');
            }
            return;
        }

        observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        for (var j = 0; j < revealElements.length; j++) {
            observer.observe(revealElements[j]);
        }

        // Expose refresh for dynamically added elements
        window.scrollRevealRefresh = refresh;
    }

    // ---------- Refresh — observe newly added elements ----------
    function refresh() {
        if (!observer) return;
        var allReveal = document.querySelectorAll('.reveal:not(.revealed)');
        for (var i = 0; i < allReveal.length; i++) {
            var el = allReveal[i];
            // Skip if already observed (heuristic: no data attr)
            if (!el.dataset.revealObserved) {
                el.dataset.revealObserved = '1';
                observer.observe(el);
            }
        }
    }

    // ---------- Boot ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
