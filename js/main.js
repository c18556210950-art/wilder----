/* ============================================================
   D&D THEMED PERSONAL BLOG — Main Entry
   维尔德 Wilder
   ============================================================ */

(function () {
    'use strict';

    // ---------- DOM Ready ----------
    function init() {
        initSmoothScroll();
        initStickyNav();
        initActiveNavSection();
        initBackToTop();
    }

    // ---------- Smooth Scroll for Nav Links ----------
    function initSmoothScroll() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        nav.addEventListener('click', function (e) {
            const link = e.target.closest('.nav__link');
            if (!link) return;

            e.preventDefault();
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (target) {
                const navHeight = nav.offsetHeight + 24;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    }

    // ---------- Sticky Nav Shadow ----------
    function initStickyNav() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.height = '1px';
        sentinel.style.width = '1px';
        sentinel.style.pointerEvents = 'none';
        nav.before(sentinel);

        const observer = new IntersectionObserver(
            function (entries) {
                for (const entry of entries) {
                    nav.classList.toggle('nav--scrolled', !entry.isIntersecting);
                }
            },
            { threshold: 0 }
        );

        observer.observe(sentinel);
    }

    // ---------- Active Nav Section ----------
    function initActiveNavSection() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        const links = nav.querySelectorAll('.nav__link');
        const sections = [];

        links.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    sections.push({ link, section });
                }
            }
        });

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            function (entries) {
                let activeFound = false;
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !activeFound) {
                        // Find matching link
                        sections.forEach(function (item) {
                            if (item.section === entry.target) {
                                links.forEach(function (l) {
                                    l.classList.remove('nav__link--active');
                                });
                                item.link.classList.add('nav__link--active');
                            }
                        });
                        activeFound = true;
                    }
                });
            },
            {
                threshold: 0.25,
                rootMargin: '-80px 0px -60% 0px',
            }
        );

        sections.forEach(function (item) {
            observer.observe(item.section);
        });
    }

    // ---------- Back to Top Button ----------
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        const observer = new IntersectionObserver(
            function (entries) {
                btn.classList.toggle('back-to-top--visible', !entries[0].isIntersecting);
            },
            { threshold: 0 }
        );

        // Observe the hero section — when it scrolls out, show button
        const hero = document.getElementById('hero');
        if (hero) {
            observer.observe(hero);
        }

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Init on DOM Ready ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
