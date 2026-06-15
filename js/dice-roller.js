/* ============================================================
   D&D THEMED PERSONAL BLOG — Interactive d20 Dice Roller
   维尔德 Wilder
   ============================================================ */

(function () {
    'use strict';

    var diceContainer;
    var diceSvg;
    var diceNumber;
    var diceResult;
    var isRolling = false;

    // ---------- Init ----------
    function init() {
        diceContainer = document.getElementById('dice-container');
        diceSvg = document.getElementById('dice-svg');
        diceNumber = document.getElementById('dice-number');
        diceResult = document.getElementById('dice-result');

        if (!diceContainer || !diceSvg) return;

        diceContainer.addEventListener('click', roll);
        diceContainer.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                roll();
            }
        });

        // Make dice container focusable for keyboard accessibility
        diceContainer.setAttribute('tabindex', '0');
        diceContainer.setAttribute('role', 'button');
        diceContainer.setAttribute('aria-label', '掷骰子，点击或按回车键');
    }

    // ---------- Roll ----------
    function roll() {
        if (isRolling) return;
        isRolling = true;

        // Clear previous result
        diceResult.classList.remove('dice-result--show', 'dice-result--crit', 'dice-result--fail');
        diceResult.textContent = '';

        // Remove previous animation classes
        diceSvg.classList.remove('dice-svg--rolling', 'dice-svg--crit', 'dice-svg--fail');

        // Force reflow to restart animation
        void diceSvg.offsetWidth;

        // Start roll animation
        diceSvg.classList.add('dice-svg--rolling');

        // Generate random result
        var result = Math.floor(Math.random() * 20) + 1;

        // Update dice number during animation
        var rollCount = 0;
        var maxRolls = 12;
        var rollInterval = setInterval(function () {
            diceNumber.textContent = Math.floor(Math.random() * 20) + 1;
            rollCount++;
            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);
                diceNumber.textContent = result;
            }
        }, 70);

        // After animation ends
        var onAnimationEnd = function () {
            diceSvg.removeEventListener('animationend', onAnimationEnd);
            clearInterval(rollInterval);
            diceNumber.textContent = result;
            diceSvg.classList.remove('dice-svg--rolling');

            // Show result
            showResult(result);

            // Special effects
            if (result === 20) {
                diceSvg.classList.add('dice-svg--crit');
                spawnBurstParticles();
            } else if (result === 1) {
                diceSvg.classList.add('dice-svg--fail');
            }

            isRolling = false;
        };

        diceSvg.addEventListener('animationend', onAnimationEnd);
    }

    // ---------- Show Result ----------
    function showResult(result) {
        diceResult.textContent = result;
        diceResult.classList.add('dice-result--show');

        if (result === 20) {
            diceResult.classList.add('dice-result--crit');
        } else if (result === 1) {
            diceResult.classList.add('dice-result--fail');
        }

        // Auto-hide after 3.5 seconds
        setTimeout(function () {
            diceResult.classList.remove('dice-result--show', 'dice-result--crit', 'dice-result--fail');
        }, 3500);
    }

    // ---------- Burst Particles (on crit) ----------
    function spawnBurstParticles() {
        var count = 12;
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < count; i++) {
            var particle = document.createElement('div');
            particle.className = 'burst-particle';

            var angle = (Math.PI * 2 * i) / count;
            var distance = 30 + Math.random() * 50;
            var bx = Math.cos(angle) * distance;
            var by = Math.sin(angle) * distance;

            particle.style.setProperty('--bx', bx + 'px');
            particle.style.setProperty('--by', by + 'px');
            particle.style.background = i % 3 === 0 ? '#c73e41' : '#f0d68a';
            particle.style.width = (3 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = '50%';
            particle.style.top = '50%';

            fragment.appendChild(particle);
        }

        diceContainer.appendChild(fragment);

        // Clean up after animation
        setTimeout(function () {
            var particles = diceContainer.querySelectorAll('.burst-particle');
            for (var j = 0; j < particles.length; j++) {
                particles[j].remove();
            }
        }, 800);
    }

    // ---------- Boot ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
