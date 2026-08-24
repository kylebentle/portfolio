# Design System

Reference doc for the visual design, components, and page-building conventions used across the portfolio. Everything here lives in [css/style.css](css/style.css) — this file explains *what's there and why*, in plain language, so both Kyle and future Claude sessions stay consistent.

## Product & principles

Kyle Bentle's UX/product design portfolio — a static site aimed at hiring managers and design peers evaluating him for mid-level UX/product design roles. It needs to read as credible and polished without a design agency budget behind it.

Design principles, based on the site as built:

- **Restrained, not decorative.** One accent color, mostly neutral grays/near-black/white. Color is used to direct attention (labels, links), not to add visual interest for its own sake.
- **Serif for moments, sans for reading.** Bree Serif appears only on big titles — it signals "this is a heading," never body copy.
- **Generous whitespace over dense layouts.** Narrow 720px content column, large section spacing (`--spacing-section`). The work should breathe.
- **Content leads, chrome stays quiet.** Buttons, labels, and dividers are deliberately low-key (thin borders, uppercase small text) so case study writing and images stay the focal point.
- **Consistent skeleton, page to page.** Every page reuses the same nav/hero/page-wrap/footer shape rather than one-off layouts, so the site feels like one coherent product rather than a stitched-together set of pages.

## Colors

Defined as CSS variables in `:root` at the top of style.css. Change a value there and it updates everywhere.

| Variable | Value | Used for |
|---|---|---|
| `--color-bg` | white | Page background |
| `--color-text` | near-black | Body text, headings, and — doubling as a background color — the dark hero/nav sections |
| `--color-muted` | dark blue-gray | Secondary text (dates, captions, nav links) |
| `--color-faint` | rust/brown | Small labels and eyebrows (section labels, card labels) |
| `--color-border` | light gray | Dividers, placeholder boxes |
| `--color-accent` | dark slate | CTA links, secondary button outline |
| `--color-surface-dark` | near-black, fixed | Background fill for the "always dark" sections (homepage hero, nav-on-homepage, `.cs-hero-band--dark`, skip-link). Doesn't change between light and dark mode — see [Dark mode](#dark-mode). |
| `--color-on-dark`, `--color-on-dark-dim`, `--color-on-dark-faint` | white at full/75%/60% opacity | Text sitting on `--color-surface-dark`. Fixed in both themes, since that surface itself is fixed. |

`--color-surface-dark` used to just be `--color-text` reused as a background — that broke once `--color-text` needed to flip to a light color for dark mode, so the two jobs were split into separate variables.

## Dark mode

Every page that shares this design system (all pages except the two standalone `experiments/*` tools, which have their own bespoke styling) supports dark mode. Two ways to end up there:

1. **Automatic** — if the visitor's OS/browser is set to dark, and they haven't chosen a theme on the site, it follows via `@media (prefers-color-scheme: dark)`.
2. **Explicit** — the toggle switch in the footer sets `data-theme="dark"` or `data-theme="light"` on `<html>`, which overrides the system setting either way. The choice is saved in `localStorage` and remembered on the next visit.

| Variable | Light | Dark |
|---|---|---|
| `--color-bg` | `#ffffff` | `#17181c` |
| `--color-text` | `#0c0d12` | `#f2f3f5` |
| `--color-muted` | `#364051` | `#a8b0bd` |
| `--color-faint` | `#9a4a28` | `#eda07d` |
| `--color-border` | `#bfc0c0` | `#3a3d45` |
| `--color-accent` | `#2d3142` | `#b8bfe0` |

`--color-surface-dark` and the `--color-on-dark*` variables are **not** in this table — they're fixed and identical in both themes (see [Colors](#colors)). That's what keeps the homepage hero and dark hero bands looking the same regardless of theme, per Kyle's original direction that those "should just track."

Every dark value above was checked against WCAG AA (4.5:1 for normal text) using the actual background it appears on — several (like `--color-faint`) needed to land brighter than a naive "invert the light color" would give, specifically because label text sometimes sits on `--color-border` (e.g. `.placeholder-label` inside `.cs-image-placeholder`), not just on `--color-bg`. When adding a new color, check contrast against *every* background it might render on, not just the page background.

**Files involved:**
- `css/style.css` — the token overrides above, plus `.theme-toggle` styling.
- `js/theme.js` — shared across every page (same pattern as `css/style.css`). Reads/writes the saved choice, applies it, and keeps the toggle's icon in sync if the visitor's system theme changes mid-visit.
- Every page's `<head>` has a small inline `<script>` (not in the shared file, since it has to run before anything paints) that applies a saved theme immediately, so there's no flash of the wrong color while the page loads.

