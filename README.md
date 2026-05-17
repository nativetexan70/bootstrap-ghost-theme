# Paso Dems Ghost Theme

A mobile-first Bootstrap 5.3 theme for Ghost 5+, built for the [Paso Robles Democratic Club](https://pasoroblesdemocrats.org).

## Features

- **Bootstrap 5.3** — responsive grid, navbar-collapse mobile nav, carousel, dropdowns
- **Zero CDN dependencies** — Bootstrap, Bootstrap Icons, Font Awesome, Reframe.js, and Lightbox2 are all vendored in `assets/vendor/`
- **Configurable color schemes** — 6 presets (Warm Parchment, Slate & Stone, Midnight Ink, Forest & Moss, Graphite Studio, Ocean Depth) with Light / Dark / Auto mode
- **Ghost Portal integration** — floating signup button optional; CTA signup buttons always open the portal modal
- **Featured post carousel** — up to 6 featured posts on the home page
- **Google Calendar sidebar** — agenda view embedded via configurable calendar ID
- **Newsletter CTA** — sidebar signup block with configurable heading, description, and button
- **Reading progress bar** — thin accent bar on single post pages
- **Lazy fade-in** — post cards animate in on scroll

## Development

**Prerequisites:** Ghost 5+, Node.js (for `gscan` and `zip`)

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

**No build step.** `assets/built/screen.css` and `assets/built/theme.js` are hand-authored — edit directly.

## Ghost Admin Settings

All settings live under **Ghost Admin → Design → Customize**.

| Setting | Group | Description |
|---|---|---|
| Color scheme | Site-wide | 6 palette presets |
| Color mode | Site-wide | Light / Dark / Auto |
| Type scale | Site-wide | Compact / Standard / Comfortable / Editorial |
| Post card layout | Site-wide | Horizontal (default) or Vertical grid |
| Show sidebar | Site-wide | Right-hand sidebar on home page |
| Show calendar | Site-wide | Google Calendar agenda in sidebar |
| Calendar source URL | Site-wide | Google Calendar ID |
| Show Ghost portal | Site-wide | Floating signup button (modal CTA still works when off) |
| Show publication cover | Homepage | Full-bleed hero image |
| Show featured section | Homepage | Featured post carousel |
| Carousel interval | Homepage | Auto-rotate speed |
| Newsletter CTA heading | Newsletter | Sidebar block heading |
| Newsletter CTA description | Newsletter | Sidebar block body text |
| Newsletter CTA disclaimer | Newsletter | Small print below button |
| Newsletter CTA button text | Newsletter | Sidebar button label |
| Newsletter CTA button action | Newsletter | Portal free / Portal paid / Custom link |
| Newsletter CTA button URL | Newsletter | URL for Custom link option |

## Navigation

Add items in Ghost Admin → Navigation. Use `"Parent-Child"` label format (hyphen-separated) to create dropdown menus — `theme.js` builds the Bootstrap dropdown DOM at runtime.

Secondary navigation (top utility bar) supports social icon auto-detection for Twitter/X, Facebook, Instagram, LinkedIn, GitHub, YouTube, TikTok, Threads, Bluesky, Mastodon, and Pinterest.

## License

MIT
