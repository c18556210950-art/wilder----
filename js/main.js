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
        initEmailCopy();
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
        var nav = document.getElementById('main-nav');
        if (!nav) return;

        var links = nav.querySelectorAll('.nav__link');
        var sections = [];

        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                var section = document.querySelector(href);
                if (section) {
                    sections.push({ link: link, section: section });
                }
            }
        });

        if (sections.length === 0) return;

        function updateActive() {
            var navBottom = nav.getBoundingClientRect().bottom + 12;
            var closest = null;
            var closestDist = Infinity;

            sections.forEach(function (item) {
                var top = item.section.getBoundingClientRect().top;
                // Section top is above or close to nav bottom
                if (top <= navBottom + 60) {
                    var dist = navBottom - top;
                    if (dist >= 0 && dist < closestDist) {
                        closestDist = dist;
                        closest = item;
                    }
                }
            });

            if (closest) {
                links.forEach(function (l) { l.classList.remove('nav__link--active'); });
                closest.link.classList.add('nav__link--active');
            }
        }

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
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

    // ---------- Email Copy to Clipboard ----------
    function initEmailCopy() {
        var emailLink = document.getElementById('email-link');
        if (!emailLink) return;

        emailLink.addEventListener('click', function (e) {
            e.preventDefault();
            var email = 'yuanye24@qq.com';

            // Try modern clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(function () {
                    showCopyToast(emailLink);
                }).catch(function () {
                    fallbackCopy(email, emailLink);
                });
            } else {
                fallbackCopy(email, emailLink);
            }
        });
    }

    function fallbackCopy(text, el) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            showCopyToast(el);
        } catch (err) {
            // If copy fails, open mailto as fallback
            window.location.href = 'mailto:' + text;
        }
        document.body.removeChild(textarea);
    }

    function showCopyToast(el) {
        // Remove any existing toast
        var existing = el.querySelector('.copy-toast');
        if (existing) existing.remove();

        var toast = document.createElement('span');
        toast.className = 'copy-toast';
        toast.textContent = '已复制 ✓';
        el.appendChild(toast);

        setTimeout(function () {
            toast.remove();
        }, 1800);
    }

    // ---------- Init on DOM Ready ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
