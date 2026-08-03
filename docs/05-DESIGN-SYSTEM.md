# 05 — DESIGN SYSTEM

The marketing design system. **Two layers**: the product's tokens, inherited and untouched, plus a
marketing-only layer namespaced `--mk-*` that adds what an application ramp does not have.

---

## 1. The two-layer rule

```
Layer 1  @akechi/ui/tokens.css          colour · radius · the 14/22 application type ramp
         ▲ IMMUTABLE HERE. Fix in packages/ui + Figma, same commit, or not at all.
         │
Layer 2  src/styles/tokens.marketing.css   --mk-* : display type · section rhythm ·
         ▼ MARKETING-ONLY. Never leaks into apps/web.                gradients · glass · wide grid
```

**Why this is the whole design strategy.** Every SaaS company's website and product look like
different companies, because marketing forks the palette on day one. Ours cannot: `--brand-500`
resolves from the same file the product's login screen reads. A visitor who clicks into the sandbox
lands somewhere that looks like where they came from. That continuity is worth more than any
gradient we could invent.

The corollary is a discipline: when the *marketing* need is a bigger type scale or a richer
surface, we add a `--mk-*` token; we never "adjust" a product token to suit a hero.

---

## 2. Colour

### 2.1 Inherited (layer 1) — do not redeclare

Full table in `01-PRODUCT-TRUTH.md` §7.1. Working set for this site:

| Purpose | Token | Light | Dark |
|---|---|---|---|
| Primary action, links, focus | `--brand-500` | `#5b5bd6` | `#7c7ce8` |
| Hover / pressed | `--brand-600` | `#4a4ac4` | `#6a6adb` |
| Tint fills | `--brand-soft` | `#eef0fe` | `#26263a` |
| Accent, "verified" states | `--accent-500` | `#12a594` | `#2cc0ae` |
| Page ground | `--surface-bg` | `#fcfcfd` | `#17171c` |
| Cards | `--surface` | `#ffffff` | `#1e1e25` |
| Recessed bands | `--surface-muted` | `#f5f6f8` | `#26262f` |
| Hairlines | `--border` | `#e4e6ea` | `#33333d` |
| Body copy | `--text-primary` | `#1a1a21` | `#f5f5f7` |
| Secondary copy | `--text-muted` | `#646d7a` | `#9ca3af` |

**The rule that has already burned this codebase once:** when a status colour carries *words*, use
the `-text` variant (`--danger-text`, `--warning-text`, `--success-text`). The plain token is a
*fill*. The product shipped for three days rendering error text at 2.1:1 by getting this backwards.
It is written in `packages/ui/src/styles/tokens.css` in eleven lines of comment; read them once.

### 2.2 Marketing additions (layer 2)

```css
/* Ink — the dark assertion surface. Deeper than --surface-bg dark, so that a dark
   act still reads as a distinct band when the whole site is in dark mode. */
--mk-ink-900: #0b0b11;
--mk-ink-800: #12121a;
--mk-ink-700: #1a1a24;
--mk-on-ink:        #f7f7fa;   /* 17.4:1 on ink-900 */
--mk-on-ink-muted:  #a8adbb;   /*  7.1:1 on ink-900 */
--mk-on-ink-faint:  #6d7382;   /*  3.6:1 — DECORATIVE ONLY, never text */

/* Hairlines on ink */
--mk-ink-border: rgb(255 255 255 / 0.09);
--mk-ink-border-strong: rgb(255 255 255 / 0.16);

/* Glass — only ever over ink or over a gradient. Never over paper. */
--mk-glass-bg: rgb(255 255 255 / 0.06);
--mk-glass-border: rgb(255 255 255 / 0.12);
--mk-glass-blur: 16px;

/* Aurora — the only gradient system. Two blobs, low alpha, on ink. */
--mk-aurora-1: radial-gradient(60% 60% at 22% 18%, rgb(91 91 214 / 0.28), transparent 70%);
--mk-aurora-2: radial-gradient(52% 52% at 84% 62%, rgb(18 165 148 / 0.20), transparent 70%);

/* Brand gradient — for 1px rules, icon strokes and the wordmark accent. Never behind text. */
--mk-grad-brand: linear-gradient(97deg, #5b5bd6 0%, #7b5be0 46%, #12a594 100%);

/* Data-visualisation ramp — categorical, colour-blind safe, ordered by first use.
   Derived from the product's chart usage; see 09 §5 before adding a sixth. */
--mk-viz-1: var(--brand-500);
--mk-viz-2: var(--accent-500);
--mk-viz-3: #8b5cf6;
--mk-viz-4: #d97706;
--mk-viz-5: #64748b;
```

