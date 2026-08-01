# 12 — ACCESSIBILITY

**Target: WCAG 2.2 level AA, with AAA where it costs nothing.** Automated checks fail the build.
Manual passes are a launch gate. The conformance statement we publish lists what still fails.

For a product sold to schools, colleges and public universities, accessibility is not a virtue —
it is a **procurement gate**, and our willingness to publish an honest conformance statement is a
competitive advantage (`08` §12).

---

## 1. Inherited posture

The product already treats accessibility as CI: axe runs in Storybook and in Playwright at 360px
among other widths and fails the build; focus outlines are never removed; there is no drag-and-drop
anywhere without a keyboard *and* a touch path; the theme system honours `prefers-color-scheme` in
both directions; `prefers-reduced-motion` is handled globally in `globals.css`; `lang` and `dir` are
set from the reader's locale, with RTL support in the shell.

This site inherits all of it and adds the marketing-specific surface: mega-menus, scroll reveals,
tab-driven heroes, long-form documents, and a form.

---

## 2. Per-criterion commitments

Only the criteria this site can actually fail are listed; the full statement on `/accessibility`
covers the rest.

### Perceivable
| SC | Commitment |
|---|---|
| 1.1.1 Non-text content | Every capture's `alt` comes from `captures.json` and describes *what the screen shows*. Diagrams get `role="img"` + label + a DOM text equivalent on long-form pages. Decorative marks get `alt=""`. |
| 1.3.1 Info and relationships | Real headings, real lists, real tables with `<caption>` and `<th scope>`. The lifecycle spine is an ordered list because it is a sequence. |
| 1.3.2 Meaningful sequence | DOM order equals visual order at every breakpoint. No `order:` reordering that breaks reading order — verified with CSS disabled. |
| 1.3.5 Identify input purpose | `autocomplete` on every field of the demo form (`name`, `email`, `tel`, `organization`). |
| 1.4.1 Use of colour | Never colour alone. The `progress` badge carries a glyph and screen-reader text; chart series carry direct labels; links are underlined, not merely coloured. |
| 1.4.3 Contrast | §3. Every text token measured on every surface it can land on — including the tinted ones. |
| 1.4.4 Resize text | 200% text-only zoom with no loss. Everything sized in `rem`; no `px` font sizes. |
| 1.4.10 Reflow | 320px wide at 400% zoom, no horizontal scroll, except the deliberate `overflow-x: auto` regions (tables, code) which are keyboard-reachable. |
| 1.4.11 Non-text contrast | Every border, focus ring, icon and control boundary ≥ 3:1 against its background — including the hairlines on ink, which is where this usually fails. |
| 1.4.12 Text spacing | Survives the standard override (line 1.5, letter 0.12em, word 0.16em, paragraph 2em) with no clipping. Tested. |
| 1.4.13 Content on hover | Every hover reveal is also focus-reachable, dismissible with `Escape`, and hoverable without disappearing. |

### Operable
| SC | Commitment |
|---|---|
| 2.1.1 Keyboard | Everything. Verified by a keyboard-only pass of every page in W5. |
| 2.1.2 No keyboard trap | The mobile nav is the only trap and it is deliberate, escapable, and returns focus. |
| 2.2.2 Pause, stop, hide | Nothing auto-advances. The aurora is decorative, under 5 seconds of perceptible change, and stops when out of view. No carousels. |
| 2.4.1 Bypass blocks | Skip link, first focusable, visible on focus. |
| 2.4.3 Focus order | DOM order. No positive `tabindex` anywhere (lint-enforced). |
| 2.4.4 Link purpose | Descriptive text. "Read the security notes", never "learn more". |
| 2.4.7 Focus visible | The inherited 2px `--brand-500` ring at 2px offset. Never removed, never replaced by a shadow. |
| **2.4.11 Focus not obscured** (2.2) | The sticky header uses `scroll-margin-top` on every anchor target so a focused element is never hidden behind it. This is the criterion sticky headers fail most often. |
| 2.5.3 Label in name | The visible label is the start of the accessible name on every control. |
| 2.5.7 Dragging | No dragging anywhere on this site. |
| **2.5.8 Target size** (2.2) | ≥ 24×24 minimum, ≥ 44×44 on touch, ≥ 8px separation. Audited per component. |

