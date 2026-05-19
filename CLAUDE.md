# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Workflow

**Validate the theme:**
```bash
npm install -g gscan
gscan .
```

**Package for upload:**
```bash
npm run zip
# produces bootstrap-ghost.zip — upload via Ghost Admin → Settings → Design → Change theme
```

**Local Ghost dev server:** Ghost runs at `http://localhost:2368`. After editing theme files, Ghost auto-reloads CSS/JS. For template (`.hbs`) changes, you may need to restart Ghost or re-activate the theme.

**No build step.** `assets/built/screen.css` and `assets/built/theme.js` are hand-authored source files — not build artifacts. Edit them directly.

## Architecture Overview

This is a Ghost 5+ Handlebars theme built on Bootstrap 5.3. The rendering pipeline is:

```
Ghost CMS → Handlebars templates → Browser → theme.js applies runtime overrides
```

**Template hierarchy:**
- `default.hbs` — master layout (head, header, footer shell)
- `index.hbs` — home + collection feeds (inherits `default` via `{{!< default}}`)
- `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs` — page-type templates
- `partials/` — reusable Handlebars partials

**Two-layer theming system:**

1. **CSS layer** (`assets/built/screen.css`): Static design tokens defined in `:root`. Provides fallback values for colors, typography, spacing.

2. **JavaScript runtime override** (`assets/built/theme.js`): Reads `data-scheme` and `data-color-mode` attributes from `<html>` (set by Ghost from `@custom` settings in `default.hbs`) and writes CSS custom properties directly onto `document.documentElement.style`. This means JS-applied values always win over CSS `:root` defaults.

**Ghost Custom Settings** (configured in Ghost Admin → Design → Customize, defined in `package.json` under `config.custom`):
- `color_scheme` — selects a color palette preset from `SCHEMES` object in `theme.js`
- `color_mode` — Light / Dark / Auto (dark mode is computed in JS, not via `prefers-color-scheme` media query alone)
- `type_scale` — font size tokens applied inline in `default.hbs` via `{{#match}}` helpers
- `post_card_layout` — "Horizontal" (default) or "Vertical grid"; layout switching is handled entirely in JS
- `show_sidebar`, `show_calendar`, `show_featured_section`, `show_publication_cover` — boolean toggles
- `show_ghost_portal` — hides the floating Ghost Portal button (bottom-right corner). **Important:** disabling this only hides the floating trigger; the full signup modal still opens when visitors click any `data-portal` CTA button. Implemented in `theme.js` by setting `visibility:hidden` on the small iframe state while allowing the full-screen modal through.

**Navigation system:** Ghost Admin navigation items use a `"Parent-Child"` label convention (dash-separated). `theme.js` section 6 (`buildPrimaryNav`) parses raw `data-nav-label`/`data-nav-url` attributes from `.nav-item-raw` elements and builds Bootstrap dropdown DOM at runtime. Do not add nav markup to `site-header.hbs` manually — add items through Ghost Admin navigation.

**Mobile navigation:** Uses Bootstrap `navbar-collapse` (standard collapsible navbar), not the offcanvas drawer. The toggler targets `#mainNav` with `data-bs-toggle="collapse"`. Mobile nav closes automatically after clicking a link (handled in `theme.js`).

**Vendored assets** (locally hosted in `assets/vendor/`):
- Bootstrap 5.3.3 CSS + JS bundle
- Bootstrap Icons 1.11.3 CSS + WOFF fonts
- Font Awesome 6.5.2 CSS + webfont files (TTF, WOFF2)
- Reframe.js 3 (responsive video)
- Lightbox2 2.11.4 CSS + JS (bundled jQuery) + 4 image assets

All external dependencies are locally hosted — **zero CDN requests at runtime**. No third-party dependencies.

**Home page layout:**
- Optional hero (cover image or gradient fallback)
- Featured carousel (Bootstrap carousel, up to 6 posts tagged `featured`)
- 70/30 grid: post feed left, optional sidebar right (`col-lg-main` / `col-lg-side` classes in CSS)

## Key Conventions

**Color tokens:** All colors flow through CSS custom properties. To add a new scheme, add an entry to the `SCHEMES` object in `theme.js` and add the option to `package.json → config.custom.color_scheme.options`.

**Dark mode:** Applied by JS (`applyScheme()` in `theme.js`), not by a CSS class or media query alone. Computed dark-mode overrides are injected as a `<style id="theme-dark-overrides">` tag.

**Post cards:** `partials/post-card.hbs` renders horizontal cards (image left, content right) using Bootstrap's `row g-0` grid. The image column (`col-4 col-sm-3`) shrinks from 33% to 25% of card width as viewport widens; the row's flex layout ensures the image fills the card height at all breakpoints. `theme.js` switches to vertical grid layout when `@custom.post_card_layout === "Vertical grid"`, adding Bootstrap row/col classes to `.post-feed-grid` dynamically.

**Ghost image sizing:** Use `{{img_url feature_image size="m"}}` etc., matching the sizes defined in `package.json → config.image_sizes`.

**Member gating:** Use `data-portal="signup|signin|account"` attributes on links/buttons — Ghost Portal intercepts these automatically.

**Koenig bookmark card layout:** Ghost renders the bookmark card as `figure.kg-bookmark-card > a.kg-bookmark-container > (div.kg-bookmark-content + div.kg-bookmark-thumbnail)`. The flex layout (row/column) must be set on `.kg-bookmark-container` — not `.kg-bookmark-card`. The card `<figure>` only has one flex child (the container), so flex-direction on the card has no effect on content/thumbnail layout.

**Koenig card mobile overrides (`@media (max-width: 767px)`):** The responsive type block in `screen.css` handles heading scale-down (`h2`, `h3`), gallery image min-width reduction, button tap-target sizing (`kg-btn`), and bookmark card column stacking (`kg-bookmark-container`). Touch hover states (e.g. `kg-bookmark-card:hover`) are wrapped in `@media (hover: hover)` to prevent sticky states on touch devices.

**Site header background:** `.site-header` uses `color-mix(in srgb, var(--bs-body-bg) 88%, var(--bs-body-color) 12%)` at `opacity: 0.92` with `backdrop-filter: blur(8px)` for a frosted-glass effect slightly darker than the page background. Adjust the `12%` body-color mix and opacity values to tune contrast.
