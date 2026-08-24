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
| `--color-on-dark`, `--color-on-dark-dim`, `--color-on-dark-faint` | white at full/75%/60% opacity | Text sitting on the dark backgrounds (`--color-text` used as a fill) |

Note: `--color-text` does double duty as both the body text color *and* the fill for dark sections (homepage hero, nav-on-homepage, `.cs-hero-band--dark`). That's why there's no separate "dark background" variable.

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
- Every `<head>` repeats the same block: Google Analytics tag, charset/viewport meta, Google Fonts preconnect + stylesheet link, `style.css`, and favicon links. New pages should copy this verbatim.
- Unlisted pages (like `/experiments/`) add `<meta name="robots" content="noindex, nofollow">` and skip the active nav state since they're not in the main nav.

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

## Don'ts

- **Don't add a new color.** The palette is deliberately small — reuse an existing `--color-*` variable. If nothing fits, ask before adding one.
- **Don't bold or otherwise weight Bree Serif.** It only has weight 400. Don't use it for anything other than a title-level heading.
- **Don't use Bree Serif for body copy, labels, or buttons.** Titles only.
- **Don't introduce a new breakpoint.** The site uses exactly two (480px, 700px). A new component should fit into one of those, not add a third.
- **Don't add a filled/solid "primary" button.** The button hierarchy today is text link (`.cta-link`) → outlined button (`.btn--secondary`) only, and that's intentional restraint, not an oversight.
- **Don't build a one-off page layout.** Every page reuses nav → hero → `.page-wrap` → footer. A new page should fit that skeleton, not invent a new structure.
- **Don't use full-uppercase for anything except the existing label pattern** (`.section__label`, `.case-study-card__label`, `.nav__link`, `.cta-link`) — small size + letter-spacing + `--color-faint` or `--color-accent`. Don't uppercase headings or body text.
- **Don't add JavaScript unless there's no plain-HTML/CSS way to do it** (per [CLAUDE.md](CLAUDE.md)). The only JS on the site today is the mobile-safe email copy button.
- **Don't add build tools, npm packages, or frameworks.** Everything must stay uploadable via FTP as-is.
- **Don't remove the `placeholder-thumb` / `cs-image-placeholder` boxes without a real image ready to replace them** — an empty gap looks broken; a labeled placeholder box reads as "in progress."

## Open questions / things not yet decided

- No filled/primary button style exists yet — only outlined and text-link CTAs.
- Experiment card thumbnails are currently commented out site-wide pending real screenshots.
- No dark mode / theme switching — the "dark" sections are fixed dark backgrounds, not a toggleable theme.
