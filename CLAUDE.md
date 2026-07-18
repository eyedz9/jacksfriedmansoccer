# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page static recruiting profile for Jackson Friedman (soccer goalkeeper, class of 2027), aimed at college coaches and athletic directors. No build step, no package manager, no test suite.

Repo: https://github.com/eyedz9/jacksfriedmansoccer (public)

## Running

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
```

All asset paths are relative, so both work.

## The live site is three files

- `index.html` — all markup and copy
- `assets/css/site.css` — the entire stylesheet, self-contained, token-driven
- `assets/js/site.js` — ~90 lines, no dependencies

Nothing else in `assets/` is loaded. Fonts come from Google Fonts (Barlow Condensed for display, Inter for body).

## Everything else in assets/ is dead template

`assets/` still contains the **Kester – Soccer & Sports HTML5 Template** (Reacthemes) it was originally built from: Bootstrap, jQuery, Swiper, a 28k-line compiled `main.css`, a `sass/` source tree, and hundreds of stock sport photos. **None of it is referenced.** It's retained only as an asset library. Don't wire any of it back in, and don't read `main.css` looking for current styles — the current styles are in `site.css`.

`assets/images/` has been stripped to the four files actually referenced: `fav.png`, `latimes.jpg`, `rotterdam.jpg`, and `team/jackson.jpg`. The template's stock photography (437 files, 119 MB) is gone. If you need to reference a template image, it isn't there anymore — it's only in git history before `e7b959b`.

Still present and still unused: `assets/css/` (1.4 MB), `assets/fonts/` (16 MB), `assets/sass/` (831 KB), `assets/js/vendors/` and `assets/webfonts/`. Safe to delete the same way if repo size matters again.

## Copy is verbatim and must stay that way

Every factual claim on the page — the Prep Soccer scouting quote, awards, measurables, references, contact details — is carried over word-for-word from the original site. **Do not write new copy, paraphrase claims, or invent stats.** If new content is needed, it has to come from the site owner. UI labels (nav items, button text) are the only text authored here.

Same rule for imagery: don't generate photos of Jackson. The only headshot is the real one.

## Design intent (read before changing layout)

The visitor model is a coach arriving from a cold email, on a phone, filtering rather than admiring. That drives three decisions worth preserving:

1. **Hero shows the four fields coaches filter on** — grad year, height, GPA, club — and nothing else. Resist adding more.
2. **The Prep Soccer quote sits directly under the hero**, not buried mid-page, because third-party validation is what a skeptical visitor needs early. Its strongest sentence is pulled out as `.quote-lead` at display size; the rest is supporting body text.
3. **Contact and film are reachable from anywhere** via the sticky header.

Visual system: near-black base, single red accent (`--accent: #e41b23`, inherited from the original theme), chalk-line pitch motif in the hero drawn as inline SVG (penalty area + six-yard box + arc). One deliberate off-grid element: the rotated "GOALKEEPER" wordmark on the hero's left edge.

Spacing runs on an 8pt scale via `--s1`–`--s7`. Use those tokens rather than raw rem values.

## Video gallery

`site.js` renders **thumbnail facades**, not live iframes. The page loads seven YouTube thumbnails; a player only mounts on click. This matters — the original site loaded seven live embeds on page load.

- Each `.video-stage` holds one or more `.yt-facade` buttons carrying `data-yt="<videoId>"`. Exactly one has `.active`.
- Clicking a facade appends an iframe **over** it (not replacing it) so clip-switching can tear the player down and restore the thumbnail.
- Galleries with multiple clips get `.video-btn` tabs. **Buttons pair to facades by DOM index** — add a facade and its button in matching order or the mapping silently breaks.
- Thumbnails use `hqdefault.jpg`, which is 4:3 with baked-in letterbox bars. `transform: scale(1.35)` on the img crops them off. Don't remove it without switching thumbnail sizes.

## Notes

- `index-legacy.html` is the pre-redesign template version, kept for reference. Not linked from anywhere.
- The redesign fixed a bug where Dan McCarthy's reference card displayed `dmccarthy@beachfutbolclub.com` but its `mailto:` pointed at `merush@hw.com`.
- There's a print stylesheet at the bottom of `site.css`. Coaches print these.
- Git pushes must use the `eyedz9` GitHub account (`gh auth switch -u eyedz9`); the machine's default is `AdForge-Studios`, which lacks access. Commit email must be the noreply form (`1859434+eyedz9@users.noreply.github.com`) or GitHub rejects the push on email-privacy grounds.
