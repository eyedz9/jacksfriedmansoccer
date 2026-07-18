# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page static recruiting profile site for Jackson Friedman (soccer goalkeeper, class of 2027). One page (`index.html`), a linked recruiting PDF, and the `assets/` tree. No build step required to view it, no package manager, no test suite, no git repo.

## Running / previewing

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
```

All asset paths are relative (`assets/...`), so both work.

## Origin: Kester template

`assets/` is the near-untouched **Kester – Soccer & Sports HTML5 Template** (Reacthemes). This matters:

- The vast majority of CSS/JS/images ship with the template and are **unused by `index.html`**. Don't treat orphaned files as dead code to delete or as evidence of missing pages — the site is one page by design.
- Class names (`rts-*`, `player-status-area`, `status-box`, `banner-heading`, `player-role`, `player-name`) come from the template. Reuse existing ones instead of inventing new markup patterns.

## CSS architecture

Load order in `index.html` (lines 13–16) is significant:

1. `bootstrap.min.css` — grid + utilities (Bootstrap 5, `col-lg-*`, `row`, `container`)
2. `all.min.css` — Font Awesome (icons used as `<i class="fab fa-instagram">`)
3. `variables/variable1.css` — theme accent, currently `--theme-color: #e41b23`. Six interchangeable `variableN.css` palettes exist; swapping the `<link>` reskins the site.
4. `main.css` — ~28k lines, **compiled output** of `assets/sass/main.scss`

`assets/sass/` is the real source for `main.css`. There is no npm script — the template was compiled with **Prepros** (see `assets/css/variables/prepros.config`). Since no toolchain is wired up here, prefer editing the page-local `<style>` block in `index.html` for site-specific tweaks rather than regenerating `main.css`; if you do touch Sass, note `main.css` will drift until someone recompiles.

Non-Bootstrap layout overrides also live inline as `style="..."` attributes throughout `index.html` — the site was customized in HTML, not in Sass.

## Video gallery

The one piece of bespoke JS, inline at the bottom of `index.html`. Pattern per gallery:

- A `.video-gallery` wrapper containing N `.video-container` divs (each holding a YouTube `<iframe>`) and N `.video-btn` buttons.
- Exactly one container and one button carry `active` on load.
- The script pairs buttons to containers **by DOM index**, not by id or data attribute — `data-index` is decorative. Adding a video means adding the container and the button in matching order, or the mapping silently breaks.
- `.video-container` is `display: none` unless `.active`; iframes stay in the DOM, so all embeds load on page load.

## Known gotchas

- **No `<body>` tag.** `</head>` at line 76 is followed directly by `<header>`; the closing `</body>` exists. Browsers recover, but be aware if adding anything that targets `body` structurally.
- **`assets/js/main.js` throws early.** It instantiates `new Swiper(...)` near the top, but `index.html` only loads jQuery and Bootstrap — not `swiper-bundle.min.js`. The ReferenceError aborts the rest of the file (preloader, menu, counters, WOW). This is inert today because the page uses none of it; loading Swiper or removing the call is the fix if any template behavior is ever needed.
- `assets/js/min/main.min.js` is a stale minified copy of `main.js` and is not referenced.

## Content edits

Player facts (position, height, weight, club, grad year, GPA, contact) live in `.status-item` blocks inside `.player-status-area`. The recruiting PDF `Jackson_Friedman-Goalkeeper_2027.pdf` is linked from the header icon row and lives at repo root — keep the filename stable or update the header link.
