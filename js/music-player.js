/* ============================================================
   D&D THEMED PERSONAL BLOG — Floating Music Player
   维尔德 Wilder
   ============================================================ */

(function () {
    'use strict';

    // D&D / Fantasy ambiance playlist (YouTube video IDs)
    var PLAYLIST = [
        { id: 'xtfB66CzHvY', title: '酒馆小调 — Tavern Ambience' },
        { id: 'ETVKfNopz_c', title: '暗黑中世纪酒馆 — Dark Medieval Tavern' },
        { id: 'nAczqBTqUPs', title: '幻想酒馆 — Fantasy Tavern' },
        { id: 'IoqLxbgMTSQ', title: 'D&D 奇幻乐章 — D&D Fantasy Music' },
        { id: 'auNK8WyT0-E', title: '地下城氛围 — Dungeons & Dragons Ambience' },
        { id: 'FX9lbpE7FqM', title: '奇幻之境 — Fantasy Ambience' },
        { id: 'VkNZ9iGnyG0', title: '旅者驿站 — Tavern Music' }
    ];

    var currentIndex = 0;
    var player = null;
    var isPlaying = false;
    var apiReady = false;

    // Panel controls
    var btnPlay, btnPrev, btnNext, volumeSlider, trackName;
    var iconPlay, iconPause;
    // Floating bar controls
    var fpBar, fpBtnPlay, fpIconPlay, fpIconPause, fpTrackName;
    var fpPanel, fpToggle, fpPlayer;

    function init() {
        // Panel elements
        btnPlay = document.getElementById('btn-play');
        btnPrev = document.getElementById('btn-prev');
        btnNext = document.getElementById('btn-next');
        volumeSlider = document.getElementById('volume-slider');
        trackName = document.getElementById('track-name');
        iconPlay = document.getElementById('icon-play');
        iconPause = document.getElementById('icon-pause');

        // Floating bar elements
        fpBar = document.getElementById('floating-bar');
        fpBtnPlay = document.getElementById('fp-btn-play');
        fpIconPlay = document.getElementById('fp-icon-play');
        fpIconPause = document.getElementById('fp-icon-pause');
        fpTrackName = document.getElementById('fp-track-name');
        fpPanel = document.getElementById('fp-panel');
        fpToggle = document.getElementById('fp-toggle');
        fpPlayer = document.getElementById('floating-player');

        if (!btnPlay) return;

        // Load YouTube IFrame API
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Bind panel controls
        btnPlay.addEventListener('click', togglePlay);
        btnPrev.addEventListener('click', playPrev);
        btnNext.addEventListener('click', playNext);
        volumeSlider.addEventListener('input', onVolumeChange);

        // Bind floating bar controls
        fpBtnPlay.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePlay();
        });
        fpToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePanel();
        });
        fpBar.addEventListener('click', function () {
            if (!fpPanel.style.display || fpPanel.style.display === 'none') {
                togglePanel();
            }
        });
    }

    // ---------- Panel Toggle ----------
    function togglePanel() {
        var isOpen = fpPanel.style.display !== 'none';
        if (isOpen) {
            fpPanel.style.display = 'none';
            fpPlayer.classList.remove('floating-player--open');
            fpToggle.setAttribute('aria-label', '展开播放器');
        } else {
            fpPanel.style.display = 'block';
            fpPlayer.classList.add('floating-player--open');
            fpToggle.setAttribute('aria-label', '收起播放器');
        }
    }

    // ---------- YouTube API ----------
    window.onYouTubeIframeAPIReady = function () {
        apiReady = true;
        player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: PLAYLIST[0].id,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onStateChange,
                onError: onError,
            },
        });
    };

    function onPlayerReady() {
        // Restore saved volume & track
        var savedVol = localStorage.getItem('wilder_music_volume');
        var savedIndex = localStorage.getItem('wilder_music_index');
        var wasPlaying = localStorage.getItem('wilder_music_playing');

        if (savedVol !== null) {
            var vol = parseInt(savedVol, 10);
            player.setVolume(vol);
            volumeSlider.value = vol;
        } else {
            player.setVolume(parseInt(volumeSlider.value, 10));
        }

        if (savedIndex !== null) {
            currentIndex = parseInt(savedIndex, 10) % PLAYLIST.length;
        }

        updateAllTrackNames();

        // Auto-resume if was playing before
        if (wasPlaying === '1') {
            player.loadVideoById(PLAYLIST[currentIndex].id);
            setTimeout(function () {
                player.playVideo();
            }, 500);
        }
    }

    function onStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
            setAllPlayStates(true);
        } else if (event.data === YT.PlayerState.PAUSED ||
                   event.data === YT.PlayerState.ENDED) {
            isPlaying = false;
            setAllPlayStates(false);
            if (event.data === YT.PlayerState.ENDED) {
                playNext();
            }
        }
    }

    function onError() {
        playNext();
    }

    // ---------- Controls ----------
    function togglePlay() {
        if (!player || !apiReady) return;
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }

    function playNext() {
        currentIndex = (currentIndex + 1) % PLAYLIST.length;
        playCurrent();
    }

    function playPrev() {
        currentIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        playCurrent();
    }

    function playCurrent() {
        if (!player || !apiReady) return;
        player.loadVideoById(PLAYLIST[currentIndex].id);
        updateAllTrackNames();
        if (!isPlaying) {
            setTimeout(function () {
                player.playVideo();
            }, 300);
        }
    }

    function onVolumeChange() {
        if (player && apiReady) {
            var vol = parseInt(volumeSlider.value, 10);
            player.setVolume(vol);
            localStorage.setItem('wilder_music_volume', vol);
        }
    }

    // ---------- Sync both UIs ----------
    function updateAllTrackNames() {
        var title = PLAYLIST[currentIndex] ? PLAYLIST[currentIndex].title : '';
        if (trackName) trackName.textContent = title;
        if (fpTrackName) fpTrackName.textContent = title;
    }

    function setAllPlayStates(playing) {
        // Save state for cross-page resume
        localStorage.setItem('wilder_music_playing', playing ? '1' : '0');
        localStorage.setItem('wilder_music_index', currentIndex);

        // Panel button
        if (iconPlay && iconPause && btnPlay) {
            iconPlay.style.display = playing ? 'none' : 'block';
            iconPause.style.display = playing ? 'block' : 'none';
            if (playing) {
                btnPlay.classList.add('playing');
            } else {
                btnPlay.classList.remove('playing');
            }
        }
        // Floating bar button
        if (fpIconPlay && fpIconPause && fpBtnPlay) {
            fpIconPlay.style.display = playing ? 'none' : 'block';
            fpIconPause.style.display = playing ? 'block' : 'none';
            if (playing) {
                fpBtnPlay.classList.add('playing');
            } else {
                fpBtnPlay.classList.remove('playing');
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
