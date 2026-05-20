# Design: Vendor All CDN Assets Locally

**Date:** 2026-05-15
**Status:** Completed

## Goal

Replace all externally-loaded CDN resources (CSS, JS, fonts, images) with locally-hosted copies under `assets/vendor/`, so the theme works fully offline and has no third-party dependencies at runtime.

## Assets Vendored

| Library | Version | CDN Source | Type |
|---|---|---|---|
| Bootstrap | 5.3.3 | cdn.jsdelivr.net | CSS + JS bundle |
| Bootstrap Icons | 1.11.3 | cdn.jsdelivr.net | CSS + woff/woff2 fonts |
| Font Awesome | 6.5.2 | cdnjs.cloudflare.com | CSS + webfonts (woff2, ttf) |
| Reframe.js | 3 | cdn.jsdelivr.net | JS only |
| Lightbox2 + jQuery | 2.11.4 | cdn.jsdelivr.net | CSS + JS + 4 images |

## Directory Structure

```
assets/vendor/
├── bootstrap/
│   ├── bootstrap.min.css
│   └── bootstrap.bundle.min.js
├── bootstrap-icons/
│   ├── bootstrap-icons.min.css
│   └── fonts/
│       ├── bootstrap-icons.woff
│       └── bootstrap-icons.woff2
├── font-awesome/
│   ├── css/
│   │   └── all.min.css
│   └── webfonts/
│       ├── fa-brands-400.ttf
│       ├── fa-brands-400.woff2
│       ├── fa-regular-400.ttf
│       ├── fa-regular-400.woff2
│       ├── fa-solid-900.ttf
│       ├── fa-solid-900.woff2
│       ├── fa-v4compatibility.ttf
│       └── fa-v4compatibility.woff2
├── reframe/
│   └── reframe.min.js
└── lightbox2/
    ├── css/
    │   └── lightbox.min.css
    ├── js/
    │   └── lightbox-plus-jquery.min.js
    └── images/
        ├── close.png
        ├── loading.gif
        ├── next.png
        └── prev.png
```

## Font and Image Path Strategy

Each library's CSS uses relative paths to reference its fonts/images (e.g., `../fonts/`, `../webfonts/`, `../images/`). By placing the CSS file and its assets in a subdirectory that mirrors the library's own dist structure, the relative paths remain valid without any CSS rewriting.

- Bootstrap Icons: CSS at `vendor/bootstrap-icons/bootstrap-icons.min.css`, fonts at `vendor/bootstrap-icons/fonts/`
- Font Awesome: CSS at `vendor/font-awesome/css/all.min.css`, webfonts at `vendor/font-awesome/webfonts/`
- Lightbox2: CSS at `vendor/lightbox2/css/lightbox.min.css`, images at `vendor/lightbox2/images/`

## Template Changes

In `default.hbs`, all 7 CDN `<link>` and `<script>` tags were replaced with Ghost `{{asset "vendor/..."}}` helpers:

**Before (CDN):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
...
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reframe.js@3/dist/reframe.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/css/lightbox.min.css">
<script src="https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/js/lightbox-plus-jquery.min.js"></script>
```

**After (vendored):**
```html
<link rel="stylesheet" href="{{asset "vendor/bootstrap/bootstrap.min.css"}}">
<link rel="stylesheet" href="{{asset "vendor/bootstrap-icons/bootstrap-icons.min.css"}}">
<link rel="stylesheet" href="{{asset "vendor/font-awesome/css/all.min.css"}}">
...
<script src="{{asset "vendor/bootstrap/bootstrap.bundle.min.js"}}"></script>
<script src="{{asset "vendor/reframe/reframe.min.js"}}"></script>
<link rel="stylesheet" href="{{asset "vendor/lightbox2/css/lightbox.min.css"}}">
<script src="{{asset "vendor/lightbox2/js/lightbox-plus-jquery.min.js"}}"></script>
```

## Verification Checklist

- No CDN requests appear in browser DevTools Network tab
- Icons render correctly (Bootstrap Icons, Font Awesome)
- Lightbox images display (close, next, prev buttons; loading spinner)
- Carousel and navbar collapse still function (Bootstrap JS)
- Embedded videos are responsive (Reframe.js)

## Out of Scope

- Modifying `screen.css` or `theme.js` (theme-authored files, not CDN dependencies)
- Concatenating vendor files into a single bundle
- Adding a build step or package manager for vendor updates