### Understandable
| SC | Commitment |
|---|---|
| 3.1.1 / 3.1.2 Language | `lang` on `<html>`; `lang` on any inline foreign-language phrase. |
| 3.2.1 / 3.2.2 On focus / on input | Nothing changes context on focus or on typing. The tab sets use **manual** activation for exactly this reason. |
| 3.3.1–3.3.4 Errors | Inline, associated, described in words (never "invalid"), with a suggestion; focus moves to the first error; nothing is destructive. |
| **3.3.7 Redundant entry** (2.2) | The demo form asks for nothing twice. Values survive a failed submit. |
| **3.3.8 Accessible authentication** (2.2) | No authentication on this site. No cognitive-function test, no puzzle CAPTCHA — one more reason we refused a CAPTCHA (`10` §4.2). |

### Robust
| SC | Commitment |
|---|---|
| 4.1.2 Name, role, value | Native elements first. ARIA only where no element exists — and then the full pattern, not a `role` sprinkled on a `<div>`. |
| 4.1.3 Status messages | `aria-live="polite"` on the form status, the copy-button confirmation and the permission-catalog result count. `aria-live="off"` on counters, which must not be announced. |

---

## 3. Contrast

Measured, not assumed, and re-measured on every token change. The matrix lives in
`src/styles/__tests__/contrast.spec.ts` and **fails CI**, mirroring the product's own
`tailwind-tokens.spec.ts` (which exists because a token that does not resolve fails *silently*).

| Foreground | Background | Light | Dark | Requirement |
|---|---|---|---|---|
| `--text-primary` | `--surface` | 15.9:1 | 15.1:1 | 4.5 |
| `--text-primary` | `--surface-muted` | 14.6:1 | 12.8:1 | 4.5 |
| `--text-muted` | `--surface` | 5.24:1 | 6.9:1 | 4.5 |
| `--text-muted` | `--surface-muted` | **4.84:1** | 5.9:1 | 4.5 — the one that was at 4.47 and failed |
| `--mk-on-ink` | `--mk-ink-900` | 17.4:1 | 17.4:1 | 4.5 |
| `--mk-on-ink-muted` | `--mk-ink-900` | 7.1:1 | 7.1:1 | 4.5 |
| `--mk-on-ink-faint` | `--mk-ink-900` | 3.6:1 | 3.6:1 | **decorative only — lint-blocked on text** |
| `--brand-500` (link) | `--surface` | 5.6:1 | 6.4:1 | 4.5 |
| `--brand-500` (focus ring) | any surface | ≥ 3.0 | ≥ 3.0 | 3.0 (1.4.11) |
| `--danger-text` | `--surface` | 6.9:1 | 8.3:1 | 4.5 |
| `--danger-text` | danger tint | 6.0:1 | 7.2:1 | 4.5 |
| `--text-inverse` | `--brand-500` (button) | 5.7:1 | — | 4.5 |
| `--border` | `--surface` | 1.3:1 | — | **decorative** — never the sole boundary |

**The rule this codebase learned the hard way:** when a status colour carries words, use its
`-text` variant. The plain token is a fill. The product rendered error text at 2.1:1 for three days
by getting this backwards, and it was invisible until a page rendered an error banner *on load*
rather than after a submit.

**Gradients and glass:** contrast is measured at the *worst* point of the gradient, not the
average, and at every breakpoint where the blob moves. Text never sits on a gradient (`05` §2.3).

---

## 4. Patterns

### 4.1 The hero role switcher
`role="tablist"` (horizontal), `role="tab"` with `aria-selected` and `aria-controls`, panel with
`role="tabpanel"`, `tabindex="0"` and `aria-labelledby`. **Manual activation** — arrowing moves
focus, `Enter`/`Space` activates — so a keyboard user does not trigger four image loads while
navigating. `Home`/`End` jump. Roving tabindex; one stop in the page's tab order.

### 4.2 The module explorer
Same, `aria-orientation="vertical"`, with `ArrowUp`/`ArrowDown`.