### 2.3 Rules

1. **Gradients never sit behind text.** A gradient may sit behind a solid card; the card carries
   the text. Every one of the ~30 "beautiful gradient hero" sites fails contrast at some viewport
   width because the blob moved.
2. **`--mk-on-ink-faint` is decorative only.** It is 3.6:1. It exists for hairline labels and
   dividers. A lint rule (`no-faint-text`) catches it on a text node.
3. **Dark mode is a re-theme, not a second design.** Ink acts stay ink; paper acts become the
   product's dark surfaces. Contrast is re-measured, not assumed (`12` §3).
4. **Accent green means *verified*.** `--accent-500` is reserved on this site for verification,
   security-passed and "built" states. Using it decoratively dilutes the one place it earns
   attention.

---

## 3. Typography

### 3.1 The faces

| Role | Face | Why | Weight axis used |
|---|---|---|---|
| **Display** (≥40px only) | **Space Grotesk** variable — `wght 300–700`, latin | The face the parent brand sets its own display type in (`algoryq.com`), which is the whole argument: a visitor arriving from the parent site should not have to be told the two are the same company. Its quirks are what stop a geometric grotesque from reading as Helvetica at 6.5rem — the flat-sided `o`, the squared bowls, the single-storey `a`. | 400 |
| **Text / UI** | **Inter** variable | It is the product's face. Continuity outranks novelty here. `cv11`, `ss01` on, matching `apps/web/globals.css`. | 400–600 |
| **Mono** | **The platform stack** — `ui-monospace`, `SFMono-Regular`, `Cascadia Mono`, `Menlo`, `Consolas` | API examples, permission keys, formulas, the "Verifiable by" labels. Not a webfont: see §3.4. | — |

**[ADR 0010](adr/0010-algoryq-learn-brand-alignment.md)** records this decision and what it costs.
It supersedes ADR 0003, which chose Fraunces and whose kill-criterion A/B never ran — the face was
replaced by the rebrand, not by the experiment. The one argument that did not survive is optical
sizing: Space Grotesk has no `opsz` axis, so a 6.5rem headline is a scaled 16px headline in the
way ADR 0003 objected to. Accepted knowingly; the face's own display-size quirks do that work.

**Display is never used below 40px.** Below that its quirks read as noise rather than character.
`--mk-display-3` is the floor at 40px. The single exception is the **wordmark** (1.375rem,
`wght 600`), which is a brand lockup rather than running text — see `09` §7.

### 3.2 The marketing scale

Fluid via `clamp()`; every bound tested at 320px and 2560px.

| Token | Face | Size | Leading | Tracking | Use |
|---|---|---|---|---|---|
| `--mk-display-1` | Space Grotesk 400 | `clamp(2.75rem, 1.15rem + 6.2vw, 6.5rem)` | 0.95 | −0.03em | Homepage H1 only |
| `--mk-display-2` | Space Grotesk 400 | `clamp(2.25rem, 1.1rem + 4.4vw, 4.5rem)` | 1.00 | −0.025em | Act headlines |
| `--mk-display-3` | Space Grotesk 400 | `clamp(1.875rem, 1.1rem + 2.6vw, 2.75rem)` | 1.10 | −0.02em | Page H1s, sub-act headlines |
| `--mk-title` | Inter 600 | `clamp(1.375rem, 1.05rem + 1.2vw, 1.875rem)` | 1.22 | −0.015em | Card and panel titles |
| `--mk-subtitle` | Inter 600 | `1.125rem` | 1.45 | −0.005em | Small headings |
| `--mk-lead` | Inter 400 | `clamp(1.0625rem, 1rem + 0.42vw, 1.3125rem)` | 1.55 | 0 | The paragraph under a headline |
| `--mk-body` | Inter 400 | `1.0625rem` (17px) | 1.65 | 0 | Body copy |
| `--mk-body-sm` | Inter 400 | `0.9375rem` | 1.6 | 0 | Captions, table cells, footnotes |
| `--mk-eyebrow` | Inter 500 | `0.8125rem` | 1.2 | 0.08em, uppercase | Section eyebrows |
| `--mk-mono` | Platform mono | `0.875rem` | 1.6 | 0 | Code, keys, formulas |