**A rule this created:** any component that sets a background using one token and text using another must make sure that pairing still works if only one of them changes color in dark mode. This bit us once already — `.btn--secondary:hover` used to hardcode white hover text against `var(--color-accent)`, which only worked because accent was always dark. Now it uses `var(--color-bg)` instead, so it stays readable against whichever accent color is active. Check for this pattern before introducing new color pairings.

## Type

Two fonts, used by purpose rather than a numeric scale:

- **Display / Bree Serif** (`--font-display`) — page and section titles only: `.hero__title` (28px inner pages, 46px case study heroes, 60px homepage), `.case-studies-intro__title` (28px), `.cs-sub-heading` (24px, process sub-headings). Single-weight font (400) — never bold it. Never used for body copy or labels.
- **Body / Roboto** (`--font-base`) — everything else: paragraphs, labels, nav, buttons, metadata.
- **Body text** (`--size-body`, 16px) — default paragraph size, applied at the `body` level.
- **Small / label text** (`--size-small`, 13px) — nav links, section labels, card labels, captions, metadata, button text. Almost always paired with uppercase + letter-spacing when it's a label (e.g. `.section__label`, `.nav__link`).
- Beyond those two shared variables, sizes are hardcoded per component rather than pulled from a scale — that's intentional for a site this size, but keep new sizes close to the existing ones (22px card titles, 28px headings, 36px stat numbers) rather than introducing new one-off values.

## Spacing & layout

- `--max-width` (720px) — the standard content column width, applied via `.page-wrap`.
- `--spacing-section` (4rem) — vertical rhythm between major sections (hero padding, `.section` top margin, footer top margin).
- `.page-wrap` centers content and adds side padding; use it to wrap the narrow content on every page.
- `.cs-wide-wrap` (960px) is a wider variant used only inside case study hero bands.
- **Breakpoints**: 480px (phones — most components stack here) and 700px (used once, for the homepage hero photo/text layout). There's no tablet-specific breakpoint; the two-breakpoint approach keeps things simple.

## Naming convention (BEM-style)

Classes follow `block`, `block__element`, `block--modifier`:

- `.case-study-card` is a block; `.case-study-card__title` is an element inside it; `.btn--secondary` is a modifier on the (implicit) `.btn` block.
- Page-specific prefixes group related classes: `cs-*` for case-study-page-only styles (`.cs-hero-band`, `.cs-process-step`, `.cs-meta`, `.cs-stat-grid`, `.cs-figure`, `.cs-reflection`), `home-hero__*` for the homepage-only hero.
- Utility/state classes don't follow the pattern on purpose: `.page-home`, `.page-wrap`, `.placeholder-thumb`.

When adding new components, follow this same pattern — pick a short block name, prefix elements with `block__`, and add `--modifier` suffixes for variants rather than new standalone classes.

## Page skeleton

Every page follows the same shape:

```html
<body> (or <body class="page-home"> on the homepage)
  <a class="skip-link">...</a>

  <nav class="nav">...</nav>

  <main id="main-content">
    <!-- hero: .hero inside .cs-hero-band, or .home-hero on the homepage -->
    <div class="page-wrap">
      <!-- page content: .section blocks, .case-study-card articles, etc. -->
    </div>
  </main>

  <footer class="page-wrap">
    <div class="footer">...</div>
  </footer>
</body>
```

