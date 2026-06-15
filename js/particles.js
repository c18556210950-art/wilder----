/* ============================================================
   D&D THEMED PERSONAL BLOG — Magical Particles Background
   维尔德 Wilder
   ============================================================ */

(function () {
    'use strict';

    // ---------- Configuration ----------
    var PARTICLE_COUNT_DESKTOP = 50;
    var PARTICLE_COUNT_TABLET = 35;
    var PARTICLE_COUNT_MOBILE = 20;
    var MOUSE_RADIUS = 120; // px — repulsion zone around cursor

    var canvas, ctx, particles = [];
    var width, height;
    var mouseX = -1000;
    var mouseY = -1000;
    var animFrameId;
    var prefersReducedMotion = false;

    // ---------- Init ----------
    function init() {
        // Check reduced motion preference
        var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion = mq.matches;
        mq.addEventListener('change', function (e) {
            prefersReducedMotion = e.matches;
            if (prefersReducedMotion) {
                stop();
            } else {
                start();
            }
        });

        if (prefersReducedMotion) return;

        canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        if (!ctx) return;

        resize();
        createParticles();
        bindEvents();
        animate();
    }

    // ---------- Resize ----------
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // ---------- Create Particles ----------
    function createParticles() {
        var count;
        if (width < 480) {
            count = PARTICLE_COUNT_MOBILE;
        } else if (width < 768) {
            count = PARTICLE_COUNT_TABLET;
        } else {
            count = PARTICLE_COUNT_DESKTOP;
        }

        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 1.2 + Math.random() * 2.8,
                color: Math.random() < 0.7 ? 'gold' : 'purple',
                opacity: 0.12 + Math.random() * 0.3,
                baseOpacity: 0.12 + Math.random() * 0.3,
                speedY: -0.12 - Math.random() * 0.35, // upward drift
                speedX: (Math.random() - 0.5) * 0.15,
                wobbleAmp: 0.1 + Math.random() * 0.5,
                wobbleSpeed: 0.005 + Math.random() * 0.015,
                wobbleOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    // ---------- Bind Events ----------
    function bindEvents() {
        window.addEventListener('resize', onResize);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
    }

    function onResize() {
        resize();
        createParticles();
    }

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function onMouseLeave() {
        mouseX = -1000;
        mouseY = -1000;
    }

    // ---------- Animation Loop ----------
    function animate() {
        if (prefersReducedMotion) return;

        ctx.clearRect(0, 0, width, height);

        var time = Date.now() * 0.001;

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            // Wobble
            var wobX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp;

            // Mouse repulsion
            var repX = 0;
            var repY = 0;
            var dx = p.x - mouseX;
            var dy = p.y - mouseY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                var force = (1 - dist / MOUSE_RADIUS) * 0.6;
                repX = (dx / dist) * force;
                repY = (dy / dist) * force;
            }

            // Move
            p.x += p.speedX + wobX + repX;
            p.y += p.speedY + repY;

            // Wrap around
            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            // Pulse opacity
            var pulse = 0.7 + 0.3 * Math.sin(time * 1.5 + p.wobbleOffset);
            var alpha = p.baseOpacity * pulse;

            // Color
            var color;
            if (p.color === 'gold') {
                color = '201, 168, 76'; // --gold-primary in RGB
            } else {
                color = '107, 78, 141'; // --magic-purple in RGB
            }

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + color + ', ' + alpha.toFixed(2) + ')';
            ctx.fill();
        }

        animFrameId = requestAnimationFrame(animate);
    }

    // ---------- Stop ----------
    function stop() {
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
        }
    }

    // ---------- Start ----------
    function start() {
        if (!canvas || !ctx) return;
        resize();
        createParticles();
        animate();
    }

    // ---------- Boot ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