**The 17px body is deliberate.** The product's body is 14px because an application is dense and
scanned. A marketing page is *read*, at arm's length, often on a phone, often by a 48-year-old
institute owner. 17/1.65 is the comfortable end of the research range and costs us nothing.
Document the divergence rather than "fixing" it.

### 3.3 Rules

- **Measure**: 62–72 characters for `--mk-body`, 46–58 for `--mk-lead`, ≤ 24 for display. `.prose`
  sets `max-width: 68ch`.
- **`text-wrap: balance`** on every heading; **`text-wrap: pretty`** on every paragraph. Hard line
  breaks only in the hero H1, and only ≥1024px.
- **Never letterspace lowercase text.** Only the uppercase eyebrow.
- **One H1 per page.** Acts use H2. Nothing skips a level; the outline is the document.
- **Numerals**: `font-variant-numeric: tabular-nums` on anything that animates or aligns in a
  column. Proportional elsewhere.
- **No display italics, at any size.** Space Grotesk ships no true italic; a synthesised oblique
  of a squared grotesque is visibly a slant rather than a cut. Emphasis in display type is a
  weight change or a colour change, never a slope.

### 3.4 Loading

**As shipped:** two self-hosted variable `woff2` files, latin subset — Inter (48 KB) and Space
Grotesk (22 KB), **70 KB total**, both preloaded.

There is no third file. JetBrains Mono would have cost 31 KB to set a dozen labels, so the mono
role uses the platform stack (`ui-monospace`, `SFMono-Regular`, `Cascadia Mono`, `Menlo`,
`Consolas`), which is excellent everywhere and costs nothing.

Both files are loaded by `next/font/local` (`src/app/fonts.ts`) rather than a hand-written
`@font-face`, for `adjustFontFallback`: it reads the real metrics out of each `woff2` and emits a
metric-matched fallback, so a 6.5rem headline does not reflow when the webfont lands. The files
were fetched once at author time and are committed — nothing resolves a font host at build or run
time, which is what makes the CSP claim in ADR 0007 checkable rather than aspirational.

Both load through `next/font/local`, which reads the real metrics out of each file and emits a
metric-matched fallback face. That is the whole reason for using it rather than a hand-written
`@font-face`: hand-authoring `size-adjust` would mean inventing metrics we cannot measure here,
and a 6.5rem display headline reflowing when the webfont lands is the most conspicuous layout
shift available to us.

No `@font-face` may point at a host other than our own — the CSP forbids it and
`src/test/voice.spec.ts` fails on a reference to a font CDN anywhere in the source.

---

## 4. Space, grid, radius, elevation

### 4.1 Spacing scale (4px base)

`0 · 1(4) · 2(8) · 3(12) · 4(16) · 5(20) · 6(24) · 8(32) · 10(40) · 12(48) · 16(64) · 20(80) ·
24(96) · 32(128) · 40(160) · 50(200)`

Section rhythm is its own fluid token so acts breathe consistently:

```css
--mk-space-act:    clamp(4.5rem, 3rem + 7vw, 10rem);   /* 72 → 160px vertical padding */
--mk-space-block:  clamp(2rem, 1.5rem + 2.5vw, 4rem);  /* between blocks inside an act */
--mk-gutter:       clamp(1.25rem, 0.9rem + 1.6vw, 2.5rem);
```

### 4.2 Grid

| Breakpoint | Columns | Content max | Gutter | Notes |
|---|---:|---:|---:|---|
| 320–639 | 4 | 100% − 2×20px | 16 | Everything stacks. Nothing side-by-side. |
| 640–1023 | 8 | 100% − 2×32px | 20 | Two-up cards allowed |
| 1024–1279 | 12 | 1024 | 24 | |
| 1280–1535 | 12 | **1280** | 32 | The design width |
| 1536+ | 12 | 1280 content, **1440 wide** | 40 | Only media and the aurora use `wide`; text never exceeds 1280 |

Three named containers: `.container` (1280), `.container-wide` (1440), `.prose` (68ch, centred).
Full-bleed is a modifier, not a container.

### 4.3 Radius