- The nav has three links (Home, Work/Case Studies, Resume) with `nav__link--active` marking the current page. The homepage nav floats over the hero (`.page-home .nav`) instead of sitting in normal flow.
- Every `<head>` repeats the same block: Google Analytics tag, charset/viewport meta, the small inline dark-mode anti-flash script (see [Dark mode](#dark-mode)), Google Fonts preconnect + stylesheet link, `style.css`, and favicon links. New pages should copy this verbatim.
- Unlisted pages (like `/experiments/`) add `<meta name="robots" content="noindex, nofollow">` and skip the active nav state since they're not in the main nav.
- The footer includes the theme toggle button, and every page loads `<script src="/js/theme.js"></script>` right before `</body>`.

## Components

**Hero** (`.hero`) — title + body text. Sits inside either `.cs-hero-band` (light) or `.cs-hero-band--dark` (dark, no image needed) on inner pages, or as the full-viewport `.home-hero` on the homepage only.

**Section** (`.section`) — a content block with a small uppercase `.section__label` and `.section__body`, separated from the next section by a bottom border. The default vertical building block for page content.

**Cards** (`.case-study-card`) — image + text side by side (45%/rest split), used for both the case study listing and the experiments listing. Stacks vertically under 480px. A smaller variant (`.cs-next .case-study-card`) is used for the "next case study" teaser at the bottom of a case study page.

**Buttons/links** — three levels of visual weight:
- `.cta-link` — plain text link with an underline, lowest emphasis (used inside cards).
- `.btn--secondary` — outlined button, medium emphasis (used for "View case studies →" style links on the homepage).
- No filled/primary button currently exists in the system.

**Case study page pieces** (all `cs-*`) — `.cs-meta` (Role/Status/Client row), `.cs-stat-grid` (big impact numbers), `.cs-process-step` (alternating text/image), `.cs-figure` (image + caption), `.cs-reflection` (shaded callout box), `.cs-image-placeholder` (gray box standing in for real screenshots).

**Placeholder thumbnail** (`.placeholder-thumb`) — 16:9 gray box used on the experiments page until real screenshots are ready. Swap for `<img class="case-study-card__thumb">` when available.

**Email action** (`.email-action`) — mailto link + copy-to-clipboard button, obfuscated mailto href, small JS `copyEmail()` function in `index.html` handles the clipboard copy and checkmark feedback.

**Theme toggle** (`.theme-toggle`) — small circular button in the footer, sun icon in light mode, moon icon in dark mode. Icon swap is driven by the button's own `aria-pressed` attribute (kept in sync by `js/theme.js`), not by the page's `data-theme` attribute directly — that's deliberate, since `data-theme` may be unset when the page is just following the system setting rather than an explicit choice. See [Dark mode](#dark-mode).

## Don'ts

- **Don't add a new color.** The palette is deliberately small — reuse an existing `--color-*` variable. If nothing fits, ask before adding one — and if you do, it needs both a light and a dark value that pass WCAG AA against every background it can appear on.
- **Don't bold or otherwise weight Bree Serif.** It only has weight 400. Don't use it for anything other than a title-level heading.
- **Don't use Bree Serif for body copy, labels, or buttons.** Titles only.
- **Don't introduce a new breakpoint.** The site uses exactly two (480px, 700px). A new component should fit into one of those, not add a third.
- **Don't add a filled/solid "primary" button.** The button hierarchy today is text link (`.cta-link`) → outlined button (`.btn--secondary`) only, and that's intentional restraint, not an oversight.
- **Don't build a one-off page layout.** Every page reuses nav → hero → `.page-wrap` → footer. A new page should fit that skeleton, not invent a new structure.
- **Don't use full-uppercase for anything except the existing label pattern** (`.section__label`, `.case-study-card__label`, `.nav__link`, `.cta-link`) — small size + letter-spacing + `--color-faint` or `--color-accent`. Don't uppercase headings or body text.
- **Don't add JavaScript unless there's no plain-HTML/CSS way to do it** (per [CLAUDE.md](CLAUDE.md)). The only JS on the site today is the email copy button and the dark mode toggle (`js/theme.js` + the inline anti-flash snippet).
- **Don't add build tools, npm packages, or frameworks.** Everything must stay uploadable via FTP as-is.
- **Don't remove the `placeholder-thumb` / `cs-image-placeholder` boxes without a real image ready to replace them** — an empty gap looks broken; a labeled placeholder box reads as "in progress."
- **Don't use `var(--color-text)` as a `background-color`.** That was the old (broken) way to fill the "always dark" sections — use `var(--color-surface-dark)` instead, since `--color-text` now flips color in dark mode.
- **Don't hardcode `--color-on-dark` (white) as text/hover color against anything other than `--color-surface-dark`.** Against `--color-accent` or other theme-aware tokens, pair it with `--color-bg` instead so the pairing still contrasts once the other color flips in dark mode.

## Open questions / things not yet decided

- No filled/primary button style exists yet — only outlined and text-link CTAs.
- Experiment card thumbnails are currently commented out site-wide pending real screenshots.
- `experiments/webn/` and `experiments/capacity-tracker/` don't use `css/style.css` or the shared dark mode system — they're standalone tools with their own color variables. They weren't brought into dark mode when it shipped; revisit if that should change.
