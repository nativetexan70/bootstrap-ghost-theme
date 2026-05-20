# Paso Dems Ghost Theme

A mobile-first Bootstrap 5.3 theme for Ghost 5+, built for the [Paso Robles Democratic Club](https://pasoroblesdemocrats.org). All external dependencies are locally vendored — zero CDN requests at runtime.

## Overview

This theme layers two systems on top of Ghost's Handlebars rendering engine:

1. **CSS layer** (`assets/built/screen.css`) — static design tokens defined in `:root` CSS custom properties covering colors, typography, spacing, and component styles.
2. **JavaScript runtime override** (`assets/built/theme.js`) — reads `data-scheme` and `data-color-mode` attributes injected by Ghost from the theme's custom settings, then writes CSS custom properties directly onto `document.documentElement.style`. JS-applied values always win over CSS `:root` defaults.

Ghost renders templates server-side; `theme.js` then applies the visitor's configured scheme, dark mode, post card layout, and navigation structure at runtime in the browser.

## Features

### Layout & Navigation
- **Bootstrap 5.3 grid** — responsive 12-column layout with breakpoint-aware column sizing
- **Dropdown navigation** — uses a `"Parent-Child"` label convention in Ghost Admin; `theme.js` parses raw nav items and builds Bootstrap dropdown DOM at runtime. No nav markup is hand-coded in templates.
- **Mobile navbar collapse** — standard Bootstrap `navbar-collapse` toggler targeting `#mainNav`; links auto-close the menu on tap (handled in `theme.js`)
- **Secondary nav with social icons** — top utility bar auto-detects social platforms (Twitter/X, Facebook, Instagram, LinkedIn, GitHub, YouTube, TikTok, Threads, Bluesky, Mastodon, Pinterest) and swaps text labels for the correct icons
- **Frosted-glass header** — `.site-header` uses `color-mix()` + `backdrop-filter: blur(8px)` for a glass effect that adapts to any color scheme
- **70/30 home page grid** — post feed left (`col-lg-main`), optional sidebar right (`col-lg-side`)

### Home Page Sections
- **Hero banner** — full-bleed publication cover image with gradient fallback; toggle on/off
- **Featured post carousel** — Bootstrap carousel displaying up to 6 posts tagged `featured`; configurable auto-rotate interval (3 / 5 / 7 / 10 seconds or Off)
- **Post feed** — paginated at 6 posts per page; switchable between horizontal card and vertical grid layouts
- **Sidebar** — optional right column containing the Google Calendar block and newsletter CTA

### Post Cards
- **Horizontal layout (default)** — image left, content right using Bootstrap `row g-0`. Image column shrinks from 33% → 25% of card width as viewport widens; row flex ensures the image fills card height at all breakpoints.
- **Vertical grid layout** — `theme.js` switches to a Bootstrap row/col grid when `post_card_layout === "Vertical grid"`, adding classes to `.post-feed-grid` dynamically
- **Lazy fade-in** — cards animate in on scroll using an `IntersectionObserver`

### Color & Typography
- **6 color scheme presets**: Warm Parchment, Slate & Stone, Midnight Ink, Forest & Moss, Graphite Studio, Ocean Depth
- **Light / Dark / Auto mode** — dark mode is computed in JS (`applyScheme()`), not via a CSS media query alone. Dark-mode overrides are injected as a `<style id="theme-dark-overrides">` tag. Auto follows the visitor's OS preference.
- **4 type scales**: Compact, Standard, Comfortable, Editorial — applied inline in `default.hbs` via `{{#match}}` helpers

### Ghost Integration
- **Ghost Portal** — floating signup button is optional (toggle off hides the small iframe; the full-screen modal still opens from any `data-portal` CTA button). Implemented by setting `visibility:hidden` on the small iframe state while allowing the full-screen modal through.
- **Member gating** — `data-portal="signup|signin|account"` attributes on links/buttons are intercepted by Ghost Portal automatically
- **Newsletter CTA** — sidebar signup block with configurable heading, description, disclaimer, button text, and action (Portal free / Portal paid / Custom link)
- **Reading progress bar** — thin accent bar at the top of single post pages
- **Ghost image sizing** — uses `{{img_url feature_image size="m"}}` with sizes defined in `package.json → config.image_sizes` (xxs → xl)

### Koenig Card Support
Full styling for Ghost's built-in content cards:
- **Bookmark cards** — flex row/column layout on `.kg-bookmark-container` (the anchor element). On mobile (≤767px), stacks to column layout.
- **Gallery cards** — responsive image grid with reduced `min-width` on mobile
- **Button cards** (`kg-btn`) — tap-target sized on touch devices
- **Toggle cards** — `overflow-wrap` applied for long content handling
- **Horizontal rules** — styled at 80% width with body-text color for visual prominence
- **Hover states** — wrapped in `@media (hover: hover)` to prevent sticky hover states on touch devices

### Google Calendar Sidebar
Embeds a Google Calendar agenda view. Configure by providing the Calendar ID in Ghost Admin settings.

### Vendored Assets (Zero CDN)
All dependencies are locally hosted in `assets/vendor/`:

| Library | Version |
|---|---|
| Bootstrap CSS + JS bundle | 5.3.3 |
| Bootstrap Icons CSS + WOFF fonts | 1.11.3 |
| Font Awesome CSS + webfonts (TTF, WOFF2) | 6.5.2 |
| Reframe.js (responsive video) | 3 |
| Lightbox2 CSS + JS (bundled jQuery) + images | 2.11.4 |

## Template Structure

```
default.hbs          — master layout: <head>, site header, footer shell
index.hbs            — home page + collection feeds
post.hbs             — single post
page.hbs             — static page
tag.hbs              — tag archive
author.hbs           — author archive
partials/
  site-header.hbs    — navbar shell (nav DOM built by theme.js at runtime)
  post-card.hbs      — horizontal/vertical post card
  sidebar.hbs        — calendar + newsletter CTA blocks
  ...
assets/
  built/
    screen.css       — hand-authored CSS (not a build artifact)
    theme.js         — hand-authored JS (not a build artifact)
  vendor/            — all vendored libraries
```

## Ghost Admin Settings

All settings live under **Ghost Admin → Design → Customize**.

### Site-wide

| Setting | Type | Default | Description |
|---|---|---|---|
| Color scheme | Select | Warm Parchment | Choose from 6 palette presets |
| Color mode | Select | Light | Light / Dark / Auto (follows OS) |
| Type scale | Select | Standard | Compact / Standard / Comfortable / Editorial |
| Post card layout | Select | Horizontal | Horizontal cards or Vertical grid |
| Show sidebar | Boolean | On | Right-hand sidebar on home page |
| Show calendar | Boolean | On | Google Calendar agenda in sidebar |
| Calendar source URL | Text | US Holidays | Google Calendar ID (without the full URL) |
| Show Ghost portal | Boolean | On | Floating signup button (modal CTA still works when Off) |
| Show powered by Ghost | Boolean | On | Ghost attribution in footer |

### Homepage

| Setting | Type | Default | Description |
|---|---|---|---|
| Show publication cover | Boolean | On | Full-bleed hero image/banner |
| Show featured section | Boolean | On | Featured post carousel |
| Carousel interval | Select | 5 | Auto-rotate speed in seconds (3 / 5 / 7 / 10 / Off) |

### Newsletter

| Setting | Type | Default | Description |
|---|---|---|---|
| Newsletter CTA heading | Text | Join the list | Sidebar block heading |
| Newsletter CTA description | Text | New posts, in your inbox — most Tuesdays. | Sidebar block body text |
| Newsletter CTA disclaimer | Text | No spam, no tracking. Unsubscribe in one click. | Small print below the button |
| Newsletter CTA button text | Text | Subscribe | Button label |
| Newsletter CTA button action | Select | Portal signup – free | Portal free / Portal paid / Custom link |
| Newsletter CTA button URL | Text | (empty) | URL used when Custom link is selected (opens in new tab) |

## Navigation Setup

Add navigation items in **Ghost Admin → Navigation**.

**Dropdown menus:** Use the `"Parent-Child"` label format (hyphen-separated). `theme.js` reads raw `data-nav-label` / `data-nav-url` attributes from `.nav-item-raw` elements and builds Bootstrap dropdown DOM at runtime. Example: a label of `"About-Mission"` becomes a child item "Mission" nested under a "About" dropdown.

**Secondary navigation:** Items in the secondary nav bar support social icon auto-detection. Add a social profile URL and the theme will replace the label with the correct icon for: Twitter/X, Facebook, Instagram, LinkedIn, GitHub, YouTube, TikTok, Threads, Bluesky, Mastodon, and Pinterest.

## Development

**Prerequisites:** Ghost 5+, Node.js

**Validate the theme:**
```bash
npm install -g gscan
gscan .
```

**Package for upload:**
```bash
npm run zip
# produces bootstrap-ghost.zip
# upload via Ghost Admin → Settings → Design → Change theme
```

**Local dev server:** `http://localhost:2368`
Ghost auto-reloads CSS/JS on save. Template (`.hbs`) changes require restarting Ghost or re-activating the theme in Ghost Admin.

**No build step.** `assets/built/screen.css` and `assets/built/theme.js` are hand-authored source files — not build artifacts. Edit them directly.

## Extending the Theme

**Adding a color scheme:** Add an entry to the `SCHEMES` object in `theme.js` and add the option name to `package.json → config.custom.color_scheme.options`.

**Adjusting the header:** `.site-header` uses `color-mix(in srgb, var(--bs-body-bg) 88%, var(--bs-body-color) 12%)` at `opacity: 0.92`. Adjust the `12%` body-color mix ratio and opacity to tune contrast.

**Image sizes:** Defined in `package.json → config.image_sizes`. Reference in templates with `{{img_url feature_image size="m"}}`.

## License

MIT