Inherited: `--radius-sm 6` · `--radius 10` · `--radius-lg 16`.
Marketing additions: `--mk-radius-xl: 24px` (product frames, hero media) ·
`--mk-radius-2xl: 32px` (full-bleed media panels) · `--mk-radius-pill: 999px` (chips, the segmented
switcher).

Nesting rule: an inner radius equals the outer minus its padding, floored at 6. A 24px frame with
16px padding holds a 8px inner element.

### 4.4 Elevation

Five levels. On paper, elevation is **a hairline plus a soft shadow**; on ink it is **a lighter
surface plus a hairline**, because shadows are invisible on ink and faking them with a glow reads
as amateur.

| Level | Paper | Ink |
|---|---|---|
| `e0` flat | `1px solid var(--border)` | `1px solid var(--mk-ink-border)` |
| `e1` card | `+ 0 1px 2px rgb(16 18 27 / .04)` | `background: --mk-ink-800` |
| `e2` raised | `+ 0 4px 12px rgb(16 18 27 / .06)` | `background: --mk-ink-700` |
| `e3` overlay | `+ 0 12px 32px rgb(16 18 27 / .10)` | `+ --mk-ink-border-strong` |
| `e4` frame | `+ 0 32px 64px −16px rgb(16 18 27 / .18)` | glass + `--mk-glass-border` |

`e4` is reserved for product frames. Two `e4`s must never be adjacent.

### 4.5 Iconography

**Lucide**, 1.5px stroke, 20/24px, inherited from the product (its navigation registry names Lucide
icons directly). Icons are `aria-hidden` when adjacent to a label and given a `<title>` only when
they stand alone. Never an icon inside a headline. Never a filled variant — the product is stroke.

---

## 5. Dark mode

Not a toggle bolted on: the product ships light and dark from one Figma collection with two modes,
and this site inherits both. `prefers-color-scheme` decides by default; an explicit choice wins in
**both** directions via `:root[data-theme]` (the classic half-implemented toggle only overrides one
way — the product's `tokens.css` has a comment about exactly this).

| Act surface | Light mode | Dark mode |
|---|---|---|
| paper | `--surface-bg` | `--surface-bg` (dark) |
| paper-muted | `--surface-muted` | `--surface-muted` (dark) |
| ink | `--mk-ink-900` | `--mk-ink-900` — **unchanged** |

Ink stays ink in dark mode. That is what keeps the page's five-band rhythm legible when the whole
site is dark; if ink tracked the theme, Acts I/III/VI/IX/XII would dissolve into the page.

**Every dark-mode surface is re-measured, not assumed.** `12` §3 holds the matrix and the test.

---

## 6. Component-level defaults

| Property | Value |
|---|---|
| Focus ring | `2px solid var(--brand-500)`, `outline-offset: 2px` — inherited from the product's `globals.css`. Never removed, never replaced with a shadow. |
| Transition | `--mk-dur-fast 120ms` / `--mk-dur 200ms`, `--mk-ease cubic-bezier(.2,0,0,1)` |
| Hit target | ≥ 44×44 CSS px on touch, ≥ 32×32 with 8px separation on pointer (WCAG 2.2 SC 2.5.8) |
| Disabled | 45% opacity + `cursor: not-allowed` + `aria-disabled`. Never `pointer-events: none` on a control that needs to explain itself. |
| Selection | `::selection { background: var(--brand-soft); color: var(--text-primary) }` |
| Scrollbar | Default. A custom scrollbar is a bug report waiting to happen. |

---

## 7. Design principles (the tie-breakers)

1. **Continuity over novelty.** If the product does it one way, the site does it that way, unless
   there is a written reason.
2. **The type does the work.** Before adding an illustration, try making the sentence better and
   the type bigger. Most sections need no image at all.
3. **Nothing decorative survives a "why".** Every visual element answers a question a visitor has.
   If it does not, delete it — that is a budget line as well as a taste line.
4. **The honest version is the premium version.** An empty proof band that is *designed* reads more
   confident than six grey logos. Restraint is the flex.
5. **Reduced motion is a rendering, not a fallback.** Design both. If the still version does not
   communicate, the animation was carrying meaning it should not have been.
6. **Dense where it is dense, roomy where it is roomy.** The product frames are dense — that is
   what an institute's software looks like. Do not fake a "simple" product by cropping to four
   widgets.
7. **Every claim earns its typographic weight.** The biggest type on a section is its truest
   sentence, not its most exciting one.
