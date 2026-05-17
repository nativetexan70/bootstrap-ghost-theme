/* Bootstrap-Ghost Theme JS — v1.3.0 */
(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // 1. COLOUR SCHEME PRESETS
    //    Reads data-scheme / data-color-mode from <html> and writes
    //    CSS custom properties onto :root.
    // ═══════════════════════════════════════════════════════════════
    const SCHEMES = {
        'Warm Parchment':  { accent:'#c96a3a', bg:'#fbf3e8', surface:'#ffffff', text:'#1a1a1a', muted:'#7b6b58', rule:'#e5d9ca', footerBg:'#141413', accentSoft:'#f9ede2' },
        'Slate & Stone':   { accent:'#3b6ea8', bg:'#eef3f7', surface:'#ffffff', text:'#17202b', muted:'#6a7a88', rule:'#d8dee4', footerBg:'#1c2430', accentSoft:'#e7eef7' },
        'Midnight Ink':    { accent:'#7b6bf7', bg:'#0c0e18', surface:'#141824', text:'#eef1ff', muted:'#9aa0c1', rule:'#2c3050', footerBg:'#080b14', accentSoft:'#1f2140' },
        'Forest & Moss':   { accent:'#2f6f44', bg:'#eef4ee', surface:'#ffffff', text:'#17221b', muted:'#597064', rule:'#d7e2d8', footerBg:'#132113', accentSoft:'#e6efe7' },
        'Graphite Studio': { accent:'#444444', bg:'#f2f2f2', surface:'#ffffff', text:'#151515', muted:'#767676', rule:'#dcdcdc', footerBg:'#121212', accentSoft:'#ececec' },
        'Ocean Depth':     { accent:'#1f78a8', bg:'#e8f2f8', surface:'#ffffff', text:'#102334', muted:'#5a7188', rule:'#c7d7e4', footerBg:'#0a1828', accentSoft:'#e5f1fa' },
    };

    function hexDarken(hex, factor) {
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
        const f = Math.max(0, Math.min(1, factor));
        return '#' + [r,g,b].map(c => Math.round(c * f).toString(16).padStart(2,'0')).join('');
    }

    function applyScheme() {
        const html        = document.documentElement;
        const schemeName  = html.getAttribute('data-scheme') || 'Warm Parchment';
        const colorMode   = html.getAttribute('data-color-mode') || 'Light';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark      = colorMode === 'Dark' || (colorMode === 'Auto' && prefersDark);

        let s = Object.assign({}, SCHEMES[schemeName] || SCHEMES['Warm Parchment']);

        if (isDark) {
            s.bg      = hexDarken(s.bg,      0.12);
            s.surface = hexDarken(s.surface,  0.14);
            s.text    = '#ececea';
            s.muted   = '#9a9a93';
            s.rule    = hexDarken(s.rule,     0.35);
            html.setAttribute('data-dark', '');
        } else {
            html.removeAttribute('data-dark');
        }

        const root = html.style;
        root.setProperty('--accent',        s.accent);
        root.setProperty('--accent-soft',   s.accentSoft);
        root.setProperty('--bs-body-bg',    s.bg);
        root.setProperty('--surface',       s.surface);
        root.setProperty('--bs-body-color', s.text);
        root.setProperty('--muted',         s.muted);
        root.setProperty('--rule',          s.rule);
        root.setProperty('--footer-bg',     s.footerBg);

        // Dark-mode utility overrides
        let ds = document.getElementById('theme-dark-overrides');
        if (isDark) {
            if (!ds) { ds = document.createElement('style'); ds.id = 'theme-dark-overrides'; document.head.appendChild(ds); }
            ds.textContent = [
                '.bg-white{background-color:var(--surface)!important}',
                '.bg-subtle{background-color:var(--surface)!important}',
                '.border,.border-bottom,.border-top{border-color:var(--rule)!important}',
                '.site-header{background-color:var(--surface)!important}',
                '.sidebar-block{background-color:var(--surface)!important}',
                '.post-card{background-color:var(--surface)!important}',
            ].join('');
        } else if (ds) {
            ds.textContent = '';
        }
    }

    applyScheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyScheme);


    // ═══════════════════════════════════════════════════════════════
    // 2. FONT LOADER
    //    Fonts are now loaded automatically by Ghost's built-in font system
    //    using --gh-font-heading and --gh-font-body CSS custom properties.
    // ═══════════════════════════════════════════════════════════════
    (function loadFonts() {
        // Ghost handles font loading automatically
    })();


    // ═══════════════════════════════════════════════════════════════
    // 3. POST CARD LAYOUT — "Horizontal" vs "Vertical grid"
    //    Reads data-post-card-layout from <body> (set by default.hbs
    //    from @custom.post_card_layout).
    //    Horizontal (default): .post-feed-grid is flex column.
    //    Vertical grid: .post-feed-grid becomes a Bootstrap row grid.
    // ═══════════════════════════════════════════════════════════════
    (function applyCardLayout() {
        const layout = document.body.getAttribute('data-post-card-layout') || 'Horizontal';
        const grids  = document.querySelectorAll('.post-feed-grid');
        if (!grids.length) return;

        if (layout === 'Vertical grid') {
            // Check if sidebar is displayed
            const sidebarDisplayed = document.querySelector('.sidebar') !== null;

            grids.forEach(grid => {
                // Switch to Bootstrap grid
                grid.classList.remove('d-flex', 'flex-column', 'gap-3');
                grid.classList.add('row', 'g-4');

                // Wrap each card in a col with appropriate sizing
                const cards = Array.from(grid.children);
                cards.forEach(card => {
                    const col = document.createElement('div');
                    // 2 columns when sidebar is shown, 3 columns when not shown
                    col.className = sidebarDisplayed ? 'col-sm-6 col-lg-6' : 'col-sm-6 col-lg-4';
                    grid.insertBefore(col, card);
                    col.appendChild(card);

                    // Remove horizontal card classes — switch to vertical style
                    card.classList.remove('post-card-horizontal');
                    card.querySelector('a')?.classList.remove('d-flex');

                    // Make cards equal height
                    card.classList.add('h-100');
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';

                    const imgWrap = card.querySelector('.post-card-image-wrap');
                    if (imgWrap) {
                        imgWrap.style.width  = '';
                        imgWrap.style.height = '';
                        imgWrap.classList.add('ratio', 'ratio-16x9');
                    }
                });
            });
        }
        // Horizontal is the default — CSS handles it
    })();


    // ═══════════════════════════════════════════════════════════════
    // 5. READING PROGRESS BAR
    // ═══════════════════════════════════════════════════════════════
    const post = document.querySelector('.post-full');
    if (post) {
        const bar = document.createElement('div');
        Object.assign(bar.style, {
            position: 'fixed', top: '0', left: '0', height: '3px',
            width: '0%', background: 'var(--accent, #c96a3a)',
            zIndex: '1080', transition: 'width 80ms linear',
            pointerEvents: 'none',
        });
        document.body.appendChild(bar);
        const updateBar = () => {
            const rect  = post.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const past  = Math.min(Math.max(-rect.top, 0), total);
            bar.style.width = total > 0 ? (past / total * 100) + '%' : '0%';
        };
        window.addEventListener('scroll', updateBar, { passive: true });
        window.addEventListener('resize', updateBar);
        updateBar();
    }


    // ═══════════════════════════════════════════════════════════════
    // 4. LAZY FADE-IN FOR CARDS
    // ═══════════════════════════════════════════════════════════════
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity   = '1';
                    e.target.style.transform = 'translateY(0)';
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.post-card, .post-card-featured').forEach(el => {
            el.style.opacity   = '0';
            el.style.transform = 'translateY(8px)';
            el.style.transition = 'opacity .4s ease, transform .4s ease';
            io.observe(el);
        });
    }


    // ═══════════════════════════════════════════════════════════════
    // 5. SECONDARY NAV: SOCIAL ICON MAPPING (Font Awesome 6)
    // ═══════════════════════════════════════════════════════════════
    const SOCIAL_MAP = [
        [/twitter\.com|x\.com|t\.co/i,   'fa-brands fa-x-twitter'],
        [/facebook\.com|fb\.me|fb\.watch/i, 'fa-brands fa-facebook-f'],
        [/instagram\.com/i,               'fa-brands fa-instagram'],
        [/linkedin\.com/i,                'fa-brands fa-linkedin-in'],
        [/github\.com/i,                  'fa-brands fa-github'],
        [/gitlab\.com/i,                  'fa-brands fa-gitlab'],
        [/youtube\.com|youtu\.be/i,       'fa-brands fa-youtube'],
        [/tiktok\.com/i,                  'fa-brands fa-tiktok'],
        [/threads\.net/i,                 'fa-brands fa-threads'],
        [/mastodon|fosstodon|hachyderm/i,   'fa-brands fa-mastodon'],
        [/bsky\.app|bluesky/i,            'fa-brands fa-bluesky'],
        [/reddit\.com/i,                  'fa-brands fa-reddit'],
        [/pinterest\.com/i,               'fa-brands fa-pinterest'],
        [/discord\.gg|discord\.com/i,     'fa-brands fa-discord'],
        [/dribbble\.com/i,                'fa-brands fa-dribbble'],
        [/behance\.net/i,                 'fa-brands fa-behance'],
        [/medium\.com/i,                  'fa-brands fa-medium'],
        [/snapchat\.com/i,                'fa-brands fa-snapchat'],
        [/telegram\.me|t\.me/i,          'fa-brands fa-telegram'],
        [/whatsapp\.com|wa\.me/i,        'fa-brands fa-whatsapp'],
        [/^mailto:/i,                      'fa-solid fa-envelope'],
        [/\/rss\/?$|\.xml$|\/feed/i,    'fa-solid fa-rss'],
    ];

    function iconForUrl(href, label) {
        if (!href) return 'fa-solid fa-link';
        for (const [re, cls] of SOCIAL_MAP) if (re.test(href))  return cls;
        for (const [re, cls] of SOCIAL_MAP) if (re.test(label)) return cls;
        return 'fa-solid fa-link';
    }

    document.querySelectorAll('.secondary-nav-link').forEach(link => {
        const i = link.querySelector('i');
        if (i) i.className = iconForUrl(link.getAttribute('href') || '', link.getAttribute('aria-label') || '');
    });


    // ═══════════════════════════════════════════════════════════════
    // 6. PRIMARY NAV: BUILD FROM DATA ATTRIBUTES
    //
    //    Ghost Admin navigation convention:
    //      "Home"           → plain top-level link
    //      "Topics-Essays"  → child of "Topics" dropdown, label "Essays"
    //      "Topics-Notebook"→ child of "Topics" dropdown, label "Notebook"
    //
    //    The header partial emits .nav-item-raw <li> elements with
    //    data-nav-label and data-nav-url. This builds Bootstrap
    //    dropdown DOM from those, then splits for logo-in-middle.
    // ═══════════════════════════════════════════════════════════════
    (function buildPrimaryNav() {
        const navRight = document.getElementById('navRight');
        const navLeft  = document.getElementById('navLeft');
        if (!navRight) return;

        const rawItems = Array.from(navRight.querySelectorAll('.nav-item-raw'));
        if (!rawItems.length) return;

        // Parse
        const entries = rawItems.map(li => ({
            label: li.getAttribute('data-nav-label') || '',
            url:   li.getAttribute('data-nav-url')   || '#',
        }));
        rawItems.forEach(li => li.remove());

        // Group by prefix before first "-"
        const parents = new Map();
        const order   = [];

        entries.forEach(({ label, url }) => {
            const dash = label.indexOf('-');
            if (dash === -1) {
                if (!parents.has(label)) { parents.set(label, { topUrl: url, children: [] }); order.push(label); }
            } else {
                const pKey  = label.slice(0, dash).trim();
                const cText = label.slice(dash + 1).trim();
                if (!parents.has(pKey)) { parents.set(pKey, { topUrl: '#', children: [] }); order.push(pKey); }
                parents.get(pKey).children.push({ label: cText, url });
            }
        });

        // Auth anchor (Sign in / Subscribe)
        const authAnchor = navRight.querySelector('.nav-item:not(.nav-item-raw)') || null;

        // Build nav items and insert before auth buttons
        const builtItems = [];
        order.forEach(key => {
            const { topUrl, children } = parents.get(key);
            const li = document.createElement('li');

            if (children.length === 0) {
                li.className = 'nav-item';
                const a = Object.assign(document.createElement('a'), { className: 'nav-link', href: topUrl, textContent: key });
                li.appendChild(a);
            } else {
                li.className = 'nav-item dropdown';
                const toggle = Object.assign(document.createElement('a'), {
                    className: 'nav-link dropdown-toggle', href: '#', textContent: key,
                });
                toggle.setAttribute('role', 'button');
                toggle.setAttribute('data-bs-toggle', 'dropdown');
                toggle.setAttribute('aria-expanded', 'false');
                li.appendChild(toggle);

                const menu = document.createElement('ul');
                menu.className = 'dropdown-menu dropdown-menu-themed';
                children.forEach(child => {
                    const item = document.createElement('li');
                    item.appendChild(Object.assign(document.createElement('a'), {
                        className: 'dropdown-item', href: child.url, textContent: child.label,
                    }));
                    menu.appendChild(item);
                });
                li.appendChild(menu);

                toggle.addEventListener('click', function (event) {
                    if (window.innerWidth < 992) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const isOpen = li.classList.contains('show');
                    if (isOpen) {
                        li.classList.remove('show');
                        menu.classList.remove('show');
                        toggle.setAttribute('aria-expanded', 'false');
                    } else {
                        li.classList.add('show');
                        menu.classList.add('show');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                });
            }

            authAnchor ? navRight.insertBefore(li, authAnchor) : navRight.appendChild(li);
            builtItems.push(li);
        });

        // Hover-open dropdowns on desktop
        navRight.querySelectorAll('.nav-item.dropdown').forEach(attachHover);
        if (navLeft) navLeft.querySelectorAll('.nav-item.dropdown').forEach(attachHover);

        // Close collapse on link click (mobile)
        const allNavLinks = [...navRight.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item')];
        if (navLeft) allNavLinks.push(...navLeft.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item'));
        const navCollapse = new bootstrap.Collapse(document.getElementById('mainNav'), { toggle: false });
        allNavLinks.forEach(link => link.addEventListener('click', () => {
            if (window.innerWidth < 992) navCollapse.hide();
        }));
    })();

    function attachHover(item) {
        let closeTimer;

        function openDropdown() {
            if (window.innerWidth < 992) return;
            clearTimeout(closeTimer);
            item.classList.add('show');
            const m = item.querySelector('.dropdown-menu');
            const t = item.querySelector('.dropdown-toggle');
            if (m) m.classList.add('show');
            if (t) t.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
            if (window.innerWidth < 992) return;
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                item.classList.remove('show');
                const m = item.querySelector('.dropdown-menu');
                const t = item.querySelector('.dropdown-toggle');
                if (m) m.classList.remove('show');
                if (t) t.setAttribute('aria-expanded', 'false');
            }, 80);
        }

        item.addEventListener('mouseenter', openDropdown);
        item.addEventListener('mouseleave', closeDropdown);

        const menu = item.querySelector('.dropdown-menu');
        if (menu) {
            menu.addEventListener('mouseenter', openDropdown);
            menu.addEventListener('mouseleave', closeDropdown);
        }
    }


    // ═══════════════════════════════════════════════════════════════
    // 7. CAROUSEL INTERVAL
    // ═══════════════════════════════════════════════════════════════
    document.querySelectorAll('[data-carousel-seconds]').forEach(el => {
        const v = el.getAttribute('data-carousel-seconds');
        if (v === 'Off') {
            el.removeAttribute('data-bs-ride');
            el.setAttribute('data-bs-interval', 'false');
        } else {
            el.setAttribute('data-bs-interval', String((parseInt(v, 10) || 5) * 1000));
        }
    });


    // ═══════════════════════════════════════════════════════════════
    // 8. GOOGLE CALENDAR: NORMALISE TO AGENDA VIEW
    // ═══════════════════════════════════════════════════════════════
    document.querySelectorAll('.calendar-embed').forEach(wrap => {
        const base   = wrap.getAttribute('data-base-url');
        const iframe = wrap.querySelector('iframe');
        if (!base || !iframe) return;
        try {
            const url = new URL(base);
            ['mode','AGENDA','showTitle','0','showNav','1','showDate','1',
             'showPrint','0','showTabs','0','showCalendars','0','showTz','0']
                .reduce((p, v, i, a) => { if (i % 2 === 0) p.set(v, a[i+1]); return p; }, url.searchParams);
            iframe.src = url.toString();
        } catch (_) { /* leave src alone */ }
    });

})();

