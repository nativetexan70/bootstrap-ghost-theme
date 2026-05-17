# Vendor CDN Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Download all externally-loaded CDN resources into `assets/vendor/` and update `default.hbs` to reference them locally.

**Architecture:** Each library gets its own subdirectory under `assets/vendor/`. Font/image subdirectory names mirror the CDN dist structure so relative paths inside vendor CSS files remain valid without any CSS rewriting. `default.hbs` is updated last, after all assets are confirmed present.

**Tech Stack:** curl, Ghost Handlebars `{{asset}}` helper

---

## Directory Layout Reference

```
assets/vendor/
├── bootstrap/
│   ├── bootstrap.min.css
│   └── bootstrap.bundle.min.js
├── bootstrap-icons/
│   ├── bootstrap-icons.min.css     ← refs fonts/ (same level)
│   └── fonts/
│       ├── bootstrap-icons.woff
│       └── bootstrap-icons.woff2
├── font-awesome/
│   ├── css/
│   │   └── all.min.css             ← refs ../webfonts/
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
    │   └── lightbox.min.css        ← refs ../images/
    ├── js/
    │   └── lightbox-plus-jquery.min.js
    └── images/
        ├── close.png
        ├── loading.gif
        ├── next.png
        └── prev.png
```

---

### Task 1: Create vendor directory structure

**Files:**
- Create: `assets/vendor/` tree

- [ ] **Step 1: Create all directories**

```bash
mkdir -p assets/vendor/bootstrap
mkdir -p assets/vendor/bootstrap-icons/fonts
mkdir -p assets/vendor/font-awesome/css
mkdir -p assets/vendor/font-awesome/webfonts
mkdir -p assets/vendor/reframe
mkdir -p assets/vendor/lightbox2/css
mkdir -p assets/vendor/lightbox2/js
mkdir -p assets/vendor/lightbox2/images
```

- [ ] **Step 2: Verify structure**

```bash
find assets/vendor -type d | sort
```

Expected output:
```
assets/vendor
assets/vendor/bootstrap
assets/vendor/bootstrap-icons
assets/vendor/bootstrap-icons/fonts
assets/vendor/font-awesome
assets/vendor/font-awesome/css
assets/vendor/font-awesome/webfonts
assets/vendor/lightbox2
assets/vendor/lightbox2/css
assets/vendor/lightbox2/images
assets/vendor/lightbox2/js
assets/vendor/reframe
```

---

### Task 2: Download Bootstrap CSS and JS

**Files:**
- Create: `assets/vendor/bootstrap/bootstrap.min.css`
- Create: `assets/vendor/bootstrap/bootstrap.bundle.min.js`

- [ ] **Step 1: Download Bootstrap CSS**

```bash
curl -L -o assets/vendor/bootstrap/bootstrap.min.css \
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
```

- [ ] **Step 2: Download Bootstrap JS bundle**

```bash
curl -L -o assets/vendor/bootstrap/bootstrap.bundle.min.js \
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
```

- [ ] **Step 3: Verify files exist and have non-zero size**

```bash
ls -lh assets/vendor/bootstrap/
```

Expected: both files present, CSS ~200KB, JS ~75KB.

---

### Task 3: Download Bootstrap Icons CSS and fonts

**Files:**
- Create: `assets/vendor/bootstrap-icons/bootstrap-icons.min.css`
- Create: `assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff`
- Create: `assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2`

- [ ] **Step 1: Download Bootstrap Icons CSS**

```bash
curl -L -o assets/vendor/bootstrap-icons/bootstrap-icons.min.css \
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
```

- [ ] **Step 2: Download Bootstrap Icons fonts**

```bash
curl -L -o assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff \
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff"

curl -L -o assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2 \
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2"
```

- [ ] **Step 3: Confirm the CSS font-face path matches the local structure**

```bash
grep "url(" assets/vendor/bootstrap-icons/bootstrap-icons.min.css | head -3
```

Expected: paths contain `fonts/bootstrap-icons.woff` (relative, no `../`), confirming they resolve correctly when CSS is at `bootstrap-icons/bootstrap-icons.min.css`.

- [ ] **Step 4: Verify all three files exist**

```bash
ls -lh assets/vendor/bootstrap-icons/
ls -lh assets/vendor/bootstrap-icons/fonts/
```

---

### Task 4: Download Font Awesome CSS and webfonts

**Files:**
- Create: `assets/vendor/font-awesome/css/all.min.css`
- Create: `assets/vendor/font-awesome/webfonts/` (8 files)

- [ ] **Step 1: Download Font Awesome CSS**

```bash
curl -L -o assets/vendor/font-awesome/css/all.min.css \
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
```

- [ ] **Step 2: Confirm CSS uses `../webfonts/` relative path**

```bash
grep "url(" assets/vendor/font-awesome/css/all.min.css | head -3
```

Expected: paths like `../webfonts/fa-brands-400.woff2`. This confirms `webfonts/` must sit one level up from `css/` — which is exactly our `font-awesome/webfonts/` directory.

- [ ] **Step 3: Download all 8 webfont files**

```bash
BASE="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts"
DEST="assets/vendor/font-awesome/webfonts"

for f in \
  fa-brands-400.ttf \
  fa-brands-400.woff2 \
  fa-regular-400.ttf \
  fa-regular-400.woff2 \
  fa-solid-900.ttf \
  fa-solid-900.woff2 \
  fa-v4compatibility.ttf \
  fa-v4compatibility.woff2
do
  curl -L -o "$DEST/$f" "$BASE/$f"
done
```

