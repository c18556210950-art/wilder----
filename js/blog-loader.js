/* ============================================================
   D&D THEMED PERSONAL BLOG — Blog Loader
   维尔德 Wilder
   ============================================================ */

(function () {
    'use strict';

    // ---------- Configuration ----------
    const POSTS_JSON_PATH = 'data/posts.json';
    const BLOG_CONTAINER_ID = 'blog-posts';
    const LOADING_ID = 'blog-loading';

    // ---------- Init ----------
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadPosts);
        } else {
            loadPosts();
        }
    }

    // ---------- Fetch and Render ----------
    async function loadPosts() {
        const container = document.getElementById(BLOG_CONTAINER_ID);
        const loadingEl = document.getElementById(LOADING_ID);
        if (!container) return;

        var posts = null;

        // Try inline data first (works with file:// protocol)
        if (window.__BLOG_POSTS__ && Array.isArray(window.__BLOG_POSTS__)) {
            posts = window.__BLOG_POSTS__;
        }

        // Fallback to fetch
        if (!posts) {
            try {
                const response = await fetch(POSTS_JSON_PATH);
                if (!response.ok) throw new Error('Failed to fetch posts');
                posts = await response.json();
            } catch (err) {
                console.warn('Blog posts could not be loaded:', err.message);
                showEmpty(container, loadingEl);
                return;
            }
        }

        if (!Array.isArray(posts) || posts.length === 0) {
            showEmpty(container, loadingEl);
            return;
        }

        // Sort by date descending
        posts.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        // Remove loading indicator
        if (loadingEl) loadingEl.remove();

        // Render each post card
        posts.forEach(function (post, index) {
            var card = createBlogCard(post, index);
            container.appendChild(card);
        });

        // Re-trigger scroll reveal for new elements
        if (window.scrollRevealRefresh) {
            window.scrollRevealRefresh();
        }
    }

    // ---------- Create Blog Card ----------
    function createBlogCard(post, index) {
        var article = document.createElement('article');
        article.className = 'blog-card glass-card reveal reveal-delay-' + ((index % 5) + 1);

        var dateStr = formatDate(post.date);

        var tagsHtml = '';
        if (Array.isArray(post.tags) && post.tags.length > 0) {
            tagsHtml = '<div class="blog-card__tags">' +
                post.tags.map(function (t) {
                    return '<span class="tag">#' + escapeHtml(t) + '</span>';
                }).join('') +
                '</div>';
        }

        var url = post.url || '#';

        article.innerHTML =
            '<time class="blog-card__date" datetime="' + escapeHtml(post.date) + '">' +
                dateStr +
            '</time>' +
            '<h3 class="blog-card__title">' +
                '<a href="' + escapeHtml(url) + '">' + escapeHtml(post.title) + '</a>' +
            '</h3>' +
            '<p class="blog-card__excerpt">' + escapeHtml(post.excerpt || '') + '</p>' +
            tagsHtml +
            '<a class="blog-card__readmore" href="' + escapeHtml(url) + '">阅读全文 →</a>';

        return article;
    }

    // ---------- Show Empty State ----------
    function showEmpty(container, loadingEl) {
        if (loadingEl) loadingEl.remove();
        container.innerHTML =
            '<div class="blog-empty reveal">' +
                '<p>📜 冒险手记尚在撰写中...</p>' +
                '<p style="font-size:0.8rem;margin-top:0.5rem;">新的故事即将到来，请稍后再来探索。</p>' +
            '</div>';
    }

    // ---------- Format Date ----------
    function formatDate(dateStr) {
        if (!dateStr) return '';
        var date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');

        var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        var weekday = weekdays[date.getDay()];

        return year + '年' + month + '月' + day + '日 · 星期' + weekday;
    }

    // ---------- Escape HTML ----------
    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // ---------- Start ----------
    init();
})();