/* Responsive video in post content */
(function () {
    if (typeof reframe === 'function') {
        const sources = [
            '.gh-content iframe[src*="youtube.com"]',
            '.gh-content iframe[src*="youtube-nocookie.com"]',
            '.gh-content iframe[src*="player.vimeo.com"]',
            '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
            '.gh-content object',
            '.gh-content embed',
        ];
        reframe(document.querySelectorAll(sources.join(',')));
    } else {
        console.warn('Reframe library not loaded');
    };
    if (navigator.share) {
        // Feature is supported, show the share button
    } else {
        // Fallback or hide the button
    }
})();

/* Add lightbox to gallery images */
(function () {
    if (typeof $ !== 'undefined' && $.fn.lightbox) {
        $('.kg-image-card > .kg-image[width][height], .kg-gallery-image > img').closest('a').lightbox();
    } else {
        console.warn('Lightbox2 or jQuery not loaded');
    }
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items
(function () {
    dropdown();
})(); */

/* Infinite scroll pagination */
(function () {
    if (!document.body.classList.contains('home-template') && !document.body.classList.contains('post-template')) {
        pagination();
    }
})();

/* Responsive HTML table */
(function () {
    const tables = document.querySelectorAll('.gh-content > table:not(.gist table)');

    tables.forEach(function (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-table';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
})();

/* Align Ghost Portal trigger button to Bootstrap container right edge */
(function () {
    const showPortal = document.documentElement.getAttribute('data-show-portal') !== 'false';

    if (!showPortal) {
        document.addEventListener('DOMContentLoaded', function () {
            const root = document.getElementById('ghost-portal-root');
            if (root) root.style.display = 'none';
        });
        const root = document.getElementById('ghost-portal-root');
        if (root) root.style.display = 'none';
        return;
    }

    function getContainerRightGap() {
        const container = document.querySelector('.container');
        if (!container) return 0;
        return Math.max(0, window.innerWidth - container.getBoundingClientRect().right);
    }

    function adjustPortalPosition() {
        const root = document.getElementById('ghost-portal-root');
        const iframe = document.querySelector('#ghost-portal-root iframe');
        if (!iframe) return;

        // Ensure root and iframe are visible with proper z-index
        if (root) {
            root.style.zIndex = '9999';
            root.style.display = 'block';
            root.style.visibility = 'visible';
        }
        iframe.style.zIndex = '9999';

        const w = parseFloat(iframe.style.width) || 0;
        const h = parseFloat(iframe.style.height) || 0;
        // Only reposition the button/notification state — leave the full modal alone
        if (w < 600 && h < 300) {
            iframe.style.right = getContainerRightGap() + 'px';
        }
    }

    function watchPortalRoot() {
        const root = document.getElementById('ghost-portal-root');
        if (root) {
            new MutationObserver(adjustPortalPosition)
                .observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
            adjustPortalPosition();
        } else {
            // Portal not yet injected — watch for it
            new MutationObserver(function (_, obs) {
                if (document.getElementById('ghost-portal-root')) {
                    obs.disconnect();
                    watchPortalRoot();
                }
            }).observe(document.body, { childList: true });
        }
    }

    watchPortalRoot();
    window.addEventListener('resize', adjustPortalPosition, { passive: true });
})();