- [ ] **Step 4: Verify all 8 files exist**

```bash
ls -lh assets/vendor/font-awesome/webfonts/
```

Expected: 8 files, each non-zero size.

---

### Task 5: Download Reframe.js

**Files:**
- Create: `assets/vendor/reframe/reframe.min.js`

- [ ] **Step 1: Download Reframe.js**

```bash
curl -L -o assets/vendor/reframe/reframe.min.js \
  "https://cdn.jsdelivr.net/npm/reframe.js@3/dist/reframe.min.js"
```

- [ ] **Step 2: Verify file exists and exports `reframe`**

```bash
ls -lh assets/vendor/reframe/reframe.min.js
grep -o "reframe" assets/vendor/reframe/reframe.min.js | head -1
```

Expected: file ~2KB, grep returns `reframe`.

---

### Task 6: Download Lightbox2 CSS, JS, and images

**Files:**
- Create: `assets/vendor/lightbox2/css/lightbox.min.css`
- Create: `assets/vendor/lightbox2/js/lightbox-plus-jquery.min.js`
- Create: `assets/vendor/lightbox2/images/close.png`
- Create: `assets/vendor/lightbox2/images/loading.gif`
- Create: `assets/vendor/lightbox2/images/next.png`
- Create: `assets/vendor/lightbox2/images/prev.png`

- [ ] **Step 1: Download Lightbox2 CSS**

```bash
curl -L -o assets/vendor/lightbox2/css/lightbox.min.css \
  "https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/css/lightbox.min.css"
```

- [ ] **Step 2: Confirm CSS uses `../images/` relative path**

```bash
grep "url(" assets/vendor/lightbox2/css/lightbox.min.css
```

Expected: paths like `../images/close.png`. This confirms `images/` must sit one level up from `css/` — which is `lightbox2/images/`.

- [ ] **Step 3: Download Lightbox2 JS**

```bash
curl -L -o assets/vendor/lightbox2/js/lightbox-plus-jquery.min.js \
  "https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/js/lightbox-plus-jquery.min.js"
```

- [ ] **Step 4: Download Lightbox2 images**

```bash
BASE="https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/images"
DEST="assets/vendor/lightbox2/images"

for f in close.png loading.gif next.png prev.png; do
  curl -L -o "$DEST/$f" "$BASE/$f"
done
```

- [ ] **Step 5: Verify all files present**

```bash
ls -lh assets/vendor/lightbox2/css/
ls -lh assets/vendor/lightbox2/js/
ls -lh assets/vendor/lightbox2/images/
```

Expected: 1 CSS file, 1 JS file (~300KB with jQuery), 4 images.

---

### Task 7: Update default.hbs to use vendor paths

**Files:**
- Modify: `default.hbs`

- [ ] **Step 1: Replace the three CDN `<link>` tags in `<head>` with vendored paths**

In `default.hbs`, replace:
```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
```

With:
```html
    <link rel="stylesheet" href="{{asset "vendor/bootstrap/bootstrap.min.css"}}">
    <link rel="stylesheet" href="{{asset "vendor/bootstrap-icons/bootstrap-icons.min.css"}}">
    <link rel="stylesheet" href="{{asset "vendor/font-awesome/css/all.min.css"}}">
```

- [ ] **Step 2: Replace the four CDN `<script>`/`<link>` tags before `{{ghost_foot}}` with vendored paths**

In `default.hbs`, replace:
```html
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/reframe.js@3/dist/reframe.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/css/lightbox.min.css">
    <script src="https://cdn.jsdelivr.net/npm/lightbox2@2.11.4/dist/js/lightbox-plus-jquery.min.js"></script>
```

With:
```html
    <script src="{{asset "vendor/bootstrap/bootstrap.bundle.min.js"}}"></script>
    <script src="{{asset "vendor/reframe/reframe.min.js"}}"></script>
    <link rel="stylesheet" href="{{asset "vendor/lightbox2/css/lightbox.min.css"}}">
    <script src="{{asset "vendor/lightbox2/js/lightbox-plus-jquery.min.js"}}"></script>
```

- [ ] **Step 3: Confirm no CDN URLs remain**

```bash
grep -n "cdn.jsdelivr.net\|cdnjs.cloudflare.com" default.hbs
```

Expected: no output.

---

### Task 8: Verify in browser

- [ ] **Step 1: Open DevTools Network tab and hard-reload the site**

Navigate to `https://localhost:2368`, open DevTools → Network tab, disable cache, hard reload (Ctrl+Shift+R).

- [ ] **Step 2: Confirm zero CDN requests**

Filter Network requests by domain. There should be no requests to `cdn.jsdelivr.net` or `cdnjs.cloudflare.com`.

- [ ] **Step 3: Confirm icons render**

Check that Bootstrap Icons (e.g., the hamburger menu `bi-list`) and Font Awesome icons (e.g., social icons in secondary nav) are visible and not showing blank squares.

- [ ] **Step 4: Confirm Bootstrap JS works**

On mobile or narrow viewport, tap the hamburger — the offcanvas menu should open and close correctly.

- [ ] **Step 5: Confirm Lightbox2 images load**

Check DevTools Network for requests to `vendor/lightbox2/images/` — these load on-demand when Lightbox opens. If you have a post with a gallery image, click it to trigger Lightbox and confirm the close/arrow buttons render.