### 4.3 The mega-menu
`<button aria-expanded aria-controls>` + `<div role="group" aria-labelledby>`. **Deliberately not
`role="menu"`** — these are links to pages. `role="menu"` promises application-menu semantics
(arrow-only navigation, no `Tab`) that we do not implement and that would confuse a screen-reader
user. `Escape` closes and restores focus; `Tab` out closes; hover-with-intent on fine pointers only;
never opens on focus alone.

### 4.4 The mobile navigation sheet
Focus trapped; the page behind is `inert`; scroll locked with position preserved; `Escape` closes;
the trigger regains focus; the first focusable inside receives focus on open.

### 4.5 The FAQ
Native `<details>`/`<summary>`. Content in the DOM for crawlers and for find-in-page. JS adds the
height transition only.

### 4.6 The permission catalog
`<input type="search">` with a visible label, results as a `<ul>`, count announced in a polite live
region, virtualised list keeps `aria-setsize`/`aria-posinset` correct.

### 4.7 The demo form
Every field labelled with a real `<label for>` — never a placeholder as a label. Required fields
marked in text as well as with `required`. Errors inline, `aria-describedby`, focus to first error,
`aria-live` status on submit. Field order matches the visual order. No timeout.

### 4.8 Tables
`<caption>`, `<th scope>`, no layout tables. The scrollable wrapper is `tabindex="0"` with
`role="region"` and an `aria-label` — a scrollable region that cannot be reached by keyboard is a
2.1.1 failure that almost every marketing site ships.

---

## 5. Testing

| Layer | Tool | Gate |
|---|---|---|
| Component | Storybook + `@storybook/addon-a11y` (axe) | Fails CI |
| Page | Playwright + `@axe-core/playwright`, every route, at **360** and 1440, light and dark | Fails CI |
| Contrast | `contrast.spec.ts` computing ratios from token values | Fails CI |
| Motion | `motion.spec.ts` — with reduced motion, no animation > 20ms runs after load, and the same text nodes are visible | Fails CI |
| Focus order | `focus.spec.ts` — tabs through each page and asserts the order matches the DOM | Fails CI |
| Zoom / reflow | Manual, W5: 400% at 1280 → 320 CSS px wide |
| Screen reader | Manual, W5: VoiceOver + Safari, NVDA + Firefox, on `/`, `/security`, `/pricing`, `/demo` |
| Keyboard only | Manual, W5: every page, unplugged mouse |
| Forced colours | Manual, W5: Windows high-contrast — every border and focus ring must survive |
| Text spacing | Manual, W5: the bookmarklet override |

**Automated checks catch about 35% of real issues.** The manual passes are not optional and are
listed as W5 gates in `18`.

---

## 6. Cognitive and situational

- **Plain language.** Short sentences. The Flesch target is not a rule, but a paragraph that needs
  re-reading gets rewritten.
- **No time limits** anywhere.
- **No motion required** to understand anything (`07` §7).
- **Consistent navigation** and consistent identification across all 51 routes.
- **Predictable:** nothing moves under the cursor, nothing opens by itself, nothing changes context
  without a click.
- **Low-bandwidth is an accessibility concern here**, not just a performance one — our learners are
  on patchy 4G, and so are some of our buyers. See `13`.

---

## 7. The conformance statement (`/accessibility`)

Published at launch and updated whenever a gate changes. Structure:

1. **Scope and date** — which URLs, which date, which WCAG version and level.
2. **Conformance claim** — "partially conformant with WCAG 2.2 level AA", with the exceptions
   listed. *We do not claim full conformance.* Nobody honest does, and a procurement officer who has
   read a hundred statements believes the one with open items.
3. **How we test** — the table in §5, named tools, automated gates, manual passes, cadence.
4. **Known issues** — each with a description, the SC it touches, the impact, and a target date.
5. **The product's accessibility properties** — because the buyer is evaluating the *product*
   through this site: keyboard paths everywhere, no drag-and-drop without keyboard and touch, axe in
   the product's own CI, RTL support, reduced motion, 360px-first.
6. **Feedback** — an email address and a response commitment we can keep (5 working days).
7. **A VPAT-shaped table** for EN 301 549 and Section 508, so it can be lifted into a checklist.

**Nothing in this statement may be aspirational.** If a gate is not running, it is not listed as
running.
