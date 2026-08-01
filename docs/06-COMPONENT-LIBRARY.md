# 06 — COMPONENT LIBRARY

Every component the site is built from. Nothing is composed ad hoc in a page: if a page needs a
shape that is not here, it gets an entry here first, in Storybook, with an axe test.

Import order of preference: **`@akechi/ui`** (the product's own) → **a primitive here** → new.

> **As built.** One deviation from the list below, and it matters: `cn` is **not** imported from
> `@akechi/ui`. tailwind-merge has never heard of `text-display-2` or `text-mk-body`, files them
> under *text colour*, and silently drops the size when a colour is also present — so every
> heading on the site rendered at the inherited size until a browser test read the built HTML.
> `src/lib/cn.ts` extends the merger with the custom scale, and `src/test/cn.spec.ts` asserts the
> list stays in step with `tailwind.config.ts`. Everything else on this list is imported from the
> product as specified.

---

## 1. What comes from the product

Used as-is, so the site and the app share behaviour as well as looks.

| From `@akechi/ui` | Used on the site for |
|---|---|
| `Button` | Every CTA (wrapped — see §2.1) |
| `Field`, `Input`, `Select`, `Textarea` | The demo form, the ROI calculator |
| `BarChart`, `LineChart`, `DonutChart`, `Sparkline` | Every chart on the site (`09` §5) |
| `Markdown` | MDX-adjacent rendering where author text must not become HTML |
| `Breadcrumbs` | Every page except `/` and `/demo` |
| `Skeleton` | The one deferred region (the permission catalog) |
| `cn`, `controlClass` | Class composition, control sizing |

Do **not** import `Can`, `PermissionProvider`, `DataTable`, `Dialog`, `Toast` or `Pagination` — they
carry app assumptions (a session, a permission context, dense tables) that do not apply here.

---

## 2. Primitives

### 2.1 `<CTA>`
Wraps the product `Button` with marketing sizing and analytics.

| Prop | Type | Notes |
|---|---|---|
| `variant` | `primary \| secondary \| ghost \| link` | primary = `--brand-500` fill; secondary = hairline on current surface |
| `size` | `md \| lg` | `lg` = 52px tall, `--mk-body`; used in hero and closing CTAs |
| `surface` | `paper \| ink` | Chooses the secondary/ghost treatment. Required — no inference. |
| `href` | `Route` | Internal typed route or an absolute URL |
| `external` | `boolean` | Adds `target="_blank" rel="noopener"` **and** a visually-hidden "(opens in a new tab)" |
| `event` | `AnalyticsEvent` | Required. Every CTA is measured (`16` §3). |

States: rest / hover (`--brand-600`, `translateY(-1px)`) / active (`translateY(0)`, no scale) /
focus-visible (2px ring, offset 2) / disabled. **Never** a loading spinner — no CTA on this site
does async work except the demo form's submit, which owns its own state.

### 2.2 `<Eyebrow>`
`--mk-eyebrow`, uppercase, `--text-muted` on paper / `--mk-on-ink-muted` on ink, optional 24px
leading rule in `--mk-grad-brand`. Renders a `<p>`, never a heading — an eyebrow is not an outline
level and screen-reader users should not hear it as one.

### 2.3 `<Heading>`
`level` (1–4, sets the tag) and `display` (sets the token) are **separate props**, so a visual
`display-2` can be an `h3` where the outline needs it. This is the component that keeps the
document outline honest while the design does what it likes.

### 2.4 `<Prose>`
The MDX container. Sets `max-width: 68ch`, the vertical rhythm, and typographic details: `--mk-body`
at 17/1.65, links underlined with `text-underline-offset: 0.2em`, `h2` with `--mk-space-block`
above, `code` in `--surface-muted` at 0.9em, tables that scroll inside their own
`overflow-x: auto` container with a visible fade affordance, blockquotes as a 2px brand rule.

### 2.5 `<Card>`
`elevation` (`e0`–`e4`), `surface` (`paper | ink | glass`), `interactive` (adds hover lift and
makes the whole card a link via a stretched pseudo-element — with the **real** anchor on the title,
so the accessible name is the title and not the whole card's text).

### 2.6 `<Badge>` / `<Chip>`
`tone`: `neutral | brand | accent | progress`. `progress` is the "still being built" marker: a
small `·` glyph plus a screen-reader-only "in progress — see build status". It is never a colour
alone (WCAG 1.4.1).

### 2.7 `<StatBlock>`
A number, a label, and a required `evidence` prop (a key into `claims.ts`). Renders the number with
`tabular-nums`; wraps the `Counter` behaviour from §5.4. **A `StatBlock` without an `evidence` key
does not compile** — this is the single most important type in the codebase for keeping §17's
policy real.

### 2.8 `<Reveal>` / `<Stagger>` / `<Parallax>` / `<Counter>`
See `07-MOTION-AND-INTERACTION.md` §3 for their specs. All four render their final state under
`prefers-reduced-motion: reduce` and all four render their final state with JavaScript disabled
(they are progressive enhancements over server-rendered markup, never wrappers that hide content
until hydration).

### 2.9 `<Tabs>`
Real `role="tablist"`. `orientation` (`horizontal | vertical`), `activation` (`manual | automatic`
— we use **manual** everywhere so arrowing through does not thrash the frame images), roving
tabindex, `Home`/`End`, `aria-controls` / `aria-labelledby` pairing. Used by the hero role switcher
and the module explorer.

### 2.10 `<Accordion>`
Built on native `<details>`/`<summary>` so the content is in the DOM for crawlers and works with
JS off. JS adds the height transition and single-open behaviour. `<summary>` gets `list-style: none`
and a rotating chevron. Used by the FAQ and mobile navigation.

### 2.11 `<Disclosure>`
The one-line "show the maths" / "show the exemptions" pattern. Same base as Accordion, different
visual weight.

### 2.12 `<CodeBlock>`
Static, pre-highlighted at build time (Shiki at build, **zero runtime**). Copy button, language
label, optional filename. Wraps long lines rather than scrolling horizontally on mobile, because a
horizontally scrolling code block on a phone is unreadable.

### 2.13 `<Table>`
Marketing tables (comparison, plans, before/after). Sticky first column on mobile inside an
`overflow-x: auto` region that is `tabindex="0"` with an `aria-label` — a scrollable region must be
keyboard-reachable (WCAG 2.1.1). Caption required.

### 2.14 `<Divider>` / `<Rule>`
1px `--border`, or a `--mk-grad-brand` rule at 2px for act transitions.

---

## 3. Layout components

### 3.1 `<SiteHeader>`
Sticky, 64/56px, translucent over Act I then solid (a `IntersectionObserver` sentinel at the top of
the page, **not** a scroll listener). Contains the wordmark, the nav, the theme toggle and two CTAs.
Below 1024px it collapses to a hamburger that opens `<MobileNav>`. Hides on scroll-down and returns
on scroll-up **below 1024px only** — on desktop a moving header is an irritation, on mobile it is
40px of reclaimed screen.

### 3.2 `<MegaMenu>`
`<button aria-expanded aria-controls>` + a `<div role="group">`. **Not** `role="menu"` — these are
links to pages, and a menu role tells a screen-reader user to expect application-menu semantics they
will not get. Opens on click *and* on hover-with-intent (120ms delay in, 240ms out) on fine
pointers. `Escape` closes and returns focus. Tabbing out closes. Never opens on focus alone.

### 3.3 `<MobileNav>`
Full-screen `<dialog>`-like sheet: focus trapped, `inert` on the page behind, body scroll locked
with the scroll position preserved, `Escape` closes, the trigger regains focus. CTAs pin above
`env(safe-area-inset-bottom)`.

### 3.4 `<SiteFooter>`
Five columns → two on tablet → one accordion on mobile. Includes the "This site sets no cookies"
line, which links to `/legal/cookies`.

### 3.5 `<Act>`
The section wrapper. Props: `id`, `surface` (`paper | paper-muted | ink`), `spacing`
(`normal | tight | loose`), `labelledBy`. Emits `<section aria-labelledby>` and owns the act's
vertical rhythm so no page ever hand-rolls padding.

### 3.6 `<SectionRail>`
The 12-dot progress rail, ≥1280px, `aria-hidden`, pointer-only (it duplicates the headings, which
are already the document's navigation for assistive tech).

### 3.7 `<StickyCTA>`
`<420px` only, appears after Act IV, dismissible for the session (`sessionStorage`), never covers
more than 64px, sits above the safe-area inset.

---

## 4. Product-rendering components

The components that make the site's screenshots trustworthy.

### 4.1 `<ProductFrame>`
A browser or device chrome around a real capture.

| Prop | Notes |
|---|---|
| `capture` | A key into `captures.json` — **not** a raw path. The manifest holds `{ path, alt, route, role, theme, width, capturedAt, appVersion }`. |
| `chrome` | `browser \| laptop \| tablet \| phone \| none` |
| `caption` | Short claim-shaped sentence under the frame. Optional but strongly encouraged. |
| `theme` | `light \| dark \| auto` — `auto` swaps the capture with the site theme |

Behaviour: renders `<picture>` with AVIF → WebP → PNG, correct `width`/`height` so CLS is 0, `alt`
from the manifest (never invented at the call site), and a `<figcaption>` carrying the capture date
when `caption` is set. **A capture older than 90 days emits a build warning; older than 180 days
fails the build.** That rule is why the site cannot quietly rot.

### 4.2 The proof components — `<ProofBand>`, `<Testimonials>`, `<CaseStudies>`, `<Awards>`
All four share one contract:

```ts
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;   // ← not a placeholder. Not a skeleton. Nothing.
  …
}
```

And a design contract that matters more than the code: **the surrounding layout must look finished
when they return `null`.** That is verified by a Playwright test that renders the homepage with an
empty proof source and runs a visual check — the page must not contain a gap taller than one
`--mk-space-block`.

`<ProofBand>` at launch renders the **Verifiable by** variant (six checkable links) because that
source is non-empty. It is the same component with a different item type.

### 4.3 `<VerifiableItem>`
Monospace label, Lucide icon, an outbound link. Six of them in the band. Each carries an `evidence`
key. Hover reveals a one-line explanation; the explanation is always in the DOM (not a
`title`-attribute-only tooltip, which is invisible to touch and to most screen readers).

### 4.4 `<PermissionCatalog>`
The live 272-key catalog on `/security`. Static JSON (~18 KB gz) fetched **on interaction**, not on
load. Filter by module, search by key, each row showing the key in mono plus its
school-administrator-readable description straight from `packages/authz`. Virtualised above 120
visible rows. Keyboard: the filter is a plain `<input type="search">`, results are a `<ul>`, and the
count is announced in an `aria-live="polite"` region.

### 4.5 `<LifecycleSpine>`
The Act VI device. Seven stops, horizontal ≥1024px, vertical below. Renders as an ordered list
semantically — it *is* a sequence — with each stop a `<li>` containing a heading, body and a
`<ProductFrame>`. The connecting line is a decorative SVG, `aria-hidden`.

### 4.6 `<ModuleExplorer>`
Act IV. `<Tabs orientation="vertical" activation="manual">` + a `<ProductFrame>` panel + a chip
list. Preloads the next capture on hover intent; never more than two captures in flight.

### 4.7 `<BuildStatusTable>`
Renders the module completion matrix from a checked-in JSON mirror of the product tracker.
Columns: module · cluster · % · what's real · what isn't. Sortable by percentage. Used on
`/trust/build-status` and, in a 6-row summary form, in Act IV.

---

## 5. Interactive components

### 5.1 `<RoleSwitcher>`
The hero. `<Tabs>` with four roles; each panel is a `<ProductFrame>` plus a caption plus one
floating `<StatBlock>`. Panel 1's capture is eager; 2–4 are lazy and prefetched on first
interaction. Cross-dissolve 220ms. Under reduced motion, an instant swap.

### 5.2 `<RoiCalculator>`
Six numeric inputs, three outputs, one `<Disclosure>` holding the printed formula. Rules in
`10` §6 — the ones that matter here are structural: **no default that flatters us**, every output
derived only from inputs the visitor supplied, nothing submitted anywhere, and the arithmetic
visible. Inputs are `<input type="number" inputmode="numeric">` with `<Field>` labels, min/max, and
a live `aria-live="polite"` result region that announces on blur, not on every keystroke.

### 5.3 `<ComparisonToggle>`
The Act XI before/after. Two-state `<Tabs>`; the two tables are both in the DOM, one
`hidden`. Cross-fades on desktop; on mobile, both render stacked and the toggle is not rendered at
all — a toggle that hides content on the device with the least screen is the wrong trade.

### 5.4 `<Counter>`
Counts once when 60% visible. `tabular-nums`, `aria-live="off"` (a counting number announced
digit-by-digit is torture), final value present in the SSR HTML so it is correct with JS off and
under reduced motion.

### 5.5 `<DemoForm>`
The only form on the site. Fields: name, email, phone (optional), institute, role, learners
(select), message, and a hidden `intent`. Posts to `/api/lead` → the product's
`POST /public/institutes/akechi/enquiries`.

- Validation is a Zod schema shared with the API route; errors render inline, associated with
  `aria-describedby`, and focus moves to the first invalid field on submit.
- Success replaces the form with a confirmation that names what happens next and by when.
- Failure keeps every value, says what failed, and offers a `mailto:` fallback.
- Honeypot + a timing check + the API's own per-tenant rate limit. **No CAPTCHA** — the product has
  none, and a third-party CAPTCHA would break the "no third-party origin" rule for the sake of a
  form that already has three defences.
- One submit button, disabled while in flight, with the label changing to "Sending…" and an
  `aria-live` status.

---

## 6. States every component must define

| State | Requirement |
|---|---|
| Rest | The default |
| Hover | Pointer only (`@media (hover: hover)`) — never a hover-only affordance |
| Focus-visible | The inherited 2px brand ring, offset 2. Never removed. |
| Active | Immediate, no transition delay |
| Disabled | 45% + `aria-disabled` + an explanation nearby |
| Loading | Only `<DemoForm>` has one |
| Empty | The proof components (§4.2): `null` |
| Error | `<DemoForm>` and `/api/*` failures only |
| Reduced motion | Every animated component |
| Dark | Every component |
| 360px | Every component |
| RTL | Logical properties everywhere (`margin-inline-start`, not `margin-left`) so the second locale is a translation, not a rebuild |

---

## 7. Storybook

Every component gets: a default story, a states story (all of §6 side by side), a dark story, a
360px story, and an axe assertion. Storybook's axe check fails CI — inherited from the product's own
setup, which already does this. A component without a story does not ship.

---

## 8. Anti-patterns, banned by lint or review

- A carousel of anything. (Auto-advancing carousels fail SC 2.2.2 and nobody reads slide 3.)
- A modal on load. Ever.
- Text over a photograph without a solid scrim that has been contrast-measured.
- `title` as the only tooltip mechanism.
- Hover-only content on a page that has a touch audience.
- A "skeleton" used to hide the fact that there is no content.
- Scroll-jacking, scroll-snap on the body, or `overflow: hidden` on `<html>` outside a trapped
  overlay.
- Custom scrollbars, custom cursors, custom text selection colours beyond `::selection`.
- `!important`, except in the reduced-motion block inherited from the product.
- A component that reads the current URL to decide its copy.
